
-- Add 2FA columns to the admin_users table
ALTER TABLE public.admin_users 
ADD COLUMN two_factor_secret TEXT,
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN backup_codes TEXT[],
ADD COLUMN created_backup_codes_at TIMESTAMP WITH TIME ZONE;

-- Add index for performance on 2FA lookups
CREATE INDEX idx_admin_users_two_factor_enabled ON public.admin_users(two_factor_enabled);
