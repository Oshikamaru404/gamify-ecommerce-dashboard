
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import Blog from '@/pages/Blog';
import IPTVPanel from '@/pages/IPTVPanel';
import PlayerPanel from '@/pages/PlayerPanel';
import PlayerDetail from '@/pages/PlayerDetail';
import IPTVDetail from '@/pages/IPTVDetail';
import ProductDetail from '@/pages/ProductDetail';
import Subscription from '@/pages/Subscription';
import Activation from '@/pages/Activation';
import BlogIPTV from '@/pages/BlogIPTV';
import BlogPlayer from '@/pages/BlogPlayer';
import Support from '@/pages/Support';
import HowToBuy from '@/pages/HowToBuy';
import FullReviews from '@/pages/FullReviews';
import RefundPolicy from '@/pages/RefundPolicy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Checkout from '@/pages/Checkout';
import Reseller from '@/pages/Reseller';

// Admin imports
import AdminLayout from '@/layouts/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import Dashboard from '@/pages/admin/Dashboard';
import Orders from '@/pages/admin/Orders';
import ManageProducts from '@/pages/admin/ManageProducts';
import BlogManagement from '@/pages/admin/BlogManagement';
import Content from '@/pages/admin/Content';
import Settings from '@/pages/admin/Settings';

const queryClient = new QueryClient();

// Component to handle scroll to top functionality
const ScrollToTopWrapper = ({ children }: { children: React.ReactNode }) => {
  useScrollToTop();
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LanguageProvider>
          <StoreProvider>
            <BrowserRouter>
              <ScrollToTopWrapper>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/activation" element={<Activation />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog-iptv" element={<BlogIPTV />} />
                  <Route path="/blog-player" element={<BlogPlayer />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/how-to-buy" element={<HowToBuy />} />
                  <Route path="/full-reviews" element={<FullReviews />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/iptv-panel" element={<IPTVPanel />} />
                  <Route path="/player-panel" element={<PlayerPanel />} />
                  <Route path="/reseller" element={<Reseller />} />
                  <Route path="/checkout" element={<Checkout />} />
                  
                  {/* Detail page routes - Updated to use ProductDetail for all product types */}
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/player/:slug" element={<PlayerDetail />} />
                  <Route path="/iptv/:slug" element={<IPTVDetail />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="/blog" element={<BlogManagement />} />
                    <Route path="content" element={<Content />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  
                  {/* Catch all route - redirect to home for now */}
                  <Route path="*" element={<Home />} />
                </Routes>
                <Toaster />
              </ScrollToTopWrapper>
            </BrowserRouter>
          </StoreProvider>
        </LanguageProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
