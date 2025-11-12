-- Create homepage_content table for visual CMS
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  content_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view enabled homepage content"
  ON public.homepage_content
  FOR SELECT
  USING (is_enabled = true);

CREATE POLICY "Admin users can manage homepage content"
  ON public.homepage_content
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON public.homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default homepage content with multilingual support
INSERT INTO public.homepage_content (section_key, content_data, sort_order) VALUES
('hero', '{
  "title": {"en": "Premium IPTV", "fr": "IPTV Premium", "ar": "IPTV متميز"},
  "subtitle": {"en": "Experience the best IPTV service with 8K streaming, 24/7 support, and unlimited content", "fr": "Découvrez le meilleur service IPTV avec streaming 8K, support 24/7 et contenu illimité", "ar": "جرب أفضل خدمة IPTV مع بث 8K ودعم 24/7 ومحتوى غير محدود"},
  "guaranteeText": {"en": "30-Day Money Back Guarantee", "fr": "Garantie de remboursement de 30 jours", "ar": "ضمان استرداد الأموال لمدة 30 يومًا"},
  "ctaButtonText": {"en": "Free Trial", "fr": "Essai gratuit", "ar": "تجربة مجانية"}
}', 1),

('subscriptions', '{
  "title": {"en": "Our Premium Subscriptions", "fr": "Nos abonnements premium", "ar": "اشتراكاتنا المميزة"},
  "warrantyTitle": {"en": "30-Day Service Warranty", "fr": "Garantie de service de 30 jours", "ar": "ضمان الخدمة لمدة 30 يومًا"},
  "warrantyDescription": {"en": "All our subscription packages come with a 30-day warranty. Experience any issues? Contact our support team for immediate assistance or receive a full refund within the warranty period.", "fr": "Tous nos forfaits d abonnement sont assortis d une garantie de 30 jours. Vous rencontrez des problèmes ? Contactez notre équipe d assistance pour une aide immédiate ou recevez un remboursement complet pendant la période de garantie.", "ar": "تأتي جميع باقات الاشتراك لدينا مع ضمان لمدة 30 يومًا. هل تواجه أي مشاكل؟ اتصل بفريق الدعم لدينا للحصول على مساعدة فورية أو احصل على استرداد كامل خلال فترة الضمان."}
}', 2),

('feedback', '{
  "title": {"en": "What Our Customers Say", "fr": "Ce que disent nos clients", "ar": "ماذا يقول عملاؤنا"},
  "subtitle": {"en": "Real feedback from our valued IPTV customers", "fr": "Commentaires réels de nos précieux clients IPTV", "ar": "تعليقات حقيقية من عملائنا الكرام في IPTV"},
  "ctaButtonText": {"en": "Share Your Feedback", "fr": "Partagez vos commentaires", "ar": "شارك رأيك"}
}', 3),

('features', '{
  "title": {"en": "Why Choose BWIVOX?", "fr": "Pourquoi choisir BWIVOX?", "ar": "لماذا تختار BWIVOX؟"},
  "subtitle": {"en": "Experience premium IPTV streaming with unmatched quality and reliability", "fr": "Profitez du streaming IPTV premium avec une qualité et une fiabilité inégalées", "ar": "استمتع ببث IPTV المتميز بجودة وموثوقية لا مثيل لها"},
  "feature1Title": {"en": "Premium Quality", "fr": "Qualité premium", "ar": "جودة ممتازة"},
  "feature1Desc": {"en": "Crystal clear 4K/8K streaming with no buffering", "fr": "Streaming 4K/8K ultra net sans mise en mémoire tampon", "ar": "بث 4K/8K واضح تمامًا بدون تقطيع"},
  "feature2Title": {"en": "Guaranteed Reliability", "fr": "Fiabilité garantie", "ar": "موثوقية مضمونة"},
  "feature2Desc": {"en": "99.9% uptime with 24/7 technical support", "fr": "99,9% de disponibilité avec support technique 24/7", "ar": "99.9٪ وقت التشغيل مع دعم فني على مدار الساعة"},
  "feature3Title": {"en": "Fast Activation", "fr": "Activation rapide", "ar": "تفعيل سريع"},
  "feature3Desc": {"en": "Instant activation within minutes of purchase", "fr": "Activation instantanée en quelques minutes après l achat", "ar": "تفعيل فوري في دقائق من الشراء"}
}', 4),

