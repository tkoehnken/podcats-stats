import Image from "next/image";
import type { Book as BookType } from "@/server/api/routers/google";

type BookProps = {
  data: BookType;
  width: number;
  height?: number;
};

const Book = (props: BookProps) => (
  <div>
    <Image
      src={props.data.cover}
      width={props.width}
      height={props.height ?? props.width * 1.5}
      alt={`Cover of ${props.data.title}`}
    />
  </div>
);

export default Book;
