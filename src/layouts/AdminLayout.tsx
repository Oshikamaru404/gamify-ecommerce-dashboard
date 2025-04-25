
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const sidebarItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: '/admin',
    },
    {
      icon: <ShoppingCart size={20} />,
      label: 'Orders',
      path: '/admin/orders',
    },
    {
      icon: <Package size={20} />,
      label: 'Products',
      path: '/admin/products',
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      path: '/admin/settings',
    },
  ];

  const isPathActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // In a real application, this would handle logout logic
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="absolute left-4 top-4 z-50 block md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-10 w-10 rounded-full bg-background"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-y-auto border-r bg-sidebar px-4 pt-16 transition-transform md:relative md:translate-x-0 md:pt-4",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-center py-2">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">GamsGo Admin</span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "admin-sidebar-item",
                isPathActive(item.path) && "active"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mb-4 mt-auto border-t pt-4">
          <Link to="/" className="admin-sidebar-item">
            <span>View Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="admin-sidebar-item w-full text-left"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;
