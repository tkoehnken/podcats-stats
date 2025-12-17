import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const episodeSchema = {
  spotifyId: v.string(),
  books: v.array(
    v.object({
      id: v.id("books"),
      type: v.array(
        v.union(
          v.literal("main"),
          v.literal("new"),
          v.literal("next"),
          v.literal("suggestion"),
          v.literal("recommended"),
        ),
      ),
    }),
  ),
  guests: v.nullable(v.array(v.id("guests"))),
  greetings: v.array(v.id("greetings")),
}


export default defineSchema({
  books: defineTable({
    title: v.string(),
    subTitle: v.string(),
    originalTitle: v.string(),
    originalTitleShort: v.nullable(v.string()),
    publisher: v.string(),
    authors: v.array(v.id("authors")),
    mainLanguages: v.array(v.string()),
    originalLanguage: v.string(),
    collection: v.array(
      v.object({
        id: v.id("collections"),
        part: v.number(),
      }),
    ),
    variants: v.array(
      v.object({
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
      }),
    ),
  }),
  collections: defineTable({
    name: v.string(),
    authors: v.array(v.id("authors")),
  }),
  authors: defineTable({
    firstname: v.string(),
    lastname: v.string(),
    roles: v.array(
      v.union(
        v.literal("author"),
        v.literal("translator"),
        v.literal("illustrator"),
      ),
    ),
  }),
  episodes: defineTable(episodeSchema).index("by_spotifyId",["spotifyId"]),
  guests: defineTable({
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
  }),
  greetings: defineTable(
    v.union(
      v.object({
        from: v.union(v.literal("anne"), v.literal("fabienne")),
        value: v.string(),
        similar: v.nullable(v.array(v.id("greetings"))),
      }),
      v.object({
        from: v.literal("guest"),
        guest: v.id("guests"),
      }),
    ),
  ),
});
