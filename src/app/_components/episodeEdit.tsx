"use client";
import { getBiggestImage } from "@/lib/utils";
import Image from "next/image";
import type { EpisodeType } from "@/server/api/routers/spotify";
import EpisodeTypeSelect from "@/components/EpisodeTypeSelect";
import { useState } from "react";
import type {
  EpisodeTypes,
  ExtraDataType,
  Guest,
} from "@/server/api/routers/google";
import AddBook from "@/components/AddBook";
import Book from "@/components/Book";
import { type Book as BookType } from "@/server/api/routers/google";
import IntroductionEdit from "@/components/IntroductionEdit";
import GuestAdd from "@/components/GuestAdd";
import GuestSelector from "@/components/GuestSelector";

type EpisodeEditProps = {
  data: EpisodeType;
};

const EpisodeEdit = ({ data }: EpisodeEditProps) => {
  const img = getBiggestImage(data.images);
  const [episodeType, setEpisodeType] = useState<EpisodeTypes[]>(["classic"]);
  const [books, setBooks] = useState<BookType[]>(data.extraData?.books ?? []);
  const [introduction, setIntroduction] = useState<
    Required<ExtraDataType>["introduction"]
  >(
    data.extraData?.introduction ?? {
      anne: undefined,
      fabienne: undefined,
    },
  );
  const [guests, setGuests] = useState<Guest[]>(data.extraData?.guests ?? []);

  return (
    <div className="flex flex-col gap-15 pb-4">
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
          <Book key={book.id} data={book} width={200} />
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
