import { MyTeamDashboard } from "@/components/auction/MyTeamDashboard";
import { TeamDashboard } from "@/components/auction/TeamDashboard";
import { TeamNameDialog } from "@/components/auction/TeamNameDialog";
import { UpcomingPlayers } from "@/components/auction/UpcomingPlayers";
import { AuctionedPlayers } from "@/components/auction/AuctionedPlayers";
import { UserButton } from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import {
Crown,
Loader2,
Pause,
Play,
ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { useEffect } from "react";

export default function AuctionRoom() {
  const params = useParams<{ auctionId: string }>();
  const auctionId = params?.auctionId;
const { user } = useAuth();

  // ALL hooks must be called before any conditional returns
const auctionDetails = useQuery(api.auctions.getAuctionDetails, {
    auctionId: auctionId as any,
});
const userTeam = useQuery(api.auctions.getUserTeam, {
    auctionId: auctionId as any,
    userEmail: user?.email || "",
});

// Get current user's database ID
const currentUser = useQuery(api.users.getUserByEmail, {
  email: user?.email || "",
});
const placeBid = useMutation(api.bidding.placeBid);
const skipPlayer = useMutation(api.bidding.skipPlayer);
const startAuction = useMutation(api.bidding.startAuction);
const pauseAuction = useMutation(api.bidding.pauseAuction);
const resumeAuction = useMutation(api.bidding.resumeAuction);
const completeAuction = useMutation(api.bidding.completeAuction);
const currentSkipVotes = useQuery(api.bidding.getCurrentSkipVotes, {
    auctionId: auctionId as any,
  });
  const timerStatus = useQuery(api.bidding.checkTimerExpiration, {
    auctionId: auctionId as any,
  });

  const startTimerForCurrentPlayer = useMutation(api.bidding.startTimerForCurrentPlayer);
  const handleTimerExpiration = useMutation(api.bidding.handleTimerExpirationMutation);

const [isUploading, setIsUploading] = useState(false);
const [isTeamNameOpen, setTeamNameOpen] = useState(false);
  const [timerPoll, setTimerPoll] = useState(0); // For real-time timer updates
  const [isTimerExpiring, setIsTimerExpiring] = useState(false); // Prevent multiple expiration calls
  const [localTimerSeconds, setLocalTimerSeconds] = useState<number>(0); // Local timer in seconds for real-time updates

  // Auto-start timer when auction is in progress and player is available
  useEffect(() => {
    if (auctionDetails?.status === "in_progress" && auctionDetails?.currentPlayer && (!timerStatus || timerStatus.timeRemaining === 0)) {
      // Auto-start the timer when auction is in progress
      startTimerForCurrentPlayer({ auctionId: auctionId as any, userEmail: user?.email || "" }).catch(error => {
        // Timer start failed silently
      });
    }
  }, [auctionDetails?.status, auctionDetails?.currentPlayer, timerStatus, startTimerForCurrentPlayer, auctionId, user?.email]);

  // Real-time timer updates - poll every second when timer is active
  useEffect(() => {
    if (timerStatus && timerStatus.timeRemaining > 0 && !timerStatus.hasExpired) {
      const interval = setInterval(() => {
        setTimerPoll(prev => prev + 1);
      }, 500); // Poll every 500ms for more responsive updates
      return () => clearInterval(interval);
    }
  }, [timerStatus?.timeRemaining, timerStatus?.hasExpired]);

  // Force timer query refresh every second when auction is in progress
  useEffect(() => {
    if (auctionDetails?.status === "in_progress" && auctionDetails?.currentPlayer) {
      const interval = setInterval(() => {
        // Force a refresh of the timer query
        setTimerPoll(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [auctionDetails?.status, auctionDetails?.currentPlayer]);





  // Force timer updates every 200ms when timer is active
  useEffect(() => {
    if (timerStatus && timerStatus.timeRemaining > 0) {
      const interval = setInterval(() => {
        // Force timer query to refresh
        setTimerPoll(prev => prev + 1);
      }, 200); // Very aggressive polling for real-time updates
      return () => clearInterval(interval);
    }
  }, [timerStatus?.timeRemaining]);

  // Handle timer expiration - server timer only
  useEffect(() => {
    if (timerStatus?.hasExpired && auctionId && !isTimerExpiring) {
      setIsTimerExpiring(true);
      handleTimerExpiration({ auctionId: auctionId as any })
        .then(() => {
          // Timer expiration completed
        })
        .catch(error => {
          // Timer expiration failed
        })
        .finally(() => {
          setIsTimerExpiring(false);
        });
    }
  }, [timerStatus?.hasExpired, auctionId, handleTimerExpiration, isTimerExpiring]);



  // Sync local timer with server timer and update every second
  useEffect(() => {
    if (timerStatus && timerStatus.timeRemaining > 0) {
      // Initialize local timer with server time
      const serverSeconds = Math.ceil(timerStatus.timeRemaining / 1000);
      setLocalTimerSeconds(serverSeconds);
    } else {
      setLocalTimerSeconds(0);
    }
  }, [timerStatus?.timeRemaining]);

  // Real-time countdown timer - only run when auction is not paused
  useEffect(() => {
    if (localTimerSeconds > 0 && auctionDetails?.status !== "paused") {
      const interval = setInterval(() => {
        setLocalTimerSeconds(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // Timer reached zero, trigger expiration only if not already expiring
            if (!isTimerExpiring) {
              setIsTimerExpiring(true);
              handleTimerExpiration({ auctionId: auctionId as any })
                .then(() => {
                  // Local timer expiration completed
                })
                .catch(error => {
                  // Local timer expiration failed
                })
                .finally(() => {
                  setIsTimerExpiring(false);
                });
            }
            return 0;
          }
          return newTime;
        });
      }, 1000); // Update every 1 second
      return () => clearInterval(interval);
    }
  }, [localTimerSeconds, auctionDetails?.status, auctionId, handleTimerExpiration, isTimerExpiring]);



  // Ensure auctionId is properly typed and exists
  if (!auctionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Invalid Auction ID</h2>
          <p className="text-muted-foreground mt-2">
            No auction ID provided in the URL.
          </p>
        </div>
      </div>
    );
  }

  // Ensure auctionId is properly typed
  const auctionIdTyped = auctionId as Id<"auctions">;



if (!auctionDetails || userTeam === undefined) {
return (
<div className="flex items-center justify-center min-h-screen">
<Loader2 className="h-12 w-12 animate-spin" />
</div>
);
}

  // Add null check for auction
  if (!auctionDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Auction Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The auction you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // The query returns auction data directly, not nested under 'auction'
  const auction = auctionDetails;
const {
teams,
    auctionTimer: timer,
totalPlayers,
    processedPlayersCount: processedPlayers,
currentPlayer,
} = auctionDetails;

  // Get current bid from currentPlayer
  const currentBid = currentPlayer?.currentBid;

  // userTeam is now fetched from the backend query

  // For testing purposes, let's enable bidding for all users
  const canBid = true; // Set this to true for testing

  // Fix the isOwner check to work with our custom auth system
  // Check if the current user is the auction creator
  const isOwner = user?.email && auctionDetails.createdBy ? 
    // We need to find the creator user by their _id to get their email
    // For now, let's check if the user has a team in this auction
    teams.some(team => team.ownerId === auctionDetails.createdBy) : false;

  // Check if current user is the auction owner
  const isOwnerForTesting = auctionDetails?.createdBy === currentUser?._id; // Only show buttons to auction owner
const progress =
totalPlayers > 0 ? (processedPlayers / totalPlayers) * 100 : 0;

  const handlePlaceBid = async (amount: number) => {
    try {
      await placeBid({ 
        auctionId: auctionId as any, 
        amount,
        userEmail: user?.email || "",
      });
             toast.success(`Bid of ₹${amount}cr placed successfully!`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Calculate next bid amount based on current bid
  const calculateNextBidAmount = () => {
    if (!currentBid) {
      // No current bid, start with reserve price
      return Math.round(((currentPlayer?.reservePriceRsLakh || 0) / 100) * 100) / 100;
    } else {
      // Calculate increment based on current bid amount
      let increment;
      if (currentBid.amount < 1) {
        increment = 0.1; // Less than 1cr, increment by 0.1cr
      } else if (currentBid.amount < 10) {
        increment = 0.2; // Between 1cr and 10cr, increment by 0.2cr
      } else {
        increment = 0.25; // Above 10cr, increment by 0.25cr
      }
      return Math.round((currentBid.amount + increment) * 100) / 100;
    }
  };

  const handleSkipPlayer = async () => {
    try {
      await skipPlayer({ 
        auctionId: auctionId as any,
        userEmail: user?.email || "",
      });
      toast.info("You voted to skip this player.");
    } catch (error: any) {
      toast.error(error.message);
    }
  };



  console.log("AuctionRoom - timerStatus:", timerStatus);
  console.log("AuctionRoom - currentPlayer:", currentPlayer);

return (
<>
{userTeam && (
  <TeamNameDialog
    teamId={userTeam._id}
    currentName={userTeam.name || "My Team"}
    open={isTeamNameOpen}
    onOpenChange={setTeamNameOpen}
  />
)}
<div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
<header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sm:px-6">
<div className="flex items-center gap-4">
<Link to="/dashboard" className="flex items-center gap-2">
<div className="flex items-center gap-2">
<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
<span className="text-white font-bold text-lg">🏆</span>
</div>
<span className="font-bold text-xl text-white">{auction.name}</span>
</div>
</Link>
</div>
<div className="flex items-center gap-4">
<UserButton />
</div>
</header>
<main className="flex-1 p-4 sm:p-6">
<div className="space-y-6">
{/* Auction Control Section */}
<div className="border border-gray-700 rounded-lg p-6 bg-gray-800/50">
<div className="flex justify-between items-center mb-4">
<h3 className="text-lg font-semibold text-white">Auction Control</h3>
<div className="text-sm text-gray-300">
Status:{" "}
<span className={`font-semibold px-2 py-1 rounded-full text-xs ${
  auction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
  auction.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
  auction.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
  'bg-gray-500/20 text-gray-400'
}`}>{auction.status}</span>
</div>
</div>
<div className="flex items-center gap-4">
                {isOwnerForTesting && (
<>
                    {auction.status === "waiting" && (
                      <Button onClick={() => startAuction({ auctionId: auctionId as any, userEmail: user?.email || "" })}>
<Play className="w-4 h-4 mr-2" /> Start
</Button>
)}
                    {auction.status === "in_progress" && (
                      <Button onClick={() => pauseAuction({ auctionId: auctionId as any, userEmail: user?.email || "" })}>
<Pause className="w-4 h-4 mr-2" /> Pause
</Button>
)}
                    {auction.status === "paused" && (
                      <Button onClick={() => resumeAuction({ auctionId: auctionId as any, userEmail: user?.email || "" })}>
<Play className="w-4 h-4 mr-2" /> Resume
</Button>
)}
                    {auction.status !== "completed" && (
<Button
variant="destructive"
                        onClick={() => completeAuction({ auctionId: auctionId as any, userEmail: user?.email || "" })}
>
<ShieldCheck className="w-4 h-4 mr-2" /> Complete
</Button>
)}
                    
</>
)}
<div className="flex-1">
<Progress value={progress} />
<p className="text-xs text-muted-foreground mt-1 text-center">
{processedPlayers} / {totalPlayers} players auctioned
</p>
</div>
</div>
{auction.winnerId && (
<div className="mt-4 text-center bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
<Crown className="w-6 h-6 mx-auto text-yellow-500" />
<p className="font-semibold mt-1">
Winner:{" "}
{teams.find((t) => t._id === auction.winnerId)?.name}
</p>
</div>
)}
</div>

{/* Player and Bidding Section */}
<div className="border border-gray-700 rounded-lg p-6 bg-gray-800/50">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl lg:text-2xl font-bold truncate text-white">
{currentPlayer
? `${currentPlayer.firstName} ${currentPlayer.surname}`
: "Waiting for next player..."}
</h2>
{currentPlayer && (
                                        <div className="text-gray-300 flex flex-wrap gap-2 mt-1">
                      <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded">{currentPlayer.country}</span>
                      <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded">{currentPlayer.specialism}</span>
                    </div>
)}
</div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-400">
{currentBid
                      ? `₹${currentBid.amount.toFixed(2)}cr`
                      : `Base: ₹${((currentPlayer?.reservePriceRsLakh || 0) / 100).toFixed(2)}cr`}
</div>
                  <div className="text-sm text-gray-300 truncate">
{currentBid
                      ? `by ${currentBid.teamName}`
: "No bids yet"}
</div>
</div>
</div>
                             {timerStatus && (
<div className="mt-4">
                   <Progress value={(localTimerSeconds / (timer?.duration ? timer.duration / 1000 : 30)) * 100} />
                   <div className="text-center mt-2 font-mono text-lg font-bold text-yellow-400">
                     {localTimerSeconds}s remaining
                   </div>
                   <div className="text-xs text-gray-300 text-center mt-1">
                     Timer Status: {auction?.status === "paused" ? "Paused" : timerStatus.hasExpired ? "Expired" : "Active"} | 
                     Real-time Countdown
</div>
</div>
)}
<div className="mt-6 flex gap-4">
<Button
size="lg"
className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handlePlaceBid(calculateNextBidAmount())}
disabled={
!currentPlayer ||
                    auction.status !== "in_progress" ||
                    !canBid
                  }
                >
                  Bid (₹{calculateNextBidAmount().toFixed(2)}cr)
</Button>
<Button
size="lg"
variant="secondary"
className="bg-orange-500 hover:bg-orange-600 text-white"
onClick={handleSkipPlayer}
                  disabled={!currentPlayer || auction.status !== "in_progress"}
>
Vote Skip ({currentSkipVotes} / {teams.length})
</Button>
</div>
</div>

{/* Bottom Tabs Section */}
<Tabs defaultValue="my-team" className="w-full">
<TabsList className="grid w-full grid-cols-4 bg-black border border-gray-700">
<TabsTrigger value="my-team" className="text-gray-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">My Team</TabsTrigger>
<TabsTrigger value="all-teams" className="text-gray-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">All Teams</TabsTrigger>
<TabsTrigger value="upcoming-players" className="text-gray-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Upcoming Players</TabsTrigger>
<TabsTrigger value="auctioned-players" className="text-gray-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Auctioned Players</TabsTrigger>
</TabsList>
<TabsContent value="my-team" className="space-y-4">
{userTeam ? (
<MyTeamDashboard auctionId={auctionId as any} userEmail={user?.email || ""} />
) : (
<div className="text-center py-8">
<p>You are not part of a team in this auction.</p>
</div>
)}
</TabsContent>
<TabsContent value="all-teams" className="space-y-4">
<TeamDashboard auctionId={auctionId as any} />
</TabsContent>
<TabsContent value="upcoming-players" className="space-y-4">
<UpcomingPlayers auctionId={auctionId as any} />
</TabsContent>
<TabsContent value="auctioned-players">
<AuctionedPlayers auctionId={auctionId as any} />
</TabsContent>
</Tabs>
</div>
</main>
</div>
</>
);
}