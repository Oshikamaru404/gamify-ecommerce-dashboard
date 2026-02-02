-- Reset 2FA for admin user to allow login
UPDATE public.admin_users 
SET 
  two_factor_enabled = false,
  two_factor_secret = NULL,
  backup_codes = NULL
WHERE username = 'admin';