
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, TrendingUp, Shield } from 'lucide-react';

const Reseller = () => {
  const handleContactWhatsApp = () => {
    const message = "Bonjour, je suis intéressé par le panel reseller BWIVOX. Pouvez-vous me donner plus d'informations?";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="bg-white">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Panel <span className="text-red-500">Reseller</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              Devenez revendeur BWIVOX et créez votre propre business IPTV avec nos outils professionnels.
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Gestion Clients</h3>
              <p className="text-gray-600">Interface complète pour gérer vos abonnés et leurs comptes</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <TrendingUp className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Statistiques</h3>
              <p className="text-gray-600">Suivi des ventes et analytics détaillés</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Support Dédié</h3>
              <p className="text-gray-600">Assistance technique prioritaire pour revendeurs</p>
            </Card>
          </div>

          <div className="bg-red-50 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-center mb-6">Avantages Revendeur</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✓</span>
                <span>Marges attractives jusqu'à 40%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✓</span>
                <span>Panel de gestion professionnel</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✓</span>
                <span>Formation complète incluse</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✓</span>
                <span>Support marketing personnalisé</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-xl"
              onClick={handleContactWhatsApp}
            >
              <MessageCircle className="mr-2" size={24} />
              Devenir Revendeur
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Reseller;
