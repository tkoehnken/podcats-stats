import { mutation } from "./_generated/server";
import { episodeSchema } from "./schema";

export const setEpisode = mutation({
  args: episodeSchema,
  handler: async (ctx, args) => {
    if(await ctx.auth.getUserIdentity() === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const exists = await ctx.db.query("episodes").withIndex("by_spotifyId",(q)=>q.eq("spotifyId",args.spotifyId)).first();
    if(exists) {
      await ctx.db.replace("episodes",exists._id,args);
      return exists._id;
    }
    return await ctx.db.insert("episodes", args);
  },
});

