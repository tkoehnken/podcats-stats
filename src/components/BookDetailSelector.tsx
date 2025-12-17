import type { EpisodeType } from "@/server/api/routers/spotify";
import BookCoverV2 from "@/components/BookCoverV2";
import { useState } from "react";

type Book = Required<Required<EpisodeType>["extraData"]>["books"][number];

type BookDetailSelectorProps = {
  books: Book[];
  initSelectedBook?: string;
};

export default function BookDetailSelector(props: BookDetailSelectorProps) {
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(
    props.initSelectedBook
      ? props.books.find((book) => book.id === props.initSelectedBook)
      : props.books[0],
  );

  const t = props.books[0];

  return <div className="flex flex-row">
    <DisplayMainBook data={selectedBook??props.books[0]} />
  </div>;
}

type DisplayMainBook = {
  data: Book;
};

const DisplayMainBook = ({ data }: DisplayMainBook) => (
  <div className="flex flex-row gap-2">
    <BookCoverV2
      animated
      title={data.title}
      className="max-h-[300px] min-h-[300px] max-w-[200px] min-w-[200px] md:max-h-[450px] md:min-h-[450px] md:max-w-[300px] md:min-w-[300px] lg:max-h-[600px] lg:min-h-[600px] lg:max-w-[400px] lg:min-w-[400px]"
      authors={data.authors.map(
        ({ firstname, lastname }) => `${firstname} ${lastname}`,
      )}
    />
    <div className="flex flex-col gap-2">
      <h1 className="text-xl">{data.title}</h1>
      <h2 className="text-sm">{data.isbn}</h2>
      <div>
        {data.authors.map(
          ({ firstname, lastname }) => `${firstname} ${lastname}`,
        )}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: data.description }}
        className="whitespace-pre-wrap"
      />
    </div>
  </div>
);
