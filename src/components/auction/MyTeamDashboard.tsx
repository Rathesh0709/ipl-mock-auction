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
import { Trophy, Users, Wallet } from "lucide-react";

interface MyTeamDashboardProps {
  auctionId: Doc<"auctions">["_id"];
  userEmail: string;
}

interface TeamPlayer {
  _id: string;
  playerName: string;
  country: string;
  specialism?: string;
  basePrice: number;
  soldPrice: number;
}

export function MyTeamDashboard({ auctionId, userEmail }: MyTeamDashboardProps) {
  const userTeam = useQuery(api.auctions.getUserTeam, {
    auctionId,
    userEmail,
  });

  const teamPlayers = useQuery(
    api.ai.getTeamPlayers, 
    userTeam?._id ? {
      auctionId,
      teamId: userTeam._id,
    } : "skip"
  ) || [];

  if (!userTeam) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700">
        <CardContent className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300">You haven't joined this auction yet</p>
        </CardContent>
      </Card>
    );
  }

  const totalSpent = teamPlayers.reduce((sum: number, player: TeamPlayer) => sum + (player.soldPrice || 0), 0);
  const remainingPurse = Math.round((userTeam.remainingPurse - totalSpent) * 100) / 100;

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Trophy className="h-5 w-5" />
            {userTeam.name}
          </CardTitle>
          <CardDescription className="text-blue-300">
            Your team details and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-800/20 rounded-lg border border-blue-500/30">
              <Wallet className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-blue-300">Remaining Purse</p>
                <p className="text-xl font-bold text-blue-100">
                  ₹{remainingPurse.toFixed(2)}cr
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-800/20 rounded-lg border border-green-500/30">
              <Users className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-green-300">Players Bought</p>
                <p className="text-xl font-bold text-green-100">
                  {teamPlayers.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-800/20 rounded-lg border border-purple-500/30">
              <Trophy className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Total Spent</p>
                <p className="text-xl font-bold text-purple-100">
                  ₹{totalSpent.toFixed(2)}cr
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Players */}
      <Card className="bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Your Players</CardTitle>
          <CardDescription className="text-gray-300">
            Players you've successfully bid for
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamPlayers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Player</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Country</TableHead>
                  <TableHead className="text-gray-300">Base Price</TableHead>
                  <TableHead className="text-gray-300">Bought For</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamPlayers.map((player: TeamPlayer) => (
                  <TableRow key={player._id} className="border-gray-700">
                    <TableCell className="font-medium text-white">
                      {player.playerName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-800/50 text-blue-200">
                        {player.specialism || "All-rounder"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-200">{player.country}</TableCell>
                    <TableCell className="text-gray-200">
                      ₹{(player.basePrice / 100).toFixed(2)}cr
                    </TableCell>
                    <TableCell className="font-bold text-green-400">
                      ₹{player.soldPrice.toFixed(2)}cr
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-300">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No players bought yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}