
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from './contexts/LanguageContext';
import { StoreProvider } from './contexts/StoreContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { useScrollToTop } from './hooks/useScrollToTop';

// Import pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Subscription from "./pages/Subscription";
import Activation from "./pages/Activation";
import Support from "./pages/Support";
import HowToBuy from "./pages/HowToBuy";
import Reseller from "./pages/Reseller";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentReturn from "./pages/PaymentReturn";
import FeedbackSubmission from "./pages/FeedbackSubmission";
import IPTVPanel from "./pages/IPTVPanel";
import PlayerPanel from "./pages/PlayerPanel";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import ManageProducts from "./pages/admin/ManageProducts";
import EditProduct from "./pages/admin/EditProduct";
import Settings from "./pages/admin/Settings";
import Content from "./pages/admin/Content";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

const queryClient = new QueryClient();

// Component to handle scroll to top on route change
const ScrollToTopWrapper = () => {
  useScrollToTop();
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AdminAuthProvider>
            <StoreProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTopWrapper />
                <Routes>
                  {/* Public routes - Index is now the main home page */}
                  <Route path="/" element={<Home />} />
                  <Route path="/landing" element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/activation" element={<Activation />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/how-to-buy" element={<HowToBuy />} />
                  <Route path="/reseller" element={<Reseller />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment/return" element={<PaymentReturn />} />
                  <Route path="/payment/success" element={<PaymentReturn />} />
                  <Route path="/feedback" element={<FeedbackSubmission />} />
                  <Route path="/iptv-panel" element={<IPTVPanel />} />
                  <Route path="/player-panel" element={<PlayerPanel />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={
                    <AdminProtectedRoute>
                      <Dashboard />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminProtectedRoute>
                      <Orders />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminProtectedRoute>
                      <ManageProducts />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/products/:id/edit" element={
                    <AdminProtectedRoute>
                      <EditProduct />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <AdminProtectedRoute>
                      <Settings />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/content" element={
                    <AdminProtectedRoute>
                      <Content />
                    </AdminProtectedRoute>
                  } />
                  
                  {/* 404 page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </StoreProvider>
          </AdminAuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