('cta', '{
  "title": {"en": "Ready to Get Started?", "fr": "Prêt à commencer?", "ar": "هل أنت مستعد للبدء؟"},
  "subtitle": {"en": "Join thousands of satisfied customers enjoying premium IPTV", "fr": "Rejoignez des milliers de clients satisfaits qui profitent de l IPTV premium", "ar": "انضم إلى آلاف العملاء الراضين الذين يستمتعون بـ IPTV المتميز"}
}', 5),

('why_choose_cards', '{
  "cards": [
    {
      "icon": "⚡",
      "title": {"en": "Ultra Fast", "fr": "Ultra rapide", "ar": "سريع جداً"},
      "description": {"en": "Streaming without buffering with our optimized infrastructure", "fr": "Streaming sans mise en mémoire tampon avec notre infrastructure optimisée", "ar": "البث بدون تقطيع مع بنيتنا التحتية المحسّنة"}
    },
    {
      "icon": "🔒",
      "title": {"en": "Maximum Security", "fr": "Sécurité maximale", "ar": "أقصى أمان"},
      "description": {"en": "Encrypted connections and guaranteed private browsing", "fr": "Connexions cryptées et navigation privée garantie", "ar": "اتصالات مشفرة وتصفح خاص مضمون"}
    },
    {
      "icon": "💬",
      "title": {"en": "24/7 Support", "fr": "Support 24/7", "ar": "دعم 24/7"},
      "description": {"en": "Our technical team is available at all times", "fr": "Notre équipe technique est disponible à tout moment", "ar": "فريقنا الفني متاح في جميع الأوقات"}
    },
    {
      "icon": "💻",
      "title": {"en": "Multi-Device", "fr": "Multi-appareils", "ar": "متعدد الأجهزة"},
      "description": {"en": "Compatible with Smart TV, Android, iOS, PC and Mac", "fr": "Compatible avec Smart TV, Android, iOS, PC et Mac", "ar": "متوافق مع Smart TV وأندرويد وiOS وPC وMac"}
    }
  ]
}', 6),

('testimonials', '{
  "title": {"en": "99% satisfied customers", "fr": "99% de clients satisfaits", "ar": "99٪ من العملاء الراضين"},
  "subtitle": {"en": "Join our community of satisfied viewers", "fr": "Rejoignez notre communauté de téléspectateurs satisfaits", "ar": "انضم إلى مجتمع المشاهدين الراضين لدينا"},
  "testimonials": [
    {
      "name": "Marie D.",
      "text": {"en": "The image quality is exceptional, even on international channels. I highly recommend!", "fr": "La qualité de l image est exceptionnelle, même sur les chaînes internationales. Je recommande vivement!", "ar": "جودة الصورة استثنائية، حتى على القنوات الدولية. أوصي بشدة!"},
      "avatar": "https://placekitten.com/100/100"
    },
    {
      "name": "Pierre L.",
      "text": {"en": "The value for money is unbeatable. Over 8000 channels and an impressive VOD catalog.", "fr": "Le rapport qualité-prix est imbattable. Plus de 8000 chaînes et un catalogue VOD impressionnant.", "ar": "قيمة المال لا تقبل المنافسة. أكثر من 8000 قناة وكتالوج VOD مذهل."},
      "avatar": "https://placekitten.com/101/101"
    },
    {
      "name": "Sophie M.",
      "text": {"en": "The interface is intuitive and customer support is very responsive. Perfect for the whole family.", "fr": "L interface est intuitive et le support client est très réactif. Parfait pour toute la famille.", "ar": "الواجهة بديهية ودعم العملاء سريع الاستجابة. مثالي للعائلة بأكملها."},
      "avatar": "https://placekitten.com/102/102"
    }
  ]
}', 7);
