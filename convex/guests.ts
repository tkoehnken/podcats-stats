import { mutation, query } from "./_generated/server";
import { guestSchema } from "./schema";
import { v } from "convex/values";

export const createGuest = mutation({
  args: guestSchema,
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db.insert("guests", args);
  },
});

export const searchGuests = query({
  args: v.object({search: v.string()}),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db
      .query("guests")
      .withSearchIndex("by_name", (q) => q.search("name", args.search))
      .collect();
  },
});

export const connectGuestEpisode = mutation({
  args: v.object({data: v.array(
    v.object({
      guestId: v.id("guests"),
      episodeId: v.id("episodes"),
    }),
  )}),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    await Promise.all(
      args.data.map(async (connection) => {
        const exists = await ctx.db
          .query("guestEpisodes")
          .withIndex("by_guestEpisode", (q) =>
            q
              .eq("guestId", connection.guestId)
              .eq("episodeId", connection.episodeId),
          )
          .unique();
        if (!exists) {
          await ctx.db.insert("guestEpisodes", connection);
        }
      }),
    );
  },
});

export const disconnectGuestEpisode = mutation({
  args: v.object({data: v.array(
    v.object({
      guestId: v.id("guests"),
      episodeId: v.id("episodes"),
    }),
  )}),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    await Promise.all(
      args.data.map(async (connection) => {
        const exists = await ctx.db
          .query("guestEpisodes")
          .withIndex("by_guestEpisode", (q) =>
            q
              .eq("guestId", connection.guestId)
              .eq("episodeId", connection.episodeId)
          )
          .unique();
        if (exists) {
          await ctx.db.delete("guestEpisodes", exists._id);
        }
      }),
    );
  },
});

export const deleteGuest = mutation({
  args: v.object({id: v.id("guests")}),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const foundConnections = await ctx.db
      .query("guestEpisodes")
      .withIndex("by_guestEpisode", (q) => q.eq("guestId", args.id))
      .collect();

    await Promise.all(
      foundConnections.map(({ _id: id }) => ctx.db.delete("guestEpisodes", id)),
    );
    await ctx.db.delete("guests", args.id);
  },
});
