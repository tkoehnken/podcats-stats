import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { episodeSchema } from "./schema";
import { v } from "convex/values";
import * as Books from "./model/books";

export const getEpisodeCount = internalQuery({
  args: {},
  handler: async (ctx) => {
    const episodes = await ctx.db.query("episodes").collect();
    return episodes.length;
  },
});

export const insertEpisodeFromSpotify = internalMutation({
  args: {
    episodes: v.array(
      v.object({
        spotifyId: v.string(),
        spotifyData: v.object({
          name: v.string(),
          description: v.string(),
          releaseDate: v.string(),
          durationMs: v.number(),
          images: v.array(
            v.object({
              url: v.string(),
              height: v.optional(v.number()),
              width: v.optional(v.number()),
            }),
          ),
        }),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await Promise.all(
      args.episodes.map(async (ep) => {
        const exists = await ctx.db
          .query("episodes")
          .withIndex("by_spotifyId", (q) => q.eq("spotifyId", ep.spotifyId))
          .unique();
        if (exists) return;
        await ctx.db.insert("episodes", {
          ...ep,
          books: [],
          greetings: [],
        });
      }),
    );
  },
});

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
  args: v.object({ id: v.id("episodes") }),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    return await ctx.db.get("episodes", args.id);
  },
});

export const getEpisodes = query({
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

export const getAllEpisodes = query({
  args: {},
  handler: async (ctx) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const episodes = await ctx.db.query("episodes").collect();

    return Promise.all(episodes.map(async (ep)=>{
      return {
        ...ep,
        books: await Promise.all(
          ep.books.map(async (bookId) => await Books.getBookInfos(ctx, bookId)),
        ),
      };
    }));
  },
});

export const getAllInfosToEpisodes = query({
  args: v.object({ id: v.id("episodes") }),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const ep = await ctx.db.get("episodes", args.id);
    const books = (
      await (ep
        ? Promise.all(
            ep.books.map(async (simpleBookId) => {
              return await Books.getBookInfos(ctx, simpleBookId);
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
