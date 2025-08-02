# Email Service Alternatives for IPL Auction Platform

## Problem
Resend has domain restrictions that prevent sending emails to addresses not associated with your API key. This makes it difficult to test with multiple email addresses.

## Solutions

### 1. **Brevo (Sendinblue)** - Recommended
- **Pros**: Works with any email address, no domain restrictions
- **Cons**: Requires API key setup
- **Setup**: 
  1. Sign up at https://www.brevo.com/
  2. Get your API key from the dashboard
  3. Set environment variable: `BREVO_API_KEY=your_api_key_here`

### 2. **Current Fallback Solution** - For Testing
- **Pros**: Works immediately, no setup required
- **Cons**: Codes are logged to console instead of sent via email
- **How it works**: Verification codes are displayed in the browser console for easy testing

### 3. **Other Alternatives**

#### SendGrid
- Free tier: 100 emails/day
- Setup: Sign up at https://sendgrid.com/
- Environment variable: `SENDGRID_API_KEY`

#### Mailgun
- Free tier: 5,000 emails/month for 3 months
- Setup: Sign up at https://www.mailgun.com/
- Environment variable: `MAILGUN_API_KEY`

#### EmailJS (Client-side)
- Free tier: 200 emails/month
- Setup: Sign up at https://www.emailjs.com/
- Requires client-side implementation

## Current Implementation

The platform now supports:
1. **Brevo** (if `BREVO_API_KEY` is set)
2. **Fallback testing mode** (if no API key is set)

### Testing with Multiple Accounts

1. **Without API Key**: 
   - Enter any email address
   - Check the browser console for the verification code
   - Use the code to complete registration

2. **With Brevo API Key**:
   - Enter any email address
   - Receive actual email with verification code
   - Use the code to complete registration

### Environment Variables

Add to your `.env.local` file:
```bash
# Option 1: Brevo (recommended for production)
BREVO_API_KEY=your_brevo_api_key_here

# Option 2: SendGrid (alternative)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Option 3: Mailgun (alternative)
MAILGUN_API_KEY=your_mailgun_api_key_here
```

## Testing Multiple Users

With the current fallback implementation, you can:
1. Enter any email address (e.g., `user1@test.com`, `user2@test.com`)
2. Check the console for the verification code
3. Complete registration
4. Test auction functionality with multiple users

This allows you to test the auction room with different users without email domain restrictions. 