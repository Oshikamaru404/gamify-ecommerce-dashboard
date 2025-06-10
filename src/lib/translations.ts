
export type Language = 'fr' | 'en' | 'es' | 'ar' | 'de';

export interface Translations {
  // Navigation
  home: string;
  subscription: string;
  activation: string;
  reseller: string;
  iptvPanel: string;
  playerPanel: string;
  support: string;
  howToBuy: string;
  blog: string;
  
  // Common buttons and actions
  buyNow: string;
  tryFree: string;
  contact: string;
  viewMore: string;
  backToHome: string;
  startPurchase: string;
  requestPanel: string;
  
  // Home page
  heroTitle: string;
  heroSubtitle: string;
  freeTrial: string;
  subscriptionsTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  
  // Subscription page
  ourSubscriptions: string;
  loadingSubscriptions: string;
  noSubscriptionsAvailable: string;
  noSubscriptionsMessage: string;
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  premiumQuality: string;
  premiumQualityDesc: string;
  guaranteedReliability: string;
  guaranteedReliabilityDesc: string;
  fastActivation: string;
  fastActivationDesc: string;
  
  // Features
  ultraHd4k: string;
  support247: string;
  instantActivation: string;
  
  // Subscription features
  ultraHdStreaming: string;
  liveChannels: string;
  moviesVod: string;
  antiFreeze: string;
  support24_7: string;
  sportsPackages: string;
  movieCollection: string;
  fastServers: string;
  premiumTech: string;
  globalContent: string;
  premiumSupport: string;
  vodLibrary: string;
  stableConnection: string;
  multiPlatform: string;
  bigEntertainment: string;
  sportsMovies: string;
  service24_7: string;
  
  // Footer
  footerDescription: string;
  services: string;
  information: string;
  allRightsReserved: string;
  
  // How to buy
  howToBuyTitle: string;
  howToBuySubtitle: string;
  contactUs: string;
  contactUsDesc: string;
  payment: string;
  paymentDesc: string;
  reception: string;
  receptionDesc: string;
  activationStep: string;
  activationStepDesc: string;
  paymentMethods: string;
  creditCard: string;
  creditCardDesc: string;
  paypal: string;
  paypalDesc: string;
  bankTransfer: string;
  bankTransferDesc: string;
  
  // Blog
  blogTitle: string;
  blogSubtitle: string;
  stayInformed: string;
  stayInformedDesc: string;
  
  // IPTV Panel
  iptvPanelTitle: string;
  iptvPanelSubtitle: string;
  dedicatedServers: string;
  dedicatedServersDesc: string;
  configuration: string;
  configurationDesc: string;
  monitoring: string;
  monitoringDesc: string;
  
  // Language selector
  selectLanguage: string;
  
  // Common
  month: string;
  perMonth: string;
  currency: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    // Navigation
    home: 'Accueil',
    subscription: 'Abonnement',
    activation: 'Activation',
    reseller: 'Revendeur',
    iptvPanel: 'Panel IPTV',
    playerPanel: 'Panel Player',
    support: 'Support',
    howToBuy: 'Comment Acheter',
    blog: 'Blog',
    
    // Common buttons and actions
    buyNow: 'ACHETEZ MAINTENANT',
    tryFree: 'Essai Gratuit',
    contact: 'Contacter',
    viewMore: 'Voir plus de détails',
    backToHome: 'Retour à l\'accueil',
    startPurchase: 'Commencer l\'achat',
    requestPanel: 'Demander un Panel IPTV',
    
    // Home page
    heroTitle: 'BWIVOX IPTV',
    heroSubtitle: 'Découvrez nos services IPTV premium avec des milliers de chaînes en direct, films et séries en qualité 8K Ultra HD',
    freeTrial: 'Essai Gratuit',
    subscriptionsTitle: 'Nos Abonnements IPTV',
    ctaTitle: 'Prêt à commencer votre expérience IPTV ?',
    ctaSubtitle: 'Contactez-nous maintenant pour obtenir votre abonnement',
    
