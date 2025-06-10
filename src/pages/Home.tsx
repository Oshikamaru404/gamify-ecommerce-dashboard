
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  const subscriptionProducts = [
    {
      name: "STRONG 8K IPTV 🚀",
      price: 12.99,
      features: [
        "8K Ultra HD Quality",
        "5000+ Live Channels",
        "Movies & Series VOD",
        "Anti-Freeze Technology",
        "24/7 Support"
      ]
    },
    {
      name: "TREX 8K IPTV 🦖",
      price: 10.99,
      features: [
        "8K/4K Streaming",
        "4000+ Channels",
        "Sports Packages",
        "Movie Collection",
        "Fast Servers"
      ]
    },
    {
      name: "PROMAX 4K IPTV ⚡",
      price: 18.99,
      features: [
        "4K Premium Technology",
        "8000+ Channels",
        "4K Quality",
        "Global Content",
        "Premium Support"
      ]
    },
    {
      name: "TIVIONE 4K IPTV 📺",
      price: 13.99,
      features: [
        "Full 4K Streaming",
        "6000+ Channels",
        "VOD Library",
        "Stable Connection",
        "Multi-Platform"
      ]
    },
    {
      name: "B1G 4K IPTV 🎬",
      price: 16.99,
      features: [
        "Big Entertainment",
        "9000+ Channels",
        "4K Resolution",
        "Sports & Movies",
        "24/7 Service"
      ]
    }
  ];

  const handleFreeTrial = () => {
    const message = `${t.tryFree} BWIVOX IPTV. ${t.contact}?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
          <div className="container text-center">
            <h1 className="text-6xl font-extrabold mb-6">
              {t.heroTitle.split(' ')[0]} <span className="text-red-200">{t.heroTitle.split(' ')[1]}</span>
            </h1>
            <p className="text-2xl mb-8 max-w-4xl mx-auto">
              {t.heroSubtitle}
            </p>
            <Button 
              onClick={handleFreeTrial}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 text-xl"
            >
              <Zap className="mr-2" size={24} />
              {t.freeTrial}
            </Button>
          </div>
        </section>

        {/* Subscription Products */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">
              {t.subscriptionsTitle.split(' ')[0]} {t.subscriptionsTitle.split(' ')[1]} <span className="text-red-600">{t.subscriptionsTitle.split(' ')[2]}</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {subscriptionProducts.map((product, index) => (
                <ProductSubscriptionCard 
                  key={index} 
                  {...product}
                  bgColor="bg-white"
                  accentColor="text-red-600"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-red-600 text-white py-16">
          <div className="container text-center">
            <h3 className="text-4xl font-bold mb-6">
              {t.ctaTitle}
            </h3>
            <p className="text-xl mb-8">
              {t.ctaSubtitle}
            </p>
          </div>
        </section>
      </div>
    </StoreLayout>
  );
};

export default Home;
