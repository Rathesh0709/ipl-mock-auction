import { CreateAuctionDialog } from "@/components/auction/CreateAuctionDialog";
import { JoinAuctionDialog } from "@/components/auction/JoinAuctionDialog";
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
import { useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Users, Trophy, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [isUsernameOpen, setIsUsernameOpen] = useState(false);

  const myAuctions = useQuery(api.auctions.getUserAuctions, {
    userEmail: user?.email || "",
  }) || [];

  const allAuctions = useQuery(api.auctions.getAllAuctions) || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 text-white max-w-md">
          <CardContent className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-blue-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Please Sign In</h2>
            <p className="text-gray-300">You need to sign in to access the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <span className="text-xl font-bold text-white">IPL Auction</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <CreateAuctionDialog />
              <JoinAuctionDialog />
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-xl text-gray-300 mb-4">
            Welcome, {user.name || user.email}!
          </p>
          <p className="text-gray-400">
            Create a new auction or join an existing one.
          </p>
        </div>

        {/* Username Setup Dialog */}
        <UsernameSetupDialog open={isUsernameOpen} onOpenChange={setIsUsernameOpen} />

        {/* Auction Tabs */}
        <Tabs defaultValue="my-auctions" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="my-auctions" className="text-gray-300 data-[state=active]:text-white">
              My Auctions
            </TabsTrigger>
            <TabsTrigger value="all-auctions" className="text-gray-300 data-[state=active]:text-white">
              All Auctions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-auctions" className="space-y-4">
            {myAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myAuctions.map((auction) => (
                  <Card key={auction._id} className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-gray-500 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white">{auction.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        You are the owner
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Join Code:</span>
                        <span className="font-mono text-blue-400">{auction.joinCode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          auction.status === "completed" 
                            ? "bg-green-500/20 text-green-400" 
                            : auction.status === "in_progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {auction.status}
                        </span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => window.location.href = `/auction/${auction._id}`}
                      >
                        Manage Auction
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Auctions Yet</h3>
                  <p className="text-gray-300 mb-4">
                    You haven't created any auctions yet. Create your first auction to get started!
                  </p>
                  <CreateAuctionDialog />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all-auctions" className="space-y-4">
            {allAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAuctions.map((auction) => (
                  <Card key={auction._id} className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-gray-500 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white">{auction.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        Created by {auction.createdBy}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Join Code:</span>
                        <span className="font-mono text-blue-400">{auction.joinCode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          auction.status === "completed" 
                            ? "bg-green-500/20 text-green-400" 
                            : auction.status === "in_progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {auction.status}
                        </span>
                      </div>
                      <Button 
                        variant="outline"
                        className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => window.location.href = `/auction/${auction._id}`}
                      >
                        View Auction
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Auctions Available</h3>
                  <p className="text-gray-300 mb-4">
                    There are no auctions available at the moment. Create one to get started!
                  </p>
                  <CreateAuctionDialog />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}