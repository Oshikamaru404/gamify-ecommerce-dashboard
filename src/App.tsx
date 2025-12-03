
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { StoreProvider } from "./contexts/StoreContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentReturn from "./pages/PaymentReturn";
import Blog from "./pages/Blog";
import BlogIPTV from "./pages/BlogIPTV";
import BlogPlayer from "./pages/BlogPlayer";
import BlogArticleDetail from "./pages/BlogArticleDetail";
import Reviews from "./pages/Reviews";
import FullReviews from "./pages/FullReviews";
import FeedbackSubmission from "./pages/FeedbackSubmission";
import Support from "./pages/Support";
import HowToBuy from "./pages/HowToBuy";
import Activation from "./pages/Activation";
import Reseller from "./pages/Reseller";
import IPTVPanel from "./pages/IPTVPanel";
import IPTVDetail from "./pages/IPTVDetail";
import PlayerPanel from "./pages/PlayerPanel";
import PlayerDetail from "./pages/PlayerDetail";
import Subscription from "./pages/Subscription";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/AdminLogin";
import ResetAdminPassword from "./pages/admin/ResetAdminPassword";
import AdminLayout from "./layouts/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import EditProduct from "./pages/admin/EditProduct";
import ManageSubscriptionPackages from "./pages/admin/ManageSubscriptionPackages";
import Orders from "./pages/admin/Orders";
import BlogManagement from "./pages/admin/BlogManagement";
import Settings from "./pages/admin/Settings";
import Content from "./pages/admin/Content";
import StyleEditor from "./pages/admin/StyleEditor";
import Communication from "./pages/admin/Communication";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LanguageProvider>
          <StoreProvider>
            <TooltipProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Public routes - Updated to use Home as default */}
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/index" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-return" element={<PaymentReturn />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/iptv" element={<BlogIPTV />} />
                  <Route path="/blog/player" element={<BlogPlayer />} />
                  <Route path="/blog-iptv" element={<BlogIPTV />} />
                  <Route path="/blog-iptv/:slug" element={<BlogArticleDetail category="iptv" backPath="/blog-iptv" backLabel="Retour aux articles IPTV" />} />
                  <Route path="/blog-player" element={<BlogPlayer />} />
                  <Route path="/blog-player/:slug" element={<BlogArticleDetail category="player" backPath="/blog-player" backLabel="Retour aux articles Player" />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/reviews/full" element={<FullReviews />} />
                  <Route path="/full-reviews" element={<FullReviews />} />
                  <Route path="/feedback" element={<FeedbackSubmission />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/how-to-buy" element={<HowToBuy />} />
                  <Route path="/activation" element={<Activation />} />
                  <Route path="/reseller" element={<Reseller />} />
                  <Route path="/iptv-panel" element={<IPTVPanel />} />
                  <Route path="/iptv-panel/:slug" element={<IPTVDetail />} />
                  <Route path="/player-panel" element={<PlayerPanel />} />
                  <Route path="/player-panel/:slug" element={<PlayerDetail />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/reset-password" element={<ResetAdminPassword />} />
                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <AdminLayout>
                        <Outlet />
                      </AdminLayout>
                    </AdminProtectedRoute>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="products/:id/edit" element={<EditProduct />} />
                    <Route path="subscriptions" element={<ManageSubscriptionPackages />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="blog" element={<BlogManagement />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="content" element={<Content />} />
                    <Route path="style-editor" element={<StyleEditor />} />
                    <Route path="communication" element={<Communication />} />
                  </Route>
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
            </TooltipProvider>
          </StoreProvider>
        </LanguageProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
