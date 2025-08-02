import { Badge } from "@/components/ui/badge";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Crown, Users, Wallet } from "lucide-react";
interface TeamCardProps {
team: Doc<"teams">;
isWinner?: boolean;
}
export function TeamCard({ team, isWinner }: TeamCardProps) {
const spentAmount = Math.round((100 - team.remainingPurse) * 100) / 100; // Assuming initial purse was 100
return (
<Card className={`relative ${isWinner ? "ring-2 ring-yellow-500" : ""}`}>
{isWinner && (
<div className="absolute -top-2 -right-2">
<Badge className="bg-yellow-500 text-white">
<Crown className="w-3 h-3 mr-1" />
Winner
</Badge>
</div>
)}
<CardHeader className="pb-3">
<CardTitle className="text-lg">{team.name}</CardTitle>
<CardDescription>Team Overview</CardDescription>
</CardHeader>
<CardContent className="space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<Users className="w-4 h-4 text-muted-foreground" />
<span className="text-sm">Players</span>
</div>
<Badge variant="secondary">{team.playersCount}</Badge>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<Wallet className="w-4 h-4 text-muted-foreground" />
<span className="text-sm">Remaining</span>
</div>
<Badge variant="outline">₹{Math.round(team.remainingPurse * 100) / 100}cr</Badge>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<Wallet className="w-4 h-4 text-muted-foreground" />
<span className="text-sm">Spent</span>
</div>
<Badge variant="destructive">₹{Math.round(spentAmount * 100) / 100}cr</Badge>
</div>
</CardContent>
</Card>
);
}