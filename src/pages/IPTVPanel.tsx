
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Server, Settings, BarChart3, Star, CheckCircle2 } from 'lucide-react';

const IPTVPanel = () => {
  const handleContactWhatsApp = (packageName: string, credits: number, price: number) => {
    const message = `Bonjour, je suis intéressé par ${packageName} avec ${credits} crédits reseller pour €${price}. Pouvez-vous me donner plus d'informations?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const packages = [
    {
      name: "STRONG 8K IPTV",
      icon: "🚀",
      description: "Package premium 8K avec 5000+ chaînes",
      creditOptions: [
        { credits: 10, price: 89 },
        { credits: 25, price: 199 },
        { credits: 50, price: 349 },
        { credits: 100, price: 599 }
      ]
    },
    {
      name: "TREX 8K IPTV",
      icon: "🦖", 
      description: "Solution performante 8K/4K avec sports",
      creditOptions: [
        { credits: 10, price: 79 },
        { credits: 25, price: 179 },
        { credits: 50, price: 319 },
        { credits: 100, price: 549 }
      ]
    },
    {
      name: "PROMAX 4K IPTV",
      icon: "⚡",
      description: "Technologie 4K premium avec 8000+ chaînes",
      creditOptions: [
        { credits: 10, price: 119 },
        { credits: 25, price: 269 },
        { credits: 50, price: 479 },
        { credits: 100, price: 819 }
      ]
    },
    {
      name: "TIVIONE 4K IPTV",
      icon: "📺",
      description: "Streaming 4K stable multi-plateforme",
      creditOptions: [
        { credits: 10, price: 99 },
        { credits: 25, price: 219 },
        { credits: 50, price: 389 },
        { credits: 100, price: 669 }
      ]
    },
    {
      name: "B1G 4K IPTV",
      icon: "🎬",
      description: "Grande entertainment avec 9000+ chaînes",
      creditOptions: [
        { credits: 10, price: 109 },
        { credits: 25, price: 249 },
        { credits: 50, price: 439 },
        { credits: 100, price: 759 }
      ]
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Panel <span className="text-red-500">IPTV</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              Achetez des crédits reseller pour nos packages IPTV premium. 1 crédit = 1 mois d'abonnement.
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Server className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Packages Premium</h3>
              <p className="text-gray-600">Sélection complète de nos services IPTV</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Settings className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Système de Crédits</h3>
              <p className="text-gray-600">1 crédit = 1 mois d'abonnement client</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <BarChart3 className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Marges Attractives</h3>
              <p className="text-gray-600">Rentabilité optimisée pour revendeurs</p>
            </Card>
          </div>

          {/* Packages */}
          <section className="space-y-16">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{pkg.icon}</div>
                    <div>
                      <h2 className="text-3xl font-bold">{pkg.name}</h2>
                      <p className="text-red-100 text-lg">{pkg.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Options Crédits Reseller</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {pkg.creditOptions.map((option, idx) => (
                      <Card key={idx} className="p-6 border-2 border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600 mb-2">{option.credits}</div>
                          <div className="text-sm text-gray-600 mb-4">Crédits</div>
                          <div className="text-2xl font-bold text-gray-900 mb-4">€{option.price}</div>
                          <div className="text-sm text-gray-500 mb-6">
                            €{(option.price / option.credits).toFixed(1)} par crédit
                          </div>
                          <Button 
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                            onClick={() => handleContactWhatsApp(pkg.name, option.credits, option.price)}
                          >
                            <MessageCircle className="mr-2" size={16} />
                            Acheter
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="text-center mt-16 bg-red-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Information Importante</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              <strong>1 crédit = 1 mois d'abonnement client.</strong> Vous pouvez utiliser vos crédits pour activer 
              des abonnements clients sur le package IPTV correspondant. Plus vous achetez de crédits, 
              plus le prix unitaire est avantageux pour maximiser vos marges.
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default IPTVPanel;
