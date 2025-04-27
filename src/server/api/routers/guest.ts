import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { Guest } from "@/server/api/routers/google";
import { db } from "@/server/firebase/util";
import { guestSchema } from "@/lib/zodSchemas";
import { ListOfSocials } from "@/lib/utils";

export const guestRouter = createTRPCRouter({
  addNewGuest: publicProcedure
    .input(guestSchema)
    .mutation(async ({ input }): Promise<void> => {
      const cached = await db
        .collection("guest")
        .where("name", "==", input.name)
        .get();
      if (cached.size >= 1) {
        return;
      }
      const guest: Guest = {
        name: input.name,
        img: input.img
          ? input.img.length === 0
            ? undefined
            : input.img
          : input.img,
        links: [],
      };
      ListOfSocials.forEach((social) => {
        if (input[social] && input[social].length > 0) {
          guest.links?.push({ icon: social, url: input[social] });
        }
      });
      await db.collection("guest").add(guest);
    }),
  getAllGuests: publicProcedure.query(async (): Promise<Guest[]> => {
    const data = await db.collection("guest").get();
    return (data.docs.map((doc) => doc.data()) as Guest[]) ?? [];
  }),
});
