import type { Book as BookType } from "@/server/api/routers/google";
import BookCover from "@/components/BookCover";

type BookProps = {
  data: BookType;
  width: number;
  height?: number;
};

const Book = (props: BookProps) => (
  <div>
    <BookCover
      title={props.data.title}
      authors={props.data.authors.map(
        ({ firstname, lastname }) => `${firstname} ${lastname}`,
      )}
      width={props.width}
      height={props.height ?? props.width * 1.5}
    />
  </div>
);

export default Book;
