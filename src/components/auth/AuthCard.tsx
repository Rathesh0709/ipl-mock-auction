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
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Shield, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router";

interface AuthCardProps {
  onSuccess?: () => void;
}

export function AuthCard({ onSuccess }: AuthCardProps) {
  const { signIn } = useAuth();
  const sendOtp = useMutation(api.users.sendOtp);
  const sendEmailOtp = useAction(api.users.sendEmailOtp);
  const verifyOtp = useMutation(api.users.verifyOtp);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      // First, generate and store OTP
      const result = await sendOtp({ email: email.trim() });
      
      if (result.success) {
        // Send email using action with the generated OTP
        const emailResult = await sendEmailOtp({ 
          email: email.trim(), 
          otp: result.otp 
        });
        
        if (emailResult.success) {
          setOtpSent(true);
          toast.success("📧 Check your email for the verification code!");
        } else {
          toast.error(emailResult.message);
        }
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await verifyOtp({ 
        email: email.trim(), 
        otp: otp.trim() 
      });
      
      if (isValid) {
        await signIn(email.trim());
        toast.success("Successfully signed in!");
        // Redirect to dashboard immediately after successful login
        navigate("/dashboard");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setOtpSent(false);
    setOtp("");
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5" />
          {otpSent ? "Verify OTP" : "Sign In"}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {otpSent 
            ? "Enter the 6-digit code sent to your email"
            : "Enter your email to receive a verification code"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-200">
                Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                maxLength={6}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToEmail}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}