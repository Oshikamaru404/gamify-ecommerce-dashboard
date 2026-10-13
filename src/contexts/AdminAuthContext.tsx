import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { invokeAdminAuth } from '@/lib/adminAuth';

interface AdminUser {
  id: string;
  username: string;
}

interface LoginResult {
  success: boolean;
  requires2FA?: boolean;
  error?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface PendingAuth {
  username: string;
  password: string;
}

interface LoginResponse extends Record<string, unknown> {
  success?: boolean;
  requires2FA?: boolean;
  error?: string;
  session?: {
    access_token?: unknown;
    refresh_token?: unknown;
  };
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function getAdminUser(user: User | null): AdminUser | null {
  if (!user || user.app_metadata?.admin !== true) return null;
  return {
    id: user.id,
    username: typeof user.app_metadata.admin_username === 'string'
      ? user.app_metadata.admin_username
      : 'admin',
  };
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null);

  useEffect(() => {
    localStorage.removeItem('admin_user');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(getAdminUser(session?.user ?? null));
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Could not restore admin authentication session', error);
        setAdminUser(null);
      } else {
        setAdminUser(getAdminUser(data.session?.user ?? null));
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const establishSession = async (
    credentials: PendingAuth,
    otpCode?: string,
  ): Promise<LoginResult> => {
    const data = await invokeAdminAuth<LoginResponse>({
      action: 'login',
      ...credentials,
      ...(otpCode ? { otpCode } : {}),
    });
    if (data?.success !== true) {
      return { success: false, error: typeof data?.error === 'string' ? data.error : undefined };
    }
    if (data.requires2FA === true) return { success: true, requires2FA: true };
    if (
      typeof data.session?.access_token !== 'string' ||
      typeof data.session?.refresh_token !== 'string'
    ) {
      throw new Error('Admin authentication returned an incomplete session');
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
    if (sessionError) throw sessionError;
    const authenticatedAdmin = getAdminUser(sessionData.session?.user ?? null);
    if (!authenticatedAdmin) {
      await supabase.auth.signOut({ scope: 'local' });
      throw new Error('The authenticated account is not authorized as an administrator');
    }

    setAdminUser(authenticatedAdmin);
    setPendingAuth(null);
    return { success: true };
  };

  const login = async (username: string, password: string): Promise<LoginResult> => {
    const credentials = { username, password };
    const result = await establishSession(credentials);
    if (result.requires2FA) setPendingAuth(credentials);
    return result;
  };

  const verifyOtp = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!pendingAuth) return { success: false, error: 'No pending authentication' };
    const result = await establishSession(pendingAuth, code);
    return { success: result.success, error: result.error };
  };

  const logout = async (): Promise<void> => {
    setPendingAuth(null);
    setAdminUser(null);
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      console.error('Admin sign out failed', error);
      throw error;
    }
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, login, verifyOtp, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
