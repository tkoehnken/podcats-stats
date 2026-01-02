import type { Id, Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { isNotNull } from "./util";
import * as Collection from "./collections";


export const createBook = async (
  ctx: MutationCtx,
  data: Omit<Doc<"books">, "variants" | "_id" | "_creationTime"> & {
    variants: Omit<Doc<"bookVariant">, "bookId" | "_id" | "_creationTime">[];
  },
): Promise<Id<"books">> => {
  const { variants, ...book } = data;
  const bookId = await ctx.db.insert("books", {
    ...book,
    variants: [],
  });
  const variantIds = await Promise.all(
    variants.map((variant) =>
      ctx.db.insert("bookVariant", { ...variant, bookId }),
    ),
  );
  await ctx.db.patch("books", bookId, {
    variants: variantIds,
  });

  return bookId;
};

export const getBookInfos = async (
  ctx: QueryCtx,
  id: Id<"books">,
): Promise<
  Omit<Doc<"books">, "variants"> & {
    variants: Doc<"bookVariant">[];
    authors: Doc<"authors">[];
    collection: Doc<"collections">[];
  }
> => {
  const data = await ctx.db.get("books", id);
  if (!data) throw new Error("No books found!");
  const variants = (
    await Promise.all(
      data.variants.map((variantId) => ctx.db.get("bookVariant", variantId)),
    )
  ).filter(isNotNull);

  const authorIds = await ctx.db
    .query("bookAuthor")
    .withIndex("by_bookId", (q) => q.eq("bookId", id))
    .collect();
  const authors = (
    await Promise.all(
      authorIds.map(({ authorId }) => ctx.db.get("authors", authorId)),
    )
  ).filter(isNotNull);

  const collection = await Collection.getCollectionsByBook(ctx, id);

  return {
    ...data,
    variants,
    authors,
    collection,
  };
};
