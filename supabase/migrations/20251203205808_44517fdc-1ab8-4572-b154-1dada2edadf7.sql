-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can read contact settings" ON public.site_settings;

-- Create the correct permissive policy for public access to contact settings
CREATE POLICY "Anyone can read contact settings"
ON public.site_settings
FOR SELECT
TO public
USING (setting_key = ANY (ARRAY['whatsapp_number'::text, 'telegram_username'::text]));