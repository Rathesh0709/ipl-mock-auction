import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { PLAYER_DATA } from "./playerData";

export const addAllPlayers = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "admin@example.com"))
      .first();

    if (!user) {
      throw new Error("Admin user not found");
    }

    for (const playerData of PLAYER_DATA) {
      await ctx.db.insert("players", {
        ...playerData,
        testCaps: playerData.testCaps === null ? undefined : playerData.testCaps,
        odiCaps: playerData.odiCaps === null ? undefined : playerData.odiCaps,
        t20Caps: playerData.t20Caps === null ? undefined : playerData.t20Caps,
        uploadedBy: user._id,
      });
    }
  },
});