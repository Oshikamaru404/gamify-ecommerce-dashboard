
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Public Pages
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Subscription from '@/pages/Subscription';
import Activation from '@/pages/Activation';
import Reseller from '@/pages/Reseller';
import IPTVPanel from '@/pages/IPTVPanel';
import PlayerPanel from '@/pages/PlayerPanel';
import HowToBuy from '@/pages/HowToBuy';
import Support from '@/pages/Support';
import Blog from '@/pages/Blog';
import RefundPolicy from '@/pages/RefundPolicy';
import NotFound from '@/pages/NotFound';
import FeedbackSubmission from '@/pages/FeedbackSubmission';

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/layouts/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Orders from '@/pages/admin/Orders';
import ManageProducts from '@/pages/admin/ManageProducts';
import EditProduct from '@/pages/admin/EditProduct';
import Content from '@/pages/admin/Content';
import Settings from '@/pages/admin/Settings';

// Contexts
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <StoreProvider>
          <LanguageProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes - Home is the default page */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/activation" element={<Activation />} />
                <Route path="/reseller" element={<Reseller />} />
                <Route path="/iptv-panel" element={<IPTVPanel />} />
                <Route path="/player-panel" element={<PlayerPanel />} />
                <Route path="/how-to-buy" element={<HowToBuy />} />
                <Route path="/support" element={<Support />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/feedback" element={<FeedbackSubmission />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="products/edit/:id" element={<EditProduct />} />
                  <Route path="content" element={<Content />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </LanguageProvider>
        </StoreProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
