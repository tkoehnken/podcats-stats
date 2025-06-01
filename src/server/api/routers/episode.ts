import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/firebase/util";
import { typesSchema } from "@/lib/zodSchemas";
import { ListOfEpisodeTypes } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export const episodeRouter = createTRPCRouter({
  save: publicProcedure
    .input(
      z.object({
        id: z.string(),
        episodeType: z.array(z.enum(ListOfEpisodeTypes)).optional(),
        books: z
          .array(
            z.object({
              id: z.string(),
              types: typesSchema,
              presenter: z.enum(["Anne", "Fabienne"]).optional(),
            }),
          )
          .optional(),
        guests: z.array(z.string()).optional(),
        introduction: z
          .object({
            anne: z.string().optional(),
            fabienne: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input }): Promise<void> => {
      const { userId } = await auth();
      if (!userId) return;
      await db.collection("episodes").doc(input.id).set(
        {
          books: input.books,
          guests: input.guests,
          types: input.episodeType,
          introduction: input.introduction,
        },
        { merge: true },
      );
      revalidateTag(`episode-${input.id}`);
    }),
  reload: publicProcedure
    .input(z.string())
    .mutation(async ({ input }): Promise<void> => {
      const { userId } = await auth();
      if (!userId) return;
      revalidateTag(`episode-${input}`);
    }),
});
