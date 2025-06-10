
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Play, CheckCircle2, Calendar } from 'lucide-react';

const Activation = () => {
  const handleContactWhatsApp = () => {
    const message = "Bonjour, je souhaite activer l'abonnement 12 mois pour player IPTV. Pouvez-vous m'aider?";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const subscriptionFeatures = [
    "Activation pour 12 mois complets",
    "Compatible avec tous les players",
    "Support technique inclus",
    "Mise à jour automatique",
    "Garantie de fonctionnement",
    "Configuration assistée",
    "Accès prioritaire au support",
    "Documentation complète",
    "Sauvegarde des paramètres",
    "Migration de données incluse"
  ];

  return (
    <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
              Activation <span className="text-red-600">Player</span>
            </h1>
            <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
              Activez votre player IPTV professionnel avec notre abonnement annuel complet
            </p>
          </section>

          <div className="max-w-2xl mx-auto mb-12">
            <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 transform hover:scale-105 border-2 border-gray-100 hover:border-red-200 bg-white">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
              
              {/* Popular badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 animate-pulse">
                <Calendar size={16} />
                Recommandé
              </div>

              <div className="p-12 text-center">
                <div className="mb-8">
                  <Play className="h-24 w-24 text-red-600 mx-auto mb-6" />
                  <h3 className="mb-6 text-4xl font-bold text-gray-900">
                    Abonnement Player 📱
                  </h3>
                  <div className="relative mb-6">
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-6xl font-bold text-red-600">
                        €99
                      </span>
                      <span className="ml-3 text-2xl text-gray-600">/ 12 mois</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-700 mb-2">Activation Complète</div>
                    <div className="text-base text-gray-500">Valide pendant 12 mois</div>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-6">Inclus dans l'abonnement :</h4>
                  <div className="grid gap-4 md:grid-cols-2 text-left">
                    {subscriptionFeatures.map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 text-gray-700 transition-all duration-300 hover:translate-x-1"
                      >
                        <CheckCircle2 
                          size={20} 
                          className="mt-0.5 text-red-600 flex-shrink-0" 
                        />
                        <span className="text-base leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center gap-3 py-6 text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={handleContactWhatsApp}
                  >
                    <MessageCircle size={24} />
                    Activer Mon Player - 12 Mois
                  </Button>
                  
                  <p className="text-lg text-gray-600 mt-4">
                    🔒 Paiement sécurisé • ⚡ Activation immédiate • 🎯 Support garanti
                  </p>
                </div>
              </div>

              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-8 left-8 w-12 h-12 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 right-8 w-8 h-8 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            </Card>
          </div>

          {/* Additional information */}
          <section className="text-center py-16 border-t border-gray-200">
            <div className="animate-fade-in">
              <h3 className="text-3xl font-semibold text-gray-900 mb-8">
                Pourquoi choisir notre activation player ?
              </h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">12M</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Abonnement Annuel</h4>
                  <p className="text-gray-600">Activation complète valide pendant 12 mois complets</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Activation Immédiate</h4>
                  <p className="text-gray-600">Votre player est activé instantanément après confirmation</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🛡️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Support Garanti</h4>
                  <p className="text-gray-600">Assistance technique complète pendant toute la durée</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Activation;
