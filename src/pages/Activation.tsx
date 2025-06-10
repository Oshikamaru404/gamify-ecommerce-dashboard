
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Play } from 'lucide-react';

const Activation = () => {
  const handleContactWhatsApp = (playerName: string) => {
    const message = `Bonjour, je souhaite activer ${playerName}. Pouvez-vous m'aider?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const players = [
    {
      name: "VU Player Pro",
      description: "Player professionnel pour STB et Smart TV",
      features: ["Compatible STB", "Interface moderne", "EPG intégré"]
    },
    {
      name: "IBO Pro Player",
      description: "Application premium pour tous appareils",
      features: ["Multi-plateforme", "Qualité 4K", "Contrôle parental"]
    },
    {
      name: "STZ Player",
      description: "Player optimisé pour streaming",
      features: ["Faible latence", "Stabilité maximale", "Support M3U"]
    },
    {
      name: "RELAX Player",
      description: "Interface simple et intuitive",
      features: ["Facile à utiliser", "Design épuré", "Navigation rapide"]
    },
    {
      name: "HOT Player",
      description: "Player haute performance",
      features: ["Streaming HD/4K", "Zapping rapide", "Fonctions avancées"]
    },
    {
      name: "ARC Player",
      description: "Player universel compatible",
      features: ["Tous formats", "Multi-source", "Personnalisable"]
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
              Activation <span className="text-red-600">Player</span>
            </h1>
            <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
              Activez votre player IPTV professionnel avec notre support technique expert
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {players.map((player, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all transform hover:scale-105 bg-white border-2 border-gray-100">
                <div className="text-center">
                  <Play className="h-16 w-16 text-red-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{player.name}</h3>
                  <p className="text-gray-600 mb-6">{player.description}</p>
                  <ul className="text-left text-gray-600 mb-8 space-y-2">
                    {player.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-red-600 font-bold">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3"
                    onClick={() => handleContactWhatsApp(player.name)}
                  >
                    <MessageCircle className="mr-2" size={20} />
                    Activer {player.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Activation;
