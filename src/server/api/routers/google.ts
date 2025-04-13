import {unstable_cache} from "next/cache";
import {db} from "@/server/firebase/util";

export type ExtraDataType = {
  introduction?: {
    anne?: string;
    fabienne?: string;
  };
};

export const getExtraDataForEpisode = (id: string) =>
  unstable_cache(async (): Promise<ExtraDataType | undefined> => {
    const document = await db.collection("episodes").doc(id).get();
    const data = document.data();
    if (data) return data as ExtraDataType;
    return undefined;
  }, ["episodes", id],{tags: ["episodes", id]});
