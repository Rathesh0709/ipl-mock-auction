import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AUCTION_STATUS, PLAYER_STATUS } from "./schema";

// Timer management functions
const startPlayerTimer = async (ctx: any, auctionId: any, playerId: any, duration: number) => {
  // Clear any existing timers for this auction
  const existingTimers = await ctx.db
    .query("auctionTimers")
    .withIndex("by_auction", (q: any) => q.eq("auctionId", auctionId))
    .filter((q: any) => q.eq(q.field("isActive"), true))
    .collect();

  for (const timer of existingTimers) {
    await ctx.db.patch(timer._id, { isActive: false });
  }

  // Create new timer
  await ctx.db.insert("auctionTimers", {
    auctionId,
    playerId,
    startTime: Date.now(),
    duration: duration * 1000, // Convert to milliseconds
    isActive: true,
  });
};

const resetPlayerTimer = async (ctx: any, auctionId: any, playerId: any) => {
  // Get current active timer
  const currentTimer = await ctx.db
    .query("auctionTimers")
    .withIndex("by_auction", (q: any) => q.eq("auctionId", auctionId))
    .filter((q: any) => q.eq(q.field("isActive"), true))
    .first();

  if (currentTimer) {
    // Reset timer to 15 seconds
    await ctx.db.patch(currentTimer._id, {
      startTime: Date.now(),
      duration: 15 * 1000, // 15 seconds in milliseconds
    });
  }
};

