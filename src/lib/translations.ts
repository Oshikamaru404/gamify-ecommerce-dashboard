
export type Language = 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar';

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
  
  // Product Cards
  currency: string;
  perMonth: string;
  buyNow: string;
  viewMore: string;
  
  // Activation page
  activationTitle: string;
  activationSubtitle: string;
  playerActivation: string;
  activationSteps: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  needHelp: string;
  
  // Reseller page
  resellerTitle: string;
  resellerSubtitle: string;
  becomeReseller: string;
  resellerBenefits: string;
  highCommissions: string;
  highCommissionsDesc: string;
  dedicatedSupport: string;
  dedicatedSupportDesc: string;
  marketingTools: string;
  marketingToolsDesc: string;
  joinNow: string;
  
  // IPTV Panel page
  iptvPanelTitle: string;
  iptvPanelSubtitle: string;
  manageSubscriptions: string;
  
  // Player Panel page
  playerPanelTitle: string;
  playerPanelSubtitle: string;
  configurePlayer: string;
  
  // Product Detail page
  productFeatures: string;
  technicalSpecs: string;
  whatYouGet: string;
  
  // Footer
  footerDescription: string;
  
  // Common
  backToHome: string;
  getStarted: string;
  learnMore: string;
  features: string;
  pricing: string;
  support: string;
  documentation: string;
  tryNow: string;
}

