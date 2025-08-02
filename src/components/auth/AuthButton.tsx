import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { AuthCard } from "./AuthCard";

export function AuthButton() {
  const { isAuthenticated, user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300 hidden sm:inline">
          {user.email}
        </span>
        <Button
          variant="outline"
          onClick={signOut}
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogTitle className="text-xl font-bold text-white">
          Sign In to IPL Auction
        </DialogTitle>
        <DialogDescription className="text-gray-300">
          Enter your email to join the auction platform
        </DialogDescription>
        <AuthCard onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}