const handleTimerExpiration = async (ctx: any, auctionId: any, playerId: any) => {
  // Get the highest bid for this player
  const highestBid = await ctx.db
    .query("bids")
    .withIndex("by_auction_player", (q: any) =>
      q.eq("auctionId", auctionId).eq("playerId", playerId)
    )
    .order("desc")
    .first();

  // Get the auction player data
  const auctionPlayer = await ctx.db
    .query("auctionPlayers")
    .withIndex("by_auction_status", (q: any) =>
      q.eq("auctionId", auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
    )
    .filter((q: any) => q.eq(q.field("playerId"), playerId))
    .first();

  if (!auctionPlayer) {
    return;
  }

  if (highestBid) {
    // Sell to highest bidder
    await ctx.db.patch(auctionPlayer._id, {
      status: PLAYER_STATUS.SOLD,
      soldToTeam: highestBid.teamId,
      soldPrice: Math.round(highestBid.amount * 100) / 100,
    });

    // Update team purse and player count
    const team = await ctx.db.get(highestBid.teamId);
    if (team) {
      await ctx.db.patch(team._id, {
        remainingPurse: Math.round((team.remainingPurse - highestBid.amount) * 100) / 100,
        playersCount: team.playersCount + 1,
      });
    }
  } else {
    // Mark as unsold
    await ctx.db.patch(auctionPlayer._id, {
      status: PLAYER_STATUS.UNSOLD,
    });
  }

  // Clear skip votes for this player
  const skipVotes = await ctx.db
    .query("skipVotes")
    .withIndex("by_auction_player", (q: any) =>
      q.eq("auctionId", auctionId).eq("playerId", playerId)
    )
    .collect();

  for (const vote of skipVotes) {
    await ctx.db.delete(vote._id);
  }

  // Deactivate timer
  const activeTimer = await ctx.db
    .query("auctionTimers")
    .withIndex("by_auction", (q: any) => q.eq("auctionId", auctionId))
    .filter((q: any) => q.eq(q.field("isActive"), true))
    .first();

  if (activeTimer) {
    await ctx.db.patch(activeTimer._id, { isActive: false });
  }

  // Move to next player
  await moveToNextPlayer(ctx, auctionId);
};

const moveToNextPlayer = async (ctx: any, auctionId: any) => {
  // Get the next available player
  const nextPlayer = await ctx.db
    .query("auctionPlayers")
    .withIndex("by_auction_status", (q: any) =>
      q.eq("auctionId", auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
    )
    .first();

  if (nextPlayer) {
    // Start timer for next player
    await startPlayerTimer(ctx, auctionId, nextPlayer.playerId, 30);
  } else {
    // Check if auction should be completed
    const remainingPlayers = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction_status", (q: any) =>
        q.eq("auctionId", auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
      )
      .collect();

    if (remainingPlayers.length === 0) {
      // All players processed, complete auction
      await ctx.db.patch(auctionId, { status: AUCTION_STATUS.COMPLETED });
    }
  }
};

export const placeBid = mutation({
  args: {
    auctionId: v.id("auctions"),
    amount: v.number(),
    userEmail: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    // Get user's team in this auction
    const team = await ctx.db
      .query("teams")
      .withIndex("by_auction_owner", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("ownerId", user._id)
      )
      .first();
    
    if (!team) {
      throw new Error("You are not part of this auction");
    }
    
    // Check if team has enough purse
    if (team.remainingPurse < args.amount) {
      throw new Error("Insufficient purse amount");
    }
    
    // Get auction
    const auction = await ctx.db.get(args.auctionId);
    if (!auction || auction.status !== AUCTION_STATUS.IN_PROGRESS) {
      throw new Error("Auction is not in progress");
    }
    
    // Get current player
    const currentPlayerAuctionData = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction_status", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
      )
      .first();
    
    if (!currentPlayerAuctionData) {
      throw new Error("No current player to bid on");
    }
    
    // Get current highest bid
    const currentBid = await ctx.db
      .query("bids")
      .withIndex("by_auction_player", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("playerId", currentPlayerAuctionData.playerId)
      )
      .order("desc")
      .first();

    // Get player details for minimum bid
    const player = await ctx.db.get(currentPlayerAuctionData.playerId);
    if (!player) {
      throw new Error("Player not found");
    }

    // Convert reserve price from lakhs to crores
    const reservePriceInCrores = player.reservePriceRsLakh / 100;

    // Calculate minimum bid based on current bid
    let minimumBid;
    if (!currentBid) {
      minimumBid = Math.round(reservePriceInCrores * 100) / 100;
    } else {
      let increment;
      if (currentBid.amount < 1) {
        increment = 0.1;
      } else if (currentBid.amount < 10) {
        increment = 0.2;
      } else {
        increment = 0.25;
      }
      minimumBid = Math.round((currentBid.amount + increment) * 100) / 100;
    }

    if (args.amount < minimumBid) {
      throw new Error(`Minimum bid is ₹${minimumBid.toFixed(2)} crores`);
    }
    
    // Place the bid
    await ctx.db.insert("bids", {
      auctionId: args.auctionId,
      playerId: currentPlayerAuctionData.playerId,
      teamId: team._id,
      amount: Math.round(args.amount * 100) / 100,
      timestamp: Date.now(),
    });

    // Timer management
    if (!currentBid) {
      await startPlayerTimer(ctx, args.auctionId, currentPlayerAuctionData.playerId, 30);
    } else {
      await resetPlayerTimer(ctx, args.auctionId, currentPlayerAuctionData.playerId);
    }
    
    return null;
  },
});

export const skipPlayer = mutation({
  args: {
    auctionId: v.id("auctions"),
    userEmail: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    // Get user's team in this auction
    const team = await ctx.db
      .query("teams")
      .withIndex("by_auction_owner", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("ownerId", user._id)
      )
      .first();
    
    if (!team) {
      throw new Error("You are not part of this auction");
    }
    
    // Get auction
    const auction = await ctx.db.get(args.auctionId);
    if (!auction || auction.status !== AUCTION_STATUS.IN_PROGRESS) {
      throw new Error("Auction is not in progress");
    }
    
    // Get current player
    const currentPlayerAuctionData = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction_status", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
      )
      .first();
    
    if (!currentPlayerAuctionData) {
      throw new Error("No current player to skip");
    }
    
    // Check if team already voted to skip this player
    const existingVote = await ctx.db
      .query("skipVotes")
      .withIndex("by_auction_player", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("playerId", currentPlayerAuctionData.playerId)
      )
      .filter((q: any) => q.eq(q.field("teamId"), team._id))
      .first();
    
    if (existingVote) {
      throw new Error("You have already voted to skip this player");
    }
    
    // Add skip vote
    await ctx.db.insert("skipVotes", {
      auctionId: args.auctionId,
      playerId: currentPlayerAuctionData.playerId,
      teamId: team._id,
    });
    
    // Update skip votes count on auction player
    await ctx.db.patch(currentPlayerAuctionData._id, {
      skipVotes: currentPlayerAuctionData.skipVotes + 1,
    });

    // Check if all teams have voted to skip
    const allTeams = await ctx.db
      .query("teams")
      .withIndex("by_auction", (q: any) => q.eq("auctionId", args.auctionId))
      .collect();

    const totalSkipVotes = currentPlayerAuctionData.skipVotes + 1;

    if (totalSkipVotes >= allTeams.length) {
      // All teams have voted to skip, mark player as unsold
      await ctx.db.patch(currentPlayerAuctionData._id, {
        status: PLAYER_STATUS.UNSOLD,
      });
      
      // Clear skip votes for this player
      const skipVotes = await ctx.db
        .query("skipVotes")
        .withIndex("by_auction_player", (q: any) =>
          q.eq("auctionId", args.auctionId).eq("playerId", currentPlayerAuctionData.playerId)
        )
        .collect();

      for (const vote of skipVotes) {
        await ctx.db.delete(vote._id);
      }

      // Deactivate current timer
      const activeTimer = await ctx.db
        .query("auctionTimers")
        .withIndex("by_auction", (q: any) => q.eq("auctionId", args.auctionId))
        .filter((q: any) => q.eq(q.field("isActive"), true))
        .first();

      if (activeTimer) {
        await ctx.db.patch(activeTimer._id, { isActive: false });
      }

      // Move to next player and start 30s timer
      await moveToNextPlayer(ctx, args.auctionId);
    }
    
    return null;
  },
});

