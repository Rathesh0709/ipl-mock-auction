import { Email } from "@convex-dev/auth/providers/Email";

export const emailOtp = Email({
  id: "email-otp",
  apiKey: process.env.BREVO_API_KEY,
  maxAge: 60 * 10, // 10 minutes
  sendVerificationRequest: async ({ identifier, url, expires, provider, token, theme, request }) => {
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`[DEBUG] Generated 6-digit code: ${code} for ${identifier}`);
    console.log(`[DEBUG] BREVO_API_KEY exists: ${!!process.env.BREVO_API_KEY}`);
    console.log(`[DEBUG] BREVO_API_KEY length: ${process.env.BREVO_API_KEY?.length || 0}`);
    
    try {
      console.log(`[DEBUG] Attempting to send email to: ${identifier}`);
      
      // Try Brevo first, then fallback for testing
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
                email: identifier,
                name: identifier.split("@")[0]
              }
            ],
            subject: "Your IPL Auction Verification Code",
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">IPL Auction Platform</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #2563eb; font-size: 48px; text-align: center; letter-spacing: 8px; margin: 20px 0;">${code}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
              </div>
            `,
          }),
        });
        
        console.log(`[DEBUG] Response status: ${response.status}`);
        console.log(`[DEBUG] Response status text: ${response.statusText}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[DEBUG] Response error body: ${errorText}`);
          throw new Error(`Failed to send email: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log(`[DEBUG] Response data:`, responseData);
        console.log(`[DEBUG] Email sent successfully to ${identifier}`);
      } else {
        // Fallback for testing
        console.log(`[DEBUG] Using fallback email service for testing`);
        console.log(`[DEBUG] ==========================================`);
        console.log(`[DEBUG] VERIFICATION CODE FOR TESTING:`);
        console.log(`[DEBUG] Email: ${identifier}`);
        console.log(`[DEBUG] Code: ${code}`);
        console.log(`[DEBUG] ==========================================`);
        console.log(`[DEBUG] Please check the console above for the verification code`);
        console.log(`[DEBUG] This allows testing with any email address without domain restrictions`);
      }
    } catch (error) {
      console.error(`[DEBUG] Failed to send email:`, error);
      console.error(`[DEBUG] Error message:`, error instanceof Error ? error.message : String(error));
      console.error(`[DEBUG] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
      
      // If Brevo fails, use fallback
      if (process.env.BREVO_API_KEY) {
        console.log(`[DEBUG] Brevo failed, using fallback for testing`);
        console.log(`[DEBUG] ==========================================`);
        console.log(`[DEBUG] VERIFICATION CODE FOR TESTING:`);
        console.log(`[DEBUG] Email: ${identifier}`);
        console.log(`[DEBUG] Code: ${code}`);
        console.log(`[DEBUG] ==========================================`);
      }
      
      throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});