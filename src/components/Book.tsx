import type { Book as BookType } from "@/server/api/routers/google";
import BookCoverV2 from "@/components/BookCoverV2";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

type BookProps = {
  data: BookType;
  width: number;
  height?: number;
};

const Book = (props: BookProps) => (
  <div style={{ minWidth: props.width }}>
    <HoverCard>
      <HoverCardTrigger>
        <BookCoverV2
          title={props.data.title}
          authors={props.data.authors.map(
            ({ firstname, lastname }) => `${firstname} ${lastname}`,
          )}
          width={props.width}
          height={props.height ?? props.width * 1.5}
        />
      </HoverCardTrigger>
      <HoverCardContent side="left">
        <ScrollArea className="h-50">
          <div className="flex flex-col gab-2 p-4">
            <span className="text-xl">{props.data.title}</span>
            <span className="text-sm">
              {props.data.authors
                .map(({ firstname, lastname }) => `${firstname} ${lastname}`)
                .join(";")}
            </span>
            <div dangerouslySetInnerHTML={{ __html: props.data.description }} />
          </div>
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  </div>
);

export default Book;
