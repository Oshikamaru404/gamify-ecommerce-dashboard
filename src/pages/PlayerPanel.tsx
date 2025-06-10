
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Play, Palette, Zap, Star, CheckCircle2 } from 'lucide-react';

const PlayerPanel = () => {
  const handleContactWhatsApp = (packageName: string, credits: number) => {
    const message = `Bonjour, je suis intéressé par le package ${packageName} avec ${credits} crédits pour le panel player BWIVOX. Pouvez-vous me donner plus d'informations?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const creditPackages = [
    {
      name: "Starter Pack 🌟",
      credits: 10,
      price: 25,
      features: [
        "10 Crédits inclus",
        "Interface basique",
        "Support standard",
        "Documentation complète"
      ]
    },
    {
      name: "Pro Pack ⚡",
      credits: 25,
      price: 55,
      features: [
        "25 Crédits inclus",
        "Interface avancée",
        "Support prioritaire",
        "Personnalisation basique",
        "Analytics de base"
      ]
    },
    {
      name: "Business Pack 🚀",
      credits: 50,
      price: 99,
      features: [
        "50 Crédits inclus",
        "Interface premium",
        "Support VIP 24/7",
        "Personnalisation complète",
        "Analytics avancées",
        "API Access"
      ]
    },
    {
      name: "Enterprise Pack 👑",
      credits: 100,
      price: 179,
      features: [
        "100 Crédits inclus",
        "Interface Enterprise",
        "Support dédié",
        "Branding complet",
        "Analytics Pro",
        "API illimitée",
        "Formation incluse"
      ]
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Panel <span className="text-red-500">Player</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              Créez et personnalisez votre propre application player IPTV avec notre panel avancé.
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Play className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Player Personnalisé</h3>
              <p className="text-gray-600">Créez votre propre application avec votre branding</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Palette className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Design Interface</h3>
              <p className="text-gray-600">Personnalisation complète de l'interface utilisateur</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Zap className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Performance</h3>
              <p className="text-gray-600">Streaming ultra-rapide et qualité optimisée</p>
            </Card>
          </div>

          {/* Credit Packages */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Packages <span className="text-red-600">Crédits</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {creditPackages.map((pkg, index) => (
                <Card key={index} className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 transform hover:scale-105 hover:-translate-y-2 border-2 border-gray-100 hover:border-red-200 h-full bg-white">
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
                  
                  {/* Popular badge for certain plans */}
                  {(pkg.credits === 50 || pkg.credits === 100) && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
                      <Star size={12} className="fill-current" />
                      Populaire
                    </div>
                  )}

                  <div className="p-8 h-full flex flex-col relative z-10">
                    <div className="text-center mb-8">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        {pkg.name}
                      </h3>
                      <div className="relative">
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-5xl font-bold text-red-600 transition-all duration-300">
                            €{pkg.price}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-gray-700 mb-2">{pkg.credits} Crédits</div>
                        <div className="text-sm text-gray-500">Package unique</div>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <ul className="space-y-4">
                        {pkg.features.map((feature, idx) => (
                          <li 
                            key={idx} 
                            className="flex items-start gap-3 text-gray-700 transition-all duration-300 hover:translate-x-1"
                          >
                            <CheckCircle2 
                              size={20} 
                              className="mt-0.5 text-red-600 transition-colors duration-300" 
                            />
                            <span className="text-base leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Button 
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center gap-2 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={() => handleContactWhatsApp(pkg.name, pkg.credits)}
                      >
                        <MessageCircle size={20} />
                        Acheter {pkg.credits} Crédits
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default PlayerPanel;
