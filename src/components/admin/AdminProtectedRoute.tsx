
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { adminUser, isLoading } = useAdminAuth();
  const location = useLocation();

  console.log('AdminProtectedRoute - Admin User:', adminUser);
  console.log('AdminProtectedRoute - Loading:', isLoading);
  console.log('AdminProtectedRoute - Location:', location.pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    console.log('AdminProtectedRoute - No admin user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('AdminProtectedRoute - Admin user authenticated, rendering children');
  return <>{children}</>;
};

export default AdminProtectedRoute;
