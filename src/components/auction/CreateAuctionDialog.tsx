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
import { Plus } from "lucide-react";

export function CreateAuctionDialog() {
  const { user } = useAuth();
  const createAuction = useMutation(api.auctions.createAuction);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [maxTeams, setMaxTeams] = useState(10);
  const [teamPurse, setTeamPurse] = useState(100);
  const [minPlayersPerTeam, setMinPlayersPerTeam] = useState(18);
  const [maxPlayersPerTeam, setMaxPlayersPerTeam] = useState(25);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      toast.error("Please sign in to create an auction");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter an auction name");
      return;
    }

    setIsLoading(true);
    try {
      await createAuction({
        name: name.trim(),
        maxTeams,
        teamPurse,
        minPlayersPerTeam,
        maxPlayersPerTeam,
        userEmail: user.email,
      });
      
      toast.success("Auction created successfully!");
      setIsOpen(false);
      // Reset form
      setName("");
      setMaxTeams(10);
      setTeamPurse(100);
      setMinPlayersPerTeam(18);
      setMaxPlayersPerTeam(25);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create auction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Auction
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Create New Auction
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Set up a new IPL auction with custom parameters
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-200">
              Auction Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter auction name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTeams" className="text-gray-200">
              Maximum Teams
            </Label>
            <Input
              id="maxTeams"
              type="number"
              min="2"
              max="20"
              value={maxTeams}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxTeams(parseInt(e.target.value))}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamPurse" className="text-gray-200">
              Team Purse (₹ Crores)
            </Label>
            <Input
              id="teamPurse"
              type="number"
              min="50"
              max="200"
              value={teamPurse}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamPurse(parseInt(e.target.value))}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minPlayers" className="text-gray-200">
              Minimum Players per Team
            </Label>
            <Input
              id="minPlayers"
              type="number"
              min="15"
              max="25"
              value={minPlayersPerTeam}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPlayersPerTeam(parseInt(e.target.value))}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPlayers" className="text-gray-200">
              Maximum Players per Team
            </Label>
            <Input
              id="maxPlayers"
              type="number"
              min="20"
              max="30"
              value={maxPlayersPerTeam}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPlayersPerTeam(parseInt(e.target.value))}
              className="bg-gray-800 border-gray-600 text-white"
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Auction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}