import type { BookTypes, EpisodeBookType } from "@/server/api/routers/google";
import BookCover from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import BookTypeSelect from "@/components/BookTypeSelect";

type BookProps = {
  data: EpisodeBookType;
  width: number;
  height?: number;
  removeBook: (book: EpisodeBookType) => void;
  onChangeTypes: (bookTypes: BookTypes[]) => void;
};

const BookEdit = (props: BookProps) => (
  <div
    className="relative overflow-hidden rounded-2xl"
    style={{ width: props.width, height: props.height ?? props.width * 1.5 }}
  >
    <div className="absolute inset-0">
      <BookCover
        title={props.data.title}
        authors={props.data.authors.map(
          ({ firstname, lastname }) => `${firstname} ${lastname}`,
        )}
        width={props.width}
        height={props.height ?? props.width * 1.5}
      />
    </div>
    <div className="flex flex-col">
      <div className="relative flex flex-row justify-between">
        <div className="flex-1/2">
          <BookTypeSelect
            onChange={props.onChangeTypes}
            value={props.data.types ?? []}
          />
        </div>
        <Button
          onClick={() => props.removeBook(props.data)}
          size="lg"
          className="rounded-bl-full"
        >
          <XCircle />
        </Button>
      </div>
    </div>
  </div>
);

export default BookEdit;
