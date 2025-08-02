/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai from "../ai.js";
import type * as allPlayerData from "../allPlayerData.js";
import type * as auctions from "../auctions.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as bidding from "../bidding.js";
import type * as generator_clearAllAuctions from "../generator/clearAllAuctions.js";
import type * as http from "../http.js";
import type * as playerData from "../playerData.js";
import type * as players from "../players.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  allPlayerData: typeof allPlayerData;
  auctions: typeof auctions;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  bidding: typeof bidding;
  "generator/clearAllAuctions": typeof generator_clearAllAuctions;
  http: typeof http;
  playerData: typeof playerData;
  players: typeof players;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
