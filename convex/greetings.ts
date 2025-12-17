import { mutation, query } from "./_generated/server";
import { greetingSchema } from "./schema";
import { v } from "convex/values";

export const createGreeting = mutation({
  args: greetingSchema,
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const exists = await ctx.db
      .query("greetings")
      .withIndex("by_value", (q) => q.eq("value", args.value))
      .collect();

    if (exists.length > 0) {
      throw new Error(
        `Found ${exists.length} entries with value: ${args.value}`,
      );
    }
    return await ctx.db.insert("greetings", args);
  },
});

export const setSimilarGreetings = mutation({
  args: { similarTo: v.array(v.id("greetings")), id: v.id("greetings") },
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db.patch("greetings", args.id, {
      similar: args.similarTo,
    });
  },
});

export const changeGreeting = mutation({
  args: { id: v.id("greetings"), value: v.string() },
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db.patch("greetings", args.id, {
      value: args.value,
    });
  },
});

export const deleteGreeting = mutation({
  args: v.id("greetings"),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db.delete("greetings", args);
  },
});

export const searchSimilarGreeting = query({
  args: v.string(),
  handler: async (ctx, args) => {
    if ((await ctx.auth.getUserIdentity()) === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    return await ctx.db
      .query("greetings")
      .withSearchIndex("by_value", (q) => q.search("value", args))
      .collect();
  },
});
