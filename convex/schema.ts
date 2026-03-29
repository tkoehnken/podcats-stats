import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const showSchema = {
  spotifyId: v.string(),
  name: v.string(),
  description: v.string(),
  images: v.array(
    v.object({
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      url: v.string(),
    }),
  ),
};

export const episodeSchema = {
  spotifyId: v.string(),
  books: v.array(v.id("books")),
  greetings: v.array(v.id("greetings")),
  spotifyData: v.object({
    name: v.string(),
    description: v.string(),
    releaseDate: v.string(),
    durationMs: v.number(),
    images: v.array(
      v.object({
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        url: v.string(),
      }),
    ),
  }),
};

export const bookEpisodesSchema = v.object({
  bookId: v.id("books"),
  episodeId: v.id("episodes"),
  type: v.union(
    v.literal("main"),
    v.literal("new"),
    v.literal("next"),
    v.literal("suggestion"),
    v.literal("recommended"),
  ),
});

export const guestEpisodesSchema = v.object({
  episodeId: v.id("episodes"),
  guestId: v.id("guests"),
});

export const greetingSchema = v.union(
  v.object({
    from: v.union(v.literal("anne"), v.literal("fabienne")),
    value: v.string(),
    similar: v.nullable(v.array(v.id("greetings"))),
  }),
  v.object({
    from: v.literal("guest"),
    guest: v.id("guests"),
    value: v.string(),
    similar: v.nullable(v.array(v.id("greetings"))),
  }),
);

export const collectionsSchema = {
  externalId: v.string(),
  name: v.string(),
  authors: v.array(v.id("authors")),
};

export const collectionBooksSchema = {
  bookId: v.id("books"),
  collectionId: v.id("collections"),
  part: v.number(),
};

export const bookAuthorSchema = {
  bookId: v.id("books"),
  authorId: v.id("authors"),
};

export const bookVariantsSchema = v.object({
  isbn: v.string(),
  cover: v.string(),
  link: v.string(),
  description: v.string(),
  publicationDate: v.string(),
  type: v.string(),
  edition: v.nullable(
    v.object({
      text: v.string(),
      number: v.nullable(v.number()),
    }),
  ),
  pages: v.nullable(v.number()),
  bookId: v.id("books"),
});

export const bookSchema = v.object({
  title: v.string(),
  subTitle: v.string(),
  originalTitle: v.string(),
  originalTitleShort: v.nullable(v.string()),
  publisher: v.string(),
  mainLanguages: v.array(v.string()),
  originalLanguage: v.string(),
  variants: v.array(v.id("bookVariant")),
});

export const authorSchema = {
  externalId: v.string(),
  firstname: v.string(),
  lastname: v.string(),
  roles: v.array(
    v.union(
      v.literal("author"),
      v.literal("translator"),
      v.literal("illustrator"),
    ),
  ),
};

export const guestSchema = v.object({
  links: v.array(
    v.object({
      link: v.string(),
      type: v.union(
        v.literal("homepage"),
        v.literal("x"),
        v.literal("facebook"),
        v.literal("instagram"),
        v.literal("tiktok"),
        v.literal("spotify"),
        v.literal("other"),
      ),
    }),
  ),
  img: v.nullable(v.string()),
  description: v.nullable(v.string()),
  author: v.nullable(v.id("authors")),
  name: v.string(),
});

export default defineSchema({
  books: defineTable(bookSchema).index("by_publisherTitle", [
    "publisher",
    "title",
  ]),
  bookVariant: defineTable(bookVariantsSchema)
    .index("by_isbn", ["isbn"])
    .index("by_type", ["type"]),
  collectionBooks: defineTable(collectionBooksSchema)
    .index("by_book", ["bookId"])
    .index("by_collection", ["collectionId"]),
  collections: defineTable(collectionsSchema).index("by_externalId", [
    "externalId",
  ]),
  bookAuthor: defineTable(bookAuthorSchema)
    .index("by_authorId", ["authorId"])
    .index("by_bookId", ["bookId"]),
  bookEpisodes: defineTable(bookEpisodesSchema)
    .index("by_book", ["bookId"])
    .index("by_episodeType", ["episodeId", "type"]),
  authors: defineTable(authorSchema).index("by_externalId", ["externalId"]),
  episodes: defineTable(episodeSchema).index("by_spotifyId", ["spotifyId"]),
  guests: defineTable(guestSchema).searchIndex("by_name", {
    searchField: "name",
  }),
  guestEpisodes: defineTable(guestEpisodesSchema).index("by_guestEpisode", [
    "guestId",
    "episodeId",
  ]),
  greetings: defineTable(greetingSchema)
    .index("by_value", ["value"])
    .searchIndex("search_by_value", {
      searchField: "value",
    }),
  show: defineTable(showSchema).index("by_spotifyId", ["spotifyId"]),
});
