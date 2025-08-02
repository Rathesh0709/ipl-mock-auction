import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "@/components/VlyToolbar";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import Auth from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Dashboard from "./pages/Dashboard.tsx";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import AuctionRoom from "./pages/AuctionRoom.tsx";
import { ProtectedPage } from "@/lib/protected-page";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  // Handle redirect parameter from 404 page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    if (redirectPath && redirectPath !== '/') {
      window.history.replaceState({}, '', redirectPath);
    }
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedPage>
                  <Dashboard />
                </ProtectedPage>
              } 
            />
            <Route 
              path="/auction/:auctionId" 
              element={
                <ProtectedPage>
                  <AuctionRoom />
                </ProtectedPage>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);