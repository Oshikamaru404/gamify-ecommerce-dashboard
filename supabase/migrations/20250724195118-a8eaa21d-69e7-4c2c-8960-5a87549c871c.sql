
-- First, let's check if there are any constraints or issues with the site_settings table
-- and ensure the upsert functionality works properly

-- Add a unique constraint on setting_key to prevent duplicates
-- This will help ensure upsert works correctly
ALTER TABLE public.site_settings 
ADD CONSTRAINT site_settings_setting_key_unique UNIQUE (setting_key);

-- Add an index for better performance on lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_setting_key 
ON public.site_settings (setting_key);

-- Create a function to safely update or insert site settings
CREATE OR REPLACE FUNCTION public.upsert_site_setting(
  p_setting_key TEXT,
  p_setting_value TEXT
) RETURNS public.site_settings AS $$
DECLARE
  result public.site_settings;
BEGIN
  -- Insert or update the setting
  INSERT INTO public.site_settings (setting_key, setting_value, updated_at)
  VALUES (p_setting_key, p_setting_value, now())
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    updated_at = now()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admins)
GRANT EXECUTE ON FUNCTION public.upsert_site_setting(TEXT, TEXT) TO authenticated;

-- Let's also insert the default values if they don't exist
INSERT INTO public.site_settings (setting_key, setting_value, created_at, updated_at)
VALUES 
  ('whatsapp_number', '1234567890', now(), now()),
  ('telegram_username', 'bwivoxiptv', now(), now())
ON CONFLICT (setting_key) DO NOTHING;
