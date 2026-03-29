import { mutation,query } from "./_generated/server";
import { bookSchema, bookVariantsSchema } from "./schema";
import { v } from "convex/values";
import * as Books from "./model//books";

export const setBook = mutation({
  args: v.object({ book: bookSchema, id: v.id("books") }),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    await ctx.db.replace("books", args.id, args.book);
  },
});

export const createBook = mutation({
  args: bookSchema.omit("variants").extend({
    variants: v.array(bookVariantsSchema.omit("bookId")),
  }),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    return await Books.createBook(ctx, args);
  },
});

export const getBook = query({
  args: v.object({
    data: v.union(
      v.object({ isbn: v.string() }),
      v.object({ id: v.id("books") }),
    ),
  }),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const data = args.data;
    if ("id" in data) {
      return ctx.db.get("books", data.id);
    }

    const variant = await ctx.db
      .query("bookVariant")
      .withIndex("by_isbn", (q) => q.eq("isbn", data.isbn))
      .unique();

    if (!variant) {
      throw new Error(`No Book with the ISBN ${data.isbn} found!`);
    }

    return ctx.db.get("books", variant.bookId);
  },
});


export const loadAllBookInfos = async () => {

}

