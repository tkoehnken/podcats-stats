import { mutation, } from "./_generated/server";
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

export const getBook = mutation({
  args: v.union(
    v.object({ isbn: v.string() }),
    v.object({ id: v.id("books") }),
  ),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    if ("id" in args) {
      return ctx.db.get("books", args.id);
    }

    const variant = await ctx.db
      .query("bookVariant")
      .withIndex("by_isbn", (q) => q.eq("isbn", args.isbn))
      .unique();

    if (!variant) {
      throw new Error(`No Book with the ISBN ${args.isbn} found!`);
    }

    return ctx.db.get("books", variant.bookId);
  },
});


export const loadAllBookInfos = async () => {

}

