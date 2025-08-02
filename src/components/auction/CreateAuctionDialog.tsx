import { Button } from "@/components/ui/button";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface CreateAuctionDialogProps {
open: boolean;
onOpenChange: (open: boolean) => void;
}

export function CreateAuctionDialog({
open,
onOpenChange,
}: CreateAuctionDialogProps) {
const { user } = useAuth();
const [name, setName] = useState("");
const [maxTeams, setMaxTeams] = useState(8);
const [maxPlayersPerTeam, setMaxPlayersPerTeam] = useState(25);
const [minPlayersPerTeam, setMinPlayersPerTeam] = useState(15);
const [teamPurse, setTeamPurse] = useState(100);
const [isLoading, setIsLoading] = useState(false);
const createAuction = useMutation(api.auctions.createAuction);
const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!name.trim() || !user?.email) return;
setIsLoading(true);
try {
const result = await createAuction({
name: name.trim(),
maxTeams,
maxPlayersPerTeam,
minPlayersPerTeam,
teamPurse,
userEmail: user.email, // Pass the user email
});
toast.success("Auction created successfully!");
onOpenChange(false);
navigate("/dashboard"); // Redirect to dashboard instead of auction room
// Reset form
setName("");
setMaxTeams(8);
setMaxPlayersPerTeam(25);
setMinPlayersPerTeam(15);
setTeamPurse(100);
} catch (error: any) {
toast.error(error.message || "Failed to create auction");
} finally {
setIsLoading(false);
}
};
return (
<Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="sm:max-w-[425px]">
<DialogHeader>
<DialogTitle>Create New Auction</DialogTitle>
<DialogDescription>
Set up your IPL-style player auction with custom rules.
</DialogDescription>
</DialogHeader>
<form onSubmit={handleSubmit}>
<div className="grid gap-4 py-4">
<div className="grid gap-2">
<Label htmlFor="name">Auction Name</Label>
<Input
id="name"
value={name}
onChange={(e) => setName(e.target.value)}
placeholder="e.g., IPL 2024 Mega Auction"
required
disabled={isLoading}
/>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="grid gap-2">
<Label htmlFor="maxTeams">Max Teams</Label>
<Input
id="maxTeams"
type="number"
min="2"
max="16"
value={maxTeams}
onChange={(e) => setMaxTeams(parseInt(e.target.value))}
disabled={isLoading}
/>
</div>
<div className="grid gap-2">
<Label htmlFor="teamPurse">Team Purse (₹Cr)</Label>
<Input
id="teamPurse"
type="number"
min="50"
max="200"
value={teamPurse}
onChange={(e) => setTeamPurse(parseInt(e.target.value))}
disabled={isLoading}
/>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="grid gap-2">
<Label htmlFor="minPlayers">Min Players</Label>
<Input
id="minPlayers"
type="number"
min="11"
max="25"
value={minPlayersPerTeam}
onChange={(e) => setMinPlayersPerTeam(parseInt(e.target.value))}
disabled={isLoading}
/>
</div>
<div className="grid gap-2">
<Label htmlFor="maxPlayers">Max Players</Label>
<Input
id="maxPlayers"
type="number"
min="15"
max="30"
value={maxPlayersPerTeam}
onChange={(e) => setMaxPlayersPerTeam(parseInt(e.target.value))}
disabled={isLoading}
/>
</div>
</div>
</div>
<DialogFooter>
<Button
type="button"
variant="outline"
onClick={() => onOpenChange(false)}
disabled={isLoading}
>
Cancel
</Button>
<Button type="submit" disabled={isLoading || !name.trim()}>
{isLoading ? (
<>
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
Creating...
</>
) : (
"Create Auction"
)}
</Button>
</DialogFooter>
</form>
</DialogContent>
</Dialog>
);
}