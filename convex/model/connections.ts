import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export async function connectAuthorsToBook(
  ctx: MutationCtx,
  bookId: Id<"books">,
  authorIds: Id<"authors">[],
): Promise<Id<"bookAuthor">[]> {
  const existingConnectionsForBook = await ctx.db
    .query("bookAuthor")
    .withIndex("by_bookId")
    .collect();

  const missingAuthorIds = authorIds.filter((authorId) =>
    existingConnectionsForBook.find(
      (connection) => connection.authorId === authorId,
    ),
  );

  return await Promise.all(
    missingAuthorIds.map((authorId) =>
      ctx.db.insert("bookAuthor", {
        bookId,
        authorId,
      }),
    ),
  );
}

export async function connectBooksToEpisode(
  ctx: MutationCtx,
  episodeId: Id<"episodes">,
  books: { id: Id<"books">; type: Doc<"bookEpisodes">["type"] }[],
) {
  const existingConnectionsForEpisode = await ctx.db
    .query("bookEpisodes")
    .withIndex("by_episode", (q) => q.eq("episodeId", episodeId))
    .collect();

  const missingBookIds = books.filter((book) =>
    existingConnectionsForEpisode.find(
      (connection) => connection.bookId === book.id,
    ),
  );

  return await Promise.all(
    missingBookIds.map((book) =>
      ctx.db.insert("bookEpisodes", {
        bookId: book.id,
        type: book.type,
        episodeId,
      }),
    ),
  );
}
