import BookCoverV2 from "@/components/BookCoverV2";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FunctionReturnType } from "convex/server";
import type { api } from "@/convex/_generated/api";

type BookProps = {
  data: FunctionReturnType<typeof api.episodes.getAllEpisodes>[number]["books"][number];
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
          className="min-w-[150px] min-h-[225px] max-w-[150px] max-h-[225px]"
        />
      </HoverCardTrigger>
      <HoverCardContent side="left">
        <ScrollArea className="h-100">
          <div className="flex flex-col gab-2 p-4">
            <span className="text-xl">{props.data.title}</span>
            <span className="text-sm">
              {props.data.authors
                .map(({ firstname, lastname }) => `${firstname} ${lastname}`)
                .join(";")}
            </span>
            <div dangerouslySetInnerHTML={{ __html: props.data.variants[0]?.description ?? "" }} />
          </div>
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  </div>
);

export default Book;