    // Subscription page
    ourSubscriptions: 'Nos Abonnements',
    loadingSubscriptions: 'Chargement des abonnements...',
    noSubscriptionsAvailable: 'Aucun abonnement disponible',
    noSubscriptionsMessage: 'Les abonnements seront bientôt disponibles.',
    whyChooseTitle: 'Pourquoi choisir nos services IPTV ?',
    whyChooseSubtitle: 'Des fonctionnalités premium pour une expérience de streaming exceptionnelle',
    premiumQuality: 'Qualité Premium',
    premiumQualityDesc: 'Profitez de vos contenus en 4K Ultra HD avec une qualité d\'image exceptionnelle',
    guaranteedReliability: 'Fiabilité Garantie',
    guaranteedReliabilityDesc: 'Service stable avec 99.9% de temps de fonctionnement et support technique 24/7',
    fastActivation: 'Activation Rapide',
    fastActivationDesc: 'Votre abonnement est activé instantanément après confirmation du paiement',
    
    // Features
    ultraHd4k: 'Qualité 4K Ultra HD',
    support247: 'Support 24/7',
    instantActivation: 'Activation Instantanée',
    
    // Subscription features
    ultraHdStreaming: 'Streaming Ultra HD',
    liveChannels: 'Chaînes en Direct',
    moviesVod: 'Films & Séries VOD',
    antiFreeze: 'Technologie Anti-Freeze',
    support24_7: 'Support 24/7',
    sportsPackages: 'Packages Sports',
    movieCollection: 'Collection de Films',
    fastServers: 'Serveurs Rapides',
    premiumTech: 'Technologie Premium',
    globalContent: 'Contenu Global',
    premiumSupport: 'Support Premium',
    vodLibrary: 'Bibliothèque VOD',
    stableConnection: 'Connexion Stable',
    multiPlatform: 'Multi-Plateforme',
    bigEntertainment: 'Grand Divertissement',
    sportsMovies: 'Sports & Films',
    service24_7: 'Service 24/7',
    
    // Footer
    footerDescription: 'Services IPTV premium avec des milliers de chaînes en direct, films et séries en qualité 8K Ultra HD.',
    services: 'Services',
    information: 'Information',
    allRightsReserved: 'Tous droits réservés.',
    
    // How to buy
    howToBuyTitle: 'Comment Acheter',
    howToBuySubtitle: 'Processus simple et rapide pour obtenir votre abonnement IPTV',
    contactUs: 'Contactez-nous',
    contactUsDesc: 'Contactez-nous via WhatsApp pour choisir votre abonnement',
    payment: 'Paiement',
    paymentDesc: 'Effectuez le paiement de manière sécurisée',
    reception: 'Réception',
    receptionDesc: 'Recevez vos identifiants et liens de téléchargement',
    activationStep: 'Activation',
    activationStepDesc: 'Installation et activation avec notre support',
    paymentMethods: 'Méthodes de Paiement',
    creditCard: 'Carte Bancaire',
    creditCardDesc: 'Paiement sécurisé par carte',
    paypal: 'PayPal',
    paypalDesc: 'Paiement via PayPal',
    bankTransfer: 'Virement',
    bankTransferDesc: 'Virement bancaire',
    
    // Blog
    blogTitle: 'Blog IPTV',
    blogSubtitle: 'Actualités, guides et conseils pour optimiser votre expérience IPTV',
    stayInformed: 'Restez informé',
    stayInformedDesc: 'Suivez notre blog pour les dernières actualités IPTV et nos conseils d\'experts',
    
    // IPTV Panel
    iptvPanelTitle: 'Panel IPTV',
    iptvPanelSubtitle: 'Solution complète de panel IPTV pour gérer votre service de streaming professionnel.',
    dedicatedServers: 'Serveurs Dédiés',
    dedicatedServersDesc: 'Infrastructure haute performance avec uptime 99.9%',
    configuration: 'Configuration',
    configurationDesc: 'Interface intuitive pour configurer vos services',
    monitoring: 'Monitoring',
    monitoringDesc: 'Surveillance en temps réel de vos services',
    
    // Language selector
    selectLanguage: 'Choisir la langue',
    
