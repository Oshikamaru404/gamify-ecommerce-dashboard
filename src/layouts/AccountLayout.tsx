import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AccountSidebar from '@/components/account/AccountSidebar';
import RequireAuth from '@/components/account/RequireAuth';

const AccountLayout: React.FC = () => {
  React.useEffect(() => { document.title = 'My Account — BWIVOX'; }, []);
  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AccountSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center border-b bg-background/80 backdrop-blur sticky top-0 z-30 px-3 gap-2">
              <SidebarTrigger />
              <div className="text-sm font-medium">My Account</div>
            </header>
            <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RequireAuth>
  );
};

export default AccountLayout;
