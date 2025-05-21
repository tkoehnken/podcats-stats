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
  InternalEpisode,
} from "@/server/api/routers/google";
import AddBook from "@/components/AddBook";
import IntroductionEdit from "@/components/IntroductionEdit";
import GuestAdd from "@/components/GuestAdd";
import GuestSelector from "@/components/GuestSelector";
import BookEdit from "@/components/BookEdit";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { RefreshCcw } from "lucide-react";

type EpisodeEditProps = {
  episode: EpisodeType;
  refreshAction: () => void;
  saveAction: (data: { id: string } & InternalEpisode) => void;
};

const EpisodeEdit = ({
  episode,
  refreshAction,
  saveAction,
}: EpisodeEditProps) => {
  const img = getBiggestImage(episode.images);
  const { mutateAsync: reloadBook } = api.books.getByISBN.useMutation();
  const [episodeType, setEpisodeType] = useState<EpisodeTypes[]>(
    episode.extraData?.types ?? ["classic"],
  );
  const [books, setBooks] = useState<EpisodeBookType[]>(
    episode.extraData?.books ?? [],
  );
  const [introduction, setIntroduction] = useState<
    Required<ExtraDataType>["introduction"]
  >(
    episode.extraData?.introduction ?? {
      anne: undefined,
      fabienne: undefined,
    },
  );
  const [guests, setGuests] = useState<Guest[]>(
    episode.extraData?.guests ?? [],
  );

  return (
    <div className="flex flex-col gap-15 pb-4">
      <div className="fixed top-1.5 right-3 flex flex-row items-center gap-2.5">
        <form action={refreshAction}>
          <Button type="submit">
            <RefreshCcw />
          </Button>
        </form>
        <form
          action={() =>
            saveAction({
              id: episode.id,
              books: books.map((book) => ({
                id: book.id,
                types: book.types ?? [],
                presenter: book.presenter,
              })),
              guests:
                guests.length > 0 ? guests.map(({ id }) => id) : undefined,
              types: episodeType,
              introduction: introduction,
            })
          }
        >
          <Button type="submit" variant="secondary">
            Save
          </Button>
        </form>
      </div>
      <div className="flex flex-row gap-1">
        <Image src={img.url} alt="Cover" height={400} width={400} />
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">{episode.name}</h1>
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
          <p>{episode.description}</p>
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
            onChangePresenter={(presenter) => {
              setBooks((oldBooks) => {
                const tmp = [...oldBooks];
                const elm = tmp.find(({ id }) => id === book.id);
                if (!elm) return oldBooks;
                elm.presenter = presenter;
                return tmp;
              });
            }}
            onReload={(isbn) => reloadBook({ isbn, reload: true })}
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
