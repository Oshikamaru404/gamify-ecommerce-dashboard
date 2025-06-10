
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// IPTV Service Routes
import Home from "./pages/Home";
import Subscription from "./pages/Subscription";
import Activation from "./pages/Activation";
import Reseller from "./pages/Reseller";
import IPTVPanel from "./pages/IPTVPanel";
import PlayerPanel from "./pages/PlayerPanel";
import Support from "./pages/Support";
import HowToBuy from "./pages/HowToBuy";
import Blog from "./pages/Blog";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* IPTV Service Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/activation" element={<Activation />} />
          <Route path="/reseller" element={<Reseller />} />
          <Route path="/iptv-panel" element={<IPTVPanel />} />
          <Route path="/player-panel" element={<PlayerPanel />} />
          <Route path="/support" element={<Support />} />
          <Route path="/how-to-buy" element={<HowToBuy />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
