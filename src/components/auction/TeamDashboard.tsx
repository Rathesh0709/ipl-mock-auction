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
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Crown, Users, Wallet } from "lucide-react";

interface TeamDashboardProps {
  teams: Doc<"teams">[];
  winnerId?: string;
}

export function TeamDashboard({ teams, winnerId }: TeamDashboardProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {teams.map((team) => {
          const isWinner = winnerId === team._id;
          const spentAmount = Math.round((100 - team.remainingPurse) * 100) / 100; // Assuming initial purse was 100
          return (
            <Card key={team._id} className={`relative bg-gray-800 border-gray-700 ${isWinner ? "ring-2 ring-yellow-500" : ""}`}>
              {isWinner && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-yellow-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Winner
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg truncate text-white">{team.name}</CardTitle>
                <CardDescription className="text-gray-300">Team Overview</CardDescription>
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
          );
        })}
      </div>
      <TeamPlayersTable teams={teams} />
    </div>
  );
}

function TeamPlayersTable({ teams }: { teams: Doc<"teams">[] }) {
  const allTeamPlayers = teams.map((team) => {
    const teamPlayers = useQuery(api.ai.getTeamPlayers, {
      auctionId: team.auctionId,
      teamId: team._id,
    });
    return { team, players: teamPlayers || [] };
  });

  const hasAnyPlayers = allTeamPlayers.some((tp) => tp.players.length > 0);

  if (!hasAnyPlayers) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300">No players have been bought yet</p>
        </CardContent>
      </Card>
    );
  }

     return (
     <Card className="bg-gray-800 border-gray-700">
       <CardHeader>
         <CardTitle className="text-white">All Team Squads</CardTitle>
         <CardDescription className="text-gray-300">Players bought by each team</CardDescription>
       </CardHeader>
       <CardContent>
         <div className="overflow-x-auto">
           <Table>
             <TableHeader>
               <TableRow className="border-gray-700">
                 <TableHead className="w-24 text-gray-300">Team</TableHead>
                 <TableHead className="text-gray-300">Player</TableHead>
                 <TableHead className="w-32 text-gray-300">Role</TableHead>
                 <TableHead className="text-right w-20 text-gray-300">Price</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {allTeamPlayers.map(({ team, players }) =>
                 players.map((player) => (
                   <TableRow key={`${team._id}-${player._id}`} className="border-gray-700">
                     <TableCell className="w-24">
                       <Badge variant="outline" className="truncate max-w-full bg-blue-500/20 text-blue-300 border-blue-500/30">
                         {team.name}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <div className="min-w-0">
                         <div className="font-medium truncate text-white">{player.playerName}</div>
                         <div className="text-sm text-gray-400 truncate">
                           {player.country}
                         </div>
                       </div>
                     </TableCell>
                     <TableCell className="w-32">
                       <Badge variant="secondary" className="truncate max-w-full bg-green-500/20 text-green-300">
                         {player.specialism || "All-rounder"}
                       </Badge>
                     </TableCell>
                     <TableCell className="text-right font-medium w-20 text-white">
                       ₹{Math.round(player.soldPrice * 100) / 100}cr
                     </TableCell>
                   </TableRow>
                 ))
               )}
             </TableBody>
           </Table>
         </div>
       </CardContent>
     </Card>
   );
}