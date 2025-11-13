
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import * as OTPAuth from 'otpauth';

interface AdminUser {
  id: string;
  username: string;
  email?: string;
  twoFactorEnabled?: boolean;
}

interface LoginResult {
  success: boolean;
  requires2FA?: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

interface PendingAuth {
  id: string;
  username: string;
  role: string;
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
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null);

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

  const login = async (username: string, password: string): Promise<LoginResult> => {
    try {
      console.log('AdminAuth - Attempting admin login with:', { username });
      
      // Simple hardcoded admin credentials for demo
      if (username === 'admin' && password === 'admin123') {
        // Create or get admin user record in the database
        const { data: existingUser, error: checkError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('username', 'admin')
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing admin user:', checkError);
        }

        let adminUserData = existingUser;

        // If no admin user exists, create one without 2FA enabled
        if (!existingUser) {
          console.log('Creating admin user record...');

          const { data: newUser, error: createError } = await supabase
            .from('admin_users')
            .insert([
              {
                username: 'admin',
                role: 'admin',
                user_id: null,
                two_factor_enabled: false,
                two_factor_secret: null
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('Error creating admin user:', createError);
            return { success: false };
          }

          adminUserData = newUser;
        }

        // Check if 2FA is enabled
        if (adminUserData?.two_factor_enabled && adminUserData?.two_factor_secret) {
          console.log('AdminAuth - 2FA enabled, requiring OTP');
          setPendingAuth({
            id: adminUserData.id || 'admin-' + Date.now(),
            username: 'admin',
            role: 'admin'
          });
          return { success: true, requires2FA: true };
        }

        // No 2FA required, complete login
        const adminData = {
          id: adminUserData?.id || 'admin-' + Date.now(),
          username: 'admin',
          email: 'admin@demo.com',
          twoFactorEnabled: adminUserData?.two_factor_enabled || false
        };
        
        console.log('AdminAuth - Login successful, setting admin user:', adminData);
        setAdminUser(adminData);
        localStorage.setItem('admin_user', JSON.stringify(adminData));
        
        return { success: true, requires2FA: false };
      }
      
      console.log('AdminAuth - Invalid credentials');
      return { success: false };
    } catch (error) {
      console.error('AdminAuth - Login error:', error);
      return { success: false };
    }
  };

  const verifyOtp = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!pendingAuth) {
      return { success: false, error: 'No pending authentication' };
    }

    try {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('two_factor_secret, backup_codes')
        .eq('username', pendingAuth.username)
        .single();

      if (!adminUser?.two_factor_secret) {
        return { success: false, error: 'Two-factor authentication not configured' };
      }

      // Check if it's a backup code (8 characters)
      if (code.length === 8) {
        const backupCodes = adminUser.backup_codes || [];
        const codeIndex = backupCodes.indexOf(code.toUpperCase());
        
        if (codeIndex === -1) {
          return { success: false, error: 'Invalid backup code' };
        }

        // Remove used backup code
        const updatedCodes = backupCodes.filter((_, index) => index !== codeIndex);
        await supabase
          .from('admin_users')
          .update({ backup_codes: updatedCodes })
          .eq('username', pendingAuth.username);

        const adminUserData: AdminUser = {
          id: pendingAuth.id,
          username: pendingAuth.username,
          twoFactorEnabled: true,
        };

        setAdminUser(adminUserData);
        setPendingAuth(null);
        localStorage.setItem('admin_user', JSON.stringify(adminUserData));

        return { success: true };
      }

      // Verify TOTP code (6 digits)
      const totp = new OTPAuth.TOTP({
        issuer: 'Admin Panel',
        label: pendingAuth.username,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(adminUser.two_factor_secret),
      });

      const delta = totp.validate({ token: code, window: 1 });
      
      if (delta === null) {
        return { success: false, error: 'Invalid verification code' };
      }

      const adminUserData: AdminUser = {
        id: pendingAuth.id,
        username: pendingAuth.username,
        twoFactorEnabled: true,
      };

      setAdminUser(adminUserData);
      setPendingAuth(null);
      localStorage.setItem('admin_user', JSON.stringify(adminUserData));

      return { success: true };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: 'Verification failed' };
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
    <AdminAuthContext.Provider value={{ adminUser, login, verifyOtp, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
