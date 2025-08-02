import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";

export const getCurrentUser = query({
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
    // For now, return null since we're using localStorage-based auth
    return null;
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

export const sendEmailOtp = action({
  args: { 
    email: v.string(),
    otp: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log(`[DEBUG] Attempting to send email to: ${args.email}`);
      console.log(`[DEBUG] Using OTP: ${args.otp}`);
      
      // Get API key from environment variable
      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        console.error("[DEBUG] BREVO_API_KEY environment variable not found");
        return { success: false, message: "Email service configuration error" };
      }
      
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "IPL Auction Platform",
            email: "rathesh0709@gmail.com" // Use your verified email
          },
          to: [
            {
              email: args.email,
              name: args.email.split("@")[0]
            }
          ],
          subject: "Your IPL Auction Verification Code",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">🏏 IPL Auction Platform</h2>
                <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">Hello!</p>
                <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">Your verification code for the IPL Auction Platform is:</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <h1 style="color: #2563eb; font-size: 48px; letter-spacing: 8px; margin: 0; font-weight: bold;">${args.otp}</h1>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">This code will expire in 10 minutes.</p>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">If you didn't request this code, please ignore this email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">IPL Auction Platform - Secure Authentication</p>
              </div>
            </div>
          `,
          textContent: `Your IPL Auction verification code is: ${args.otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
        }),
      });
      
      console.log(`[DEBUG] Email response status: ${response.status}`);
      console.log(`[DEBUG] Email response status text: ${response.statusText}`);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log(`[DEBUG] Email sent successfully to ${args.email}:`, responseData);
        console.log(`[DEBUG] Message ID: ${responseData.messageId}`);
        return { success: true, message: `Verification code sent to ${args.email}` };
      } else {
        const errorText = await response.text();
        console.error(`[DEBUG] Email service failed with status: ${response.status} - ${errorText}`);
        
        // Try to parse error response for better debugging
        try {
          const errorData = JSON.parse(errorText);
          console.error(`[DEBUG] Error details:`, errorData);
        } catch (e) {
          console.error(`[DEBUG] Could not parse error response`);
        }
        
        return { success: false, message: `Email service failed: ${response.status}` };
      }
      
    } catch (error) {
      console.error("[DEBUG] Email sending error:", error);
      console.error("[DEBUG] Error message:", error instanceof Error ? error.message : String(error));
      return { success: false, message: `Email service error: ${error instanceof Error ? error.message : String(error)}` };
    }
  },
});

export const sendOtp = mutation({
  args: { email: v.string() },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    otp: v.string(),
  }),
  handler: async (ctx, args) => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiration
    await ctx.db.insert("otpCodes", {
      email: args.email,
      code: otp,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    });
    
    console.log(`[DEBUG] OTP generated for ${args.email}: ${otp}`);
    
    return { 
      success: true, 
      message: `OTP generated successfully`,
      otp: otp
    };
  },
});

export const verifyOtp = mutation({
  args: { 
    email: v.string(),
    otp: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Find the OTP code
    const otpRecord = await ctx.db
      .query("otpCodes")
      .filter((q) => 
        q.and(
          q.eq(q.field("email"), args.email),
          q.eq(q.field("code"), args.otp),
          q.gt(q.field("expiresAt"), new Date().toISOString())
        )
      )
      .first();
    
    if (!otpRecord) {
      return false;
    }
    
    // Delete the used OTP
    await ctx.db.delete(otpRecord._id);
    
    return true;
  },
});

export const createUser = mutation({
  args: { 
    email: v.string(),
    name: v.string(),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (existingUser) {
      return existingUser._id;
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      emailVerificationTime: Date.now(), // Mark as verified since we're using simple auth
    });
    
    return userId;
  },
});

export const updateUser = mutation({
  args: { 
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(user._id, { name: args.name });
  },
});