import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/firebase/util";
import { typesSchema } from "@/lib/zodSchemas";
import { ListOfEpisodeTypes } from "@/lib/utils";
import {revalidatePath, revalidateTag} from "next/cache";

export const episodeRouter = createTRPCRouter({
  save: publicProcedure
    .input(
      z.object({
        id: z.string(),
        episodeType: z.array(z.enum(ListOfEpisodeTypes)).optional(),
        books: z
          .array(z.object({ id: z.string(), types: typesSchema,presenter: z.enum(["Anne","Fabienne"]).optional() }))
          .optional(),
        guests: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input }): Promise<void> => {
      await db.collection("episodes").doc(input.id).set({
        books: input.books,
        guests: input.guests,
        types: input.episodeType
      },{merge: true});
      revalidateTag(input.id);
      //revalidatePath(`/episodes/${input.id}`,"page");
      revalidatePath(`/episodes/${input.id}/edit`,"page");
      //revalidatePath(`/`,"page");
    }),
});
