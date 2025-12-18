import { mutation, query } from "./_generated/server";
import { episodeSchema } from "./schema";
import { v } from "convex/values";
import * as Books from "./model/books";

export const setEpisode = mutation({
  args: episodeSchema,
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const exists = await ctx.db
      .query("episodes")
      .withIndex("by_spotifyId", (q) => q.eq("spotifyId", args.spotifyId))
      .first();
    if (exists) {
      await ctx.db.replace("episodes", exists._id, args);
      return exists._id;
    }
    return await ctx.db.insert("episodes", args);
  },
});

export const getEpisode = query({
  args: v.id("episodes"),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    return await ctx.db.get("episodes", args);
  },
});

export const getAllEpisodes = query({
  args: { cursor: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    return await ctx.db.query("episodes").paginate({
      numItems: 50,
      cursor: args.cursor ?? null,
    });
  },
});

export const getAllInfosToEpisodes = query({
  args: v.id("episodes"),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const ep = await ctx.db.get("episodes", args);
    const books = (
      await (ep
        ? Promise.all(
            ep.books.map(async (simpleBook) => {
              return {
                ...(await Books.getBookInfos(ctx, simpleBook.id)),
                type: simpleBook.type,
              };
            }),
          )
        : [])
    ).flat();

    return {
      ...ep,
      books,
    };
  },
});
