import { mutation } from "./_generated/server";
import { bookSchema, bookVariantsSchema } from "./schema";
import { v } from "convex/values";

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
    const { variants, ...book } = args;
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
  },
});
