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
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface TeamNameDialogProps {
open: boolean;
onOpenChange: (open: boolean) => void;
auctionId: Id<"auctions">;
currentName?: string;
}
export function TeamNameDialog({
open,
onOpenChange,
auctionId,
currentName,
}: TeamNameDialogProps) {
const [teamName, setTeamName] = useState("");
const [isLoading, setIsLoading] = useState(false);
const updateTeamName = useMutation(api.auctions.updateTeamName);
useEffect(() => {
if (currentName) {
setTeamName(currentName);
}
}, [currentName]);
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!teamName.trim()) return;
setIsLoading(true);
try {
await updateTeamName({
auctionId,
teamName: teamName.trim(),
});
toast.success("Team name updated successfully!");
onOpenChange(false);
} catch (error: any) {
toast.error(error.message || "Failed to update team name");
} finally {
setIsLoading(false);
}
};
return (
<Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="sm:max-w-[425px]">
<DialogHeader>
<DialogTitle>Edit Team Name</DialogTitle>
<DialogDescription>
Change your team name for this auction.
</DialogDescription>
</DialogHeader>
<form onSubmit={handleSubmit}>
<div className="grid gap-4 py-4">
<div className="grid gap-2">
<Label htmlFor="teamName">Team Name</Label>
<Input
id="teamName"
value={teamName}
onChange={(e) => setTeamName(e.target.value)}
placeholder="Enter your team name"
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
<Button type="submit" disabled={isLoading || !teamName.trim()}>
{isLoading ? (
<>
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
Updating...
</>
) : (
"Update Name"
)}
</Button>
</DialogFooter>
</form>
</DialogContent>
</Dialog>
);
}