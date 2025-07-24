
-- Create the translated_content table
CREATE TABLE public.translated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL,
  content_value TEXT NOT NULL,
  language_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique combination of content_key and language_code
  UNIQUE(content_key, language_code)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.translated_content ENABLE ROW LEVEL SECURITY;

-- Create policies for the translated_content table
CREATE POLICY "Admin users can manage translated content" 
  ON public.translated_content 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can read translated content" 
  ON public.translated_content 
  FOR SELECT 
  USING (true);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION public.update_translated_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_translated_content_updated_at
    BEFORE UPDATE ON public.translated_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_translated_content_updated_at();

-- Insert initial translated content for common UI elements
INSERT INTO public.translated_content (content_key, content_value, language_code) VALUES
-- Navigation items
('nav_home', 'Home', 'en'),
('nav_home', 'Accueil', 'fr'),
('nav_home', 'Inicio', 'es'),
('nav_home', 'Startseite', 'de'),
('nav_home', 'Casa', 'it'),
('nav_home', 'الرئيسية', 'ar'),

('nav_subscription', 'Subscription', 'en'),
('nav_subscription', 'Abonnement', 'fr'),
('nav_subscription', 'Suscripción', 'es'),
('nav_subscription', 'Abonnement', 'de'),
('nav_subscription', 'Abbonamento', 'it'),
('nav_subscription', 'الاشتراك', 'ar'),

('nav_activation', 'Activation', 'en'),
('nav_activation', 'Activation', 'fr'),
('nav_activation', 'Activación', 'es'),
('nav_activation', 'Aktivierung', 'de'),
('nav_activation', 'Attivazione', 'it'),
('nav_activation', 'التفعيل', 'ar'),

('nav_reseller', 'Reseller', 'en'),
('nav_reseller', 'Revendeur', 'fr'),
('nav_reseller', 'Revendedor', 'es'),
('nav_reseller', 'Wiederverkäufer', 'de'),
('nav_reseller', 'Rivenditore', 'it'),
('nav_reseller', 'المورد', 'ar'),

('nav_iptv_panel', 'IPTV Panel', 'en'),
('nav_iptv_panel', 'Panel IPTV', 'fr'),
('nav_iptv_panel', 'Panel IPTV', 'es'),
('nav_iptv_panel', 'IPTV Panel', 'de'),
('nav_iptv_panel', 'Panel IPTV', 'it'),
('nav_iptv_panel', 'لوحة IPTV', 'ar'),

('nav_player_panel', 'Player Panel', 'en'),
('nav_player_panel', 'Panel Player', 'fr'),
('nav_player_panel', 'Panel Player', 'es'),
('nav_player_panel', 'Player Panel', 'de'),
('nav_player_panel', 'Panel Player', 'it'),
('nav_player_panel', 'لوحة المشغل', 'ar'),

('nav_reviews', 'Reviews', 'en'),
('nav_reviews', 'Avis', 'fr'),
('nav_reviews', 'Reseñas', 'es'),
('nav_reviews', 'Bewertungen', 'de'),
('nav_reviews', 'Recensioni', 'it'),
('nav_reviews', 'التقييمات', 'ar'),

('nav_support', 'Support', 'en'),
('nav_support', 'Support', 'fr'),
('nav_support', 'Soporte', 'es'),
('nav_support', 'Support', 'de'),
('nav_support', 'Supporto', 'it'),
('nav_support', 'الدعم', 'ar'),

('nav_blog', 'Blog', 'en'),
('nav_blog', 'Blog', 'fr'),
('nav_blog', 'Blog', 'es'),
('nav_blog', 'Blog', 'de'),
('nav_blog', 'Blog', 'it'),
('nav_blog', 'المدونة', 'ar'),

-- Common UI elements
('button_buy_now', 'Buy Now', 'en'),
('button_buy_now', 'Acheter maintenant', 'fr'),
('button_buy_now', 'Comprar ahora', 'es'),
('button_buy_now', 'Jetzt kaufen', 'de'),
('button_buy_now', 'Acquista ora', 'it'),
('button_buy_now', 'اشتر الآن', 'ar'),

('button_learn_more', 'Learn More', 'en'),
('button_learn_more', 'En savoir plus', 'fr'),
('button_learn_more', 'Saber más', 'es'),
('button_learn_more', 'Mehr erfahren', 'de'),
('button_learn_more', 'Saperne di più', 'it'),
('button_learn_more', 'اعرف المزيد', 'ar'),

('button_contact_us', 'Contact Us', 'en'),
('button_contact_us', 'Contactez-nous', 'fr'),
('button_contact_us', 'Contáctanos', 'es'),
('button_contact_us', 'Kontaktieren Sie uns', 'de'),
('button_contact_us', 'Contattaci', 'it'),
('button_contact_us', 'اتصل بنا', 'ar'),

-- Service titles
('service_warranty_30_days', '30 Days Warranty', 'en'),
('service_warranty_30_days', 'Garantie 30 jours', 'fr'),
('service_warranty_30_days', 'Garantía 30 días', 'es'),
('service_warranty_30_days', '30 Tage Garantie', 'de'),
('service_warranty_30_days', 'Garanzia 30 giorni', 'it'),
('service_warranty_30_days', 'ضمان 30 يوم', 'ar'),

