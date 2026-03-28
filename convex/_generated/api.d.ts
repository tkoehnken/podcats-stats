/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as authors from "../authors.js";
import type * as books from "../books.js";
import type * as collections from "../collections.js";
import type * as crons from "../crons.js";
import type * as episodes from "../episodes.js";
import type * as greetings from "../greetings.js";
import type * as guests from "../guests.js";
import type * as model_books from "../model/books.js";
import type * as model_collections from "../model/collections.js";
import type * as model_connections from "../model/connections.js";
import type * as model_episodes from "../model/episodes.js";
import type * as model_util from "../model/util.js";
import type * as spotify from "../spotify.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  authors: typeof authors;
  books: typeof books;
  collections: typeof collections;
  crons: typeof crons;
  episodes: typeof episodes;
  greetings: typeof greetings;
  guests: typeof guests;
  "model/books": typeof model_books;
  "model/collections": typeof model_collections;
  "model/connections": typeof model_connections;
  "model/episodes": typeof model_episodes;
  "model/util": typeof model_util;
  spotify: typeof spotify;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