export const getCurrentSkipVotes = query({
  args: { auctionId: v.id("auctions") },
  returns: v.number(),
  handler: async (ctx, args) => {
    // Get current player (first available player)
    const currentPlayerAuctionData = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction_status", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
      )
      .first();
    if (!currentPlayerAuctionData) {
      return 0;
    }
    // Count skip votes for current player
    const skipVotes = await ctx.db
      .query("skipVotes")
      .withIndex("by_auction_player", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("playerId", currentPlayerAuctionData.playerId)
      )
      .collect();
    return skipVotes.length;
  },
});

export const checkTimerExpiration = query({
  args: { auctionId: v.id("auctions") },
  returns: v.object({
    hasExpired: v.boolean(),
    timeRemaining: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get auction status first
    const auction = await ctx.db.get(args.auctionId);
    if (!auction) {
      return { hasExpired: false, timeRemaining: 0 };
    }

    // If auction is paused, return the stored paused time remaining
    if (auction.status === "paused") {
      const activeTimer = await ctx.db
        .query("auctionTimers")
        .withIndex("by_auction", (q: any) => q.eq("auctionId", args.auctionId))
        .filter((q: any) => q.eq(q.field("isActive"), true))
        .first();

      if (!activeTimer) {
        return { hasExpired: false, timeRemaining: 0 };
      }

      const timeRemaining = activeTimer.pausedTimeRemaining || 0;
      const hasExpired = timeRemaining <= 0;

      return { hasExpired, timeRemaining };
    }

    // Get current active timer
    const activeTimer = await ctx.db
      .query("auctionTimers")
      .withIndex("by_auction", (q: any) => q.eq("auctionId", args.auctionId))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .first();

    if (!activeTimer) {
      return { hasExpired: false, timeRemaining: 0 };
    }

    const elapsed = Date.now() - activeTimer.startTime;
    const timeRemaining = Math.max(0, activeTimer.duration - elapsed);
    const hasExpired = timeRemaining <= 0;

    return { hasExpired, timeRemaining };
  },
});

export const soldPlayer = mutation({
  args: {
    auctionId: v.id("auctions"),
    userEmail: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    // Get auction
    const auction = await ctx.db.get(args.auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }
    
    // Only auction creator can mark player as sold
    if (auction.createdBy !== user._id) {
      throw new Error("Only auction creator can mark player as sold");
    }
    
    // Get current player
    const currentPlayerAuctionData = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction_status", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
      )
      .first();
    
    if (!currentPlayerAuctionData) {
      throw new Error("No current player to sell");
    }
    
    // Get highest bid
    const highestBid = await ctx.db
      .query("bids")
      .withIndex("by_auction_player", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("playerId", currentPlayerAuctionData.playerId)
      )
      .order("desc")
      .first();
    
    if (!highestBid) {
      throw new Error("No bids found for this player");
    }
    
    // Update auction player as sold
    await ctx.db.patch(currentPlayerAuctionData._id, {
      status: PLAYER_STATUS.SOLD,
      soldToTeam: highestBid.teamId,
      soldPrice: Math.round(highestBid.amount * 100) / 100,
    });
    
    // Update team purse and player count
    const team = await ctx.db.get(highestBid.teamId);
    if (team) {
      await ctx.db.patch(team._id, {
        remainingPurse: Math.round((team.remainingPurse - highestBid.amount) * 100) / 100,
        playersCount: team.playersCount + 1,
      });
    }
    
    // Clear skip votes for this player
    const skipVotes = await ctx.db
      .query("skipVotes")
      .withIndex("by_auction_player", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("playerId", currentPlayerAuctionData.playerId)
      )
      .collect();
    
    for (const vote of skipVotes) {
      await ctx.db.delete(vote._id);
    }
    
    return null;
  },
});

