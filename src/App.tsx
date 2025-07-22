
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { StoreProvider } from '@/contexts/StoreContext';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import Blog from '@/pages/Blog';
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
                <Route path="/blog" element={<Blog />} />
                <Route path="/iptv-panel" element={<IPTVPanel />} />
                <Route path="/player-panel" element={<PlayerPanel />} />
                
                {/* Detail page routes */}
                <Route path="/player/:slug" element={<PlayerDetail />} />
                <Route path="/iptv/:slug" element={<IPTVDetail />} />
                
                {/* Catch all route - redirect to home for now */}
                <Route path="*" element={<Home />} />
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
