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
}

interface Player {
  _id: Id<"players">;
  playerName: string;
  country: string;
  age: number;
  specialism?: string;
  reservePriceRsLakh: number;
  status: "available" | "sold" | "unsold";
}

export function UpcomingPlayers({ auctionId }: UpcomingPlayersProps) {
  const allPlayers = useQuery(api.ai.getAllAuctionPlayers, { auctionId }) || [];

  const upcomingPlayers = allPlayers
    .filter((player: Player) => player.status === "available")
    .slice(0, 10); // Show next 10 players

  return (
    <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Clock className="h-5 w-5" />
          Upcoming Players ({upcomingPlayers.length})
        </CardTitle>
        <CardDescription className="text-yellow-300">
          Next players in the auction queue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingPlayers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-yellow-500/30">
                <TableHead className="text-yellow-300">Player</TableHead>
                <TableHead className="text-yellow-300">Role</TableHead>
                <TableHead className="text-yellow-300">Country</TableHead>
                <TableHead className="text-yellow-300">Base Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingPlayers.map((player: Player, index: number) => (
                <TableRow key={player._id} className="border-yellow-500/20">
                  <TableCell className="font-medium text-yellow-100">
                    {player.playerName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-yellow-800/50 text-yellow-200">
                      {player.specialism || "All-rounder"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-yellow-200">{player.country}</TableCell>
                  <TableCell className="text-yellow-200">
                    ₹{(player.reservePriceRsLakh / 100).toFixed(2)}cr
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-yellow-300">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming players</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 