export const startAuction = mutation({
  args: { 
    auctionId: v.id("auctions"),
    userEmail: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.userEmail))
      .first();

    if (!user) {
      throw new Error("User must be authenticated");
    }

    const auction = await ctx.db.get(args.auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }

    if (auction.createdBy !== user._id) {
      throw new Error("Only auction creator can start the auction");
    }

    if (auction.status !== AUCTION_STATUS.WAITING) {
      throw new Error("Auction is not in waiting status");
    }

    // Check if there are at least 2 teams
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_auction", (q: any) => q.eq("auctionId", args.auctionId))
      .collect();

    if (teams.length < 2) {
      throw new Error("At least 2 teams are required to start the auction");
    }

    await ctx.db.patch(args.auctionId, {
      status: AUCTION_STATUS.IN_PROGRESS,
    });

    // Start timer for the first player
    const firstPlayer = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction_status", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
      )
      .first();

    if (firstPlayer) {
      await startPlayerTimer(ctx, args.auctionId, firstPlayer.playerId, 30);
    }

    return null;
  },
});

export const pauseAuction = mutation({
  args: { 
    auctionId: v.id("auctions"),
    userEmail: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    const auction = await ctx.db.get(args.auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }
    
    if (auction.createdBy !== user._id) {
      throw new Error("Only auction creator can pause the auction");
    }
    
    if (auction.status !== AUCTION_STATUS.IN_PROGRESS) {
      throw new Error("Auction is not in progress");
    }
    
    // Get current active timer and store the remaining time
    const activeTimer = await ctx.db
      .query("auctionTimers")
      .withIndex("by_auction", (q: any) => q.eq("auctionId", args.auctionId))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .first();

    if (activeTimer) {
      const elapsed = Date.now() - activeTimer.startTime;
      const timeRemaining = Math.max(0, activeTimer.duration - elapsed);
      
      // Update the timer with the paused time remaining
      await ctx.db.patch(activeTimer._id, {
        pausedTimeRemaining: timeRemaining,
      });
    }
    
    await ctx.db.patch(args.auctionId, {
      status: AUCTION_STATUS.PAUSED,
    });
    
    return null;
  },
});

export const resumeAuction = mutation({
  args: { 
    auctionId: v.id("auctions"),
    userEmail: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    const auction = await ctx.db.get(args.auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }
    
    if (auction.createdBy !== user._id) {
      throw new Error("Only auction creator can resume the auction");
    }
    
    if (auction.status !== AUCTION_STATUS.PAUSED) {
      throw new Error("Auction is not paused");
    }
    
    // Get current active timer and restart it from the paused time
    const activeTimer = await ctx.db
      .query("auctionTimers")
      .withIndex("by_auction", (q: any) => q.eq("auctionId", args.auctionId))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .first();

    if (activeTimer && activeTimer.pausedTimeRemaining) {
      // Restart the timer with the remaining time from when it was paused
      await ctx.db.patch(activeTimer._id, {
        startTime: Date.now(),
        duration: activeTimer.pausedTimeRemaining,
        pausedTimeRemaining: undefined,
      });
    }
    
    await ctx.db.patch(args.auctionId, {
      status: AUCTION_STATUS.IN_PROGRESS,
    });
    
    return null;
  },
});

export const completeAuction = mutation({
  args: { 
    auctionId: v.id("auctions"),
    userEmail: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.userEmail))
      .first();
    
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    const auction = await ctx.db.get(args.auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }
    
    if (auction.createdBy !== user._id) {
      throw new Error("Only auction creator can complete the auction");
    }
    
    await ctx.db.patch(args.auctionId, {
      status: AUCTION_STATUS.COMPLETED,
    });
    
    return null;
  },
});

export const startTimerForCurrentPlayer = mutation({
  args: { 
    auctionId: v.id("auctions"),
    userEmail: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.userEmail))
      .first();

    if (!user) {
      throw new Error("User must be authenticated");
    }

    // Get current player
    const currentPlayerAuctionData = await ctx.db
      .query("auctionPlayers")
      .withIndex("by_auction_status", (q: any) =>
        q.eq("auctionId", args.auctionId).eq("status", PLAYER_STATUS.AVAILABLE)
      )
      .first();

    if (!currentPlayerAuctionData) {
      throw new Error("No current player available");
    }

    // Start 30 second timer for the current player
    await startPlayerTimer(ctx, args.auctionId, currentPlayerAuctionData.playerId, 30);

    return null;
  },
});

export const handleTimerExpirationMutation = mutation({
  args: { auctionId: v.id("auctions") },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get current active timer
    const activeTimer = await ctx.db
      .query("auctionTimers")
      .withIndex("by_auction", (q: any) => q.eq("auctionId", args.auctionId))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .first();

    if (!activeTimer) {
      return null;
    }

    const elapsed = Date.now() - activeTimer.startTime;
    const timeRemaining = Math.max(0, activeTimer.duration - elapsed);
    const hasExpired = timeRemaining <= 0;

    if (hasExpired) {
      await handleTimerExpiration(ctx, args.auctionId, activeTimer.playerId);
    }

    return null;
  },
});