import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Edit, Users, Wallet } from "lucide-react";

interface MyTeamDashboardProps {
  team: Doc<"teams">;
  onEditName: () => void;
}

export function MyTeamDashboard({ team, onEditName }: MyTeamDashboardProps) {
  const teamPlayers = useQuery(api.ai.getTeamPlayers, {
    auctionId: team.auctionId,
    teamId: team._id,
  });
  const spentAmount = Math.round((100 - team.remainingPurse) * 100) / 100; // Assuming initial purse was 100
  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate text-white">{team.name}</CardTitle>
              <CardDescription className="text-gray-300">Your Team</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onEditName} className="flex-shrink-0 text-gray-300 hover:text-white">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">Players</span>
            </div>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">{team.playersCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Wallet className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">Remaining</span>
            </div>
            <Badge variant="outline" className="flex-shrink-0 bg-green-500/20 text-green-300 border-green-500/30">₹{Math.round(team.remainingPurse * 100) / 100}cr</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Wallet className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">Spent</span>
            </div>
            <Badge variant="destructive" className="flex-shrink-0 bg-red-500/20 text-red-300 border-red-500/30">₹{Math.round(spentAmount * 100) / 100}cr</Badge>
          </div>
        </CardContent>
      </Card>
      {teamPlayers && teamPlayers.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Squad</CardTitle>
            <CardDescription className="text-gray-300">
              {teamPlayers.length} player{teamPlayers.length !== 1 ? "s" : ""} bought
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Player</TableHead>
                    <TableHead className="w-32 text-gray-300">Role</TableHead>
                    <TableHead className="text-right w-20 text-gray-300">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamPlayers.map((player) => (
                    <TableRow key={player._id} className="border-gray-700">
                      <TableCell>
                        <div className="min-w-0">
                          <div className="font-medium truncate text-white">{player.playerName}</div>
                          <div className="text-sm text-gray-400 truncate">
                            {player.country}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-32">
                        <Badge variant="outline" className="truncate max-w-full">
                          {player.specialism || "All-rounder"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium w-20">
                        ₹{Math.round(player.soldPrice * 100) / 100}cr
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
             {(!teamPlayers || teamPlayers.length === 0) && (
         <Card className="bg-gray-800 border-gray-700">
           <CardContent className="text-center py-8">
             <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
             <p className="text-gray-300">No players bought yet</p>
           </CardContent>
         </Card>
       )}
    </div>
  );
}