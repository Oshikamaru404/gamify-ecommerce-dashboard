import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AccountSidebar from '@/components/account/AccountSidebar';
import RequireAuth from '@/components/account/RequireAuth';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const titleMap: Record<string, string> = {
  '/account': 'Dashboard',
  '/account/orders': 'My Orders',
  '/account/subscriptions': 'My Subscriptions',
  '/account/activations': 'Activations',
  '/account/payments': 'Payment History',
  '/account/coupons': 'Coupons',
  '/account/affiliate': 'Affiliate',
  '/account/settings/profile': 'Profile',
  '/account/settings/security': 'Security',
  '/account/settings/notifications': 'Notifications',
  '/account/settings/linked': 'Linked Accounts',
  '/account/settings/saved-profiles': 'Saved Profiles',
  '/account/settings/danger': 'Danger Zone',
};

const AccountLayout: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { document.title = 'My Account — BWIVOX'; }, []);
  const title = titleMap[pathname] || (pathname.startsWith('/account/orders/') ? 'Order Details' : 'My Account');

  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-red-50/20 to-background">
          <AccountSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center border-b bg-white/95 backdrop-blur-md sticky top-0 z-30 px-3 gap-2 shadow-sm">
              <SidebarTrigger className="hover:bg-red-50 hover:text-red-600" />
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent truncate">{title}</div>
              </div>
              <Button asChild variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                <Link to="/"><Home className="h-4 w-4" /></Link>
              </Button>
            </header>
            <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RequireAuth>
  );
};

export default AccountLayout;
