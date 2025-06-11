
export type Language = 'fr' | 'en' | 'es' | 'ar' | 'de';

export interface Translations {
  // Navigation (gardé en anglais pour cohérence)
  home: string;
  subscription: string;
  activation: string;
  reseller: string;
  panelIptv: string;
  playerPanel: string;
  
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  freeTrial: string;
  tryFree: string;
  contact: string;
  
  // Subscriptions
  subscriptionsTitle: string;
  ourSubscriptions: string;
  loadingSubscriptions: string;
  noSubscriptionsAvailable: string;
  noSubscriptionsMessage: string;
  
  // Features
  ultraHd4k: string;
  support247: string;
  instantActivation: string;
  premiumQuality: string;
  premiumQualityDesc: string;
  guaranteedReliability: string;
  guaranteedReliabilityDesc: string;
  fastActivation: string;
  fastActivationDesc: string;
  
  // Why Choose
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  
  // CTA
  ctaTitle: string;
  ctaSubtitle: string;
  
  // Common
  backToHome: string;
}

const translations: Record<Language, Translations> = {
  fr: {
    // Navigation (en anglais pour cohérence)
    home: 'Home',
    subscription: 'Subscription IPTV',
    activation: 'Activation Player',
    reseller: 'Panel Reseller',
    panelIptv: 'Panel IPTV',
    playerPanel: 'Panel Player',
    
    // Hero section
    heroTitle: 'Services IPTV',
    heroSubtitle: 'Profitez de milliers de chaînes en direct, films et séries en qualité 8K Ultra HD avec nos services IPTV premium.',
    freeTrial: 'Essai Gratuit',
    tryFree: 'Bonjour, je souhaite bénéficier de l\'essai gratuit',
    contact: 'Pouvez-vous m\'aider',
    
    // Subscriptions
    subscriptionsTitle: 'Nos Abonnements IPTV',
    ourSubscriptions: 'Nos Abonnements',
    loadingSubscriptions: 'Chargement des abonnements...',
    noSubscriptionsAvailable: 'Aucun abonnement disponible',
    noSubscriptionsMessage: 'Aucun abonnement n\'est actuellement disponible. Veuillez revenir plus tard.',
    
    // Features
    ultraHd4k: 'Ultra HD 4K/8K',
    support247: 'Support 24/7',
    instantActivation: 'Activation Instantanée',
    premiumQuality: 'Qualité Premium',
    premiumQualityDesc: 'Streaming en qualité 4K/8K avec une technologie anti-gel avancée.',
    guaranteedReliability: 'Fiabilité Garantie',
    guaranteedReliabilityDesc: 'Serveurs haute performance avec un uptime de 99.9%.',
    fastActivation: 'Activation Rapide',
    fastActivationDesc: 'Votre service est activé instantanément après le paiement.',
    
    // Why Choose
    whyChooseTitle: 'Pourquoi Choisir BWIVOX ?',
    whyChooseSubtitle: 'Découvrez les avantages de nos services IPTV premium.',
    
    // CTA
    ctaTitle: 'Prêt à commencer ?',
    ctaSubtitle: 'Rejoignez des milliers de clients satisfaits dès aujourd\'hui.',
    
    // Common
    backToHome: 'Retour à l\'accueil',
  },
  en: {
    // Navigation (en anglais pour cohérence)
    home: 'Home',
    subscription: 'Subscription IPTV',
    activation: 'Activation Player',
    reseller: 'Panel Reseller',
    panelIptv: 'Panel IPTV',
    playerPanel: 'Panel Player',
    
    // Hero section
    heroTitle: 'IPTV Services',
    heroSubtitle: 'Enjoy thousands of live channels, movies and series in 8K Ultra HD quality with our premium IPTV services.',
    freeTrial: 'Free Trial',
    tryFree: 'Hello, I would like to benefit from the free trial',
    contact: 'Can you help me',
    
    // Subscriptions
    subscriptionsTitle: 'Our IPTV Subscriptions',
    ourSubscriptions: 'Our Subscriptions',
    loadingSubscriptions: 'Loading subscriptions...',
    noSubscriptionsAvailable: 'No subscriptions available',
    noSubscriptionsMessage: 'No subscriptions are currently available. Please check back later.',
    
    // Features
    ultraHd4k: 'Ultra HD 4K/8K',
    support247: '24/7 Support',
    instantActivation: 'Instant Activation',
    premiumQuality: 'Premium Quality',
    premiumQualityDesc: '4K/8K quality streaming with advanced anti-freeze technology.',
    guaranteedReliability: 'Guaranteed Reliability',
    guaranteedReliabilityDesc: 'High performance servers with 99.9% uptime.',
    fastActivation: 'Fast Activation',
    fastActivationDesc: 'Your service is activated instantly after payment.',
    
    // Why Choose
    whyChooseTitle: 'Why Choose BWIVOX?',
    whyChooseSubtitle: 'Discover the advantages of our premium IPTV services.',
    
    // CTA
    ctaTitle: 'Ready to get started?',
    ctaSubtitle: 'Join thousands of satisfied customers today.',
    
    // Common
    backToHome: 'Back to home',
  },
  es: {
    // Navigation (en anglais pour cohérence)
    home: 'Home',
    subscription: 'Subscription IPTV',
    activation: 'Activation Player',
    reseller: 'Panel Reseller',
    panelIptv: 'Panel IPTV',
    playerPanel: 'Panel Player',
    
    // Hero section
    heroTitle: 'Servicios IPTV',
    heroSubtitle: 'Disfruta de miles de canales en vivo, películas y series en calidad 8K Ultra HD con nuestros servicios IPTV premium.',
    freeTrial: 'Prueba Gratuita',
    tryFree: 'Hola, me gustaría beneficiarme de la prueba gratuita',
    contact: 'Puedes ayudarme',
    
    // Subscriptions
    subscriptionsTitle: 'Nuestras Suscripciones IPTV',
    ourSubscriptions: 'Nuestras Suscripciones',
    loadingSubscriptions: 'Cargando suscripciones...',
    noSubscriptionsAvailable: 'No hay suscripciones disponibles',
    noSubscriptionsMessage: 'No hay suscripciones disponibles actualmente. Por favor, vuelve más tarde.',
    
    // Features
    ultraHd4k: 'Ultra HD 4K/8K',
    support247: 'Soporte 24/7',
    instantActivation: 'Activación Instantánea',
    premiumQuality: 'Calidad Premium',
    premiumQualityDesc: 'Streaming en calidad 4K/8K con tecnología anti-congelación avanzada.',
    guaranteedReliability: 'Fiabilidad Garantizada',
    guaranteedReliabilityDesc: 'Servidores de alto rendimiento con 99.9% de tiempo activo.',
    fastActivation: 'Activación Rápida',
    fastActivationDesc: 'Tu servicio se activa instantáneamente después del pago.',
    
    // Why Choose
    whyChooseTitle: '¿Por qué elegir BWIVOX?',
    whyChooseSubtitle: 'Descubre las ventajas de nuestros servicios IPTV premium.',
    
    // CTA
    ctaTitle: '¿Listo para empezar?',
    ctaSubtitle: 'Únete a miles de clientes satisfechos hoy.',
    
    // Common
    backToHome: 'Volver al inicio',
  },
  ar: {
    // Navigation (en anglais pour cohérence)
    home: 'Home',
    subscription: 'Subscription IPTV',
    activation: 'Activation Player',
    reseller: 'Panel Reseller',
    panelIptv: 'Panel IPTV',
    playerPanel: 'Panel Player',
    
    // Hero section
    heroTitle: 'خدمات IPTV',
    heroSubtitle: 'استمتع بآلاف القنوات المباشرة والأفلام والمسلسلات بجودة 8K Ultra HD مع خدمات IPTV المميزة لدينا.',
    freeTrial: 'تجربة مجانية',
    tryFree: 'مرحبا، أود الاستفادة من التجربة المجانية',
    contact: 'هل يمكنك مساعدتي',
    
    // Subscriptions
    subscriptionsTitle: 'اشتراكات IPTV لدينا',
    ourSubscriptions: 'اشتراكاتنا',
    loadingSubscriptions: 'جاري تحميل الاشتراكات...',
    noSubscriptionsAvailable: 'لا توجد اشتراكات متاحة',
    noSubscriptionsMessage: 'لا توجد اشتراكات متاحة حاليًا. يرجى المراجعة لاحقًا.',
    
    // Features
    ultraHd4k: 'Ultra HD 4K/8K',
    support247: 'دعم 24/7',
    instantActivation: 'تفعيل فوري',
    premiumQuality: 'جودة مميزة',
    premiumQualityDesc: 'بث بجودة 4K/8K مع تقنية مكافحة التجمد المتقدمة.',
    guaranteedReliability: 'موثوقية مضمونة',
    guaranteedReliabilityDesc: 'خوادم عالية الأداء مع وقت تشغيل 99.9%.',
    fastActivation: 'تفعيل سريع',
    fastActivationDesc: 'يتم تفعيل خدمتك فورًا بعد الدفع.',
    
    // Why Choose
    whyChooseTitle: 'لماذا تختار BWIVOX؟',
    whyChooseSubtitle: 'اكتشف مزايا خدمات IPTV المميزة لدينا.',
    
    // CTA
    ctaTitle: 'مستعد للبدء؟',
    ctaSubtitle: 'انضم إلى آلاف العملاء الراضين اليوم.',
    
    // Common
    backToHome: 'العودة إلى الرئيسية',
  },
  de: {
    // Navigation (en anglais pour cohérence)
    home: 'Home',
    subscription: 'Subscription IPTV',
    activation: 'Activation Player',
    reseller: 'Panel Reseller',
    panelIptv: 'Panel IPTV',
    playerPanel: 'Panel Player',
    
    // Hero section
    heroTitle: 'IPTV Services',
    heroSubtitle: 'Genießen Sie Tausende von Live-Kanälen, Filmen und Serien in 8K Ultra HD-Qualität mit unseren Premium-IPTV-Services.',
    freeTrial: 'Kostenlose Testversion',
    tryFree: 'Hallo, ich möchte von der kostenlosen Testversion profitieren',
    contact: 'Können Sie mir helfen',
    
    // Subscriptions
    subscriptionsTitle: 'Unsere IPTV-Abonnements',
    ourSubscriptions: 'Unsere Abonnements',
    loadingSubscriptions: 'Abonnements werden geladen...',
    noSubscriptionsAvailable: 'Keine Abonnements verfügbar',
    noSubscriptionsMessage: 'Derzeit sind keine Abonnements verfügbar. Bitte schauen Sie später wieder vorbei.',
    
    // Features
    ultraHd4k: 'Ultra HD 4K/8K',
    support247: '24/7 Support',
    instantActivation: 'Sofortige Aktivierung',
    premiumQuality: 'Premium-Qualität',
    premiumQualityDesc: '4K/8K-Qualitäts-Streaming mit fortschrittlicher Anti-Freeze-Technologie.',
    guaranteedReliability: 'Garantierte Zuverlässigkeit',
    guaranteedReliabilityDesc: 'Hochleistungsserver mit 99,9% Betriebszeit.',
    fastActivation: 'Schnelle Aktivierung',
    fastActivationDesc: 'Ihr Service wird sofort nach der Zahlung aktiviert.',
    
    // Why Choose
    whyChooseTitle: 'Warum BWIVOX wählen?',
    whyChooseSubtitle: 'Entdecken Sie die Vorteile unserer Premium-IPTV-Services.',
    
    // CTA
    ctaTitle: 'Bereit anzufangen?',
    ctaSubtitle: 'Werden Sie noch heute einer von Tausenden zufriedener Kunden.',
    
    // Common
    backToHome: 'Zurück zur Startseite',
  },
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.fr;
};