('device_activation_service', 'Device Activation Service', 'en'),
('device_activation_service', 'Service d\'activation d\'appareil', 'fr'),
('device_activation_service', 'Servicio de activación de dispositivos', 'es'),
('device_activation_service', 'Geräteaktivierungsservice', 'de'),
('device_activation_service', 'Servizio di attivazione dispositivo', 'it'),
('device_activation_service', 'خدمة تفعيل الأجهزة', 'ar'),

('activation_packages_12_months', '12 Months Activation Packages', 'en'),
('activation_packages_12_months', 'Forfaits d\'activation 12 mois', 'fr'),
('activation_packages_12_months', 'Paquetes de activación 12 meses', 'es'),
('activation_packages_12_months', '12 Monate Aktivierungspakete', 'de'),
('activation_packages_12_months', 'Pacchetti attivazione 12 mesi', 'it'),
('activation_packages_12_months', 'باقات التفعيل 12 شهر', 'ar'),

-- Section titles
('subscription_title', 'Subscription Packages', 'en'),
('subscription_title', 'Forfaits d\'abonnement', 'fr'),
('subscription_title', 'Paquetes de suscripción', 'es'),
('subscription_title', 'Abonnement-Pakete', 'de'),
('subscription_title', 'Pacchetti abbonamento', 'it'),
('subscription_title', 'باقات الاشتراك', 'ar'),

('activation_title', 'Activation Services', 'en'),
('activation_title', 'Services d\'activation', 'fr'),
('activation_title', 'Servicios de activación', 'es'),
('activation_title', 'Aktivierungsdienste', 'de'),
('activation_title', 'Servizi di attivazione', 'it'),
('activation_title', 'خدمات التفعيل', 'ar'),

('reseller_title', 'Reseller Program', 'en'),
('reseller_title', 'Programme revendeur', 'fr'),
('reseller_title', 'Programa de revendedor', 'es'),
('reseller_title', 'Wiederverkäuferprogramm', 'de'),
('reseller_title', 'Programma rivenditore', 'it'),
('reseller_title', 'برنامج المورد', 'ar'),

('panel_iptv_title', 'IPTV Panel', 'en'),
('panel_iptv_title', 'Panel IPTV', 'fr'),
('panel_iptv_title', 'Panel IPTV', 'es'),
('panel_iptv_title', 'IPTV Panel', 'de'),
('panel_iptv_title', 'Panel IPTV', 'it'),
('panel_iptv_title', 'لوحة IPTV', 'ar'),

('panel_player_title', 'Player Panel', 'en'),
('panel_player_title', 'Panel Player', 'fr'),
('panel_player_title', 'Panel Player', 'es'),
('panel_player_title', 'Player Panel', 'de'),
('panel_player_title', 'Panel Player', 'it'),
('panel_player_title', 'لوحة المشغل', 'ar'),

('why_choose_us_title', 'Why Choose Us', 'en'),
('why_choose_us_title', 'Pourquoi nous choisir', 'fr'),
('why_choose_us_title', 'Por qué elegirnos', 'es'),
('why_choose_us_title', 'Warum uns wählen', 'de'),
('why_choose_us_title', 'Perché scegliere noi', 'it'),
('why_choose_us_title', 'لماذا تختارنا', 'ar'),

('testimonials_title', 'Customer Testimonials', 'en'),
('testimonials_title', 'Témoignages clients', 'fr'),
('testimonials_title', 'Testimonios de clientes', 'es'),
('testimonials_title', 'Kundenbewertungen', 'de'),
('testimonials_title', 'Testimonianze clienti', 'it'),
('testimonials_title', 'شهادات العملاء', 'ar'),

-- Footer content
('footer_description', 'Your trusted partner for premium IPTV and streaming services', 'en'),
('footer_description', 'Votre partenaire de confiance pour les services IPTV et streaming premium', 'fr'),
('footer_description', 'Su socio de confianza para servicios IPTV y streaming premium', 'es'),
('footer_description', 'Ihr vertrauenswürdiger Partner für Premium-IPTV und Streaming-Services', 'de'),
('footer_description', 'Il vostro partner di fiducia per servizi IPTV e streaming premium', 'it'),
('footer_description', 'شريكك الموثوق لخدمات IPTV والبث المتميزة', 'ar'),

('contact_us_title', 'Contact Us', 'en'),
('contact_us_title', 'Contactez-nous', 'fr'),
('contact_us_title', 'Contáctanos', 'es'),
('contact_us_title', 'Kontaktieren Sie uns', 'de'),
('contact_us_title', 'Contattaci', 'it'),
('contact_us_title', 'اتصل بنا', 'ar'),

('free_trial_text', 'Free Trial Available', 'en'),
('free_trial_text', 'Essai gratuit disponible', 'fr'),
('free_trial_text', 'Prueba gratuita disponible', 'es'),
('free_trial_text', 'Kostenlose Testversion verfügbar', 'de'),
('free_trial_text', 'Prova gratuita disponibile', 'it'),
('free_trial_text', 'تجربة مجانية متاحة', 'ar');
