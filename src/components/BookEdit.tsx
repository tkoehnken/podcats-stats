import type { BookTypes, EpisodeBookType } from "@/server/api/routers/google";
import BookCover from "@/components/BookCoverV2";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw } from "lucide-react";
import BookTypeSelect from "@/components/BookTypeSelect";
import SelectPresenter from "@/components/SelectPresenter";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type BookProps = {
  data: EpisodeBookType;
  width: number;
  height?: number;
  removeBook: (book: EpisodeBookType) => void;
  onChangeTypes: (bookTypes: BookTypes[]) => void;
  onChangePresenter: (presenter?: "Anne" | "Fabienne") => void;
  onReload: (isbn: string) => void;
};

const BookEdit = (props: BookProps) => (
  <ContextMenu>
    <ContextMenuTrigger>
      <BookCover
        header={
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-row justify-between">
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
            <div className="pr-1 pl-1">
              <SelectPresenter
                value={props.data.presenter}
                onValueChange={props.onChangePresenter}
              />
            </div>
          </div>
        }
        title={props.data.title}
        authors={props.data.authors.map(
          ({ firstname, lastname }) => `${firstname} ${lastname}`,
        )}
        width={props.width}
        height={props.height ?? props.width * 1.5}
      />
    </ContextMenuTrigger>
    <ContextMenuContent className="w-32">
      <ContextMenuItem onClick={() => props.onReload(props.data.id)}>
        <RefreshCcw />
       Reload
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);

export default BookEdit;
