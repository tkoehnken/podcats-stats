import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {type Book, getBookById} from "@/server/api/routers/google";
import { db } from "@/server/firebase/util";
import * as BookApi from "@/server/internal/bookApi";

export const bookRouter = createTRPCRouter({
  getByISBN: publicProcedure
    .input(
      z.object({
        isbn: z.string()
      }),
    )
    .mutation(async ({ input }): Promise<Book> => {
      const cached = await getBookById(input.isbn.replaceAll('-', ''));
      if (cached) {
        return cached;
      }

      const result = await BookApi.getByISBN(input.isbn);
      const authors = result.contributors.flatMap(({ type, name }) => {
        if (type === "A01") {
          const [lastname, firstname] = name.split(",");
          if (lastname && firstname) {
            return {
              firstname,
              lastname,
            };
          }
        }
        return [];
      });

      const mainDescriptions = result.mainDescriptions.find(
        ({ containsHTML }) => containsHTML,
      );

      const book = {
        id: result.id,
        isbn: result.identifier,
        authors,
        title: result.title,
        releaseDate: Date.parse(
          result.publicationDate.substring(0, 4) +
            "-" +
            result.publicationDate.substring(4, 6) +
            "-" +
            result.publicationDate.substring(6),
        ),
        link: result.link,
        cover: result.coverUrl.replace("-m.", "-l."),
        description: mainDescriptions?.description ?? "",
      };
      await db.collection("books").doc(result.id).set(book);
      return book;
    }),
});
