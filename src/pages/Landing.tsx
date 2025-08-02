import { AuthButton } from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏆</span>
          </div>
          <span className="font-bold text-xl text-white">IPL Auction</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <AuthButton />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  <span className="text-white">Real-Time IPL</span>
                  <br />
                  <span className="text-blue-400">Auction Experience</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl leading-relaxed">
                  Create and join live cricket auctions with your friends. Build your dream team, compete in real-time bidding, and let AI determine the ultimate winner.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Everything You Need for the Perfect Auction
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-300 text-lg">
                From player uploads to AI-powered team analysis, we've got every aspect covered.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-700">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">
            Made by Rathesh
          </p>
          <a 
            href="https://github.com/Rathesh0709" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
} 