    // Common
    month: 'mois',
    perMonth: '/ mois',
    currency: '€',
  },
  
  en: {
    // Navigation
    home: 'Home',
    subscription: 'Subscription',
    activation: 'Activation',
    reseller: 'Reseller',
    iptvPanel: 'IPTV Panel',
    playerPanel: 'Player Panel',
    support: 'Support',
    howToBuy: 'How to Buy',
    blog: 'Blog',
    
    // Common buttons and actions
    buyNow: 'BUY NOW',
    tryFree: 'Free Trial',
    contact: 'Contact',
    viewMore: 'View more details',
    backToHome: 'Back to home',
    startPurchase: 'Start purchase',
    requestPanel: 'Request IPTV Panel',
    
    // Home page
    heroTitle: 'BWIVOX IPTV',
    heroSubtitle: 'Discover our premium IPTV services with thousands of live channels, movies and series in 8K Ultra HD quality',
    freeTrial: 'Free Trial',
    subscriptionsTitle: 'Our IPTV Subscriptions',
    ctaTitle: 'Ready to start your IPTV experience?',
    ctaSubtitle: 'Contact us now to get your subscription',
    
    // Subscription page
    ourSubscriptions: 'Our Subscriptions',
    loadingSubscriptions: 'Loading subscriptions...',
    noSubscriptionsAvailable: 'No subscriptions available',
    noSubscriptionsMessage: 'Subscriptions will be available soon.',
    whyChooseTitle: 'Why choose our IPTV services?',
    whyChooseSubtitle: 'Premium features for an exceptional streaming experience',
    premiumQuality: 'Premium Quality',
    premiumQualityDesc: 'Enjoy your content in 4K Ultra HD with exceptional image quality',
    guaranteedReliability: 'Guaranteed Reliability',
    guaranteedReliabilityDesc: 'Stable service with 99.9% uptime and 24/7 technical support',
    fastActivation: 'Fast Activation',
    fastActivationDesc: 'Your subscription is activated instantly after payment confirmation',
    
    // Features
    ultraHd4k: '4K Ultra HD Quality',
    support247: '24/7 Support',
    instantActivation: 'Instant Activation',
    
    // Subscription features
    ultraHdStreaming: 'Ultra HD Streaming',
    liveChannels: 'Live Channels',
    moviesVod: 'Movies & Series VOD',
    antiFreeze: 'Anti-Freeze Technology',
    support24_7: '24/7 Support',
    sportsPackages: 'Sports Packages',
    movieCollection: 'Movie Collection',
    fastServers: 'Fast Servers',
    premiumTech: 'Premium Technology',
    globalContent: 'Global Content',
    premiumSupport: 'Premium Support',
    vodLibrary: 'VOD Library',
    stableConnection: 'Stable Connection',
    multiPlatform: 'Multi-Platform',
    bigEntertainment: 'Big Entertainment',
    sportsMovies: 'Sports & Movies',
    service24_7: '24/7 Service',
    
    // Footer
    footerDescription: 'Premium IPTV services with thousands of live channels, movies and series in 8K Ultra HD quality.',
    services: 'Services',
    information: 'Information',
    allRightsReserved: 'All rights reserved.',
    
    // How to buy
    howToBuyTitle: 'How to Buy',
    howToBuySubtitle: 'Simple and fast process to get your IPTV subscription',
    contactUs: 'Contact us',
    contactUsDesc: 'Contact us via WhatsApp to choose your subscription',
    payment: 'Payment',
    paymentDesc: 'Make secure payment',
    reception: 'Reception',
    receptionDesc: 'Receive your credentials and download links',
    activationStep: 'Activation',
    activationStepDesc: 'Installation and activation with our support',
    paymentMethods: 'Payment Methods',
    creditCard: 'Credit Card',
    creditCardDesc: 'Secure card payment',
    paypal: 'PayPal',
    paypalDesc: 'Payment via PayPal',
    bankTransfer: 'Bank Transfer',
    bankTransferDesc: 'Bank transfer',
    
    // Blog
    blogTitle: 'IPTV Blog',
    blogSubtitle: 'News, guides and tips to optimize your IPTV experience',
    stayInformed: 'Stay informed',
    stayInformedDesc: 'Follow our blog for the latest IPTV news and expert tips',
    
    // IPTV Panel
    iptvPanelTitle: 'IPTV Panel',
    iptvPanelSubtitle: 'Complete IPTV panel solution to manage your professional streaming service.',
    dedicatedServers: 'Dedicated Servers',
    dedicatedServersDesc: 'High performance infrastructure with 99.9% uptime',
    configuration: 'Configuration',
    configurationDesc: 'Intuitive interface to configure your services',
    monitoring: 'Monitoring',
    monitoringDesc: 'Real-time monitoring of your services',
    
    // Language selector
    selectLanguage: 'Select language',
    
    // Common
    month: 'month',
    perMonth: '/ month',
    currency: '$',
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    subscription: 'Suscripción',
    activation: 'Activación',
    reseller: 'Revendedor',
    iptvPanel: 'Panel IPTV',
    playerPanel: 'Panel Player',
    support: 'Soporte',
    howToBuy: 'Cómo Comprar',
    blog: 'Blog',
    
    // Common buttons and actions
    buyNow: 'COMPRAR AHORA',
    tryFree: 'Prueba Gratuita',
    contact: 'Contactar',
    viewMore: 'Ver más detalles',
    backToHome: 'Volver al inicio',
    startPurchase: 'Iniciar compra',
    requestPanel: 'Solicitar Panel IPTV',
    
    // Home page
    heroTitle: 'BWIVOX IPTV',
    heroSubtitle: 'Descubre nuestros servicios IPTV premium con miles de canales en vivo, películas y series en calidad 8K Ultra HD',
    freeTrial: 'Prueba Gratuita',
    subscriptionsTitle: 'Nuestras Suscripciones IPTV',
    ctaTitle: '¿Listo para comenzar tu experiencia IPTV?',
    ctaSubtitle: 'Contáctanos ahora para obtener tu suscripción',
    
    // Subscription page
    ourSubscriptions: 'Nuestras Suscripciones',
    loadingSubscriptions: 'Cargando suscripciones...',
    noSubscriptionsAvailable: 'No hay suscripciones disponibles',
    noSubscriptionsMessage: 'Las suscripciones estarán disponibles pronto.',
    whyChooseTitle: '¿Por qué elegir nuestros servicios IPTV?',
    whyChooseSubtitle: 'Características premium para una experiencia de streaming excepcional',
    premiumQuality: 'Calidad Premium',
    premiumQualityDesc: 'Disfruta de tu contenido en 4K Ultra HD con calidad de imagen excepcional',
    guaranteedReliability: 'Fiabilidad Garantizada',
    guaranteedReliabilityDesc: 'Servicio estable con 99.9% de tiempo de actividad y soporte técnico 24/7',
    fastActivation: 'Activación Rápida',
    fastActivationDesc: 'Tu suscripción se activa instantáneamente después de la confirmación del pago',
    
    // Features
    ultraHd4k: 'Calidad 4K Ultra HD',
    support247: 'Soporte 24/7',
    instantActivation: 'Activación Instantánea',
    
    // Subscription features
    ultraHdStreaming: 'Streaming Ultra HD',
    liveChannels: 'Canales en Vivo',
    moviesVod: 'Películas y Series VOD',
    antiFreeze: 'Tecnología Anti-Congelamiento',
    support24_7: 'Soporte 24/7',
    sportsPackages: 'Paquetes Deportivos',
    movieCollection: 'Colección de Películas',
    fastServers: 'Servidores Rápidos',
    premiumTech: 'Tecnología Premium',
    globalContent: 'Contenido Global',
    premiumSupport: 'Soporte Premium',
    vodLibrary: 'Biblioteca VOD',
    stableConnection: 'Conexión Estable',
    multiPlatform: 'Multi-Plataforma',
    bigEntertainment: 'Gran Entretenimiento',
    sportsMovies: 'Deportes y Películas',
    service24_7: 'Servicio 24/7',
    
    // Footer
    footerDescription: 'Servicios IPTV premium con miles de canales en vivo, películas y series en calidad 8K Ultra HD.',
    services: 'Servicios',
    information: 'Información',
    allRightsReserved: 'Todos los derechos reservados.',
    
    // How to buy
    howToBuyTitle: 'Cómo Comprar',
    howToBuySubtitle: 'Proceso simple y rápido para obtener tu suscripción IPTV',
    contactUs: 'Contáctanos',
    contactUsDesc: 'Contáctanos vía WhatsApp para elegir tu suscripción',
    payment: 'Pago',
    paymentDesc: 'Realiza el pago de forma segura',
    reception: 'Recepción',
    receptionDesc: 'Recibe tus credenciales y enlaces de descarga',
    activationStep: 'Activación',
    activationStepDesc: 'Instalación y activación con nuestro soporte',
    paymentMethods: 'Métodos de Pago',
    creditCard: 'Tarjeta de Crédito',
    creditCardDesc: 'Pago seguro con tarjeta',
    paypal: 'PayPal',
    paypalDesc: 'Pago vía PayPal',
    bankTransfer: 'Transferencia Bancaria',
    bankTransferDesc: 'Transferencia bancaria',
    
    // Blog
    blogTitle: 'Blog IPTV',
    blogSubtitle: 'Noticias, guías y consejos para optimizar tu experiencia IPTV',
    stayInformed: 'Mantente informado',
    stayInformedDesc: 'Sigue nuestro blog para las últimas noticias IPTV y consejos de expertos',
    
    // IPTV Panel
    iptvPanelTitle: 'Panel IPTV',
    iptvPanelSubtitle: 'Solución completa de panel IPTV para gestionar tu servicio de streaming profesional.',
    dedicatedServers: 'Servidores Dedicados',
    dedicatedServersDesc: 'Infraestructura de alto rendimiento con 99.9% de tiempo de actividad',
    configuration: 'Configuración',
    configurationDesc: 'Interfaz intuitiva para configurar tus servicios',
    monitoring: 'Monitoreo',
    monitoringDesc: 'Monitoreo en tiempo real de tus servicios',
    
    // Language selector
    selectLanguage: 'Seleccionar idioma',
    
    // Common
    month: 'mes',
    perMonth: '/ mes',
    currency: '€',
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    subscription: 'الاشتراك',
    activation: 'التفعيل',
    reseller: 'المورد',
    iptvPanel: 'لوحة IPTV',
    playerPanel: 'لوحة المشغل',
    support: 'الدعم',
    howToBuy: 'كيفية الشراء',
    blog: 'المدونة',
    
    // Common buttons and actions
    buyNow: 'اشتري الآن',
    tryFree: 'تجربة مجانية',
    contact: 'اتصل',
    viewMore: 'عرض المزيد من التفاصيل',
    backToHome: 'العودة للرئيسية',
    startPurchase: 'بدء الشراء',
    requestPanel: 'طلب لوحة IPTV',
    
    // Home page
    heroTitle: 'BWIVOX IPTV',
    heroSubtitle: 'اكتشف خدمات IPTV المتميزة مع آلاف القنوات المباشرة والأفلام والمسلسلات بجودة 8K Ultra HD',
    freeTrial: 'تجربة مجانية',
    subscriptionsTitle: 'اشتراكات IPTV الخاصة بنا',
    ctaTitle: 'جاهز لبدء تجربة IPTV؟',
    ctaSubtitle: 'اتصل بنا الآن للحصول على اشتراكك',
    
    // Subscription page
    ourSubscriptions: 'اشتراكاتنا',
    loadingSubscriptions: 'جارٍ تحميل الاشتراكات...',
    noSubscriptionsAvailable: 'لا توجد اشتراكات متاحة',
    noSubscriptionsMessage: 'ستتوفر الاشتراكات قريباً.',
    whyChooseTitle: 'لماذا تختار خدمات IPTV الخاصة بنا؟',
    whyChooseSubtitle: 'ميزات متميزة لتجربة بث استثنائية',
    premiumQuality: 'جودة متميزة',
    premiumQualityDesc: 'استمتع بالمحتوى بجودة 4K Ultra HD مع جودة صورة استثنائية',
    guaranteedReliability: 'موثوقية مضمونة',
    guaranteedReliabilityDesc: 'خدمة مستقرة مع 99.9% من وقت التشغيل ودعم فني 24/7',
    fastActivation: 'تفعيل سريع',
    fastActivationDesc: 'يتم تفعيل اشتراكك فوراً بعد تأكيد الدفع',
    
    // Features
    ultraHd4k: 'جودة 4K Ultra HD',
    support247: 'دعم 24/7',
    instantActivation: 'تفعيل فوري',
    
    // Subscription features
    ultraHdStreaming: 'بث Ultra HD',
    liveChannels: 'قنوات مباشرة',
    moviesVod: 'أفلام ومسلسلات VOD',
    antiFreeze: 'تقنية مكافحة التجمد',
    support24_7: 'دعم 24/7',
    sportsPackages: 'باقات رياضية',
    movieCollection: 'مجموعة أفلام',
    fastServers: 'خوادم سريعة',
    premiumTech: 'تقنية متميزة',
    globalContent: 'محتوى عالمي',
    premiumSupport: 'دعم متميز',
    vodLibrary: 'مكتبة VOD',
    stableConnection: 'اتصال مستقر',
    multiPlatform: 'متعدد المنصات',
    bigEntertainment: 'ترفيه كبير',
    sportsMovies: 'رياضة وأفلام',
    service24_7: 'خدمة 24/7',
    
    // Footer
    footerDescription: 'خدمات IPTV متميزة مع آلاف القنوات المباشرة والأفلام والمسلسلات بجودة 8K Ultra HD.',
    services: 'الخدمات',
    information: 'المعلومات',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    
    // How to buy
    howToBuyTitle: 'كيفية الشراء',
    howToBuySubtitle: 'عملية بسيطة وسريعة للحصول على اشتراك IPTV',
    contactUs: 'اتصل بنا',
    contactUsDesc: 'اتصل بنا عبر واتساب لاختيار اشتراكك',
    payment: 'الدفع',
    paymentDesc: 'قم بالدفع بطريقة آمنة',
    reception: 'الاستلام',
    receptionDesc: 'استلم بيانات الاعتماد وروابط التحميل',
    activationStep: 'التفعيل',
    activationStepDesc: 'التثبيت والتفعيل مع دعمنا',
    paymentMethods: 'طرق الدفع',
    creditCard: 'البطاقة الائتمانية',
    creditCardDesc: 'دفع آمن بالبطاقة',
    paypal: 'باي بال',
    paypalDesc: 'الدفع عبر باي بال',
    bankTransfer: 'تحويل بنكي',
    bankTransferDesc: 'تحويل بنكي',
    
    // Blog
    blogTitle: 'مدونة IPTV',
    blogSubtitle: 'أخبار ودلائل ونصائح لتحسين تجربة IPTV',
    stayInformed: 'ابق على اطلاع',
    stayInformedDesc: 'تابع مدونتنا لآخر أخبار IPTV ونصائح الخبراء',
    
    // IPTV Panel
    iptvPanelTitle: 'لوحة IPTV',
    iptvPanelSubtitle: 'حل شامل للوحة IPTV لإدارة خدمة البث الاحترافية.',
    dedicatedServers: 'خوادم مخصصة',
    dedicatedServersDesc: 'بنية تحتية عالية الأداء مع 99.9% من وقت التشغيل',
    configuration: 'التكوين',
    configurationDesc: 'واجهة بديهية لتكوين خدماتك',
    monitoring: 'المراقبة',
    monitoringDesc: 'مراقبة خدماتك في الوقت الفعلي',
    
    // Language selector
    selectLanguage: 'اختر اللغة',
    
    // Common
    month: 'شهر',
    perMonth: '/ شهر',
    currency: '€',
  },
  
  de: {
    // Navigation
    home: 'Startseite',
    subscription: 'Abonnement',
    activation: 'Aktivierung',
    reseller: 'Wiederverkäufer',
    iptvPanel: 'IPTV Panel',
    playerPanel: 'Player Panel',
    support: 'Support',
    howToBuy: 'Wie kaufen',
    blog: 'Blog',
    
    // Common buttons and actions
    buyNow: 'JETZT KAUFEN',
    tryFree: 'Kostenlose Testversion',
    contact: 'Kontakt',
    viewMore: 'Mehr Details anzeigen',
    backToHome: 'Zurück zur Startseite',
    startPurchase: 'Kauf starten',
    requestPanel: 'IPTV Panel anfordern',
    
    // Home page
    heroTitle: 'BWIVOX IPTV',
    heroSubtitle: 'Entdecken Sie unsere Premium-IPTV-Dienste mit Tausenden von Live-Kanälen, Filmen und Serien in 8K Ultra HD-Qualität',
    freeTrial: 'Kostenlose Testversion',
    subscriptionsTitle: 'Unsere IPTV-Abonnements',
    ctaTitle: 'Bereit, Ihr IPTV-Erlebnis zu beginnen?',
    ctaSubtitle: 'Kontaktieren Sie uns jetzt, um Ihr Abonnement zu erhalten',
    
    // Subscription page
    ourSubscriptions: 'Unsere Abonnements',
    loadingSubscriptions: 'Abonnements werden geladen...',
    noSubscriptionsAvailable: 'Keine Abonnements verfügbar',
    noSubscriptionsMessage: 'Abonnements werden bald verfügbar sein.',
    whyChooseTitle: 'Warum unsere IPTV-Dienste wählen?',
    whyChooseSubtitle: 'Premium-Features für ein außergewöhnliches Streaming-Erlebnis',
    premiumQuality: 'Premium-Qualität',
    premiumQualityDesc: 'Genießen Sie Ihre Inhalte in 4K Ultra HD mit außergewöhnlicher Bildqualität',
    guaranteedReliability: 'Garantierte Zuverlässigkeit',
    guaranteedReliabilityDesc: 'Stabiler Service mit 99.9% Betriebszeit und 24/7 technischem Support',
    fastActivation: 'Schnelle Aktivierung',
    fastActivationDesc: 'Ihr Abonnement wird sofort nach der Zahlungsbestätigung aktiviert',
    
    // Features
    ultraHd4k: '4K Ultra HD-Qualität',
    support247: '24/7 Support',
    instantActivation: 'Sofortige Aktivierung',
    
    // Subscription features
    ultraHdStreaming: 'Ultra HD-Streaming',
    liveChannels: 'Live-Kanäle',
    moviesVod: 'Filme & Serien VOD',
    antiFreeze: 'Anti-Freeze-Technologie',
    support24_7: '24/7 Support',
    sportsPackages: 'Sport-Pakete',
    movieCollection: 'Filmsammlung',
    fastServers: 'Schnelle Server',
    premiumTech: 'Premium-Technologie',
    globalContent: 'Globale Inhalte',
    premiumSupport: 'Premium-Support',
    vodLibrary: 'VOD-Bibliothek',
    stableConnection: 'Stabile Verbindung',
    multiPlatform: 'Multi-Plattform',
    bigEntertainment: 'Große Unterhaltung',
    sportsMovies: 'Sport & Filme',
    service24_7: '24/7 Service',
    
    // Footer
    footerDescription: 'Premium-IPTV-Dienste mit Tausenden von Live-Kanälen, Filmen und Serien in 8K Ultra HD-Qualität.',
    services: 'Dienste',
    information: 'Information',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    
    // How to buy
    howToBuyTitle: 'Wie kaufen',
    howToBuySubtitle: 'Einfacher und schneller Prozess, um Ihr IPTV-Abonnement zu erhalten',
    contactUs: 'Kontaktieren Sie uns',
    contactUsDesc: 'Kontaktieren Sie uns über WhatsApp, um Ihr Abonnement zu wählen',
    payment: 'Zahlung',
    paymentDesc: 'Sichere Zahlung durchführen',
    reception: 'Empfang',
    receptionDesc: 'Erhalten Sie Ihre Anmeldedaten und Download-Links',
    activationStep: 'Aktivierung',
    activationStepDesc: 'Installation und Aktivierung mit unserem Support',
    paymentMethods: 'Zahlungsmethoden',
    creditCard: 'Kreditkarte',
    creditCardDesc: 'Sichere Kartenzahlung',
    paypal: 'PayPal',
    paypalDesc: 'Zahlung über PayPal',
    bankTransfer: 'Banküberweisung',
    bankTransferDesc: 'Banküberweisung',
    
    // Blog
    blogTitle: 'IPTV Blog',
    blogSubtitle: 'Nachrichten, Anleitungen und Tipps zur Optimierung Ihres IPTV-Erlebnisses',
    stayInformed: 'Bleiben Sie informiert',
    stayInformedDesc: 'Folgen Sie unserem Blog für die neuesten IPTV-Nachrichten und Expertentipps',
    
    // IPTV Panel
    iptvPanelTitle: 'IPTV Panel',
    iptvPanelSubtitle: 'Komplette IPTV-Panel-Lösung zur Verwaltung Ihres professionellen Streaming-Dienstes.',
    dedicatedServers: 'Dedizierte Server',
    dedicatedServersDesc: 'Hochleistungsinfrastruktur mit 99.9% Betriebszeit',
    configuration: 'Konfiguration',
    configurationDesc: 'Intuitive Benutzeroberfläche zur Konfiguration Ihrer Dienste',
    monitoring: 'Überwachung',
    monitoringDesc: 'Echtzeitüberwachung Ihrer Dienste',
    
    // Language selector
    selectLanguage: 'Sprache auswählen',
    
    // Common
    month: 'Monat',
    perMonth: '/ Monat',
    currency: '€',
  },
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.fr;
};

export const getLanguageName = (language: Language): string => {
  const names = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    ar: 'العربية',
    de: 'Deutsch',
  };
  return names[language];
};

export const getLanguageFlag = (language: Language): string => {
  const flags = {
    fr: '🇫🇷',
    en: '🇺🇸',
    es: '🇪🇸',
    ar: '🇸🇦',
    de: '🇩🇪',
  };
  return flags[language];
};
