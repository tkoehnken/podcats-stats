import { unstable_cache } from "next/cache";
import { db } from "@/server/firebase/util";
import {type ListOfBookTypes, type ListOfEpisodeTypes} from "@/lib/utils";

export type EpisodeTypes = typeof ListOfEpisodeTypes[number];
export type BookTypes = typeof ListOfBookTypes[number];
export type Book = {
    id: string,
    isbn: string,
    cover: string,
    title: string,
    releaseDate: number,
    authors: {firstname: string, lastname: string}[],
    link: string,
    types: BookTypes[],
    description: string
}

export type Guest = {
    name: string,
    links?: {url: string,icon?: string}[],
    img?: string
}

export type ExtraDataType = {
  types?: EpisodeTypes[];
  guests?: Guest[]
  books?: Book[]
  introduction?: {
    anne?: string;
    fabienne?: string;
  };
};

export const getExtraDataForEpisode = (id: string) =>
  unstable_cache(
    async (): Promise<ExtraDataType | undefined> => {
      const document = await db.collection("episodes").doc(id).get();
      const data = document.data();
      if (data) return data as ExtraDataType;
      return undefined;
    },
    ["episodes", id],
    { tags: ["episodes", id] },
  );
