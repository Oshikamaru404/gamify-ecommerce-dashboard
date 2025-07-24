
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  username: string;
  email?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session in localStorage
    const checkAdminSession = () => {
      try {
        const savedAdmin = localStorage.getItem('admin_user');
        if (savedAdmin) {
          const adminData = JSON.parse(savedAdmin);
          console.log('AdminAuth - Found saved admin session:', adminData);
          setAdminUser(adminData);
        }
      } catch (error) {
        console.error('AdminAuth - Error checking saved session:', error);
        localStorage.removeItem('admin_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('AdminAuth - Attempting admin login with:', { username });
      
      // Simple hardcoded admin credentials for demo
      if (username === 'admin' && password === 'admin123') {
        // Create a temporary admin user record in the database
        const { data: existingUser, error: checkError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('username', 'admin')
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing admin user:', checkError);
        }

        // If no admin user exists, create one
        if (!existingUser) {
          console.log('Creating admin user record...');
          const { error: createError } = await supabase
            .from('admin_users')
            .insert([
              {
                username: 'admin',
                role: 'admin',
                user_id: null // We'll use a special case in the function
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('Error creating admin user:', createError);
            // Continue anyway as the function might still work
          }
        }
        
        const adminData = {
          id: 'admin-' + Date.now(),
          username: 'admin',
          email: 'admin@demo.com'
        };
        
        console.log('AdminAuth - Login successful, setting admin user:', adminData);
        setAdminUser(adminData);
        
        // Save to localStorage for persistence
        localStorage.setItem('admin_user', JSON.stringify(adminData));
        
        return true;
      }
      
      console.log('AdminAuth - Invalid credentials');
      return false;
    } catch (error) {
      console.error('AdminAuth - Login error:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      console.log('AdminAuth - Logging out admin user');
      setAdminUser(null);
      localStorage.removeItem('admin_user');
    } catch (error) {
      console.error('AdminAuth - Logout error:', error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
