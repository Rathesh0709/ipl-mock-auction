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

interface JoinWithCodeDialogProps {
open: boolean;
onOpenChange: (open: boolean) => void;
}

export function JoinWithCodeDialog({
open,
onOpenChange,
}: JoinWithCodeDialogProps) {
const { user } = useAuth();
const [joinCode, setJoinCode] = useState("");
const [teamName, setTeamName] = useState("");
const [isLoading, setIsLoading] = useState(false);
const joinAuction = useMutation(api.auctions.joinAuction);
const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!joinCode.trim() || !teamName.trim() || !user?.email) return;
setIsLoading(true);
try {
const result = await joinAuction({
joinCode: joinCode.trim(),
teamName: teamName.trim(),
userEmail: user.email, // Pass the user email
});
toast.success("Successfully joined the auction!");
onOpenChange(false);
navigate("/dashboard"); // Redirect to dashboard instead of auction room
// Reset form
setJoinCode("");
setTeamName("");
} catch (error: any) {
toast.error(error.message || "Failed to join auction");
} finally {
setIsLoading(false);
}
};
return (
<Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="sm:max-w-[425px]">
<DialogHeader>
<DialogTitle>Join with Code</DialogTitle>
<DialogDescription>
Enter the auction code and your team name to join an existing auction.
</DialogDescription>
</DialogHeader>
<form onSubmit={handleSubmit}>
<div className="grid gap-4 py-4">
<div className="grid gap-2">
<Label htmlFor="joinCode">Auction Code</Label>
<Input
id="joinCode"
value={joinCode}
onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
placeholder="Enter 6-digit code"
maxLength={6}
required
disabled={isLoading}
/>
</div>
<div className="grid gap-2">
<Label htmlFor="teamName">Team Name</Label>
<Input
id="teamName"
value={teamName}
onChange={(e) => setTeamName(e.target.value)}
placeholder="e.g., Chennai Super Kings"
required
disabled={isLoading}
/>
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
<Button
type="submit"
disabled={isLoading || !joinCode.trim() || !teamName.trim()}
>
{isLoading ? (
<>
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
Joining...
</>
) : (
"Join Auction"
)}
</Button>
</DialogFooter>
</form>
</DialogContent>
</Dialog>
);
}