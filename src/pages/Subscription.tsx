
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';

const Subscription = () => {
  const subscriptionProducts = [
    {
      name: "STRONG 8K IPTV",
      price: 12.99,
      features: [
        "8K Ultra HD Quality",
        "5000+ Live Channels",
        "Movies & Series VOD",
        "Anti-Freeze Technology",
        "24/7 Support",
        "Compatible with all devices",
        "EPG Guide included"
      ]
    },
    {
      name: "ULTRA 8K IPTV",
      price: 15.99,
      features: [
        "8K Premium Quality",
        "7000+ Live Channels",
        "Premium VOD Library",
        "Multi-Device Support",
        "VIP Support",
        "International channels",
        "Catch-up TV"
      ]
    },
    {
      name: "TREX IPTV",
      price: 10.99,
      features: [
        "HD/4K Streaming",
        "4000+ Channels",
        "Sports Packages",
        "Movie Collection",
        "Fast Servers",
        "No buffering",
        "Easy setup"
      ]
    },
    {
      name: "PROMAX OTT IPTV",
      price: 18.99,
      features: [
        "OTT Technology",
        "8000+ Channels",
        "4K/8K Quality",
        "Global Content",
        "Premium Support",
        "Adult content available",
        "Regional packages"
      ]
    },
    {
      name: "TIVIONE IPTV",
      price: 13.99,
      features: [
        "Full HD Streaming",
        "6000+ Channels",
        "VOD Library",
        "Stable Connection",
        "Multi-Platform",
        "Family friendly",
        "Kids channels included"
      ]
    },
    {
      name: "B1G IPTV",
      price: 16.99,
      features: [
        "Big Entertainment",
        "9000+ Channels",
        "4K Resolution",
        "Sports & Movies",
        "24/7 Service",
        "Premium sports packages",
        "Live events coverage"
      ]
    },
    {
      name: "MAX OTT IPTV",
      price: 20.99,
      features: [
        "Maximum Quality",
        "10000+ Channels",
        "8K Streaming",
        "Complete Package",
        "Elite Support",
        "All premium channels",
        "Exclusive content"
      ]
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-20">
          <section className="mb-24 text-center">
            <div className="animate-fade-in">
              <h1 className="mb-8 text-6xl font-extrabold tracking-tight text-gray-900">
                Abonnements <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">IPTV</span>
              </h1>
              <p className="mx-auto mb-12 max-w-4xl text-2xl text-gray-600 leading-relaxed">
                Choisissez parmi nos services IPTV premium avec des milliers de chaînes, 
                films et séries en qualité 8K Ultra HD
              </p>
              <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Activé instantanément</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Support 24/7</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Sans engagement</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subscriptionProducts.map((product, index) => (
                <div 
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <ProductSubscriptionCard 
                    {...product}
                    bgColor="bg-white"
                    accentColor="text-red-600"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Additional trust indicators */}
          <section className="text-center py-16 border-t border-gray-200">
            <div className="animate-fade-in">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                Pourquoi choisir nos services IPTV ?
              </h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">8K</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Qualité Ultra HD</h4>
                  <p className="text-gray-600 text-sm">Streaming en 8K pour une expérience visuelle exceptionnelle</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">24/7</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Support Premium</h4>
                  <p className="text-gray-600 text-sm">Assistance technique disponible 24h/24 et 7j/7</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">∞</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contenu Illimité</h4>
                  <p className="text-gray-600 text-sm">Accès à des milliers de chaînes et contenus VOD</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Subscription;
