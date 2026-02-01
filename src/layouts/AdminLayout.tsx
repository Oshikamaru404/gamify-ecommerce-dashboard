
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Settings, 
  FileText, 
  Palette,
  BookOpen,
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/diza', icon: Home },
    { name: 'Orders', href: '/diza/orders', icon: ShoppingCart },
    { name: 'Products', href: '/diza/products', icon: Package },
    { name: 'Content', href: '/diza/content', icon: FileText },
    { name: 'Blog', href: '/diza/blog', icon: BookOpen },
    { name: 'Communication', href: '/diza/communication', icon: MessageSquare },
    { name: 'Style Editor', href: '/diza/style', icon: Palette },
    { name: 'Settings', href: '/diza/settings', icon: Settings },
  ];

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onLinkClick}
            className={cn(
              'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors',
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  const LogoutButton = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={() => {
        logout();
        onClick?.();
      }}
      className="flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
    >
      <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
      Logout
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-lg font-bold text-gray-900">BWIVOX Admin</h1>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <h1 className="text-xl font-bold text-gray-900">BWIVOX Admin</h1>
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                  <NavLinks onLinkClick={() => setMobileMenuOpen(false)} />
                </nav>
                <div className="p-4 border-t">
                  <LogoutButton onClick={() => setMobileMenuOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-lg fixed inset-y-0 left-0 z-40">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">BWIVOX Admin</h1>
          </div>
          <nav className="flex-1 overflow-y-auto mt-2 px-3">
            <NavLinks />
          </nav>
          <div className="p-4 border-t">
            <LogoutButton />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Spacer for mobile header */}
          <div className="h-14 lg:hidden" />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
