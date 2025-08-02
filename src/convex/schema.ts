import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";
// default user roles. can add / remove based on the project as needed
export const ROLES = {
ADMIN: "admin",
USER: "user",
MEMBER: "member",
} as const;
export const roleValidator = v.union(
v.literal(ROLES.ADMIN),
v.literal(ROLES.USER),
v.literal(ROLES.MEMBER),
)
export type Role = Infer<typeof roleValidator>;
export const AUCTION_STATUS = {
WAITING: "waiting",
IN_PROGRESS: "in_progress",
PAUSED: "paused",
COMPLETED: "completed",
} as const;
export const auctionStatusValidator = v.union(
v.literal(AUCTION_STATUS.WAITING),
v.literal(AUCTION_STATUS.IN_PROGRESS),
v.literal(AUCTION_STATUS.PAUSED),
v.literal(AUCTION_STATUS.COMPLETED),
);
export const PLAYER_STATUS = {
AVAILABLE: "available",
SOLD: "sold",
UNSOLD: "unsold",
} as const;
export const playerStatusValidator = v.union(
v.literal(PLAYER_STATUS.AVAILABLE),
v.literal(PLAYER_STATUS.SOLD),
v.literal(PLAYER_STATUS.UNSOLD),
);
const schema = defineSchema({
// default auth tables using convex auth.
...authTables, // do not remove or modify
// the users table is the default users table that is brought in by the authTables
users: defineTable({
name: v.optional(v.string()), // name of the user. do not remove
image: v.optional(v.string()), // image of the user. do not remove
email: v.optional(v.string()), // email of the user. do not remove
emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove
role: v.optional(roleValidator), // role of the user. do not remove
})
.index("email", ["email"]), // index for the email. do not remove or modify
// Auction management
auctions: defineTable({
name: v.string(),
createdBy: v.id("users"),
maxTeams: v.number(),
maxPlayersPerTeam: v.number(),
minPlayersPerTeam: v.number(),
teamPurse: v.number(), // in crores
status: auctionStatusValidator,
winnerId: v.optional(v.id("teams")),
winnerScore: v.optional(v.number()),
joinCode: v.string(),
})
.index("by_creator", ["createdBy"])
.index("by_status", ["status"])
.index("by_join_code", ["joinCode"]),
// Teams in auctions
teams: defineTable({
name: v.string(),
auctionId: v.id("auctions"),
ownerId: v.id("users"),
remainingPurse: v.number(), // in crores
playersCount: v.number(),
})
.index("by_auction", ["auctionId"])
.index("by_owner", ["ownerId"])
.index("by_auction_owner", ["auctionId", "ownerId"]),
// Player database
players: defineTable({
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
testCaps: v.optional(v.number()),
odiCaps: v.optional(v.number()),
t20Caps: v.optional(v.number()),
ipl: v.string(),
previousIPLTeams: v.string(),
team2024: v.string(),
ipl2024: v.string(),
category: v.string(),
reservePriceRsLakh: v.number(),
uploadedBy: v.id("users"),
})
.index("by_uploader", ["uploadedBy"])
.index("by_category", ["category"])
.index("by_country", ["country"])
.index("by_specialism", ["specialism"]),
// Players in specific auctions
auctionPlayers: defineTable({
auctionId: v.id("auctions"),
playerId: v.id("players"),
status: playerStatusValidator,
soldToTeam: v.optional(v.id("teams")),
soldPrice: v.optional(v.number()), // in crores
skipVotes: v.number(),
})
.index("by_auction", ["auctionId"])
.index("by_player", ["playerId"])
.index("by_auction_status", ["auctionId", "status"])
.index("by_team", ["soldToTeam"]),
// Bidding system
bids: defineTable({
auctionId: v.id("auctions"),
playerId: v.id("players"),
teamId: v.id("teams"),
amount: v.number(), // in crores
timestamp: v.number(),
})
.index("by_auction", ["auctionId"])
.index("by_player", ["playerId"])
.index("by_team", ["teamId"])
.index("by_auction_player", ["auctionId", "playerId"]),
// Skip voting system
skipVotes: defineTable({
auctionId: v.id("auctions"),
playerId: v.id("players"),
teamId: v.id("teams"),
})
.index("by_auction_player", ["auctionId", "playerId"])
.index("by_team", ["teamId"]),
// Auction timers
auctionTimers: defineTable({
auctionId: v.id("auctions"),
playerId: v.id("players"),
startTime: v.number(),
duration: v.number(), // in seconds
isActive: v.boolean(),
pausedTimeRemaining: v.optional(v.number()), // Store time remaining when paused
})
.index("by_auction", ["auctionId"])
.index("by_player", ["playerId"])
.index("by_active", ["isActive"]),
// OTP codes for email verification
otpCodes: defineTable({
email: v.string(),
code: v.string(),
createdAt: v.string(),
expiresAt: v.string(),
})
.index("by_email", ["email"])
.index("by_expires", ["expiresAt"]),
},
{
schemaValidation: false
});
export default schema;