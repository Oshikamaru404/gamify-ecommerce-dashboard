
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';

const Subscription = () => {
  const subscriptionProducts = [
    {
      name: "BWIVOX Basic",
      price: 9.99,
      features: [
        "3000+ chaînes en direct",
        "Films et séries en VOD",
        "Qualité SD/HD",
        "Compatible avec 1 appareil",
        "Support par email"
      ]
    },
    {
      name: "BWIVOX Standard",
      price: 19.99,
      features: [
        "5000+ chaînes en direct",
        "Catalogue VOD étendu",
        "Qualité HD",
        "Compatible avec 2 appareils",
        "Support 24/7 par chat"
      ]
    },
    {
      name: "BWIVOX Premium",
      price: 29.99,
      features: [
        "7000+ chaînes en direct",
        "VOD Premium",
        "Qualité Full HD",
        "Compatible avec 3 appareils",
        "Support prioritaire"
      ]
    },
    {
      name: "BWIVOX Elite",
      price: 39.99,
      features: [
        "8000+ chaînes en direct",
        "VOD Premium + Sports",
        "Qualité 4K",
        "Compatible avec 4 appareils",
        "Support VIP"
      ]
    },
    {
      name: "BWIVOX Ultimate",
      price: 49.99,
      features: [
        "10000+ chaînes en direct",
        "Catalogue complet + Exclusivités",
        "Qualité 4K Ultra HD",
        "Compatible avec 5 appareils",
        "Support & Installation VIP"
      ]
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-white">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Abonnements <span className="text-red-500">IPTV</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              Choisissez le forfait IPTV qui vous convient le mieux. Accès illimité à des milliers de chaînes, films et séries en haute qualité.
            </p>
          </section>

          <section className="mb-20">
            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
              {subscriptionProducts.map((product, index) => (
                <ProductSubscriptionCard key={index} {...product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Subscription;
