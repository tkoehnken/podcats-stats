import { mutation, query } from "./_generated/server";
import { collectionsSchema } from "./schema";
import { v } from "convex/values";

export const setCollection = mutation({
  args: collectionsSchema,
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const exists = await ctx.db
      .query("collections")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();
    if (exists) {
      await ctx.db.replace("collections", exists._id, args);
      return exists._id;
    }
    return await ctx.db.insert("collections", args);
  },
});

export const connectCollectionWithBooks = mutation({
  args: {
    collectionId: v.id("collections"),
    books: v.array(
      v.object({
        id: v.id("books"),
        part: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const exitingConnectionsForCollection = await ctx.db
      .query("collectionBooks")
      .withIndex("by_collection", (q) =>
        q.eq("collectionId", args.collectionId),
      )
      .collect();

    const missingBooks = args.books.filter(
      ({ id }) =>
        exitingConnectionsForCollection.findIndex((e) => e.bookId === id) ===
        -1,
    );

    return await Promise.all(
      missingBooks.map((book) =>
        ctx.db.insert("collectionBooks", {
          bookId: book.id,
          collectionId: args.collectionId,
          part: book.part,
        }),
      ),
    );
  },
});

export const getCollection = query({
  args: v.object({ id: v.id("collections") }),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    return await ctx.db.get("collections", args.id);
  },
});

export const getBooksOfCollection = query({
  args: v.object({id: v.id("collections")}),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    return await ctx.db
      .query("collectionBooks")
      .withIndex("by_collection", (q) => q.eq("collectionId", args.id))
      .collect();
  },
});
