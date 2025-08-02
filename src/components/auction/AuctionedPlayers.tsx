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
import { CheckCircle, XCircle, Users } from "lucide-react";

interface AuctionedPlayersProps {
  auctionId: Id<"auctions">;
}

export function AuctionedPlayers({ auctionId }: AuctionedPlayersProps) {
  const allPlayers = useQuery(api.ai.getAllAuctionPlayers, { auctionId });
  
  if (!allPlayers) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300">Loading auctioned players...</p>
        </CardContent>
      </Card>
    );
  }

  // Get sold and unsold players
  const soldPlayers = allPlayers.filter(player => player.status === "sold");
  const unsoldPlayers = allPlayers.filter(player => player.status === "unsold");
  const auctionedPlayers = [...soldPlayers, ...unsoldPlayers];

  if (auctionedPlayers.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300">No players have been auctioned yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-white">Auctioned Players</CardTitle>
        <CardDescription className="text-gray-300">
          {soldPlayers.length} sold, {unsoldPlayers.length} unsold
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
                <TableHead className="text-right w-20 text-gray-300">Sold Price</TableHead>
                <TableHead className="w-32 text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctionedPlayers.map((player) => {
                const isSold = player.status === "sold";
                return (
                  <TableRow key={player._id} className="border-gray-700">
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-medium truncate text-white">
                          {player.playerName}
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
                                                    <TableCell className="text-right font-medium w-20">
                                  {isSold ? (
                                    <span className="text-green-400">
                                      ₹{(player.soldPrice || 0).toFixed(2)}cr
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </TableCell>
                    <TableCell className="w-32">
                      {isSold ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            {player.soldToTeam || "Unknown"}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                            Unsold
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 