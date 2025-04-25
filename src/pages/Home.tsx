
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';
import PlatformSection from '@/components/home/PlatformSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';

const Home = () => {
  const subscriptionProducts = [
    {
      name: "BWIVOX Standard",
      price: 9.99,
      features: [
        "Plus de 5000 chaînes en direct",
        "Films et séries en VOD",
        "Qualité HD",
        "Compatible avec 2 appareils",
        "Support par email"
      ],
      bgColor: "bg-[#1A1F2C]",
      accentColor: "text-[#0EA5E9]"
    },
    {
      name: "BWIVOX Premium",
      price: 19.99,
      features: [
        "Plus de 8000 chaînes en direct",
        "Catalogue VOD complet",
        "Qualité Full HD & 4K",
        "Compatible avec 4 appareils",
        "Support prioritaire 24/7"
      ],
      bgColor: "bg-[#1E293B]",
      accentColor: "text-[#8B5CF6]"
    },
    {
      name: "BWIVOX Ultimate",
      price: 29.99,
      features: [
        "Plus de 10000 chaînes en direct",
        "VOD Premium + Nouveautés",
        "Qualité 4K Ultra HD",
        "Compatible avec 6 appareils",
        "Support VIP & installation"
      ],
      bgColor: "bg-[#0F172A]",
      accentColor: "text-[#F97316]"
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-gradient-to-b from-[#0F172A] to-[#111827] text-white">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              BWIVOX <span className="text-[#0EA5E9]">IPTV</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-300">
              Le service de streaming IPTV premium avec plus de 10 000 chaînes en direct,
              films et séries du monde entier en qualité HD et 4K.
            </p>
            <PlatformSection />
          </section>

          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-16">Nos Forfaits <span className="text-[#0EA5E9]">Premium</span></h2>
            <div className="grid gap-8 md:grid-cols-3">
              {subscriptionProducts.map((product, index) => (
                <ProductSubscriptionCard key={index} {...product} />
              ))}
            </div>
          </section>

          <WhyChooseUs />
          <Testimonials />
        </div>
      </div>
    </StoreLayout>
  );
};

export default Home;
