import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = async (ctx: QueryCtx) => {
  // First try Convex Auth
  const userId = await getAuthUserId(ctx);
  if (userId !== null) {
    return await ctx.db.get(userId);
  }
  
  // If Convex Auth fails, try our custom auth system
  // We'll use a session token approach
  const sessionToken = ctx.headers().get("x-session-token");
  if (sessionToken) {
    // For now, we'll use a simple approach - you can enhance this later
    // This is a temporary solution to get things working
    console.log(`[DEBUG] Using custom auth with session token: ${sessionToken}`);
    return null; // We'll implement this properly in the next step
  }
  
  return null;
};

export const currentUser = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return null;
    }
    return user;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    return user;
  },
});

export const updateUserName = mutation({
  args: { name: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    await ctx.db.patch(user._id, {
      name: args.name,
    });
    return null;
  },
});