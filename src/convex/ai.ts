import { v } from "convex/values";
import { mutation, action, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { getCurrentUser } from "./users";
import { AUCTION_STATUS } from "./schema";
// Analyze teams and determine winner using AI
export const analyzeTeamsAndDeclareWinner = action({
args: { auctionId: v.id("auctions") },
returns: v.null(),
handler: async (ctx, args) => {
const auction = await ctx.runQuery(api.auctions.getAuctionDetails, { auctionId: args.auctionId });
if (!auction || auction.status !== AUCTION_STATUS.COMPLETED) {
throw new Error("Auction must be completed to analyze teams");
}
// Get all sold players for each team
const teamAnalysis = [];
for (const team of auction.teams) {
const soldPlayers = await ctx.runQuery(api.ai.getTeamPlayers, {
auctionId: args.auctionId,
teamId: team._id
});
teamAnalysis.push({
teamId: team._id,
teamName: team.name,
players: soldPlayers,
totalSpent: auction.teamPurse - team.remainingPurse,
playersCount: team.playersCount,
});
}
// Simple AI scoring algorithm (in a real app, you'd use OpenAI API)
let bestTeam = null;
let highestScore = 0;
for (const team of teamAnalysis) {
let score = 0;
// Score based on player quality (base price as proxy)
const avgPlayerPrice = team.totalSpent / Math.max(team.playersCount, 1);
score += avgPlayerPrice * 2;
// Bonus for balanced squad
const specialisms = team.players.map((p: any) => p.specialism).filter(Boolean);
const uniqueSpecialisms = new Set(specialisms).size;
score += uniqueSpecialisms * 10;
// Bonus for having wicket-keeper
const hasWicketKeeper = specialisms.some((spec: any) => spec?.toLowerCase().includes('keeper'));
if (hasWicketKeeper) score += 15;
// Bonus for all-rounders
const allRounders = specialisms.filter((spec: any) => spec?.toLowerCase().includes('rounder')).length;
score += allRounders * 8;
// Penalty for incomplete squad
if (team.playersCount < auction.minPlayersPerTeam) {
score -= (auction.minPlayersPerTeam - team.playersCount) * 5;
}
if (score > highestScore) {
highestScore = score;
bestTeam = team;
}
}
if (bestTeam) {
await ctx.runMutation(api.ai.declareWinner, {
auctionId: args.auctionId,
winnerId: bestTeam.teamId,
winnerScore: Math.round(highestScore),
});
}
return null;
},
});
// Get all auction players (query)
export const getAllAuctionPlayers = query({
args: {
auctionId: v.id("auctions"),
},
returns: v.array(v.object({
_id: v.id("players"),
playerName: v.string(),
country: v.string(),
age: v.number(),
specialism: v.optional(v.string()),
reservePriceRsLakh: v.number(),
  status: v.union(v.literal("available"), v.literal("sold"), v.literal("unsold")),
soldPrice: v.optional(v.number()),
soldToTeam: v.optional(v.string()),
})),
handler: async (ctx, args) => {
const auctionPlayers = await ctx.db
.query("auctionPlayers")
.withIndex("by_auction", (q) => q.eq("auctionId", args.auctionId))
.collect();

const players = [];
for (const auctionPlayer of auctionPlayers) {
const player = await ctx.db.get(auctionPlayer.playerId);
if (player) {
// Get team name if sold
let soldToTeamName = undefined;
if (auctionPlayer.soldToTeam) {
const team = await ctx.db.get(auctionPlayer.soldToTeam);
if (team) {
soldToTeamName = team.name;
}
}

players.push({
_id: player._id,
playerName: `${player.firstName} ${player.surname}`,
country: player.country,
age: player.age,
specialism: player.specialism,
reservePriceRsLakh: player.reservePriceRsLakh,
status: auctionPlayer.status,
soldPrice: auctionPlayer.soldPrice,
soldToTeam: soldToTeamName,
});
}
}
return players;
},
});

// Get team players (query)
export const getTeamPlayers = query({
  args: { 
    auctionId: v.id("auctions"),
    teamId: v.id("teams"),
  },
  returns: v.array(v.object({
    _id: v.string(),
    playerName: v.string(),
    country: v.string(),
    specialism: v.optional(v.string()),
    basePrice: v.number(),
    soldPrice: v.number(),
  })),
  handler: async (ctx, args) => {
    // Get all auction players for this auction
    const auctionPlayers = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction", (q) => q.eq("auctionId", args.auctionId))
      .filter((q) => q.eq(q.field("soldToTeam"), args.teamId))
      .collect();

    const players = [];
    for (const auctionPlayer of auctionPlayers) {
      const player = await ctx.db.get(auctionPlayer.playerId);
      if (player) {
        players.push({
          _id: player._id,
          playerName: `${player.firstName} ${player.surname}`,
          country: player.country,
          specialism: player.specialism,
          basePrice: Math.round(player.reservePriceRsLakh * 100) / 100,
          soldPrice: Math.round((auctionPlayer.soldPrice || 0) * 100) / 100,
        });
      }
    }
    return players;
  },
});
// Declare winner (mutation)
export const declareWinner = mutation({
  args: { 
    auctionId: v.id("auctions"),
    winnerId: v.id("teams"),
    winnerScore: v.number(),
  },
  handler: async (ctx, args) => {
    // Update auction with winner
    await ctx.db.patch(args.auctionId, {
      winnerId: args.winnerId,
      winnerScore: args.winnerScore,
      status: "completed",
    });

    return args.winnerId;
  },
});