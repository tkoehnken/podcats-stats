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
  args: v.string(),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db
      .query("guests")
      .withSearchIndex("by_name", (q) => q.search("name", args))
      .collect();
  },
});

export const connectGuestEpisode = mutation({
  args: v.array(
    v.object({
      guestId: v.id("guests"),
      episodeId: v.id("episodes"),
    }),
  ),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    await Promise.all(
      args.map(async (connection) => {
        const exists = await ctx.db
          .query("guestEpisodes")
          .withIndex("by_episodeGuest", (q) =>
            q
              .eq("episodeId", connection.episodeId)
              .eq("guestId", connection.guestId),
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
  args: v.array(
    v.object({
      guestId: v.id("guests"),
      episodeId: v.id("episodes"),
    }),
  ),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    await Promise.all(
      args.map(async (connection) => {
        const exists = await ctx.db
          .query("guestEpisodes")
          .withIndex("by_episodeGuest", (q) =>
            q
              .eq("episodeId", connection.episodeId)
              .eq("guestId", connection.guestId),
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
  args: v.id("guests"),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const foundConnections = await ctx.db
      .query("guestEpisodes")
      .withIndex("by_guestId", (q) => q.eq("guestId", args))
      .collect();

    await Promise.all(
      foundConnections.map(({ _id: id }) => ctx.db.delete("guestEpisodes", id)),
    );
    await ctx.db.delete("guests", args);
  },
});
