
import * as OTPAuth from 'otpauth';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser2FA {
  username: string;
  two_factor_secret?: string;
  two_factor_enabled: boolean;
  backup_codes?: string[];
}

export const verifyTOTP = (secret: string, token: string): boolean => {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: 'Admin Panel',
      label: 'admin',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    const tokenInt = parseInt(token);
    if (isNaN(tokenInt)) {
      return false;
    }

    // Allow a window of 1 step (30 seconds) in both directions
    const result = totp.validate({ token: tokenInt, window: 1 });
    return result !== null;
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return false;
  }
};

export const verifyBackupCode = async (username: string, code: string): Promise<boolean> => {
  try {
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('backup_codes')
      .eq('username', username)
      .single();

    if (error || !adminUser?.backup_codes) {
      return false;
    }

    const backupCodes = adminUser.backup_codes as string[];
    const isValid = backupCodes.includes(code.toUpperCase());

    if (isValid) {
      // Remove the used backup code
      const updatedCodes = backupCodes.filter(c => c !== code.toUpperCase());
      
      await supabase
        .from('admin_users')
        .update({ backup_codes: updatedCodes })
        .eq('username', username);
    }

    return isValid;
  } catch (error) {
    console.error('Error verifying backup code:', error);
    return false;
  }
};

export const getAdminUser2FA = async (username: string): Promise<AdminUser2FA | null> => {
  try {
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('username, two_factor_secret, two_factor_enabled, backup_codes')
      .eq('username', username)
      .single();

    if (error || !adminUser) {
      return null;
    }

    return adminUser as AdminUser2FA;
  } catch (error) {
    console.error('Error fetching admin user 2FA data:', error);
    return null;
  }
};

export const disable2FA = async (username: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({
        two_factor_secret: null,
        two_factor_enabled: false,
        backup_codes: null,
        created_backup_codes_at: null,
      })
      .eq('username', username);

    return !error;
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return false;
  }
};