const translations: Record<Language, Translations> = {
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
    
    // Product Cards
    currency: '€',
    perMonth: '/month',
    buyNow: 'Buy Now',
    viewMore: 'View More Details',
    
    // Activation page
    activationTitle: 'Activate Your Player',
    activationSubtitle: 'Follow these simple steps to activate your IPTV service',
    playerActivation: 'Player Activation',
    activationSteps: 'Activation Steps',
    step1Title: 'Download the App',
    step1Desc: 'Install our application on your device',
    step2Title: 'Enter Your Codes',
    step2Desc: 'Use the codes we sent you',
    step3Title: 'Enjoy Content',
    step3Desc: 'Watch your favorite channels and content',
    needHelp: 'Need Help?',
    
    // Reseller page
    resellerTitle: 'Become a BWIVOX Reseller',
    resellerSubtitle: 'Join our partnership program and generate revenue',
    becomeReseller: 'Become Reseller',
    resellerBenefits: 'Reseller Benefits',
    highCommissions: 'High Commissions',
    highCommissionsDesc: 'Earn up to 40% commission on every sale',
    dedicatedSupport: 'Dedicated Support',
    dedicatedSupportDesc: 'Dedicated support team to help you',
    marketingTools: 'Marketing Tools',
    marketingToolsDesc: 'Promotional materials and sales tools',
    joinNow: 'Join Now',
    
    // IPTV Panel page
    iptvPanelTitle: 'IPTV Panel',
    iptvPanelSubtitle: 'Manage your IPTV subscriptions and services',
    manageSubscriptions: 'Manage Subscriptions',
    
    // Player Panel page
    playerPanelTitle: 'Player Panel',
    playerPanelSubtitle: 'Configure and manage your IPTV players',
    configurePlayer: 'Configure Player',
    
    // Product Detail page
    productFeatures: 'Product Features',
    technicalSpecs: 'Technical Specifications',
    whatYouGet: 'What You Get',
    
    // Footer
    footerDescription: 'Premium IPTV services with thousands of live channels, movies and series in 8K Ultra HD quality.',
    
    // Common
    backToHome: 'Back to home',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    features: 'Features',
    pricing: 'Pricing',
    support: 'Support',
    documentation: 'Documentation',
    tryNow: 'Try Now',
  },
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
    
    // Product Cards
    currency: '€',
    perMonth: '/mois',
    buyNow: 'Acheter maintenant',
    viewMore: 'Voir plus de détails',
    
    // Activation page
    activationTitle: 'Activation de votre Player',
    activationSubtitle: 'Suivez ces étapes simples pour activer votre service IPTV',
    playerActivation: 'Activation Player',
    activationSteps: 'Étapes d\'activation',
    step1Title: 'Téléchargez l\'application',
    step1Desc: 'Installez notre application sur votre appareil',
    step2Title: 'Entrez vos codes',
    step2Desc: 'Utilisez les codes que nous vous avons envoyés',
    step3Title: 'Profitez du contenu',
    step3Desc: 'Regardez vos chaînes et contenus préférés',
    needHelp: 'Besoin d\'aide ?',
    
    // Reseller page
    resellerTitle: 'Devenez Revendeur BWIVOX',
    resellerSubtitle: 'Rejoignez notre programme de partenariat et générez des revenus',
    becomeReseller: 'Devenir Revendeur',
    resellerBenefits: 'Avantages Revendeur',
    highCommissions: 'Commissions Élevées',
    highCommissionsDesc: 'Gagnez jusqu\'à 40% de commission sur chaque vente',
    dedicatedSupport: 'Support Dédié',
    dedicatedSupportDesc: 'Équipe de support dédiée pour vous aider',
    marketingTools: 'Outils Marketing',
    marketingToolsDesc: 'Matériel promotionnel et outils de vente',
    joinNow: 'Rejoindre Maintenant',
    
    // IPTV Panel page
    iptvPanelTitle: 'Panel IPTV',
    iptvPanelSubtitle: 'Gérez vos abonnements et services IPTV',
    manageSubscriptions: 'Gérer les Abonnements',
    
    // Player Panel page
    playerPanelTitle: 'Panel Player',
    playerPanelSubtitle: 'Configurez et gérez vos players IPTV',
    configurePlayer: 'Configurer le Player',
    
    // Product Detail page
    productFeatures: 'Fonctionnalités du Produit',
    technicalSpecs: 'Spécifications Techniques',
    whatYouGet: 'Ce que vous obtenez',
    
    // Footer
    footerDescription: 'Services IPTV premium avec des milliers de chaînes en direct, films et séries en qualité 8K Ultra HD.',
    
    // Common
    backToHome: 'Retour à l\'accueil',
    getStarted: 'Commencer',
    learnMore: 'En savoir plus',
    features: 'Fonctionnalités',
    pricing: 'Tarifs',
    support: 'Support',
    documentation: 'Documentation',
    tryNow: 'Essayer Maintenant',
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
    
    // Product Cards
    currency: '€',
    perMonth: '/mes',
    buyNow: 'Comprar Ahora',
    viewMore: 'Ver Más Detalles',
    
    // Activation page
    activationTitle: 'Activa tu Player',
    activationSubtitle: 'Sigue estos pasos simples para activar tu servicio IPTV',
    playerActivation: 'Activación del Player',
    activationSteps: 'Pasos de Activación',
    step1Title: 'Descarga la App',
    step1Desc: 'Instala nuestra aplicación en tu dispositivo',
    step2Title: 'Introduce tus Códigos',
    step2Desc: 'Usa los códigos que te enviamos',
    step3Title: 'Disfruta del Contenido',
    step3Desc: 'Mira tus canales y contenido favoritos',
    needHelp: '¿Necesitas Ayuda?',
    
    // Reseller page
    resellerTitle: 'Conviértete en Revendedor BWIVOX',
    resellerSubtitle: 'Únete a nuestro programa de asociación y genera ingresos',
    becomeReseller: 'Ser Revendedor',
    resellerBenefits: 'Beneficios del Revendedor',
    highCommissions: 'Comisiones Altas',
    highCommissionsDesc: 'Gana hasta 40% de comisión en cada venta',
    dedicatedSupport: 'Soporte Dedicado',
    dedicatedSupportDesc: 'Equipo de soporte dedicado para ayudarte',
    marketingTools: 'Herramientas de Marketing',
    marketingToolsDesc: 'Material promocional y herramientas de venta',
    joinNow: 'Unirse Ahora',
    
    // IPTV Panel page
    iptvPanelTitle: 'Panel IPTV',
    iptvPanelSubtitle: 'Gestiona tus suscripciones y servicios IPTV',
    manageSubscriptions: 'Gestionar Suscripciones',
    
    // Player Panel page
    playerPanelTitle: 'Panel del Player',
    playerPanelSubtitle: 'Configura y gestiona tus players IPTV',
    configurePlayer: 'Configurar Player',
    
    // Product Detail page
    productFeatures: 'Características del Producto',
    technicalSpecs: 'Especificaciones Técnicas',
    whatYouGet: 'Lo que Obtienes',
    
    // Footer
    footerDescription: 'Servicios IPTV premium con miles de canales en vivo, películas y series en calidad 8K Ultra HD.',
    
    // Common
    backToHome: 'Volver al inicio',
    getStarted: 'Empezar',
    learnMore: 'Saber Más',
    features: 'Características',
    pricing: 'Precios',
    support: 'Soporte',
    documentation: 'Documentación',
    tryNow: 'Probar Ahora',
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
    
    // Product Cards
    currency: '€',
    perMonth: '/Monat',
    buyNow: 'Jetzt Kaufen',
    viewMore: 'Mehr Details Anzeigen',
    
    // Activation page
    activationTitle: 'Aktivieren Sie Ihren Player',
    activationSubtitle: 'Befolgen Sie diese einfachen Schritte, um Ihren IPTV-Service zu aktivieren',
    playerActivation: 'Player-Aktivierung',
    activationSteps: 'Aktivierungsschritte',
    step1Title: 'App herunterladen',
    step1Desc: 'Installieren Sie unsere Anwendung auf Ihrem Gerät',
    step2Title: 'Codes eingeben',
    step2Desc: 'Verwenden Sie die Codes, die wir Ihnen gesendet haben',
    step3Title: 'Inhalte genießen',
    step3Desc: 'Schauen Sie Ihre Lieblings-Kanäle und -Inhalte',
    needHelp: 'Brauchen Sie Hilfe?',
    
    // Reseller page
    resellerTitle: 'Werden Sie BWIVOX-Händler',
    resellerSubtitle: 'Treten Sie unserem Partnerprogramm bei und generieren Sie Einnahmen',
    becomeReseller: 'Händler werden',
    resellerBenefits: 'Händler-Vorteile',
    highCommissions: 'Hohe Provisionen',
    highCommissionsDesc: 'Verdienen Sie bis zu 40% Provision bei jedem Verkauf',
    dedicatedSupport: 'Dedizierter Support',
    dedicatedSupportDesc: 'Dediziertes Support-Team zur Unterstützung',
    marketingTools: 'Marketing-Tools',
    marketingToolsDesc: 'Werbematerialien und Verkaufstools',
    joinNow: 'Jetzt beitreten',
    
    // IPTV Panel page
    iptvPanelTitle: 'IPTV-Panel',
    iptvPanelSubtitle: 'Verwalten Sie Ihre IPTV-Abonnements und -Services',
    manageSubscriptions: 'Abonnements verwalten',
    
    // Player Panel page
    playerPanelTitle: 'Player-Panel',
    playerPanelSubtitle: 'Konfigurieren und verwalten Sie Ihre IPTV-Player',
    configurePlayer: 'Player konfigurieren',
    
    // Product Detail page
    productFeatures: 'Produktfunktionen',
    technicalSpecs: 'Technische Spezifikationen',
    whatYouGet: 'Was Sie erhalten',
    
    // Footer
    footerDescription: 'Premium-IPTV-Services mit Tausenden von Live-Kanälen, Filmen und Serien in 8K Ultra HD-Qualität.',
    
    // Common
    backToHome: 'Zurück zur Startseite',
    getStarted: 'Loslegen',
    learnMore: 'Mehr erfahren',
    features: 'Funktionen',
    pricing: 'Preise',
    support: 'Support',
    documentation: 'Dokumentation',
    tryNow: 'Jetzt Testen',
  },
  it: {
    // Navigation (en anglais pour cohérence)
    home: 'Home',
    subscription: 'Subscription IPTV',
    activation: 'Activation Player',
    reseller: 'Panel Reseller',
    panelIptv: 'Panel IPTV',
    playerPanel: 'Panel Player',
    
    // Hero section
    heroTitle: 'Servizi IPTV',
    heroSubtitle: 'Goditi migliaia di canali in diretta, film e serie in qualità 8K Ultra HD con i nostri servizi IPTV premium.',
    freeTrial: 'Prova Gratuita',
    tryFree: 'Ciao, vorrei beneficiare della prova gratuita',
    contact: 'Puoi aiutarmi',
    
    // Subscriptions
    subscriptionsTitle: 'I Nostri Abbonamenti IPTV',
    ourSubscriptions: 'I Nostri Abbonamenti',
    loadingSubscriptions: 'Caricamento abbonamenti...',
    noSubscriptionsAvailable: 'Nessun abbonamento disponibile',
    noSubscriptionsMessage: 'Al momento non ci sono abbonamenti disponibili. Riprova più tardi.',
    
    // Features
    ultraHd4k: 'Ultra HD 4K/8K',
    support247: 'Supporto 24/7',
    instantActivation: 'Attivazione Istantanea',
    premiumQuality: 'Qualità Premium',
    premiumQualityDesc: 'Streaming in qualità 4K/8K con tecnologia anti-freeze avanzata.',
    guaranteedReliability: 'Affidabilità Garantita',
    guaranteedReliabilityDesc: 'Server ad alte prestazioni con uptime del 99,9%.',
    fastActivation: 'Attivazione Rapida',
    fastActivationDesc: 'Il tuo servizio viene attivato istantaneamente dopo il pagamento.',
    
    // Why Choose
    whyChooseTitle: 'Perché Scegliere BWIVOX?',
    whyChooseSubtitle: 'Scopri i vantaggi dei nostri servizi IPTV premium.',
    
    // CTA
    ctaTitle: 'Pronto per iniziare?',
    ctaSubtitle: 'Unisciti a migliaia di clienti soddisfatti oggi stesso.',
    
    // Product Cards
    currency: '€',
    perMonth: '/mese',
    buyNow: 'Acquista Ora',
    viewMore: 'Visualizza Altri Dettagli',
    
    // Activation page
    activationTitle: 'Attiva il Tuo Player',
    activationSubtitle: 'Segui questi semplici passaggi per attivare il tuo servizio IPTV',
    playerActivation: 'Attivazione Player',
    activationSteps: 'Passaggi di Attivazione',
    step1Title: 'Scarica l\'App',
    step1Desc: 'Installa la nostra applicazione sul tuo dispositivo',
    step2Title: 'Inserisci i Tuoi Codici',
    step2Desc: 'Usa i codici che ti abbiamo inviato',
    step3Title: 'Goditi i Contenuti',
    step3Desc: 'Guarda i tuoi canali e contenuti preferiti',
    needHelp: 'Hai Bisogno di Aiuto?',
    
    // Reseller page
    resellerTitle: 'Diventa Rivenditore BWIVOX',
    resellerSubtitle: 'Unisciti al nostro programma di partnership e genera entrate',
    becomeReseller: 'Diventa Rivenditore',
    resellerBenefits: 'Vantaggi Rivenditore',
    highCommissions: 'Commissioni Elevate',
    highCommissionsDesc: 'Guadagna fino al 40% di commissione su ogni vendita',
    dedicatedSupport: 'Supporto Dedicato',
    dedicatedSupportDesc: 'Team di supporto dedicato per aiutarti',
    marketingTools: 'Strumenti di Marketing',
    marketingToolsDesc: 'Materiali promozionali e strumenti di vendita',
    joinNow: 'Unisciti Ora',
    
    // IPTV Panel page
    iptvPanelTitle: 'Pannello IPTV',
    iptvPanelSubtitle: 'Gestisci i tuoi abbonamenti e servizi IPTV',
    manageSubscriptions: 'Gestisci Abbonamenti',
    
    // Player Panel page
    playerPanelTitle: 'Pannello Player',
    playerPanelSubtitle: 'Configura e gestisci i tuoi player IPTV',
    configurePlayer: 'Configura Player',
    
    // Product Detail page
    productFeatures: 'Caratteristiche del Prodotto',
    technicalSpecs: 'Specifiche Tecniche',
    whatYouGet: 'Cosa Ottieni',
    
    // Footer
    footerDescription: 'Servizi IPTV premium con migliaia di canali in diretta, film e serie in qualità 8K Ultra HD.',
    
    // Common
    backToHome: 'Torna alla home',
    getStarted: 'Inizia',
    learnMore: 'Scopri di Più',
    features: 'Caratteristiche',
    pricing: 'Prezzi',
    support: 'Supporto',
    documentation: 'Documentazione',
    tryNow: 'Prova Ora',
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
    
    // Product Cards
    currency: '€',
    perMonth: '/شهر',
    buyNow: 'اشتر الآن',
    viewMore: 'عرض المزيد من التفاصيل',
    
    // Activation page
    activationTitle: 'تفعيل المشغل الخاص بك',
    activationSubtitle: 'اتبع هذه الخطوات البسيطة لتفعيل خدمة IPTV',
    playerActivation: 'تفعيل المشغل',
    activationSteps: 'خطوات التفعيل',
    step1Title: 'تحميل التطبيق',
    step1Desc: 'تثبيت التطبيق على جهازك',
    step2Title: 'إدخال الرموز',
    step2Desc: 'استخدم الرموز التي أرسلناها لك',
    step3Title: 'استمتع بالمحتوى',
    step3Desc: 'شاهد قنواتك ومحتواك المفضل',
    needHelp: 'تحتاج مساعدة؟',
    
    // Reseller page
    resellerTitle: 'كن موزع BWIVOX',
    resellerSubtitle: 'انضم إلى برنامج الشراكة واحصل على الأرباح',
    becomeReseller: 'أصبح موزع',
    resellerBenefits: 'مزايا الموزع',
    highCommissions: 'عمولات عالية',
    highCommissionsDesc: 'احصل على عمولة تصل إلى 40% من كل عملية بيع',
    dedicatedSupport: 'دعم مخصص',
    dedicatedSupportDesc: 'فريق دعم مخصص لمساعدتك',
    marketingTools: 'أدوات التسويق',
    marketingToolsDesc: 'مواد ترويجية وأدوات بيع',
    joinNow: 'انضم الآن',
    
    // IPTV Panel page
    iptvPanelTitle: 'لوحة IPTV',
    iptvPanelSubtitle: 'إدارة اشتراكات وخدمات IPTV',
    manageSubscriptions: 'إدارة الاشتراكات',
    
    // Player Panel page
    playerPanelTitle: 'لوحة المشغل',
    playerPanelSubtitle: 'تكوين وإدارة مشغلات IPTV',
    configurePlayer: 'تكوين المشغل',
    
    // Product Detail page
    productFeatures: 'ميزات المنتج',
    technicalSpecs: 'المواصفات التقنية',
    whatYouGet: 'ما تحصل عليه',
    
    // Footer
    footerDescription: 'خدمات IPTV مميزة مع آلاف القنوات المباشرة والأفلام والمسلسلات بجودة 8K Ultra HD.',
    
    // Common
    backToHome: 'العودة إلى الرئيسية',
    getStarted: 'ابدأ',
    learnMore: 'تعلم المزيد',
    features: 'الميزات',
    pricing: 'الأسعار',
    support: 'الدعم',
    documentation: 'التوثيق',
    tryNow: 'جرب الآن',
  },
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.en;
};

// Helper functions for language display
export const getLanguageFlag = (language: Language): string => {
  const flags: Record<Language, string> = {
    en: '🇺🇸',
    fr: '🇫🇷',
    es: '🇪🇸',
    de: '🇩🇪',
    it: '🇮🇹',
    ar: '🇸🇦',
  };
  return flags[language] || '🇺🇸';
};

export const getLanguageName = (language: Language): string => {
  const names: Record<Language, string> = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    it: 'Italiano',
    ar: 'العربية',
  };
  return names[language] || 'English';
};
