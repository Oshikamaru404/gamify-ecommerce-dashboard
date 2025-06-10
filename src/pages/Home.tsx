
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';

const Home = () => {
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

  return (
    <StoreLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
          <div className="container text-center">
            <h1 className="text-6xl font-extrabold mb-6">
              BWIVOX <span className="text-red-200">IPTV</span>
            </h1>
            <p className="text-2xl mb-8 max-w-4xl mx-auto">
              Découvrez nos services IPTV premium avec des milliers de chaînes en direct, 
              films et séries en qualité 8K Ultra HD
            </p>
          </div>
        </section>

        {/* Subscription Products */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">
              Nos Abonnements <span className="text-red-600">IPTV</span>
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
              Prêt à commencer votre expérience IPTV ?
            </h3>
            <p className="text-xl mb-8">
              Contactez-nous maintenant pour obtenir votre abonnement
            </p>
          </div>
        </section>
      </div>
    </StoreLayout>
  );
};

export default Home;
