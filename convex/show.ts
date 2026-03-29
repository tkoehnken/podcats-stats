import { internalMutation, query } from "@/convex/_generated/server";
import { showSchema } from "@/convex/schema";
import { SHOW_ID } from "@/convex/spotify";

export const setShow = internalMutation({
  args: showSchema,
  handler: async (ctx, args) => {
    const oldData = await ctx.db
      .query("show")
      .withIndex("by_spotifyId", (e) => e.eq("spotifyId", args.spotifyId))
      .unique();
    if(oldData) {
      await ctx.db.patch("show",oldData._id,args);
    } else {
      await ctx.db.insert("show",args);
    }
  },
});


export const getShow = query({
  args: {},
  handler: async (ctx,args) => {

    return await ctx.db
      .query("show")
      .withIndex("by_spotifyId", (e) => e.eq("spotifyId", SHOW_ID)).unique();

  }
})