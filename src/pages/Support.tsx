
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Phone, Clock } from 'lucide-react';

const Support = () => {
  const handleWhatsApp = () => {
    const message = "Bonjour, j'ai besoin d'aide avec mon service IPTV.";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
              Support <span className="text-red-600">Client</span>
            </h1>
            <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
              Notre équipe support est disponible 24/7 pour vous aider
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-2xl transition-all bg-white">
              <MessageCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">WhatsApp</h3>
              <p className="text-gray-600 mb-6">Support instantané via WhatsApp</p>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleWhatsApp}
              >
                Contacter via WhatsApp
              </Button>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-2xl transition-all bg-white">
              <Mail className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Email</h3>
              <p className="text-gray-600 mb-6">support@bwivox.com</p>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.location.href = 'mailto:support@bwivox.com'}
              >
                Envoyer un Email
              </Button>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-2xl transition-all bg-white">
              <Clock className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Horaires</h3>
              <p className="text-gray-600 mb-6">Support 24h/24, 7j/7</p>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleWhatsApp}
              >
                Contact Immédiat
              </Button>
            </Card>
          </div>

          <section className="bg-white rounded-lg p-12 shadow-lg">
            <h2 className="text-4xl font-bold text-center mb-8">Questions Fréquentes</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-red-600 pl-6">
                <h3 className="text-xl font-semibold mb-2">Comment installer mon IPTV ?</h3>
                <p className="text-gray-600">Nous fournissons un guide d'installation complet et un support personnalisé.</p>
              </div>
              <div className="border-l-4 border-red-600 pl-6">
                <h3 className="text-xl font-semibold mb-2">Quels appareils sont compatibles ?</h3>
                <p className="text-gray-600">Smart TV, Android, iOS, PC, MAC, STB et bien plus.</p>
              </div>
              <div className="border-l-4 border-red-600 pl-6">
                <h3 className="text-xl font-semibold mb-2">Que faire en cas de problème ?</h3>
                <p className="text-gray-600">Contactez-nous immédiatement via WhatsApp pour une assistance rapide.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Support;
