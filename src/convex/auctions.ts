import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { AUCTION_STATUS, PLAYER_STATUS, auctionStatusValidator } from "./schema";
import { PLAYER_DATA } from "./playerData";
export const createAuction = mutation({
  args: {
    name: v.string(),
    maxTeams: v.number(),
    maxPlayersPerTeam: v.number(),
    minPlayersPerTeam: v.number(),
    teamPurse: v.number(),
    userEmail: v.string(), // Add userEmail parameter
  },
  returns: v.object({
    auctionId: v.id("auctions"),
    joinCode: v.string(),
  }),
  handler: async (ctx, args) => {
    // Find user by email instead of using getCurrentUser
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    // Generate a 6-digit join code
    const joinCode = Math.floor(100000 + Math.random() * 900000).toString();
    const auctionId = await ctx.db.insert("auctions", {
      name: args.name,
      createdBy: user._id,
      maxTeams: args.maxTeams,
      maxPlayersPerTeam: args.maxPlayersPerTeam,
      minPlayersPerTeam: args.minPlayersPerTeam,
      teamPurse: args.teamPurse,
      status: AUCTION_STATUS.WAITING,
      joinCode,
    });
    
    // Ensure all 100 players exist in database
    const existingPlayers = await ctx.db.query("players").collect();
    console.log(`[DEBUG] Found ${existingPlayers.length} existing players in database`);
    console.log(`[DEBUG] Total players needed: ${PLAYER_DATA.length}`);

    // If we don't have all 100 players, create the missing ones
    if (existingPlayers.length < PLAYER_DATA.length) {
      console.log(`[DEBUG] Need to create ${PLAYER_DATA.length - existingPlayers.length} more players`);
      
      // Create a set of existing player names for quick lookup
      const existingPlayerNames = new Set(
        existingPlayers.map(p => `${p.firstName} ${p.surname}`)
      );
      
      // Create missing players
      for (const playerData of PLAYER_DATA) {
        const playerName = `${playerData.firstName} ${playerData.surname}`;
        if (!existingPlayerNames.has(playerName)) {
          await ctx.db.insert("players", {
            srNo: playerData.srNo,
            setNo: playerData.setNo,
            set2025: playerData.set2025,
            firstName: playerData.firstName,
            surname: playerData.surname,
            country: playerData.country,
            state: playerData.state,
            dob: playerData.dob,
            age: playerData.age,
            specialism: playerData.specialism,
            hand: playerData.hand,
            specialiceat: playerData.specialiceat,
            testCaps: playerData.testCaps === null ? undefined : (playerData.testCaps as number),
            odiCaps: playerData.odiCaps === null ? undefined : (playerData.odiCaps as number),
            t20Caps: playerData.t20Caps === null ? undefined : (playerData.t20Caps as number),
            ipl: playerData.ipl,
            previousIPLTeams: playerData.previousIPLTeams,
            team2024: playerData.team2024,
            ipl2024: playerData.ipl2024,
            category: playerData.category,
            reservePriceRsLakh: playerData.reservePriceRsLakh,
            uploadedBy: user._id,
          });
          console.log(`[DEBUG] Created player: ${playerName}`);
        }
      }
    }

    // Now add all players to this auction
    const allPlayers = await ctx.db.query("players").collect();
    console.log(`[DEBUG] Adding ${allPlayers.length} players to auction ${auctionId}`);
    
    for (const player of allPlayers) {
      await ctx.db.insert("auctionPlayers", {
        auctionId,
        playerId: player._id,
        status: PLAYER_STATUS.AVAILABLE,
        skipVotes: 0,
      });
    }
    console.log(`[DEBUG] Added ${allPlayers.length} players to auction ${auctionId}`);
    console.log(`[DEBUG] Auction ${auctionId} now has ${allPlayers.length} players available`);
    
    return { auctionId, joinCode };
  },
});


