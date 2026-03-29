import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import * as Books from "./books";
import { isNotNull } from "./util";

// export async function getEpisodeInfo(
//   ctx: QueryCtx,
//   episodeId: Doc<"episodes">["spotifyId"],
// ) {
//   const result = await ctx.db
//     .query("episodes")
//     .withIndex("by_spotifyId", (q) => q.eq("spotifyId", episodeId))
//     .unique();
//   if(!result) {
//     throw new Error("No episodes found!");
//   }
//
//   const mainBook = await ctx.db.query("bookEpisodes").withIndex("by_episodeType",(q)=>q.eq("episodeId",result._id)).filter((f)=>f.sub())
//
//
//
// }
