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
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Clock, Users } from "lucide-react";

interface UpcomingPlayersProps {
  auctionId: Id<"auctions">;
  currentPlayerIndex: number;
}

export function UpcomingPlayers({ auctionId, currentPlayerIndex }: UpcomingPlayersProps) {
  const allPlayers = useQuery(api.ai.getAllAuctionPlayers, { auctionId });
  
  if (!allPlayers) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300">Loading upcoming players...</p>
        </CardContent>
      </Card>
    );
  }

  // Get upcoming players (next 10 players after current)
  const upcomingPlayers = allPlayers
    .filter(player => player.status === "available")
    .slice(0, 10);

  if (upcomingPlayers.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300">No upcoming players</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-white">Upcoming Players</CardTitle>
        <CardDescription className="text-gray-300">
          Next {upcomingPlayers.length} players in the auction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Player</TableHead>
                <TableHead className="w-32 text-gray-300">Role</TableHead>
                <TableHead className="w-24 text-gray-300">Country</TableHead>
                <TableHead className="text-right w-20 text-gray-300">Base Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingPlayers.map((player, index) => (
                <TableRow key={player._id} className="border-gray-700">
                  <TableCell>
                    <div className="min-w-0">
                      <div className="font-medium truncate text-white">
                        {index + 1}. {player.playerName}
                      </div>
                      <div className="text-sm text-gray-400 truncate">
                        Age: {player.age}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-32">
                    <Badge variant="outline" className="truncate max-w-full bg-green-500/20 text-green-300 border-green-500/30">
                      {player.specialism || "All-rounder"}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-24">
                    <Badge variant="outline" className="truncate max-w-full bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {player.country}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium w-20 text-white">
                    ₹{((player.reservePriceRsLakh || 0) / 100).toFixed(2)}cr
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 