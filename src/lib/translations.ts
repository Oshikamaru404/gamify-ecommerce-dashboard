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
  
  // Support page
  supportTitle: string;
  supportSubtitle: string;
  whatsappSupport: string;
  whatsappDesc: string;
  emailSupport: string;
  hoursTitle: string;
  hoursDesc: string;
  contactImmediate: string;
  faqTitle: string;
  faqInstall: string;
  faqInstallAnswer: string;
  faqDevices: string;
  faqDevicesAnswer: string;
  faqProblem: string;
  faqProblemAnswer: string;
  contactViaWhatsapp: string;
  sendEmail: string;
  
  // Refund Policy page
  backToHome: string;
  refundPolicy: string;
  refundSubtitle: string;
  moneyBackGuarantee: string;
  standBehindServices: string;
  policyOverview: string;
  policyOverviewText: string;
  refundEligibility: string;
  requestWithin30Days: string;
  serviceIssuesNotResolved: string;
  compatibilityIssues: string;
  serviceNotMeeting: string;
  howToRequest: string;
  step1Contact: string;
  step2Provide: string;
  step3Allow: string;
  step4Process: string;
  processingTime: string;
  processingTimeText: string;
  needHelpRefund: string;
  needHelpRefundText: string;
  contactSupport: string;
  whatsappSupportLink: string;
  
  // Index page
  indexTitle: string;
  indexSubtitle: string;
  discoverOffers: string;
  
  // Common
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
    
    // Support page
    supportTitle: 'Customer Support',
    supportSubtitle: 'Our support team is available 24/7 to help you',
    whatsappSupport: 'WhatsApp',
    whatsappDesc: 'Instant support via WhatsApp',
    emailSupport: 'Email',
    hoursTitle: 'Hours',
    hoursDesc: '24/7 support',
    contactImmediate: 'Immediate Contact',
    faqTitle: 'Frequently Asked Questions',
    faqInstall: 'How to install my IPTV?',
    faqInstallAnswer: 'We provide a complete installation guide and personalized support.',
    faqDevices: 'Which devices are compatible?',
    faqDevicesAnswer: 'Smart TV, Android, iOS, PC, MAC, STB and much more.',
    faqProblem: 'What to do in case of problem?',
    faqProblemAnswer: 'Contact us immediately via WhatsApp for quick assistance.',
    contactViaWhatsapp: 'Contact via WhatsApp',
    sendEmail: 'Send Email',
    
    // Refund Policy page
    backToHome: 'Back to Home',
    refundPolicy: 'Refund Policy',
    refundSubtitle: 'Your satisfaction is our priority. Learn about our 30-day money-back guarantee.',
    moneyBackGuarantee: '30-Day Money Back Guarantee',
    standBehindServices: 'We stand behind our services',
    policyOverview: 'Policy Overview',
    policyOverviewText: 'We offer a 30-day money-back guarantee on all our IPTV services. If you\'re not completely satisfied with your purchase, you can request a full refund within 30 days of your initial purchase date.',
    refundEligibility: 'Refund Eligibility',
    requestWithin30Days: 'Request made within 30 days of purchase',
    serviceIssuesNotResolved: 'Service issues not resolved by our support team',
    compatibilityIssues: 'Compatibility issues with your device',
    serviceNotMeeting: 'Service not meeting advertised specifications',
    howToRequest: 'How to Request a Refund',
    step1Contact: 'Contact our support team via WhatsApp or Telegram',
    step2Provide: 'Provide your order details and reason for refund',
    step3Allow: 'Allow our team to attempt resolving any technical issues',
    step4Process: 'If unresolved, we\'ll process your refund within 5-7 business days',
    processingTime: 'Processing Time',
    processingTimeText: 'Refunds are typically processed within 5-7 business days after approval. The time for funds to appear in your account depends on your payment method and bank.',
    needHelpRefund: 'Need Help?',
    needHelpRefundText: 'Our customer support team is here to help with any questions about our refund policy.',
    contactSupport: 'Contact Support',
    whatsappSupportLink: 'WhatsApp Support',
    
    // Index page
    indexTitle: 'BWIVOX IPTV',
    indexSubtitle: 'Premium IPTV streaming service with over 10,000 live channels, movies and series from around the world in HD and 4K quality.',
    discoverOffers: 'Discover our offers',
    
    // Common
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
    
    // Support page
    supportTitle: 'Support Client',
    supportSubtitle: 'Notre équipe support est disponible 24/7 pour vous aider',
    whatsappSupport: 'WhatsApp',
    whatsappDesc: 'Support instantané via WhatsApp',
    emailSupport: 'Email',
    hoursTitle: 'Horaires',
    hoursDesc: 'Support 24h/24, 7j/7',
    contactImmediate: 'Contact Immédiat',
    faqTitle: 'Questions Fréquentes',
    faqInstall: 'Comment installer mon IPTV ?',
    faqInstallAnswer: 'Nous fournissons un guide d\'installation complet et un support personnalisé.',
    faqDevices: 'Quels appareils sont compatibles ?',
    faqDevicesAnswer: 'Smart TV, Android, iOS, PC, MAC, STB et bien plus.',
    faqProblem: 'Que faire en cas de problème ?',
    faqProblemAnswer: 'Contactez-nous immédiatement via WhatsApp pour une assistance rapide.',
    contactViaWhatsapp: 'Contacter via WhatsApp',
    sendEmail: 'Envoyer un Email',
    
    // Refund Policy page
    backToHome: 'Retour à l\'accueil',
    refundPolicy: 'Politique de Remboursement',
    refundSubtitle: 'Votre satisfaction est notre priorité. Découvrez notre garantie de remboursement de 30 jours.',
    moneyBackGuarantee: 'Garantie de Remboursement 30 Jours',
    standBehindServices: 'Nous soutenons nos services',
    policyOverview: 'Aperçu de la Politique',
    policyOverviewText: 'Nous offrons une garantie de remboursement de 30 jours sur tous nos services IPTV. Si vous n\'êtes pas complètement satisfait de votre achat, vous pouvez demander un remboursement complet dans les 30 jours de votre date d\'achat initial.',
    refundEligibility: 'Éligibilité au Remboursement',
    requestWithin30Days: 'Demande faite dans les 30 jours de l\'achat',
    serviceIssuesNotResolved: 'Problèmes de service non résolus par notre équipe de support',
    compatibilityIssues: 'Problèmes de compatibilité avec votre appareil',
    serviceNotMeeting: 'Service ne répondant pas aux spécifications annoncées',
    howToRequest: 'Comment Demander un Remboursement',
    step1Contact: 'Contactez notre équipe de support via WhatsApp ou Telegram',
    step2Provide: 'Fournissez vos détails de commande et la raison du remboursement',
    step3Allow: 'Permettez à notre équipe de tenter de résoudre les problèmes techniques',
    step4Process: 'Si non résolu, nous traiterons votre remboursement dans 5-7 jours ouvrables',
    processingTime: 'Temps de Traitement',
    processingTimeText: 'Les remboursements sont généralement traités dans 5-7 jours ouvrables après approbation. Le temps pour que les fonds apparaissent dans votre compte dépend de votre méthode de paiement et de votre banque.',
    needHelpRefund: 'Besoin d\'Aide ?',
    needHelpRefundText: 'Notre équipe de support client est là pour aider avec toute question sur notre politique de remboursement.',
    contactSupport: 'Contacter le Support',
    whatsappSupportLink: 'Support WhatsApp',
    
    // Index page
    indexTitle: 'BWIVOX IPTV',
    indexSubtitle: 'Le service de streaming IPTV premium avec plus de 10 000 chaînes en direct, films et séries du monde entier en qualité HD et 4K.',
    discoverOffers: 'Découvrir nos offres',
    
    // Common
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
    
    // Support page
    supportTitle: 'Soporte al Cliente',
    supportSubtitle: 'Nuestro equipo de soporte está disponible 24/7 para ayudarte',
    whatsappSupport: 'WhatsApp',
    whatsappDesc: 'Soporte instantáneo vía WhatsApp',
    emailSupport: 'Email',
    hoursTitle: 'Horarios',
    hoursDesc: 'Soporte 24/7',
    contactImmediate: 'Contacto Inmediato',
    faqTitle: 'Preguntas Frecuentes',
    faqInstall: '¿Cómo instalar mi IPTV?',
    faqInstallAnswer: 'Proporcionamos una guía de instalación completa y soporte personalizado.',
    faqDevices: '¿Qué dispositivos son compatibles?',
    faqDevicesAnswer: 'Smart TV, Android, iOS, PC, MAC, STB y mucho más.',
    faqProblem: '¿Qué hacer en caso de problema?',
    faqProblemAnswer: 'Contáctanos inmediatamente vía WhatsApp para asistencia rápida.',
    contactViaWhatsapp: 'Contactar vía WhatsApp',
    sendEmail: 'Enviar Email',
    
    // Refund Policy page
    backToHome: 'Volver al Inicio',
    refundPolicy: 'Política de Reembolso',
    refundSubtitle: 'Tu satisfacción es nuestra prioridad. Conoce nuestra garantía de devolución de dinero de 30 días.',
    moneyBackGuarantee: 'Garantía de Devolución de Dinero de 30 Días',
    standBehindServices: 'Respaldamos nuestros servicios',
    policyOverview: 'Resumen de la Política',
    policyOverviewText: 'Ofrecemos una garantía de devolución de dinero de 30 días en todos nuestros servicios IPTV. Si no estás completamente satisfecho con tu compra, puedes solicitar un reembolso completo dentro de los 30 días de tu fecha de compra inicial.',
    refundEligibility: 'Elegibilidad para Reembolso',
    requestWithin30Days: 'Solicitud hecha dentro de 30 días de la compra',
    serviceIssuesNotResolved: 'Problemas de servicio no resueltos por nuestro equipo de soporte',
    compatibilityIssues: 'Problemas de compatibilidad con tu dispositivo',
    serviceNotMeeting: 'Servicio que no cumple con las especificaciones anunciadas',
    howToRequest: 'Cómo Solicitar un Reembolso',
    step1Contact: 'Contacta a nuestro equipo de soporte vía WhatsApp o Telegram',
    step2Provide: 'Proporciona tus detalles de pedido y razón para el reembolso',
    step3Allow: 'Permite que nuestro equipo intente resolver cualquier problema técnico',
    step4Process: 'Si no se resuelve, procesaremos tu reembolso en 5-7 días hábiles',
    processingTime: 'Tiempo de Procesamiento',
    processingTimeText: 'Los reembolsos se procesan típicamente en 5-7 días hábiles después de la aprobación. El tiempo para que los fondos aparezcan en tu cuenta depende de tu método de pago y banco.',
    needHelpRefund: '¿Necesitas Ayuda?',
    needHelpRefundText: 'Nuestro equipo de soporte al cliente está aquí para ayudar con cualquier pregunta sobre nuestra política de reembolso.',
    contactSupport: 'Contactar Soporte',
    whatsappSupportLink: 'Soporte WhatsApp',
    
    // Index page
    indexTitle: 'BWIVOX IPTV',
    indexSubtitle: 'Servicio de streaming IPTV premium con más de 10,000 canales en vivo, películas y series de todo el mundo en calidad HD y 4K.',
    discoverOffers: 'Descubrir nuestras ofertas',
    
    // Common
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
    
    // Support page
    supportTitle: 'Kundensupport',
    supportSubtitle: 'Unser Support-Team ist 24/7 verfügbar, um Ihnen zu helfen',
    whatsappSupport: 'WhatsApp',
    whatsappDesc: 'Sofortiger Support über WhatsApp',
    emailSupport: 'E-Mail',
    hoursTitle: 'Öffnungszeiten',
    hoursDesc: '24/7 Support',
    contactImmediate: 'Sofortiger Kontakt',
    faqTitle: 'Häufig Gestellte Fragen',
    faqInstall: 'Wie installiere ich mein IPTV?',
    faqInstallAnswer: 'Wir stellen einen vollständigen Installationsleitfaden und persönlichen Support zur Verfügung.',
    faqDevices: 'Welche Geräte sind kompatibel?',
    faqDevicesAnswer: 'Smart TV, Android, iOS, PC, MAC, STB und vieles mehr.',
    faqProblem: 'Was tun bei Problemen?',
    faqProblemAnswer: 'Kontaktieren Sie uns sofort über WhatsApp für schnelle Hilfe.',
    contactViaWhatsapp: 'Kontakt über WhatsApp',
    sendEmail: 'E-Mail senden',
    
    // Refund Policy page
    backToHome: 'Zurück zur Startseite',
    refundPolicy: 'Rückerstattungsrichtlinie',
    refundSubtitle: 'Ihre Zufriedenheit ist unsere Priorität. Erfahren Sie mehr über unsere 30-tägige Geld-zurück-Garantie.',
    moneyBackGuarantee: '30-Tage Geld-zurück-Garantie',
    standBehindServices: 'Wir stehen hinter unseren Services',
    policyOverview: 'Richtlinienübersicht',
    policyOverviewText: 'Wir bieten eine 30-tägige Geld-zurück-Garantie für alle unsere IPTV-Services. Wenn Sie nicht vollständig zufrieden mit Ihrem Kauf sind, können Sie eine vollständige Rückerstattung innerhalb von 30 Tagen nach Ihrem ursprünglichen Kaufdatum beantragen.',
    refundEligibility: 'Rückerstattungsberechtigung',
    requestWithin30Days: 'Antrag innerhalb von 30 Tagen nach dem Kauf gestellt',
    serviceIssuesNotResolved: 'Serviceprobleme nicht von unserem Support-Team gelöst',
    compatibilityIssues: 'Kompatibilitätsprobleme mit Ihrem Gerät',
    serviceNotMeeting: 'Service entspricht nicht den beworbenen Spezifikationen',
    howToRequest: 'Wie man eine Rückerstattung beantragt',
    step1Contact: 'Kontaktieren Sie unser Support-Team über WhatsApp oder Telegram',
    step2Provide: 'Geben Sie Ihre Bestelldetails und den Grund für die Rückerstattung an',
    step3Allow: 'Lassen Sie unser Team versuchen, technische Probleme zu lösen',
    step4Process: 'Wenn ungelöst, bearbeiten wir Ihre Rückerstattung innerhalb von 5-7 Werktagen',
    processingTime: 'Bearbeitungszeit',
    processingTimeText: 'Rückerstattungen werden normalerweise innerhalb von 5-7 Werktagen nach Genehmigung bearbeitet. Die Zeit, bis die Mittel auf Ihrem Konto erscheinen, hängt von Ihrer Zahlungsmethode und Bank ab.',
    needHelpRefund: 'Brauchen Sie Hilfe?',
    needHelpRefundText: 'Unser Kundensupport-Team ist hier, um bei Fragen zu unserer Rückerstattungsrichtlinie zu helfen.',
    contactSupport: 'Support kontaktieren',
    whatsappSupportLink: 'WhatsApp Support',
    
    // Index page
    indexTitle: 'BWIVOX IPTV',
    indexSubtitle: 'Premium-IPTV-Streaming-Service mit über 10.000 Live-Kanälen, Filmen und Serien aus der ganzen Welt in HD- und 4K-Qualität.',
    discoverOffers: 'Unsere Angebote entdecken',
    
    // Common
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
    
    // Support page
    supportTitle: 'Supporto Clienti',
    supportSubtitle: 'Il nostro team di supporto è disponibile 24/7 per aiutarti',
    whatsappSupport: 'WhatsApp',
    whatsappDesc: 'Supporto istantaneo via WhatsApp',
    emailSupport: 'Email',
    hoursTitle: 'Orari',
    hoursDesc: 'Supporto 24/7',
    contactImmediate: 'Contatto Immediato',
    faqTitle: 'Domande Frequenti',
    faqInstall: 'Come installare il mio IPTV?',
    faqInstallAnswer: 'Forniamo una guida completa all\'installazione e supporto personalizzato.',
    faqDevices: 'Quali dispositivi sono compatibili?',
    faqDevicesAnswer: 'Smart TV, Android, iOS, PC, MAC, STB e molto altro.',
    faqProblem: 'Cosa fare in caso di problema?',
    faqProblemAnswer: 'Contattaci immediatamente via WhatsApp per assistenza rapida.',
    contactViaWhatsapp: 'Contatta via WhatsApp',
    sendEmail: 'Invia Email',
    
    // Refund Policy page
    backToHome: 'Torna alla home',
    refundPolicy: 'Politica di Rimborso',
    refundSubtitle: 'La tua soddisfazione è la nostra priorità. Scopri la nostra garanzia di rimborso di 30 giorni.',
    moneyBackGuarantee: 'Garanzia Soddisfatti o Rimborsati di 30 Giorni',
    standBehindServices: 'Sosteniamo i nostri servizi',
    policyOverview: 'Panoramica della Politica',
    policyOverviewText: 'Offriamo una garanzia di rimborso di 30 giorni su tutti i nostri servizi IPTV. Se non sei completamente soddisfatto del tuo acquisto, puoi richiedere un rimborso completo entro 30 giorni dalla data di acquisto iniziale.',
    refundEligibility: 'Idoneità al Rimborso',
    requestWithin30Days: 'Richiesta fatta entro 30 giorni dall\'acquisto',
    serviceIssuesNotResolved: 'Problemi di servizio non risolti dal nostro team di supporto',
    compatibilityIssues: 'Problemi di compatibilità con il tuo dispositivo',
    serviceNotMeeting: 'Servizio che non soddisfa le specifiche pubblicizzate',
    howToRequest: 'Come Richiedere un Rimborso',
    step1Contact: 'Contatta il nostro team di supporto via WhatsApp o Telegram',
    step2Provide: 'Fornisci i dettagli del tuo ordine e il motivo del rimborso',
    step3Allow: 'Permetti al nostro team di tentare di risolvere eventuali problemi tecnici',
    step4Process: 'Se non risolto, elaboreremo il tuo rimborso entro 5-7 giorni lavorativi',
    processingTime: 'Tempo di Elaborazione',
    processingTimeText: 'I rimborsi sono tipicamente elaborati entro 5-7 giorni lavorativi dopo l\'approvazione. Il tempo perché i fondi appaiano nel tuo account dipende dal tuo metodo di pagamento e dalla banca.',
    needHelpRefund: 'Hai Bisogno di Aiuto?',
    needHelpRefundText: 'Il nostro team di supporto clienti è qui per aiutare con qualsiasi domanda sulla nostra politica di rimborso.',
    contactSupport: 'Contatta il Supporto',
    whatsappSupportLink: 'Supporto WhatsApp',
    
    // Index page
    indexTitle: 'BWIVOX IPTV',
    indexSubtitle: 'Servizio di streaming IPTV premium con oltre 10.000 canali in diretta, film e serie da tutto il mondo in qualità HD e 4K.',
    discoverOffers: 'Scopri le nostre offerte',
    
    // Common
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
    
    // Support page
    supportTitle: 'دعم العملاء',
    supportSubtitle: 'فريق الدعم لدينا متاح 24/7 لمساعدتك',
    whatsappSupport: 'واتساب',
    whatsappDesc: 'دعم فوري عبر واتساب',
    emailSupport: 'البريد الإلكتروني',
    hoursTitle: 'ساعات العمل',
    hoursDesc: 'دعم 24/7',
    contactImmediate: 'تواصل فوري',
    faqTitle: 'الأسئلة الشائعة',
    faqInstall: 'كيفية تثبيت IPTV الخاص بي؟',
    faqInstallAnswer: 'نحن نوفر دليل تثبيت كامل ودعم شخصي.',
    faqDevices: 'ما هي الأجهزة المتوافقة؟',
    faqDevicesAnswer: 'التلفزيون الذكي، أندرويد، iOS، PC، MAC، STB وأكثر.',
    faqProblem: 'ماذا تفعل في حالة وجود مشكلة؟',
    faqProblemAnswer: 'اتصل بنا فورًا عبر واتساب للحصول على مساعدة سريعة.',
    contactViaWhatsapp: 'تواصل عبر واتساب',
    sendEmail: 'إرسال بريد إلكتروني',
    
    // Refund Policy page
    backToHome: 'العودة إلى الرئيسية',
    refundPolicy: 'سياسة الاسترداد',
    refundSubtitle: 'رضاك أولويتنا. تعرف على ضمان استرداد الأموال لمدة 30 يوم.',
    moneyBackGuarantee: 'ضمان استرداد الأموال لمدة 30 يوم',
    standBehindServices: 'نحن ندعم خدماتنا',
    policyOverview: 'نظرة عامة على السياسة',
    policyOverviewText: 'نحن نقدم ضمان استرداد الأموال لمدة 30 يوم على جميع خدمات IPTV لدينا. إذا لم تكن راضياً تماماً عن شرائك، يمكنك طلب استرداد كامل خلال 30 يوم من تاريخ الشراء الأولي.',
    refundEligibility: 'أهلية الاسترداد',
    requestWithin30Days: 'طلب مقدم خلال 30 يوم من الشراء',
    serviceIssuesNotResolved: 'مشاكل الخدمة غير محلولة من فريق الدعم لدينا',
    compatibilityIssues: 'مشاكل التوافق مع جهازك',
    serviceNotMeeting: 'الخدمة لا تلبي المواصفات المعلنة',
    howToRequest: 'كيفية طلب الاسترداد',
    step1Contact: 'اتصل بفريق الدعم عبر واتساب أو تيليجرام',
    step2Provide: 'قدم تفاصيل طلبك وسبب الاسترداد',
    step3Allow: 'اسمح لفريقنا بمحاولة حل أي مشاكل تقنية',
    step4Process: 'إذا لم تحل، سنعالج استردادك خلال 5-7 أيام عمل',
    processingTime: 'وقت المعالجة',
    processingTimeText: 'عادة ما تتم معالجة المبالغ المستردة خلال 5-7 أيام عمل بعد الموافقة. الوقت اللازم لظهور الأموال في حسابك يعتمد على طريقة الدفع والبنك.',
    needHelpRefund: 'تحتاج مساعدة؟',
    needHelpRefundText: 'فريق دعم العملاء لدينا هنا للمساعدة في أي أسئلة حول سياسة الاسترداد الخاصة بنا.',
    contactSupport: 'تواصل مع الدعم',
    whatsappSupportLink: 'دعم واتساب',
    
    // Index page
    indexTitle: 'BWIVOX IPTV',
    indexSubtitle: 'خدمة بث IPTV مميزة مع أكثر من 10,000 قناة مباشرة وأفلام ومسلسلات من جميع أنحاء العالم بجودة HD و 4K.',
    discoverOffers: 'اكتشف عروضنا',
    
    // Common
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
