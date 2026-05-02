
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Button } from '@/components/ui/button';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';
import FeedbackCards from '@/components/home/FeedbackCards';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import ActivationSection from '@/components/home/ActivationSection';
import PaymentOptionsCheckout from '@/components/PaymentOptionsCheckout';
import SEO from '@/components/SEO';
import InternalLinksSection from '@/components/InternalLinksSection';
import { buildOrganizationSchema, buildWebsiteSchema, buildFaqSchema } from '@/lib/seoSchemas';
import { Zap, Star, Check, MessageCircle, MessageSquarePlus, Shield, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getLocalizedText } from '@/lib/multilingualUtils';

const Home = () => {
  const { t, language } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();
  const { data: homepageContent } = useHomepageContent();
  const { data: siteSettings } = useSiteSettings();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Get WhatsApp number from site settings
  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  // Helper function to get content from CMS
  const getContent = (sectionKey: string, field: string, fallback: string = '') => {
    const section = homepageContent?.find(s => s.section_key === sectionKey);
    if (!section?.content_data) return fallback;
    
    const value = section.content_data[field];
    if (typeof value === 'object' && value !== null) {
      return getLocalizedText(JSON.stringify(value), language);
    }
    return value || fallback;
  };

  const handleFreeTrial = () => {
    const message = `${t.tryFree} BWIVOX IPTV. ${t.contact}?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
  };

  const handleOrderSuccess = () => {
    console.log('Order submitted successfully');
  };

  // Filter subscription packages from iptv_packages table
  const subscriptionPackages = packages?.filter(pkg => pkg.category === 'subscription' && pkg.status !== 'inactive') || [];

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading packages...</p>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  // FAQ schema for rich snippets — multilingual content
  const faqByLang: Record<string, { question: string; answer: string }[]> = {
    en: [
      { question: 'What is BWIVOX IPTV?', answer: 'BWIVOX IPTV is a premium 4K IPTV service offering 20,000+ live channels and full VOD library worldwide.' },
      { question: 'Do you offer a free trial?', answer: 'Yes, we offer a free 24-hour IPTV trial with no payment required.' },
      { question: 'Is there a money-back guarantee?', answer: 'Yes, all our IPTV subscriptions include a 30-day money-back guarantee.' },
      { question: 'Which devices are supported?', answer: 'BWIVOX IPTV works on Smart TVs, Firestick, Android, iOS, MAG boxes, Enigma2 and most IPTV players.' },
    ],
    fr: [
      { question: "Qu'est-ce que BWIVOX IPTV ?", answer: 'BWIVOX IPTV est un service IPTV premium 4K avec plus de 20 000 chaînes en direct et une VOD complète, disponible dans le monde entier.' },
      { question: 'Proposez-vous un essai gratuit ?', answer: 'Oui, nous offrons un essai IPTV gratuit de 24 heures sans aucun paiement requis.' },
      { question: 'Y a-t-il une garantie de remboursement ?', answer: 'Oui, tous nos abonnements IPTV incluent une garantie satisfait ou remboursé de 30 jours.' },
      { question: 'Quels appareils sont compatibles ?', answer: 'BWIVOX IPTV fonctionne sur Smart TV, Firestick, Android, iOS, boîtiers MAG, Enigma2 et la plupart des lecteurs IPTV.' },
    ],
    ar: [
      { question: 'ما هو BWIVOX IPTV؟', answer: 'BWIVOX IPTV هي خدمة IPTV بريميوم بدقة 4K تقدم أكثر من 20,000 قناة مباشرة ومكتبة VOD كاملة في جميع أنحاء العالم.' },
      { question: 'هل تقدمون تجربة مجانية؟', answer: 'نعم، نقدم تجربة IPTV مجانية لمدة 24 ساعة دون الحاجة إلى أي دفع.' },
      { question: 'هل هناك ضمان لاسترداد المال؟', answer: 'نعم، جميع اشتراكات IPTV لدينا تتضمن ضمان استرداد المال خلال 30 يومًا.' },
      { question: 'ما هي الأجهزة المدعومة؟', answer: 'يعمل BWIVOX IPTV على أجهزة Smart TV و Firestick و Android و iOS وصناديق MAG و Enigma2 ومعظم مشغلات IPTV.' },
    ],
  };
  const faqLang = (['en', 'fr', 'ar'].includes(language) ? language : 'en') as 'en' | 'fr' | 'ar';
  const homeJsonLd = [
    buildOrganizationSchema(),
    buildWebsiteSchema(),
    buildFaqSchema(faqByLang[faqLang]),
  ];

  return (
    <StoreLayout>
      <SEO page="home" jsonLd={homeJsonLd} />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
          <div className="container text-center">
            <h1 className="text-6xl font-extrabold mb-6">
              {getContent('hero', 'title', t.heroTitle)}
            </h1>
            <p className="text-2xl mb-8 max-w-4xl mx-auto">
              {getContent('hero', 'subtitle', t.heroSubtitle)}
            </p>
            
            {/* 30-Day Money Back Guarantee Badge - Enhanced version from subscription page */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 bg-white backdrop-blur-sm border-2 border-red-500 rounded-full px-8 py-4 shadow-xl transform hover:scale-105 transition-all duration-300">
                <Shield className="h-7 w-7 text-red-500" />
                <span className="text-red-600 font-bold text-xl">{getContent('hero', 'guaranteeText', '30-Day Money Back Guarantee')}</span>
              </div>
            </div>

            <Button 
              onClick={handleFreeTrial}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 text-xl"
            >
              <Zap className="mr-2" size={24} />
              {getContent('hero', 'ctaButtonText', t.freeTrial)}
            </Button>
          </div>
        </section>

        {/* Subscription Products */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">
              {getContent('subscriptions', 'title', t.subscriptionsTitle)}
            </h2>
            
            {/* 30-Day Warranty Section */}
            <div className="mb-12 text-center">
              <div className="max-w-3xl mx-auto p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-blue-900">
                    {getContent('subscriptions', 'warrantyTitle', '30-Day Service Warranty')}
                  </h3>
                </div>
                <p className="text-blue-800">
                  {getContent('subscriptions', 'warrantyDescription', 
                    'All our subscription packages come with a 30-day warranty. Experience any issues? Contact our support team for immediate assistance or receive a full refund within the warranty period.'
                  )}
                </p>
              </div>
            </div>

            {subscriptionPackages.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {subscriptionPackages.map((pkg) => (
                  <ProductSubscriptionCard
                    key={pkg.id}
                    package={pkg}
                    featured={pkg.status === 'featured'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Subscription Packages Available</h3>
                <p className="text-gray-600">Subscription packages are currently being updated. Please check back later.</p>
              </div>
            )}
          </div>
        </section>

        {/* Activation Section - Exact clone from Activation page */}
        <ActivationSection />

        {/* Customer Feedback Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {getContent('feedback', 'title', 'What Our Customers Say')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {getContent('feedback', 'subtitle', 'Real feedback from our valued IPTV customers')}
              </p>
              <Link to="/feedback">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <MessageSquarePlus className="mr-2" size={20} />
                  {getContent('feedback', 'ctaButtonText', 'Share Your Feedback')}
                </Button>
              </Link>
            </div>
            
            <FeedbackCards />
            
            {/* View All Reviews Button */}
            <div className="text-center mt-10">
              <Link to="/full-reviews">
                <Button 
                  variant="outline" 
                  className="border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold px-8 py-3"
                >
                  View All Reviews
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {getContent('features', 'title', t.whyChooseTitle)}
              </h2>
              <p className="text-xl text-gray-600">
                {getContent('features', 'subtitle', t.whyChooseSubtitle)}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getContent('features', 'feature1Title', t.premiumQuality)}
                </h3>
                <p className="text-gray-600">
                  {getContent('features', 'feature1Desc', t.premiumQualityDesc)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getContent('features', 'feature2Title', t.guaranteedReliability)}
                </h3>
                <p className="text-gray-600">
                  {getContent('features', 'feature2Desc', t.guaranteedReliabilityDesc)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getContent('features', 'feature3Title', t.fastActivation)}
                </h3>
                <p className="text-gray-600">
                  {getContent('features', 'feature3Desc', t.fastActivationDesc)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <NewsletterSubscription />

        {/* Call to Action */}
        <section className="bg-red-600 text-white py-16">
          <div className="container text-center">
            <h3 className="text-4xl font-bold mb-6">
              {getContent('cta', 'title', t.ctaTitle)}
            </h3>
            <p className="text-xl mb-8">
              {getContent('cta', 'subtitle', t.ctaSubtitle)}
            </p>
          </div>
        </section>

        {/* Payment Options Checkout Modal */}
        {showCheckout && selectedPackage && (
          <PaymentOptionsCheckout
            packageData={{
              id: selectedPackage.id,
              name: selectedPackage.name,
              category: selectedPackage.category,
              description: selectedPackage.description,
              icon_url: selectedPackage.icon_url,
              price: selectedPackage.price || 0,
              duration: selectedPackage.duration || 1
            }}
            onClose={handleCloseCheckout}
            onSuccess={handleOrderSuccess}
          />
        )}
      </div>
      <InternalLinksSection />
    </StoreLayout>
  );
};

export default Home;
