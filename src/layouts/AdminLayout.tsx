
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings, 
  LogOut,
  FileText,
  BookOpen
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { useToast } from '@/hooks/use-toast';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Blog', href: '/admin/blog', icon: BookOpen },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <AdminProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-red-600">BWIVOX Admin</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {adminUser?.username}</p>
          </div>
          
          <nav className="mt-6 flex-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/admin' && location.pathname === '/admin/dashboard');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${
                    isActive
                      ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-6 mt-auto">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full flex items-center justify-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminLayout;
