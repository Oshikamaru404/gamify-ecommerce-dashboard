
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
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
              Abonnements <span className="text-red-600">IPTV</span>
            </h1>
            <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
              Choisissez parmi nos services IPTV premium avec des milliers de chaînes, 
              films et séries en qualité 8K Ultra HD
            </p>
          </section>

          <section className="mb-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subscriptionProducts.map((product, index) => (
                <ProductSubscriptionCard 
                  key={index} 
                  {...product}
                  bgColor="bg-white"
                  accentColor="text-red-600"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Subscription;
