
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Play, Palette, Zap, Star, CheckCircle2 } from 'lucide-react';

const PlayerPanel = () => {
  const handleContactWhatsApp = (playerName: string) => {
    const message = `Bonjour, je suis intéressé par l'activation ${playerName} pour 12 mois. Pouvez-vous me donner plus d'informations?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const players = [
    {
      name: "VU Player Pro",
      icon: "📱",
      features: [
        "Interface moderne et intuitive",
        "Support 4K/8K",
        "Compatible multi-plateforme",
        "Activation immédiate",
        "Support technique inclus"
      ]
    },
    {
      name: "IBO Player Pro", 
      icon: "🎮",
      features: [
        "Player professionnel",
        "Optimisé pour Android TV",
        "Interface personnalisable",
        "Activation rapide",
        "Guide complet inclus"
      ]
    },
    {
      name: "STZ Player",
      icon: "📺",
      features: [
        "Streaming haute qualité",
        "Compatible Smart TV",
        "Navigation simplifiée",
        "Configuration automatique",
        "Assistance 24/7"
      ]
    },
    {
      name: "RELAX Player",
      icon: "🏠",
      features: [
        "Confort d'utilisation optimal",
        "Design épuré",
        "Performance stable",
        "Installation facile",
        "Support multilingue"
      ]
    },
    {
      name: "HOT Player",
      icon: "🔥",
      features: [
        "Technologie avancée",
        "Vitesse de chargement rapide",
        "Qualité vidéo supérieure",
        "Mise à jour automatique",
        "Configuration professionnelle"
      ]
    },
    {
      name: "ARC Player",
      icon: "⚡",
      features: [
        "Architecture moderne",
        "Performance optimisée",
        "Compatibilité étendue",
        "Interface révolutionnaire",
        "Innovation technologique"
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
              Activez votre player IPTV préféré pour 12 mois et profitez d'une expérience de streaming exceptionnelle.
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Play className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Players Premium</h3>
              <p className="text-gray-600">Large choix de players professionnels</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Palette className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Interface Optimisée</h3>
              <p className="text-gray-600">Interfaces modernes et intuitives</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Zap className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Activation Instantanée</h3>
              <p className="text-gray-600">Activation immédiate après commande</p>
            </Card>
          </div>

          {/* Players List */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Players <span className="text-red-600">Disponibles</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {players.map((player, index) => (
                <Card key={index} className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 transform hover:scale-105 hover:-translate-y-2 border-2 border-gray-100 hover:border-red-200 h-full bg-white">
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
                  
                  <div className="p-8 h-full flex flex-col relative z-10">
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-4">{player.icon}</div>
                      <h3 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        {player.name}
                      </h3>
                      <div className="relative">
                        <div className="text-lg font-semibold text-gray-700 mb-2">Activation 12 mois</div>
                        <div className="text-sm text-gray-500">Player premium</div>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <ul className="space-y-4">
                        {player.features.map((feature, idx) => (
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
                        onClick={() => handleContactWhatsApp(player.name)}
                      >
                        <MessageCircle size={20} />
                        Activer {player.name}
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
