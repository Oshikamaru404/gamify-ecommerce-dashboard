
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Play, Smartphone, Tv } from 'lucide-react';

const Activation = () => {
  const handleContactWhatsApp = () => {
    const message = "Bonjour, je souhaite activer mon player IPTV. Pouvez-vous m'aider?";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="bg-white">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Activation <span className="text-red-500">Player</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              Activez votre player IPTV en quelques étapes simples. Support technique disponible 24/7.
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Tv className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Smart TV</h3>
              <p className="text-gray-600">Activation pour Smart TV Samsung, LG, Android TV</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Smartphone className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Mobile & Tablette</h3>
              <p className="text-gray-600">Application mobile Android et iOS</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Play className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Box Android</h3>
              <p className="text-gray-600">Configuration pour box Android et MAG</p>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-xl"
              onClick={handleContactWhatsApp}
            >
              <MessageCircle className="mr-2" size={24} />
              Demander l'activation
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Activation;
