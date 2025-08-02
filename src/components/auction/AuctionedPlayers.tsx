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
import { Clock, Trophy, X } from "lucide-react";

interface AuctionedPlayersProps {
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
  soldPrice?: number;
  soldToTeam?: string;
}

export function AuctionedPlayers({ auctionId }: AuctionedPlayersProps) {
  const allPlayers = useQuery(api.ai.getAllAuctionPlayers, { auctionId }) || [];

  const soldPlayers = allPlayers.filter((player: Player) => player.status === "sold");
  const unsoldPlayers = allPlayers.filter((player: Player) => player.status === "unsold");

  return (
    <div className="space-y-6">
      {/* Sold Players */}
      <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Trophy className="h-5 w-5" />
            Sold Players ({soldPlayers.length})
          </CardTitle>
          <CardDescription className="text-green-300">
            Players successfully auctioned
          </CardDescription>
        </CardHeader>
        <CardContent>
          {soldPlayers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-green-500/30">
                  <TableHead className="text-green-300">Player</TableHead>
                  <TableHead className="text-green-300">Role</TableHead>
                  <TableHead className="text-green-300">Country</TableHead>
                  <TableHead className="text-green-300">Base Price</TableHead>
                  <TableHead className="text-green-300">Sold Price</TableHead>
                  <TableHead className="text-green-300">Team</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soldPlayers.map((player: Player) => (
                  <TableRow key={player._id} className="border-green-500/20">
                    <TableCell className="font-medium text-green-100">
                      {player.playerName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-800/50 text-green-200">
                        {player.specialism || "All-rounder"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-200">{player.country}</TableCell>
                    <TableCell className="text-green-200">
                      ₹{(player.reservePriceRsLakh / 100).toFixed(2)}cr
                    </TableCell>
                    <TableCell className="font-bold text-green-400">
                      ₹{player.soldPrice?.toFixed(2)}cr
                    </TableCell>
                    <TableCell className="text-green-200">{player.soldToTeam}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-green-300">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No players sold yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unsold Players */}
      <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <X className="h-5 w-5" />
            Unsold Players ({unsoldPlayers.length})
          </CardTitle>
          <CardDescription className="text-red-300">
            Players that went unsold
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unsoldPlayers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-red-500/30">
                  <TableHead className="text-red-300">Player</TableHead>
                  <TableHead className="text-red-300">Role</TableHead>
                  <TableHead className="text-red-300">Country</TableHead>
                  <TableHead className="text-red-300">Base Price</TableHead>
                  <TableHead className="text-red-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unsoldPlayers.map((player: Player) => (
                  <TableRow key={player._id} className="border-red-500/20">
                    <TableCell className="font-medium text-red-100">
                      {player.playerName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-800/50 text-red-200">
                        {player.specialism || "All-rounder"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-red-200">{player.country}</TableCell>
                    <TableCell className="text-red-200">
                      ₹{(player.reservePriceRsLakh / 100).toFixed(2)}cr
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="bg-red-600/50 text-red-200">
                        Unsold
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-red-300">
              <X className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No unsold players</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 