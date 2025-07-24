import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CreditCard, Download, Play } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const HowToBuy = () => {
  const { data: siteSettings } = useSiteSettings();
  
  // Get WhatsApp number from site settings
  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const handleWhatsApp = () => {
    const message = "Bonjour, je souhaite acheter un abonnement IPTV. Pouvez-vous me guider?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const steps = [
    {
      icon: MessageCircle,
      title: "1. Contactez-nous",
      description: "Contactez-nous via WhatsApp pour choisir votre abonnement"
    },
    {
      icon: CreditCard,
      title: "2. Paiement",
      description: "Effectuez le paiement de manière sécurisée"
    },
    {
      icon: Download,
      title: "3. Réception",
      description: "Recevez vos identifiants et liens de téléchargement"
    },
    {
      icon: Play,
      title: "4. Activation",
      description: "Installation et activation avec notre support"
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
              Comment <span className="text-red-600">Acheter</span>
            </h1>
            <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
              Processus simple et rapide pour obtenir votre abonnement IPTV
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-2xl transition-all bg-white">
                <step.icon className="h-16 w-16 text-red-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
            ))}
          </div>

          <section className="bg-white rounded-lg p-12 shadow-lg mb-16">
            <h2 className="text-4xl font-bold text-center mb-8">Méthodes de Paiement</h2>
            <div className="grid gap-6 md:grid-cols-3 text-center">
              <div className="p-6">
                <CreditCard className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Carte Bancaire</h3>
                <p className="text-gray-600">Paiement sécurisé par carte</p>
              </div>
              <div className="p-6">
                <MessageCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">PayPal</h3>
                <p className="text-gray-600">Paiement via PayPal</p>
              </div>
              <div className="p-6">
                <CreditCard className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Virement</h3>
                <p className="text-gray-600">Virement bancaire</p>
              </div>
            </div>
          </section>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-2xl"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="mr-3" size={24} />
              Commencer l'achat
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default HowToBuy;
