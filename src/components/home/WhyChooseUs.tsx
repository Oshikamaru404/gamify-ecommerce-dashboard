
import React from 'react';
import { Card } from '@/components/ui/card';

const WhyChooseUs = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Ultra Rapide',
      description: 'Streaming sans tampon avec notre infrastructure optimisée'
    },
    {
      icon: '🔒',
      title: 'Sécurité Maximale',
      description: 'Connexions cryptées et navigation privée garantie'
    },
    {
      icon: '💬',
      title: 'Support 24/7',
      description: 'Notre équipe technique est disponible à tout moment'
    },
    {
      icon: '💻',
      title: 'Multi-appareils',
      description: 'Compatible avec Smart TV, Android, iOS, PC et Mac'
    }
  ];

  return (
    <section className="py-20 bg-[#111827]">
      <div className="container">
        <h2 className="mb-16 text-center text-4xl font-bold text-white">
          Pourquoi choisir BWIVOX ?
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center bg-[#1A1F2C] border-none hover:shadow-xl transition-all hover:transform hover:scale-105">
              <div className="mb-6 text-5xl">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-base text-gray-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
