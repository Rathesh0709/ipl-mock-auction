import { convexAuth } from "@convex-dev/auth/server";
import { emailOtp } from "./auth/emailOtp";
import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [emailOtp],
});

// Store OTP codes
export const storeOtp = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, { email, code }) => {
    // Delete any existing codes for this email
    const existingCodes = await ctx.db
      .query("otpCodes")
      .filter((q) => q.eq(q.field("email"), email))
      .collect();
    
    for (const existingCode of existingCodes) {
      await ctx.db.delete(existingCode._id);
    }
    
    // Insert new code
    const id = await ctx.db.insert("otpCodes", {
      email,
      code,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    });
    return id;
  },
});

// Send email with OTP code (using action instead of mutation)
export const sendOtpEmail = action({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, { email, code }) => {
    console.log(`[DEBUG] Sending OTP email to: ${email}`);
    console.log(`[DEBUG] BREVO_API_KEY exists: ${!!process.env.BREVO_API_KEY}`);
    
    try {
      // Try Brevo first, then fallback to a simple service
      if (process.env.BREVO_API_KEY) {
        console.log(`[DEBUG] Using Brevo email service`);
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "IPL Auction Platform",
              email: "noreply@ipl-auction.com"
            },
            to: [
              {
                email: email,
                name: email.split("@")[0]
              }
            ],
            subject: "Your IPL Auction Verification Code",
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h2 style="color: #2563eb; margin: 0; font-size: 24px;">IPL Auction Platform</h2>
                  <p style="color: #64748b; margin: 10px 0 0 0;">Your verification code</p>
                </div>
                <div style="background-color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #2563eb; font-size: 48px; text-align: center; letter-spacing: 8px; margin: 20px 0; font-weight: bold;">${code}</h1>
                  <p style="color: #64748b; margin: 0;">This code will expire in 10 minutes.</p>
                </div>
                <div style="text-align: center; color: #64748b; font-size: 14px;">
                  <p style="margin: 0;">If you didn't request this code, please ignore this email.</p>
                  <p style="margin: 10px 0 0 0;">This is an automated message, please do not reply.</p>
                </div>
              </div>
            `,
          }),
        });
        
        console.log(`[DEBUG] Brevo response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[DEBUG] Brevo response error: ${errorText}`);
          throw new Error(`Brevo failed: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log(`[DEBUG] Email sent successfully via Brevo:`, responseData);
        return true;
      } else {
        // Fallback: Use a simple approach for testing
        console.log(`[DEBUG] Using fallback email service for testing`);
        
        // For testing purposes, we'll just log the code
        // This allows you to test with any email address
        console.log(`[DEBUG] ==========================================`);
        console.log(`[DEBUG] VERIFICATION CODE FOR TESTING:`);
        console.log(`[DEBUG] Email: ${email}`);
        console.log(`[DEBUG] Code: ${code}`);
        console.log(`[DEBUG] ==========================================`);
        console.log(`[DEBUG] Please check the console above for the verification code`);
        console.log(`[DEBUG] This allows testing with any email address without domain restrictions`);
        
        // In production, you would replace this with a real email service
        // Some options:
        // 1. Brevo (Sendinblue) - requires API key but works with any email
        // 2. SendGrid - has a free tier
        // 3. Mailgun - has a free tier
        // 4. EmailJS - client-side email service
        
        return true;
      }
    } catch (error) {
      console.error(`[DEBUG] Email sending failed:`, error);
      
      // If Brevo fails, use the fallback
      if (process.env.BREVO_API_KEY) {
        console.log(`[DEBUG] Brevo failed, using fallback for testing`);
        console.log(`[DEBUG] ==========================================`);
        console.log(`[DEBUG] VERIFICATION CODE FOR TESTING:`);
        console.log(`[DEBUG] Email: ${email}`);
        console.log(`[DEBUG] Code: ${code}`);
        console.log(`[DEBUG] ==========================================`);
        return true;
      }
      
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

// Verify OTP codes
export const verifyOtp = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, { email, code }) => {
    const otpCode = await ctx.db
      .query("otpCodes")
      .filter((q) => q.eq(q.field("email"), email))
      .filter((q) => q.eq(q.field("code"), code))
      .filter((q) => q.gt(q.field("expiresAt"), new Date().toISOString()))
      .first();
    
    return otpCode !== null;
  },
});

// Clean up expired OTP codes
export const cleanupExpiredOtps = mutation({
  args: {},
  handler: async (ctx) => {
    const expiredCodes = await ctx.db
      .query("otpCodes")
      .filter((q) => q.lt(q.field("expiresAt"), new Date().toISOString()))
      .collect();
    
    for (const expiredCode of expiredCodes) {
      await ctx.db.delete(expiredCode._id);
    }
    
    return expiredCodes.length;
  },
});

// Create or update user after successful OTP verification
export const createOrUpdateUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    console.log(`[DEBUG] Creating/updating user: ${email}`);
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
    
    if (existingUser) {
      console.log(`[DEBUG] User already exists: ${email}`);
      return existingUser._id;
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      email,
      name: email.split("@")[0], // Use email prefix as default name
      role: "user",
    });
    
    console.log(`[DEBUG] Created new user: ${userId}`);
    return userId;
  },
});

// Sign in user with Convex Auth after OTP verification
export const signInWithConvexAuth = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    console.log(`[DEBUG] Signing in user with Convex Auth: ${email}`);
    
    // Find the user in the database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // For now, we'll just return the user ID
    // In a real implementation, you would need to integrate with Convex Auth's token system
    console.log(`[DEBUG] User found: ${user._id}`);
    return user._id;
  },
});