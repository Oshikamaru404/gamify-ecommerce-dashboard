import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Language Provider
import { LanguageProvider } from "@/contexts/LanguageContext";

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
import ProductDetail from "./pages/ProductDetail";

// Admin Routes
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import ManageProducts from "./pages/admin/ManageProducts";
import EditProduct from "./pages/admin/EditProduct";
import Settings from "./pages/admin/Settings";
import ContentEditor from "./components/admin/ContentEditor";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* IPTV Service Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/activation" element={<Activation />} />
            <Route path="/reseller" element={<Reseller />} />
            <Route path="/iptv-panel" element={<IPTVPanel />} />
            <Route path="/player-panel" element={<PlayerPanel />} />
            <Route path="/support" element={<Support />} />
            <Route path="/how-to-buy" element={<HowToBuy />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="products/new" element={<EditProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="content" element={<ContentEditor />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
