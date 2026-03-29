import { mutation } from "./_generated/server";
import { authorSchema } from "./schema";
import { v } from "convex/values";

export const setAuthor = mutation({
  args: authorSchema,
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const exists = await ctx.db
      .query("authors")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();
    if (exists) {
      await ctx.db.replace("authors", exists._id, args);
      return exists._id;
    }
    return await ctx.db.insert("authors", args);
  },
});

export const connectAuthorWithBooks = mutation({
  args: {
    authorId: v.id("authors"),
    books: v.array(v.id("books")),
  },
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const exitingConnectionsForAuthor = await ctx.db
      .query("bookAuthor")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.authorId))
      .collect();

    const missingBooks = args.books.filter(
      (id) =>
        exitingConnectionsForAuthor.findIndex((e) => e.bookId === id) === -1,
    );

    return await Promise.all(
      missingBooks.map((bookId) =>
        ctx.db.insert("bookAuthor", {
          bookId,
          authorId: args.authorId,
        }),
      ),
    );
  },
});
