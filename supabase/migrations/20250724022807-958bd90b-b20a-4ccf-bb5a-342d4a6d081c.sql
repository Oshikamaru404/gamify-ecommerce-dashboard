
-- Add settings table to store WhatsApp and Telegram contact information
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to manage settings
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

-- Insert default WhatsApp and Telegram settings
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES 
  ('whatsapp_number', '1234567890'),
  ('telegram_username', 'bwivoxiptv')
ON CONFLICT (setting_key) DO NOTHING;
