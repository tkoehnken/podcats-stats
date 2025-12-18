import type { QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export async function getCollectionsByBook(ctx: QueryCtx, bookId: Id<"books">) {
  const collectionIds = await ctx.db
    .query("collectionBooks")
    .withIndex("by_book", (q) => q.eq("bookId", bookId))
    .collect();

  return await Promise.all(
    collectionIds.map(async ({ collectionId,part }) =>{
      const collection = await ctx.db.get("collections", collectionId)
      if(!collection) throw new Error("Collection not found");
      return {
        ...collection,
        part
      };
    }
    ),
  );
}
