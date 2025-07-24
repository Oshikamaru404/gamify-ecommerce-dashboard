
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
    // Check for existing Supabase session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AdminAuth - Initial session check:', session?.user?.id ? 'Found session' : 'No session');
        
        if (session?.user) {
          // Check if user is admin
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (adminData && !error) {
            console.log('AdminAuth - User is admin:', adminData);
            setAdminUser({
              id: adminData.id,
              username: adminData.username,
              email: session.user.email
            });
          } else {
            console.log('AdminAuth - User is not admin or error:', error);
            setAdminUser(null);
          }
        } else {
          setAdminUser(null);
        }
      } catch (error) {
        console.error('AdminAuth - Session check error:', error);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AdminAuth - Auth state changed:', event, session?.user?.id ? 'User present' : 'No user');
      
      if (event === 'SIGNED_OUT' || !session?.user) {
        setAdminUser(null);
        setIsLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          // Check if user is admin
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (adminData && !error) {
            console.log('AdminAuth - User authenticated as admin:', adminData);
            setAdminUser({
              id: adminData.id,
              username: adminData.username,
              email: session.user.email
            });
          } else {
            console.log('AdminAuth - User authenticated but not admin:', error);
            setAdminUser(null);
          }
        } catch (error) {
          console.error('AdminAuth - Error checking admin status:', error);
          setAdminUser(null);
        }
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('AdminAuth - Attempting login...');
      
      // For demo purposes, we'll create a temporary user and sign them in
      // In production, you should have proper user management
      if (username === 'admin' && password === 'admin123') {
        // Try to sign in with a demo email
        const demoEmail = 'admin@demo.com';
        const demoPassword = 'admin123456';
        
        // First try to sign in
        let { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        });

        // If sign in fails, try to sign up
        if (signInError) {
          console.log('AdminAuth - Sign in failed, trying sign up...');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
          });
          
          if (signUpError) {
            console.error('AdminAuth - Sign up failed:', signUpError);
            return false;
          }
          
          authData = signUpData;
        }

        if (authData.user) {
          console.log('AdminAuth - User authenticated, checking/creating admin record...');
          
          // Check if admin record exists, create if not
          const { data: existingAdmin, error: checkError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', authData.user.id)
            .single();

          if (checkError && checkError.code === 'PGRST116') {
            // Admin record doesn't exist, create it
            console.log('AdminAuth - Creating admin record...');
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({
                user_id: authData.user.id,
                username: 'admin',
                role: 'admin'
              });
            
            if (insertError) {
              console.error('AdminAuth - Error creating admin record:', insertError);
              return false;
            }
          }

          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('AdminAuth - Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('AdminAuth - Logging out...');
      await supabase.auth.signOut();
      setAdminUser(null);
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
