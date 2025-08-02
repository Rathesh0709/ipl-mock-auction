import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { PLAYER_DATA } from "./playerData";
export const getAllPlayers = query({
args: {},
returns: v.array(v.object({
_id: v.id("players"),
_creationTime: v.number(),
srNo: v.number(),
setNo: v.string(),
set2025: v.string(),
firstName: v.string(),
surname: v.string(),
country: v.string(),
state: v.string(),
dob: v.string(),
age: v.number(),
specialism: v.string(),
hand: v.string(),
specialiceat: v.string(),
testCaps: v.number(),
odiCaps: v.number(),
t20Caps: v.number(),
ipl: v.string(),
previousIPLTeams: v.string(),
team2024: v.string(),
ipl2024: v.string(),
category: v.string(),
reservePriceRsLakh: v.number(),
uploadedBy: v.id("users"),
})),
handler: async (ctx) => {
return await ctx.db.query("players").collect();
},
});
export const deleteAllPlayers = mutation({
args: {},
returns: v.null(),
handler: async (ctx) => {
const user = await getCurrentUser(ctx);
if (!user) {
throw new Error("User must be authenticated");
}
const players = await ctx.db.query("players").collect();
for (const player of players) {
await ctx.db.delete(player._id);
}
return null;
},
});
export const restorePlayerData = mutation({
args: {},
returns: v.null(),
handler: async (ctx) => {
const user = await getCurrentUser(ctx);
if (!user) {
throw new Error("User must be authenticated");
}
// Check if players already exist
const existingPlayers = await ctx.db.query("players").collect();
if (existingPlayers.length > 0) {
return null; // Don't restore if players already exist
}
// Insert all player data
for (const playerData of PLAYER_DATA) {
await ctx.db.insert("players", {
...playerData,
uploadedBy: user._id,
});
}
return null;
},
});
