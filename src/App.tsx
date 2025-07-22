
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreContextProvider } from "@/contexts/StoreContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Subscription from "./pages/Subscription";
import PaymentReturn from "./pages/PaymentReturn";
import Activation from "./pages/Activation";
import IPTVPanel from "./pages/IPTVPanel";
import PlayerPanel from "./pages/PlayerPanel";
import Support from "./pages/Support";
import Reviews from "./pages/Reviews";
import FullReviews from "./pages/FullReviews";
import Blog from "./pages/Blog";
import BlogIPTV from "./pages/BlogIPTV";
import BlogPlayer from "./pages/BlogPlayer";
import HowToBuy from "./pages/HowToBuy";
import Reseller from "./pages/Reseller";
import FeedbackSubmission from "./pages/FeedbackSubmission";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import ManageProducts from "./pages/admin/ManageProducts";
import EditProduct from "./pages/admin/EditProduct";
import ManageSubscriptionPackages from "./pages/admin/ManageSubscriptionPackages";
import Settings from "./pages/admin/Settings";
import Content from "./pages/admin/Content";
import BlogManagement from "./pages/admin/BlogManagement";
import AdminLayout from "./layouts/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <StoreContextProvider>
          <AdminAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/payment-return" element={<PaymentReturn />} />
                  <Route path="/activation" element={<Activation />} />
                  <Route path="/iptv-panel" element={<IPTVPanel />} />
                  <Route path="/player-panel" element={<PlayerPanel />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/full-reviews" element={<FullReviews />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog-iptv" element={<BlogIPTV />} />
                  <Route path="/blog-player" element={<BlogPlayer />} />
                  <Route path="/how-to-buy" element={<HowToBuy />} />
                  <Route path="/reseller" element={<Reseller />} />
                  <Route path="/feedback" element={<FeedbackSubmission />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="products/edit/:id" element={<EditProduct />} />
                    <Route path="subscription-packages" element={<ManageSubscriptionPackages />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="content" element={<Content />} />
                    <Route path="blog" element={<BlogManagement />} />
                  </Route>

                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AdminAuthProvider>
        </StoreContextProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
