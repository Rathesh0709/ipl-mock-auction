import { CreateAuctionDialog } from "@/components/auction/CreateAuctionDialog";
import { JoinAuctionDialog } from "@/components/auction/JoinAuctionDialog";
import { JoinWithCodeDialog } from "@/components/auction/JoinWithCodeDialog";
import { UsernameSetupDialog } from "@/components/auth/UsernameSetupDialog";
import { UserButton } from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function Dashboard() {
const { user } = useAuth();
const [isCreateOpen, setCreateOpen] = useState(false);
const [isJoinOpen, setJoinOpen] = useState(false);
const [isJoinWithCodeOpen, setJoinWithCodeOpen] = useState(false);

const myAuctions = useQuery(api.auctions.getUserAuctions, {
userEmail: user?.email || "",
});

const allAuctions = useQuery(api.auctions.getAllAuctions);

if (!user?.email) {
return (
<div className="flex items-center justify-center min-h-screen">
<div className="text-center">
<h2 className="text-xl font-semibold">Please Sign In</h2>
<p className="text-muted-foreground mt-2">
You need to be signed in to view your auctions.
</p>
</div>
</div>
);
}

if (myAuctions === undefined || allAuctions === undefined) {
return (
<div className="flex items-center justify-center min-h-screen">
<Loader2 className="h-12 w-12 animate-spin" />
</div>
);
}
return (
<>
<UsernameSetupDialog />
<CreateAuctionDialog open={isCreateOpen} onOpenChange={setCreateOpen} />
<JoinAuctionDialog open={isJoinOpen} onOpenChange={setJoinOpen} />
<JoinWithCodeDialog
open={isJoinWithCodeOpen}
onOpenChange={setJoinWithCodeOpen}
/>
<div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
<header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sm:px-6">
<div className="flex items-center gap-4">
<Link to="/" className="flex items-center gap-2">
<div className="flex items-center gap-2">
<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
<span className="text-white font-bold text-lg">🏆</span>
</div>
<span className="font-bold text-xl text-white">IPL Auction</span>
</div>
</Link>
</div>
<div className="flex items-center gap-4">
<Button
variant="outline"
className="hidden sm:inline-flex border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
onClick={() => setJoinWithCodeOpen(true)}
>
Join with Code
</Button>
<UserButton />
</div>
</header>
<main className="flex-1 p-4 sm:p-6">
<div className="container mx-auto">
<div className="flex items-center justify-between">
<h1 className="text-3xl font-bold text-white">Dashboard</h1>
<div className="flex items-center gap-2">
<Button onClick={() => setCreateOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
<Plus className="w-4 h-4 mr-2" />
Create Auction
</Button>
</div>
</div>
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
<div>
<h1 className="text-2xl font-bold text-white">
Welcome, {user?.name?.split(" ")[0] || "Player"}!
</h1>
<p className="text-gray-300">
Create a new auction or join an existing one.
</p>
</div>
</div>
<Tabs defaultValue="my-auctions" className="w-full">
<TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
<TabsTrigger value="my-auctions" className="text-gray-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">My Auctions</TabsTrigger>
<TabsTrigger value="all-auctions" className="text-gray-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white">All Auctions</TabsTrigger>
</TabsList>

<TabsContent value="my-auctions" className="mt-6">
{myAuctions.length === 0 ? (
<div className="text-center py-16 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50">
<h2 className="text-xl font-semibold text-white">No Auctions Yet</h2>
<p className="text-gray-300 mt-2">
Get started by creating your first auction.
</p>
<Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setCreateOpen(true)}>
<Plus className="w-4 h-4 mr-2" />
Create Auction
</Button>
</div>
) : (
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
{myAuctions.map((auction) => (
<Card key={auction._id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
<CardHeader>
<CardTitle className="text-white">{auction.name}</CardTitle>
<CardDescription className="text-gray-300">
{auction.isOwner
? "You are the owner"
: `Joined as ${auction.teamName}`}
</CardDescription>
</CardHeader>
<CardContent>
<div className="flex items-center justify-between text-sm text-gray-400">
<div className="flex items-center">
<span>Join Code: {auction.joinCode}</span>
</div>
<span className={`px-2 py-1 rounded-full text-xs font-medium ${
  auction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
  auction.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
  auction.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
  'bg-gray-500/20 text-gray-400'
}`}>{auction.status}</span>
</div>
<Button asChild className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
<Link to={`/auction/${auction._id}`}>
{auction.isOwner ? "Manage Auction" : "Enter Room"}
</Link>
</Button>
</CardContent>
</Card>
))}
</div>
)}
</TabsContent>

<TabsContent value="all-auctions" className="mt-6">
{allAuctions.length === 0 ? (
<div className="text-center py-16 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50">
<h2 className="text-xl font-semibold text-white">No Auctions Available</h2>
<p className="text-gray-300 mt-2">
Be the first to create an auction!
</p>
<Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setCreateOpen(true)}>
<Plus className="w-4 h-4 mr-2" />
Create Auction
</Button>
</div>
) : (
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
{allAuctions.map((auction) => (
<Card key={auction._id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
<CardHeader>
<CardTitle className="text-white">{auction.name}</CardTitle>
<CardDescription className="text-gray-300">
Created by {auction.creatorName}
</CardDescription>
</CardHeader>
<CardContent>
<div className="flex items-center justify-between text-sm text-gray-400">
<div className="flex items-center">
<span>Join Code: {auction.joinCode}</span>
</div>
<span className={`px-2 py-1 rounded-full text-xs font-medium ${
  auction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
  auction.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
  auction.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
  'bg-gray-500/20 text-gray-400'
}`}>{auction.status}</span>
</div>
<div className="mt-4 space-y-2 text-sm text-gray-300">
<div className="flex justify-between">
<span>Max Teams:</span>
<span>{auction.maxTeams}</span>
</div>
<div className="flex justify-between">
<span>Team Purse:</span>
<span>₹{auction.teamPurse}cr</span>
</div>
</div>
<Button asChild className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
<Link to={`/auction/${auction._id}`}>
View Auction
</Link>
</Button>
</CardContent>
</Card>
))}
</div>
)}
</TabsContent>
</Tabs>
</div>
</main>
</div>
</>
);
}