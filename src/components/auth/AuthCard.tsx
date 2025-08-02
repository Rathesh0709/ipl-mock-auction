import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function AuthCard() {
const { isLoading, isAuthenticated, user, signIn } = useAuth();
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [code, setCode] = useState("");
const [step, setStep] = useState<"email" | "code">("email");
const [isSubmitting, setIsSubmitting] = useState(false);
const [isVerifying, setIsVerifying] = useState(false);

const storeOtp = useMutation(api.auth.storeOtp);
const sendOtpEmail = useAction(api.auth.sendOtpEmail);
const verifyOtp = useMutation(api.auth.verifyOtp);
const createOrUpdateUser = useMutation(api.auth.createOrUpdateUser);

// Redirect to dashboard if already authenticated
useEffect(() => {
if (isAuthenticated && user) {
console.log(`[DEBUG] User is authenticated, redirecting to dashboard`);
navigate("/dashboard");
}
}, [isAuthenticated, user, navigate]);

const handleEmailSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!email) return;
setIsSubmitting(true);
try {
console.log(`[DEBUG] Starting email submission for: ${email}`);

// Generate a 6-digit code
const code = Math.floor(100000 + Math.random() * 900000).toString();
console.log(`[DEBUG] Generated code: ${code}`);

// Store OTP in database
await storeOtp({ email, code });
console.log(`[DEBUG] OTP stored in database`);

// Send email via server-side action
console.log(`[DEBUG] Calling server-side email action`);
await sendOtpEmail({ email, code });
console.log(`[DEBUG] Email sent successfully`);

setStep("code");
toast.success("Verification code sent to your email");
} catch (error) {
console.error(`[DEBUG] Error in handleEmailSubmit:`, error);
console.error(`[DEBUG] Error message:`, error instanceof Error ? error.message : String(error));
toast.error(`Failed to send verification code: ${error instanceof Error ? error.message : String(error)}`);
} finally {
setIsSubmitting(false);
}
};

const handleCodeSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!code) return;
setIsVerifying(true);
try {
console.log(`[DEBUG] Verifying code: ${code} for email: ${email}`);
// Call the verifyOtp mutation with the current email and code
const isValid = await verifyOtp({ email, code });
console.log(`[DEBUG] Verification result: ${isValid}`);
if (isValid) {
toast.success("Successfully signed in!");
// Create or update user in the database
await createOrUpdateUser({ email });
// Sign in the user using our custom auth system
await signIn(email);
console.log(`[DEBUG] User created/updated and signed in, redirecting to dashboard`);
navigate("/dashboard");
} else {
toast.error("Invalid verification code");
}
} catch (error) {
console.error(`[DEBUG] Verification error:`, error);
toast.error("Invalid verification code");
} finally {
setIsVerifying(false);
}
};

const handleBack = () => {
setStep("email");
setCode("");
};

if (isLoading) {
return (
<Card className="w-full max-w-md mx-auto">
<CardContent className="flex items-center justify-center py-8">
<Loader2 className="h-8 w-8 animate-spin" />
</CardContent>
</Card>
);
}

if (isAuthenticated) {
return (
<Card className="w-full max-w-md mx-auto">
<CardContent className="flex items-center justify-center py-8">
<div className="text-center">
<h3 className="text-lg font-semibold">You're signed in!</h3>
<p className="text-muted-foreground">Redirecting to dashboard...</p>
</div>
</CardContent>
</Card>
);
}

return (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
>
<Card className="w-full max-w-md mx-auto">
<CardHeader className="text-center">
<CardTitle className="text-2xl font-bold">Welcome</CardTitle>
<CardDescription>
{step === "email"
? "Enter your email to get started"
: "Enter the verification code sent to your email"}
</CardDescription>
</CardHeader>
<CardContent>
{step === "email" ? (
<form onSubmit={handleEmailSubmit} className="space-y-4">
<div className="space-y-2">
<Label htmlFor="email">Email</Label>
<div className="relative">
<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
<Input
id="email"
type="email"
placeholder="Enter your email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="pl-10"
required
disabled={isSubmitting}
/>
</div>
</div>
<Button type="submit" className="w-full" disabled={isSubmitting}>
{isSubmitting ? (
<>
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
Sending...
</>
) : (
"Continue"
)}
</Button>
</form>
) : (
<form onSubmit={handleCodeSubmit} className="space-y-4">
<div className="space-y-2">
<Label htmlFor="code">Verification Code</Label>
<Input
id="code"
type="text"
placeholder="Enter 6-digit code"
value={code}
onChange={(e) => setCode(e.target.value)}
maxLength={6}
required
disabled={isVerifying}
/>
</div>
<div className="space-y-2">
<Button type="submit" className="w-full" disabled={isVerifying}>
{isVerifying ? (
<>
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
Verifying...
</>
) : (
"Sign In"
)}
</Button>
<Button
type="button"
variant="outline"
className="w-full"
onClick={handleBack}
disabled={isVerifying}
>
Back
</Button>
</div>
</form>
)}
</CardContent>
</Card>
</motion.div>
);
}