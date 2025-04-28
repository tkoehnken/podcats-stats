import { db } from "@/server/firebase/util";
import {
  type ListOfBookTypes,
  type ListOfEpisodeTypes,
  type ListOfSocials,
} from "@/lib/utils";
import { unstable_cache } from "next/cache";

export type EpisodeTypes = (typeof ListOfEpisodeTypes)[number];
export type BookTypes = (typeof ListOfBookTypes)[number];
export type Book = {
  id: string;
  isbn: string;
  cover: string;
  title: string;
  releaseDate: number;
  authors: { firstname: string; lastname: string }[];
  link: string;
  description: string;
};

export type Social = (typeof ListOfSocials)[number];

export type Guest = {
  id: string;
  name: string;
  links?: { url: string; icon: Social }[];
};

type InternalEpisode = {
  types?: EpisodeTypes[];
  books?: { id: string; types: BookTypes[] }[];
  guests?: string[];
  introduction?: {
    anne?: string;
    fabienne?: string;
  };
};

export type EpisodeBookType = Book & { types?: BookTypes[],presenter?: string };

export type ExtraDataType = {
  types?: EpisodeTypes[];
  guests?: Guest[];
  books?: EpisodeBookType[];
  introduction?: {
    anne?: string;
    fabienne?: string;
  };
};

export const getGuestById = (id: string) => {
  return unstable_cache(
    async () => {
      const document = await db.collection("guest").doc(id).get();

      const data = document.data();
      if (data) return { ...data, id } as Guest;
      return undefined;
    },
    ["guests", id],
    { tags: ["guests", id] },
  )();
};

export const getBookById = async (isbn: string) => {
  return unstable_cache(
    async () => {
      const document = await db
        .collection("books")
        .doc(isbn.replaceAll("-", ""))
        .get();
      const data = document.data();
      if (data) return data as Book;
      return undefined;
    },
    ["books", isbn],
    { tags: ["books", isbn] },
  )();
};

export const getExtraDataForEpisode = async (id: string) => {
  return unstable_cache(
    async () => {
        console.log("Load ep",id)
      const document = await db.collection("episodes").doc(id).get();
      const data = document.data();
      if (data) {
        const d = data as InternalEpisode;
        return {
          introduction: d.introduction,
          types: d.types,
          guests: d.guests
            ? (
                await Promise.all(
                  d.guests.map(async (gId) => {
                    const guest = await getGuestById(gId);
                    if (guest) return guest;
                    return [];
                  }),
                )
              ).flat()
            : undefined,
          books: d.books
            ? (
                await Promise.all(
                  d.books.map(async (b) => {
                    const book = await getBookById(b.id);
                    if (book)
                      return {
                        ...book,
                        types: b.types,
                      };
                    return [];
                  }),
                )
              ).flat()
            : undefined,
        };
      }
      return undefined;
    },
    ["episodes", id],
    { tags: ["episodes", id] },
  )();
};
