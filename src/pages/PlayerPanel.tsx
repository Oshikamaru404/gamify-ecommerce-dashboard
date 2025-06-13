
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Play, Palette, Zap, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const PlayerPanel = () => {
  const { t } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();

  const handleContactWhatsApp = (playerName: string, credits: number, price: number) => {
    const message = `${t.contact} ${playerName} - ${credits} credits - ${t.currency}${price}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Filter only player packages
  const playerPackages = packages?.filter(pkg => pkg.category === 'player' && pkg.status !== 'inactive') || [];

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading player packages...</p>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              {t.playerPanelTitle}
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              {t.playerPanelSubtitle}
            </p>
            
            {/* Credits Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
              <p className="text-blue-800 font-medium">
                💡 Each credit is equivalent to 1 month of service activation
              </p>
            </div>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Play className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.premiumQuality}</h3>
              <p className="text-gray-600">{t.premiumQualityDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Palette className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.fastActivation}</h3>
              <p className="text-gray-600">{t.fastActivationDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Zap className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.instantActivation}</h3>
              <p className="text-gray-600">{t.fastActivationDesc}</p>
            </Card>
          </div>

          <section className="space-y-16">
            {playerPackages.map((player, index) => (
              <div key={player.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{player.icon || '📱'}</div>
                    <div>
                      <h2 className="text-3xl font-bold">{player.name}</h2>
                      <p className="text-red-100 text-lg">{player.description || t.premiumQualityDesc}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Features:</h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {(player.features || [t.premiumQuality, t.ultraHd4k, t.fastActivation, t.instantActivation, t.support247]).map((feature, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <CheckCircle2 
                            size={20} 
                            className="mt-0.5 text-red-600" 
                          />
                          <span className="text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.manageSubscriptions}</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      { credits: 10, price: player.price_10_credits },
                      { credits: 25, price: player.price_25_credits },
                      { credits: 50, price: player.price_50_credits },
                      { credits: 100, price: player.price_100_credits },
                    ].filter(option => option.price).map((option, idx) => (
                      <Card key={idx} className="p-6 border-2 border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600 mb-2">{option.credits}</div>
                          <div className="text-sm text-gray-600 mb-2">Credits</div>
                          <div className="text-xs text-blue-600 mb-4">({option.credits} months)</div>
                          <div className="text-2xl font-bold text-gray-900 mb-4">{t.currency}{option.price}</div>
                          <div className="text-sm text-gray-500 mb-6">
                            {t.currency}{(option.price! / option.credits).toFixed(1)} {t.perMonth}
                          </div>
                          <Button 
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                            onClick={() => handleContactWhatsApp(player.name, option.credits, option.price!)}
                          >
                            <MessageCircle className="mr-2" size={16} />
                            {t.buyNow}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {playerPackages.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Player Packages Available</h3>
              <p className="text-gray-600">Player packages are currently being updated. Please check back later.</p>
            </div>
          )}

          <div className="text-center mt-16 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-4">
              <p className="text-blue-800 font-medium">
                💡 Remember: 1 credit = 1 month of service
              </p>
            </div>
            
            <div className="bg-red-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.needHelp}</h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {t.fastActivationDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default PlayerPanel;
