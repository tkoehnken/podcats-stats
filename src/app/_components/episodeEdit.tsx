"use client";
import { getBiggestImage } from "@/lib/utils";
import Image from "next/image";
import type { EpisodeType } from "@/server/api/routers/spotify";
import EpisodeTypeSelect from "@/components/EpisodeTypeSelect";
import { useState } from "react";
import type {
  EpisodeBookType,
  EpisodeTypes,
  ExtraDataType,
  Guest,
} from "@/server/api/routers/google";
import AddBook from "@/components/AddBook";
import IntroductionEdit from "@/components/IntroductionEdit";
import GuestAdd from "@/components/GuestAdd";
import GuestSelector from "@/components/GuestSelector";
import BookEdit from "@/components/BookEdit";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

type EpisodeEditProps = {
  data: EpisodeType;
};

const EpisodeEdit = ({ data }: EpisodeEditProps) => {
  const img = getBiggestImage(data.images);
  const [episodeType, setEpisodeType] = useState<EpisodeTypes[]>(data.extraData?.types??["classic"]);
  const [books, setBooks] = useState<EpisodeBookType[]>(
    data.extraData?.books ?? [],
  );
  const [introduction, setIntroduction] = useState<
    Required<ExtraDataType>["introduction"]
  >(
    data.extraData?.introduction ?? {
      anne: undefined,
      fabienne: undefined,
    },
  );
  const [guests, setGuests] = useState<Guest[]>(data.extraData?.guests ?? []);
  const { mutateAsync } = api.episode.save.useMutation();

  const onSave = async () => {
    await mutateAsync({
      id: data.id,
      books: books.map((book) => ({ id: book.id, types: book.types ?? [] })),
      guests: guests.length > 0 ? guests.map(({ id }) => id) : undefined,
      episodeType: episodeType,
    });
  };

  return (
    <div className="flex flex-col gap-15 pb-4">
      <div className="fixed top-1.5 right-3">
        <Button onClick={onSave} variant="secondary">
          Save
        </Button>
      </div>
      <div className="flex flex-row gap-1">
        <Image src={img.url} alt="Cover" height={400} width={400} />
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">{data.name}</h1>
          <div className="max-w-400">
            <EpisodeTypeSelect value={episodeType} onChange={setEpisodeType} />
          </div>
          {episodeType.includes("guest") ? (
            <div className="flex flex-col gap-2">
              <GuestAdd />
              <GuestSelector value={guests} onChange={setGuests} />
            </div>
          ) : null}
          <IntroductionEdit value={introduction} onChange={setIntroduction} />
          <p>{data.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {books.map((book) => (
          <BookEdit
            key={book.id}
            data={book}
            width={200}
            removeBook={(book) => {
              setBooks((old) =>
                old.filter((oldBook) => oldBook.id !== book.id),
              );
            }}
            onChangeTypes={(types) => {
              setBooks((oldBooks) => {
                const tmp = [...oldBooks];
                const elm = tmp.find(({ id }) => id === book.id);
                if (!elm) return oldBooks;
                elm.types = types;
                return tmp;
              });
            }}
          />
        ))}
        <div className="flex h-75 w-50 border-1 p-5">
          <AddBook
            addBook={(book) => {
              setBooks((old) => [...old, book]);
            }}
            defaultType={episodeType.includes("preview") ? "preview" : "main"}
          />
        </div>
      </div>
    </div>
  );
};

export default EpisodeEdit;
