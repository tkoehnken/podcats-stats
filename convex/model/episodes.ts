import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import * as Books from "./books";
import { isNotNull } from "./util";


async function loadBooksAndGreetings(
  ctx: QueryCtx,
  bookIds: { id: Id<"books">; type: Doc<"episodes">["books"][number]["type"] }[],
  greetingIds: Id<"greetings">[],
) {
  const [books, greetings] = await Promise.all([
    await Promise.all(
      bookIds.map(async (simpleBook) => {
        return {
          ...(await Books.getBookInfos(ctx, simpleBook.id)),
          type: simpleBook.type,
        };
      }),
    ),
    (
      await Promise.all(
        greetingIds.map(async (greetingId) =>
          ctx.db.get("greetings", greetingId),
        ),
      )
    ).filter(isNotNull),
  ]);

  return {
    books,
    greetings,
  }

}


export async function getAllEpisodeInfos(ctx: QueryCtx, id: Id<"episodes">) {
  const ep = await ctx.db.get("episodes", id);
  if (!ep) throw new Error("No episodes found!");


  const booksAndGreetings = await loadBooksAndGreetings(ctx,ep.books,ep.greetings);


  return {
    ...ep,
    ...booksAndGreetings,
  };
}

export async function addBooksAndGreetingsToLoadedEpisode(ctx: QueryCtx,ep: Doc<"episodes">) {
  const booksAndGreetings = await loadBooksAndGreetings(
    ctx,
    ep.books,
    ep.greetings,
  );

  return {
    ...ep,
    ...booksAndGreetings,
  };

}


export async function getAllEpisodes(ctx: QueryCtx) {

  const eps = await Promise.all([
    ctx.db.query("episodes").collect(),
    ctx.db.query("books").collect(),
    ctx.db.query("bookVariant").collect(),
    ctx.db.query("greetings").collect(),
    ctx.db.query("guests").collect()
  ];




}