export const joinAuction = mutation({
  args: {
    joinCode: v.string(),
    teamName: v.string(),
    userEmail: v.string(), // Add userEmail parameter
  },
  returns: v.object({
    auctionId: v.id("auctions"),
    teamId: v.id("teams"),
  }),
  handler: async (ctx, args) => {
    // Find user by email instead of using getCurrentUser
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    // Find auction by join code
    const auction = await ctx.db
      .query("auctions")
      .withIndex("by_join_code", (q) => q.eq("joinCode", args.joinCode))
      .first();
    
    if (!auction) {
      throw new Error("Invalid join code");
    }
    
    // Check if user already has a team in this auction
    const existingTeam = await ctx.db
      .query("teams")
      .withIndex("by_auction_owner", (q) =>
        q.eq("auctionId", auction._id).eq("ownerId", user._id)
      )
      .first();
    
    if (existingTeam) {
      return { auctionId: auction._id, teamId: existingTeam._id };
    }
    
    // Check if auction is full
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_auction", (q) => q.eq("auctionId", auction._id))
      .collect();
    
    if (teams.length >= auction.maxTeams) {
      throw new Error("Auction is full");
    }
    
    // Create team
    const teamId = await ctx.db.insert("teams", {
      name: args.teamName,
      auctionId: auction._id,
      ownerId: user._id,
      remainingPurse: auction.teamPurse,
      playersCount: 0,
    });
    
    return { auctionId: auction._id, teamId };
  },
});
export const getUserAuctions = query({
  args: { userEmail: v.string() }, // Add userEmail parameter
  returns: v.array(v.object({
    _id: v.id("auctions"),
    _creationTime: v.number(),
    name: v.string(),
    createdBy: v.id("users"),
    maxTeams: v.number(),
    maxPlayersPerTeam: v.number(),
    minPlayersPerTeam: v.number(),
    teamPurse: v.number(),
    status: v.string(),
    winnerId: v.optional(v.id("teams")),
    winnerScore: v.optional(v.number()),
    joinCode: v.string(),
    isOwner: v.boolean(),
    teamName: v.optional(v.string()),
    teamId: v.optional(v.id("teams")),
  })),
  handler: async (ctx, args) => {
    // Find user by email instead of using getCurrentUser
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      return [];
    }
    
    // Get auctions created by user
    const createdAuctions = await ctx.db
      .query("auctions")
      .withIndex("by_creator", (q) => q.eq("createdBy", user._id))
      .collect();
    
    // Get auctions where user has a team
    const userTeams = await ctx.db
      .query("teams")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
    
    const joinedAuctionIds = userTeams.map(team => team.auctionId);
    const joinedAuctions = [];
    
    for (const auctionId of joinedAuctionIds) {
      const auction = await ctx.db.get(auctionId);
      if (auction && auction.createdBy !== user._id) {
        joinedAuctions.push(auction);
      }
    }
    
    // Combine and format results
    const allAuctions = [...createdAuctions, ...joinedAuctions];
    const result = [];
    
    for (const auction of allAuctions) {
      const isOwner = auction.createdBy === user._id;
      const userTeam = userTeams.find(team => team.auctionId === auction._id);
      result.push({
        ...auction,
        isOwner,
        teamName: userTeam?.name,
        teamId: userTeam?._id,
      });
    }
    
    return result.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getAllAuctions = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("auctions"),
    _creationTime: v.number(),
    name: v.string(),
    createdBy: v.id("users"),
    maxTeams: v.number(),
    maxPlayersPerTeam: v.number(),
    minPlayersPerTeam: v.number(),
    teamPurse: v.number(),
    status: v.string(),
    winnerId: v.optional(v.id("teams")),
    winnerScore: v.optional(v.number()),
    joinCode: v.string(),
    creatorName: v.optional(v.string()),
  })),
  handler: async (ctx, args) => {
    // Get all auctions
    const allAuctions = await ctx.db
      .query("auctions")
      .collect();
    
    const result = [];
    
    for (const auction of allAuctions) {
      // Get creator name
      const creator = await ctx.db.get(auction.createdBy);
      const creatorName = creator?.name || creator?.email || "Unknown";
      
      result.push({
        ...auction,
        creatorName,
      });
    }
    
    return result.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getAuctionDetails = query({
  args: { auctionId: v.id("auctions") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("auctions"),
      _creationTime: v.float64(),
      name: v.string(),
      createdBy: v.id("users"),
      maxTeams: v.float64(),
      maxPlayersPerTeam: v.float64(),
      minPlayersPerTeam: v.float64(),
      teamPurse: v.float64(),
      status: auctionStatusValidator,
      winnerId: v.optional(v.id("teams")),
      winnerScore: v.optional(v.float64()),
      joinCode: v.string(),
      teams: v.array(v.object({
        _id: v.id("teams"),
        name: v.string(),
        ownerId: v.id("users"),
        remainingPurse: v.float64(),
        playersCount: v.float64(),
        auctionId: v.id("auctions"),
      })),
      totalPlayers: v.float64(),
      processedPlayersCount: v.float64(),
      currentPlayerNumber: v.float64(),
      currentPlayer: v.optional(v.object({
        _id: v.id("players"),
        firstName: v.string(),
        surname: v.string(),
        country: v.string(),
        specialism: v.string(),
        reservePriceRsLakh: v.float64(),
        currentBid: v.optional(v.object({
          amount: v.float64(),
          teamName: v.string(),
        })),
      })),
      auctionTimer: v.optional(v.object({
        startTime: v.float64(),
        duration: v.float64(),
        isActive: v.boolean(),
      })),
    })
  ),
  handler: async (ctx, args) => {
    const auction = await ctx.db.get(args.auctionId);
    if (!auction) {
      return null;
    }
    // Get teams
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_auction", (q) => q.eq("auctionId", args.auctionId))
      .collect();
    
    // Map teams to only include expected fields
    const mappedTeams = teams.map(team => ({
      _id: team._id,
      name: team.name,
      ownerId: team.ownerId,
      remainingPurse: team.remainingPurse,
      playersCount: team.playersCount,
      auctionId: team.auctionId,
    }));
    // Get auction players
    const auctionPlayers = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction", (q) => q.eq("auctionId", args.auctionId))
      .collect();
    console.log(`[DEBUG] Found ${auctionPlayers.length} auction players for auction ${args.auctionId}`);

    const totalPlayers = auctionPlayers.length;
    const processedPlayersCount = auctionPlayers.filter(
      p => p.status === PLAYER_STATUS.SOLD || p.status === PLAYER_STATUS.UNSOLD
    ).length;
    const currentPlayerNumber = processedPlayersCount + 1;

    // Get current player (first available player)
    const currentPlayerAuctionData = auctionPlayers.find(
      p => p.status === PLAYER_STATUS.AVAILABLE
    );
    console.log(`[DEBUG] Current player auction data:`, currentPlayerAuctionData);

    let currentPlayer = undefined;
    if (currentPlayerAuctionData) {
      const playerDetails = await ctx.db.get(currentPlayerAuctionData.playerId);
      console.log(`[DEBUG] Player details:`, playerDetails);
      if (playerDetails) {
        // Get current highest bid
        const currentBid = await ctx.db
          .query("bids")
          .withIndex("by_auction_player", (q) =>
            q.eq("auctionId", args.auctionId).eq("playerId", playerDetails._id)
          )
          .order("desc")
          .first();
        let currentBidInfo = undefined;
        if (currentBid) {
          const biddingTeam = await ctx.db.get(currentBid.teamId);
          if (biddingTeam) {
            currentBidInfo = {
              amount: currentBid.amount,
              teamName: biddingTeam.name,
            };
          }
        }
        currentPlayer = {
          _id: playerDetails._id,
          firstName: playerDetails.firstName,
          surname: playerDetails.surname,
          country: playerDetails.country,
          specialism: playerDetails.specialism,
          reservePriceRsLakh: playerDetails.reservePriceRsLakh,
          currentBid: currentBidInfo,
        };
      }
    }
    console.log(`[DEBUG] Final current player:`, currentPlayer);
    // Get auction timer
    const auctionTimer = await ctx.db
      .query("auctionTimers")
      .withIndex("by_auction", (q) => q.eq("auctionId", args.auctionId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    // Map auctionTimer to only include expected fields
    const mappedAuctionTimer = auctionTimer ? {
      startTime: auctionTimer.startTime,
      duration: auctionTimer.duration,
      isActive: auctionTimer.isActive,
    } : undefined;

    return {
      ...auction,
      teams: mappedTeams,
      totalPlayers,
      processedPlayersCount,
      currentPlayerNumber,
      currentPlayer: currentPlayer || undefined,
      auctionTimer: mappedAuctionTimer || undefined,
      winnerId: auction.winnerId || undefined,
      winnerScore: auction.winnerScore || undefined,
    };
  },
});

export const getUserTeam = query({
  args: { 
    auctionId: v.id("auctions"),
    userEmail: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("teams"),
      name: v.string(),
      ownerId: v.id("users"),
      remainingPurse: v.float64(),
      playersCount: v.float64(),
      auctionId: v.id("auctions"),
    })
  ),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      return null;
    }
    
    // Find team by auctionId and ownerId
    const team = await ctx.db
      .query("teams")
      .withIndex("by_auction_owner", (q) =>
        q.eq("auctionId", args.auctionId).eq("ownerId", user._id)
      )
      .first();
    
    if (!team) {
      return null;
    }
    
    return {
      _id: team._id,
      name: team.name,
      ownerId: team.ownerId,
      remainingPurse: team.remainingPurse,
      playersCount: team.playersCount,
      auctionId: team.auctionId,
    };
  },
});

export const getAuctionTeams = query({
  args: { auctionId: v.id("auctions") },
  returns: v.array(v.object({
    _id: v.id("teams"),
    name: v.string(),
    ownerId: v.id("users"),
    remainingPurse: v.float64(),
    playersCount: v.float64(),
    auctionId: v.id("auctions"),
  })),
  handler: async (ctx, args) => {
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_auction", (q) => q.eq("auctionId", args.auctionId))
      .collect();
    
    // Return only the fields specified in the validator
    return teams.map(team => ({
      _id: team._id,
      name: team.name,
      ownerId: team.ownerId,
      remainingPurse: team.remainingPurse,
      playersCount: team.playersCount,
      auctionId: team.auctionId,
    }));
  },
});

export const updateTeamName = mutation({
  args: { 
    teamId: v.id("teams"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.teamId, { name: args.name });
  },
});