// SEO meta translations per page × language
// Languages supported: en (international default), fr, ar

export type SeoLang = 'en' | 'fr' | 'ar';

export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string;
}

export type SeoPageKey =
  | 'home'
  | 'subscription'
  | 'activation'
  | 'reseller'
  | 'products'
  | 'blog'
  | 'blogIptv'
  | 'blogPlayer'
  | 'fullReviews'
  | 'howToBuy'
  | 'support'
  | 'feedback'
  | 'privacy'
  | 'refund';

export const SEO_TRANSLATIONS: Record<SeoPageKey, Record<SeoLang, SeoMeta>> = {
  home: {
    en: {
      title: 'BWIVOX IPTV — Premium 4K IPTV Subscription | 20,000+ Channels & VOD',
      description:
        'Premium 4K IPTV subscription with 20,000+ live channels, full VOD library, 24h free trial and 30-day money-back guarantee. Instant worldwide activation.',
      keywords: 'best IPTV subscription, IPTV 4K premium, IPTV free trial, IPTV with money back guarantee, IPTV 2026',
    },
    fr: {
      title: 'BWIVOX IPTV — Abonnement IPTV Premium 4K | +20 000 Chaînes & VOD',
      description:
        'Abonnement IPTV premium 4K avec +20 000 chaînes en direct, VOD complète, essai gratuit 24h et garantie satisfait ou remboursé 30 jours. Activation instantanée.',
      keywords: 'abonnement IPTV, meilleur IPTV 2026, IPTV 4K premium, IPTV essai gratuit, IPTV avec garantie',
    },
    ar: {
      title: 'BWIVOX IPTV — اشتراك IPTV بريميوم 4K | +20,000 قناة ومكتبة أفلام',
      description:
        'اشتراك IPTV بريميوم بدقة 4K مع أكثر من 20,000 قناة مباشرة، مكتبة أفلام كاملة، تجربة مجانية 24 ساعة وضمان استرداد المال خلال 30 يومًا. تفعيل فوري.',
      keywords: 'اشتراك IPTV, أفضل IPTV, IPTV 4K, تجربة IPTV مجانية, اشتراك IPTV مع ضمان',
    },
  },
  subscription: {
    en: {
      title: 'IPTV Subscription Plans — 1, 3, 6 & 12 Months | BWIVOX',
      description: 'Choose your premium IPTV subscription: 1, 3, 6 or 12 months. 4K quality, 20,000+ channels, full VOD, 30-day money-back guarantee.',
    },
    fr: {
      title: 'Forfaits Abonnement IPTV — 1, 3, 6 et 12 Mois | BWIVOX',
      description: "Choisissez votre abonnement IPTV premium : 1, 3, 6 ou 12 mois. Qualité 4K, +20 000 chaînes, VOD complète, garantie 30 jours satisfait ou remboursé.",
    },
    ar: {
      title: 'باقات اشتراك IPTV — 1، 3، 6 و 12 شهرًا | BWIVOX',
      description: 'اختر اشتراك IPTV البريميوم: 1، 3، 6 أو 12 شهرًا. جودة 4K، أكثر من 20,000 قناة، مكتبة VOD كاملة، ضمان استرداد المال خلال 30 يومًا.',
    },
  },
  activation: {
    en: {
      title: 'IPTV Activation Packages — Instant Setup | BWIVOX',
      description: 'Get your IPTV activation package and start streaming in minutes. Compatible with Smart TV, Firestick, Android, iOS, MAG and more.',
    },
    fr: {
      title: "Packages d'Activation IPTV — Installation Instantanée | BWIVOX",
      description: "Obtenez votre package d'activation IPTV et commencez à regarder en quelques minutes. Compatible Smart TV, Firestick, Android, iOS, MAG et plus.",
    },
    ar: {
      title: 'باقات تفعيل IPTV — تركيب فوري | BWIVOX',
      description: 'احصل على باقة تفعيل IPTV وابدأ المشاهدة في دقائق. متوافق مع Smart TV و Firestick و Android و iOS و MAG وأكثر.',
    },
  },
  reseller: {
    en: {
      title: 'IPTV Reseller Panel — Become an IPTV Reseller | BWIVOX',
      description: 'Launch your own IPTV business with our reseller panel. Buy credits, manage clients, premium support. Best wholesale prices.',
    },
    fr: {
      title: 'Panel Revendeur IPTV — Devenez Revendeur IPTV | BWIVOX',
      description: 'Lancez votre activité IPTV avec notre panel revendeur. Achetez des crédits, gérez vos clients, support premium. Meilleurs prix grossistes.',
    },
    ar: {
      title: 'لوحة موزع IPTV — كن موزع IPTV | BWIVOX',
      description: 'ابدأ نشاطك التجاري في IPTV مع لوحة الموزع لدينا. اشترِ الأرصدة، أدر العملاء، دعم بريميوم. أفضل أسعار الجملة.',
    },
  },
  products: {
    en: { title: 'All IPTV Products — Subscriptions, Activation & Players | BWIVOX', description: 'Browse all BWIVOX IPTV products: subscriptions, activation packages, IPTV players and reseller credits.' },
    fr: { title: 'Tous les Produits IPTV — Abonnements, Activation & Lecteurs | BWIVOX', description: 'Découvrez tous les produits BWIVOX IPTV : abonnements, packages d\'activation, lecteurs IPTV et crédits revendeur.' },
    ar: { title: 'جميع منتجات IPTV — اشتراكات، تفعيل ومشغلات | BWIVOX', description: 'تصفح جميع منتجات BWIVOX IPTV: الاشتراكات، باقات التفعيل، مشغلات IPTV وأرصدة الموزعين.' },
  },
  blog: {
    en: { title: 'IPTV Blog — Tips, Guides & News | BWIVOX', description: 'Latest IPTV guides, installation tutorials, news and reviews from BWIVOX experts.' },
    fr: { title: 'Blog IPTV — Astuces, Guides & Actualités | BWIVOX', description: "Derniers guides IPTV, tutoriels d'installation, actualités et tests par les experts BWIVOX." },
    ar: { title: 'مدونة IPTV — نصائح وأدلة وأخبار | BWIVOX', description: 'أحدث أدلة IPTV ودروس التثبيت والأخبار والمراجعات من خبراء BWIVOX.' },
  },
  blogIptv: {
    en: { title: 'IPTV Subscription Blog — Guides & Reviews | BWIVOX', description: 'Everything about IPTV subscriptions: setup guides, comparisons, troubleshooting and reviews.' },
    fr: { title: 'Blog Abonnement IPTV — Guides & Tests | BWIVOX', description: "Tout sur les abonnements IPTV : guides d'installation, comparatifs, dépannage et tests." },
    ar: { title: 'مدونة اشتراكات IPTV — أدلة ومراجعات | BWIVOX', description: 'كل ما يخص اشتراكات IPTV: أدلة التثبيت، المقارنات، استكشاف الأخطاء والمراجعات.' },
  },
  blogPlayer: {
    en: { title: 'IPTV Players Blog — Best Apps & Setup | BWIVOX', description: 'Discover the best IPTV player apps, setup guides for Smart TV, Firestick, Android and iOS.' },
    fr: { title: 'Blog Lecteurs IPTV — Meilleures Apps & Installation | BWIVOX', description: "Découvrez les meilleures applications de lecteurs IPTV, guides d'installation pour Smart TV, Firestick, Android et iOS." },
    ar: { title: 'مدونة مشغلات IPTV — أفضل التطبيقات والتثبيت | BWIVOX', description: 'اكتشف أفضل تطبيقات مشغلات IPTV وأدلة التثبيت لـ Smart TV و Firestick و Android و iOS.' },
  },
  fullReviews: {
    en: { title: 'Customer Reviews — Real BWIVOX IPTV Feedback', description: 'Read genuine reviews from BWIVOX IPTV customers worldwide. Real experiences, ratings and testimonials.' },
    fr: { title: 'Avis Clients — Témoignages Réels BWIVOX IPTV', description: 'Lisez les avis authentiques des clients BWIVOX IPTV à travers le monde. Expériences réelles, notes et témoignages.' },
    ar: { title: 'آراء العملاء — تقييمات حقيقية لـ BWIVOX IPTV', description: 'اقرأ آراء حقيقية من عملاء BWIVOX IPTV حول العالم. تجارب حقيقية، تقييمات وشهادات.' },
  },
  howToBuy: {
    en: { title: 'How to Buy IPTV — Step-by-Step Guide | BWIVOX', description: 'Learn how to buy your BWIVOX IPTV subscription: payment methods, activation steps and installation.' },
    fr: { title: "Comment Acheter IPTV — Guide Étape par Étape | BWIVOX", description: "Apprenez à acheter votre abonnement BWIVOX IPTV : moyens de paiement, étapes d'activation et installation." },
    ar: { title: 'كيفية شراء IPTV — دليل خطوة بخطوة | BWIVOX', description: 'تعلم كيفية شراء اشتراك BWIVOX IPTV: طرق الدفع، خطوات التفعيل والتثبيت.' },
  },
  support: {
    en: { title: 'IPTV Support — 24/7 Customer Service | BWIVOX', description: 'Get 24/7 support for your BWIVOX IPTV subscription. WhatsApp, email and live chat available.' },
    fr: { title: 'Support IPTV — Service Client 24/7 | BWIVOX', description: 'Obtenez un support 24/7 pour votre abonnement BWIVOX IPTV. WhatsApp, email et chat en direct.' },
    ar: { title: 'دعم IPTV — خدمة العملاء 24/7 | BWIVOX', description: 'احصل على دعم 24/7 لاشتراك BWIVOX IPTV. WhatsApp، البريد الإلكتروني والدردشة المباشرة.' },
  },
  feedback: {
    en: { title: 'Share Your Feedback — BWIVOX IPTV', description: 'Share your experience with BWIVOX IPTV. Your feedback helps us improve our service.' },
    fr: { title: 'Partagez Votre Avis — BWIVOX IPTV', description: 'Partagez votre expérience avec BWIVOX IPTV. Vos retours nous aident à améliorer notre service.' },
    ar: { title: 'شارك رأيك — BWIVOX IPTV', description: 'شارك تجربتك مع BWIVOX IPTV. ملاحظاتك تساعدنا على تحسين خدمتنا.' },
  },
  privacy: {
    en: { title: 'Privacy Policy | BWIVOX IPTV', description: 'BWIVOX IPTV privacy policy: how we collect, use and protect your personal data.' },
    fr: { title: 'Politique de Confidentialité | BWIVOX IPTV', description: 'Politique de confidentialité BWIVOX IPTV : comment nous collectons, utilisons et protégeons vos données personnelles.' },
    ar: { title: 'سياسة الخصوصية | BWIVOX IPTV', description: 'سياسة خصوصية BWIVOX IPTV: كيف نجمع ونستخدم ونحمي بياناتك الشخصية.' },
  },
  refund: {
    en: { title: 'Refund Policy — 30-Day Money-Back Guarantee | BWIVOX', description: '30-day money-back guarantee on all BWIVOX IPTV subscriptions. Read our full refund policy.' },
    fr: { title: 'Politique de Remboursement — Garantie 30 Jours | BWIVOX', description: 'Garantie satisfait ou remboursé de 30 jours sur tous les abonnements BWIVOX IPTV. Consultez notre politique complète.' },
    ar: { title: 'سياسة الاسترداد — ضمان 30 يومًا لاسترداد المال | BWIVOX', description: 'ضمان استرداد المال خلال 30 يومًا على جميع اشتراكات BWIVOX IPTV. اقرأ سياسة الاسترداد الكاملة.' },
  },
};

export const SITE_URL = 'https://bwivox.com';

export function mapToSeoLang(lang: string): SeoLang {
  if (lang === 'fr') return 'fr';
  if (lang === 'ar') return 'ar';
  return 'en';
}

export function getSeoMeta(page: SeoPageKey, lang: string): SeoMeta {
  const seoLang = mapToSeoLang(lang);
  return SEO_TRANSLATIONS[page][seoLang];
}
