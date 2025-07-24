
-- Create WhatsApp templates table
CREATE TABLE public.whatsapp_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key TEXT NOT NULL UNIQUE,
  template_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create translations table
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  translation_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(language_code, translation_key)
);

-- Enable RLS on both tables
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for WhatsApp templates
CREATE POLICY "Admin users can manage WhatsApp templates" 
  ON public.whatsapp_templates 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Create policies for translations
CREATE POLICY "Admin users can manage translations" 
  ON public.translations 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Public read access for translations (for the website to use)
CREATE POLICY "Anyone can read translations" 
  ON public.translations 
  FOR SELECT 
  USING (true);

-- Insert default WhatsApp templates
INSERT INTO public.whatsapp_templates (template_key, template_value) VALUES 
('order_status', '🎯 *BWIVOX IPTV Order Update*

Hi {customerName}! 👋

📋 *Order Details:*
• Order ID: {orderId}
• Package: {packageName}
• Status: {status}
• Payment: {paymentStatus}

📞 Need help? Contact our support team!

Thank you for choosing BWIVOX IPTV! 🌟'),

('welcome', '🎉 *Welcome to BWIVOX IPTV!*

Hi {customerName}! 👋

Thank you for purchasing {packageName}! 🎯

🚀 *What''s Next:*
• Your order is being processed
• You''ll receive activation details shortly
• Our support team is ready to help

📞 *Support Contact:*
• WhatsApp: Available 24/7
• Telegram: @bwivoxiptv

Welcome to the BWIVOX family! 🌟'),

('processing', '🔄 *Order Processing*

Hi {customerName}! 👋

Your order {orderId} for {packageName} is being processed.

We''ll notify you once it''s ready!

Thank you for choosing BWIVOX IPTV! 🌟'),

('delivered', '✅ *Order Delivered*

Hi {customerName}! 👋

Your order {orderId} for {packageName} has been delivered successfully!

Enjoy your premium IPTV service! 🎉

Thank you for choosing BWIVOX IPTV! 🌟'),

('cancelled', '❌ *Order Cancelled*

Hi {customerName}! 👋

Your order {orderId} for {packageName} has been cancelled.

If you have any questions, please contact our support team.

Thank you for choosing BWIVOX IPTV! 🌟')

ON CONFLICT (template_key) DO NOTHING;
