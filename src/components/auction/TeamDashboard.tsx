import { Badge } from "@/components/ui/badge";
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
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Trophy, Users, Wallet } from "lucide-react";

interface TeamDashboardProps {
  auctionId: Doc<"auctions">["_id"];
}

interface Team {
  _id: Id<"teams">;
  name: string;
  remainingPurse: number;
  playersCount: number;
}

interface TeamPlayer {
  _id: string;
  playerName: string;
  country: string;
  specialism?: string;
  basePrice: number;
  soldPrice: number;
}

export function TeamDashboard({ auctionId }: TeamDashboardProps) {
  const teams = useQuery(api.auctions.getAuctionTeams, { auctionId }) || [];

  return (
    <div className="space-y-6">
      {/* Teams Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team: Team) => (
          <TeamCard key={team._id} team={team} auctionId={auctionId} />
        ))}
      </div>

      {/* All Teams Table */}
      <Card className="bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5" />
            All Teams
          </CardTitle>
          <CardDescription className="text-gray-300">
            Complete overview of all teams in the auction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Team</TableHead>
                <TableHead className="text-gray-300">Players</TableHead>
                <TableHead className="text-gray-300">Remaining Purse</TableHead>
                <TableHead className="text-gray-300">Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team: Team) => {
                const spentAmount = Math.round((100 - team.remainingPurse) * 100) / 100;
                return (
                  <TableRow key={team._id} className="border-gray-700">
                    <TableCell className="font-medium text-white">
                      {team.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-800/50 text-blue-200">
                        {team.playersCount} players
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-400 font-medium">
                      ₹{team.remainingPurse.toFixed(2)}cr
                    </TableCell>
                    <TableCell className="text-red-400 font-medium">
                      ₹{spentAmount.toFixed(2)}cr
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

interface TeamCardProps {
  team: Team;
  auctionId: Doc<"auctions">["_id"];
}

function TeamCard({ team, auctionId }: TeamCardProps) {
  const teamPlayers = useQuery(api.ai.getTeamPlayers, {
    auctionId,
    teamId: team._id,
  }) || [];

  const totalSpent = teamPlayers.reduce((sum: number, player: TeamPlayer) => sum + (player.soldPrice || 0), 0);

  return (
    <Card className="bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader>
        <CardTitle className="text-white truncate">{team.name}</CardTitle>
        <CardDescription className="text-gray-300">Team Overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Players</p>
              <p className="text-sm font-medium text-white">{team.playersCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-green-400" />
            <div>
              <p className="text-xs text-gray-400">Remaining</p>
              <p className="text-sm font-medium text-green-400">
                ₹{team.remainingPurse.toFixed(2)}cr
              </p>
            </div>
          </div>
        </div>
        
        {teamPlayers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Recent Players</p>
            <div className="space-y-1">
              {teamPlayers.slice(0, 3).map((player: TeamPlayer) => (
                <div key={player._id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 truncate">{player.playerName}</span>
                  <span className="text-green-400 font-medium">
                    ₹{player.soldPrice.toFixed(2)}cr
                  </span>
                </div>
              ))}
              {teamPlayers.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{teamPlayers.length - 3} more players
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}