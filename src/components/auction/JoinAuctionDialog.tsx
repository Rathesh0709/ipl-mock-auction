import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";

export function JoinAuctionDialog() {
  const { user } = useAuth();
  const joinAuction = useMutation(api.auctions.joinAuction);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [joinCode, setJoinCode] = useState("");
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      toast.error("Please sign in to join an auction");
      return;
    }

    if (!joinCode.trim()) {
      toast.error("Please enter the join code");
      return;
    }

    if (!teamName.trim()) {
      toast.error("Please enter your team name");
      return;
    }

    setIsLoading(true);
    try {
      await joinAuction({
        joinCode: joinCode.trim().toUpperCase(),
        teamName: teamName.trim(),
        userEmail: user.email,
      });
      
      toast.success("Successfully joined the auction!");
      setIsOpen(false);
      // Reset form
      setJoinCode("");
      setTeamName("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to join auction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
          <Users className="w-4 h-4 mr-2" />
          Join Auction
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Join Auction
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter the auction code and your team name to join
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="joinCode" className="text-gray-200">
              Auction Code
            </Label>
            <Input
              id="joinCode"
              type="text"
              placeholder="Enter auction code"
              value={joinCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinCode(e.target.value.toUpperCase())}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 uppercase"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamName" className="text-gray-200">
              Team Name
            </Label>
            <Input
              id="teamName"
              type="text"
              placeholder="Enter your team name"
              value={teamName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join Auction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}