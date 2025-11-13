-- Add 2FA fields to admin_users table
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS two_factor_secret TEXT,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS backup_codes TEXT[],
ADD COLUMN IF NOT EXISTS created_backup_codes_at TIMESTAMP WITH TIME ZONE;