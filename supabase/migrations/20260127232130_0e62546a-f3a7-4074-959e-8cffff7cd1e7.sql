-- Reset 2FA for admin user
UPDATE admin_users 
SET 
  two_factor_enabled = false,
  two_factor_secret = NULL,
  backup_codes = NULL,
  created_backup_codes_at = NULL
WHERE username = 'admin';