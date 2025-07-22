import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { StoreProvider } from '@/contexts/StoreContext';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import BlogReseller from '@/pages/BlogReseller';
import BlogPlayer from '@/pages/BlogPlayer';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Refund from '@/pages/Refund';
import Shipping from '@/pages/Shipping';
import FAQ from '@/pages/FAQ';
import Error404 from '@/pages/Error404';
import StoreAdmin from '@/pages/admin/StoreAdmin';
import OrdersAdmin from '@/pages/admin/OrdersAdmin';
import UsersAdmin from '@/pages/admin/UsersAdmin';
import SettingsAdmin from '@/pages/admin/SettingsAdmin';
import LoginAdmin from '@/pages/admin/LoginAdmin';
import IPTVPanel from '@/pages/IPTVPanel';
import PlayerPanel from '@/pages/PlayerPanel';
import PlayerDetail from '@/pages/PlayerDetail';
import IPTVDetail from '@/pages/IPTVDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LanguageProvider>
          <StoreProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/blog-reseller" element={<BlogReseller />} />
                <Route path="/blog-player" element={<BlogPlayer />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/iptv-panel" element={<IPTVPanel />} />
                <Route path="/player-panel" element={<PlayerPanel />} />
                
                <Route path="/admin" element={<StoreAdmin />} />
                <Route path="/admin/orders" element={<OrdersAdmin />} />
                <Route path="/admin/users" element={<UsersAdmin />} />
                <Route path="/admin/settings" element={<SettingsAdmin />} />
                <Route path="/admin/login" element={<LoginAdmin />} />
                
                {/* Add new detail page routes */}
                <Route path="/player/:slug" element={<PlayerDetail />} />
                <Route path="/iptv/:slug" element={<IPTVDetail />} />
                
                <Route path="*" element={<Error404 />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </StoreProvider>
        </LanguageProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
