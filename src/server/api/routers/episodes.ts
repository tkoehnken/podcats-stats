import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getMoreEpisodes } from "@/server/api/routers/spotify";

export const episodesRouter = createTRPCRouter({
  episodes: publicProcedure
    .input(
      z.object({
        cursor: z.number(),
        limit: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return await getMoreEpisodes(input.cursor, input.limit);
    }),
});
