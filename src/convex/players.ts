import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { PLAYER_DATA } from "./playerData";

export const getAllPlayers = query({
  returns: v.array(v.object({
    _id: v.id("players"),
    _creationTime: v.number(),
    country: v.string(),
    srNo: v.number(),
    setNo: v.string(),
    set2025: v.string(),
    firstName: v.string(),
    surname: v.string(),
    state: v.string(),
    dob: v.string(),
    age: v.number(),
    specialism: v.string(),
    hand: v.string(),
    reservePriceRsLakh: v.number(),
    testCaps: v.optional(v.number()),
    odiCaps: v.optional(v.number()),
    t20Caps: v.optional(v.number()),
    uploadedBy: v.id("users"),
  })),
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    return players.map(player => ({
      _id: player._id,
      _creationTime: player._creationTime,
      country: player.country,
      srNo: player.srNo,
      setNo: player.setNo,
      set2025: player.set2025,
      firstName: player.firstName,
      surname: player.surname,
      state: player.state,
      dob: player.dob,
      age: player.age,
      specialism: player.specialism,
      hand: player.hand,
      reservePriceRsLakh: player.reservePriceRsLakh,
      testCaps: player.testCaps,
      odiCaps: player.odiCaps,
      t20Caps: player.t20Caps,
      uploadedBy: player.uploadedBy,
    }));
  },
});

export const addSamplePlayers = mutation({
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
