
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Server, Settings, BarChart3 } from 'lucide-react';

const IPTVPanel = () => {
  const handleContactWhatsApp = () => {
    const message = "Bonjour, je suis intéressé par le panel IPTV BWIVOX. Pouvez-vous me donner plus d'informations?";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="bg-white">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Panel <span className="text-red-500">IPTV</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              Solution complète de panel IPTV pour gérer votre service de streaming professionnel.
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Server className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Serveurs Dédiés</h3>
              <p className="text-gray-600">Infrastructure haute performance avec uptime 99.9%</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Settings className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Configuration</h3>
              <p className="text-gray-600">Interface intuitive pour configurer vos services</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <BarChart3 className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Monitoring</h3>
              <p className="text-gray-600">Surveillance en temps réel de vos services</p>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-xl"
              onClick={handleContactWhatsApp}
            >
              <MessageCircle className="mr-2" size={24} />
              Demander un Panel IPTV
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default IPTVPanel;
