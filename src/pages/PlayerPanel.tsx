
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Play, Palette, Zap } from 'lucide-react';

const PlayerPanel = () => {
  const handleContactWhatsApp = () => {
    const message = "Bonjour, je suis intéressé par le panel player BWIVOX. Pouvez-vous me donner plus d'informations?";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="bg-white">
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

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-xl"
              onClick={handleContactWhatsApp}
            >
              <MessageCircle className="mr-2" size={24} />
              Créer Mon Player
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default PlayerPanel;
