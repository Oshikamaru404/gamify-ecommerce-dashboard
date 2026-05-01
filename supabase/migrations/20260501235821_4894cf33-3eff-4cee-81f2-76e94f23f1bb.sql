DROP POLICY IF EXISTS "Anyone can read contact settings" ON public.site_settings;
CREATE POLICY "Anyone can read public settings" ON public.site_settings
  FOR SELECT
  USING (setting_key = ANY (ARRAY['whatsapp_number','telegram_username','crypto_provider']));