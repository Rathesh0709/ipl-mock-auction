import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
export const clearAllAuctions = internalMutation({
args: {},
returns: v.null(),
handler: async (ctx) => {
// Delete all auction-related data in the correct order to avoid foreign key issues
// 1. Delete skip votes
const skipVotes = await ctx.db.query("skipVotes").collect();
for (const vote of skipVotes) {
await ctx.db.delete(vote._id);
}
// 2. Delete bids
const bids = await ctx.db.query("bids").collect();
for (const bid of bids) {
await ctx.db.delete(bid._id);
}
// 3. Delete auction players
const auctionPlayers = await ctx.db.query("auctionPlayers").collect();
for (const auctionPlayer of auctionPlayers) {
await ctx.db.delete(auctionPlayer._id);
}
// 4. Delete auction timers
const timers = await ctx.db.query("auctionTimers").collect();
for (const timer of timers) {
await ctx.db.delete(timer._id);
}
// 5. Delete teams
const teams = await ctx.db.query("teams").collect();
for (const team of teams) {
await ctx.db.delete(team._id);
}
// 6. Delete auctions
const auctions = await ctx.db.query("auctions").collect();
for (const auction of auctions) {
await ctx.db.delete(auction._id);
}
console.log("All auction data cleared successfully");
return null;
},
});