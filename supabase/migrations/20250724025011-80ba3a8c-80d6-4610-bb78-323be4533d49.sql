
-- Check if site_settings table exists and has proper structure
-- Update the site_settings table to ensure proper functionality
UPDATE public.site_settings 
SET updated_at = now() 
WHERE setting_key IN ('whatsapp_number', 'telegram_username');

-- Ensure the admin policy allows proper updates
DROP POLICY IF EXISTS "Admin users can manage site settings" ON public.site_settings;

CREATE POLICY "Admin users can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Add policy for reading site settings (for public access to contact info)
CREATE POLICY "Anyone can read contact settings" 
  ON public.site_settings 
  FOR SELECT 
  USING (setting_key IN ('whatsapp_number', 'telegram_username'));

-- Ensure the settings exist with proper default values
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES 
  ('whatsapp_number', '1234567890'),
  ('telegram_username', 'bwivoxiptv')
ON CONFLICT (setting_key) DO UPDATE SET
  updated_at = now(),
  setting_value = EXCLUDED.setting_value;
