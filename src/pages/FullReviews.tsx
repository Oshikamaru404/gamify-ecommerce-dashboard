
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Check, ThumbsUp } from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const FullReviews = () => {
  const { t } = useLanguage();

  const fullReviews = [
    {
      id: 1,
      name: "Jean-Marc L.",
      rating: 5,
      title: "Service IPTV exceptionnel - Dépassé mes attentes",
      comment: "J'utilise BWIVOX IPTV depuis 8 mois maintenant et je suis absolument ravi. La qualité 4K est parfaite, même pendant les heures de pointe. J'ai testé plusieurs services IPTV auparavant mais celui-ci est vraiment au-dessus du lot. Les chaînes françaises sont nombreuses et de qualité, les films sont mis à jour régulièrement. Le support client est réactif - j'ai eu un problème technique résolu en moins de 2 heures. Je recommande vivement !",
      date: "2024-01-15",
      verified: true,
      helpful: 23,
      subscription: "12 mois Premium"
    },
    {
      id: 2,
      name: "Sophie M.",
      rating: 5,
      title: "Parfait pour toute la famille",
      comment: "Nous avons souscrit à l'abonnement famille et c'est exactement ce que nous cherchions. Les enfants peuvent regarder leurs dessins animés sur la tablette pendant que nous regardons les informations sur la TV principale. L'interface est intuitive, même ma mère de 75 ans arrive à s'en servir ! Les chaînes pour enfants sont nombreuses et sécurisées. Le prix est très raisonnable comparé aux abonnements traditionnels. Nous économisons plus de 50€ par mois.",
      date: "2024-01-10",
      verified: true,
      helpful: 18,
      subscription: "6 mois Famille"
    },
    {
      id: 3,
      name: "Ahmed K.",
      rating: 5,
      title: "Idéal pour les amateurs de sport",
      comment: "En tant que grand fan de football, j'étais sceptique au début mais BWIVOX IPTV a complètement changé ma vision. Toutes les chaînes sportives sont disponibles en HD, pas de décalage pendant les matchs importants. J'ai pu suivre la Coupe du Monde, la Ligue des Champions, et même des championnats moins connus. La fonctionnalité de replay est fantastique quand je rate un match. Le streaming est fluide même sur plusieurs appareils simultanément.",
      date: "2024-01-08",
      verified: true,
      helpful: 31,
      subscription: "12 mois Sport+"
    },
    {
      id: 4,
      name: "Marie D.",
      rating: 4,
      title: "Très bon rapport qualité/prix",
      comment: "J'ai choisi BWIVOX IPTV après avoir comparé plusieurs services. Le prix est vraiment attractif et le service est à la hauteur. J'ai eu quelques petites coupures les premiers jours mais le support m'a aidé à optimiser ma configuration internet et depuis plus aucun problème. La bibliothèque de films est impressionnante, j'ai découvert des films que je cherchais depuis longtemps. L'activation a été instantanée comme promis.",
      date: "2024-01-05",
      verified: true,
      helpful: 15,
      subscription: "3 mois Standard"
    },
    {
      id: 5,
      name: "Carlos R.",
      rating: 5,
      title: "Solution parfaite pour expatriés",
      comment: "Vivant à l'étranger, je cherchais un moyen de regarder les chaînes françaises. BWIVOX IPTV est la solution parfaite ! Non seulement j'ai accès à toutes les chaînes françaises, mais aussi aux chaînes internationales. La qualité est excellente malgré la distance. Mes enfants peuvent suivre leurs programmes préférés et garder le contact avec la culture française. Le service client comprend parfaitement les besoins des expatriés.",
      date: "2024-01-03",
      verified: true,
      helpful: 27,
      subscription: "12 mois International"
    },
    {
      id: 6,
      name: "Fatima B.",
      rating: 5,
      title: "Installation simple et service fiable",
      comment: "J'étais inquiète de la complexité d'installation mais tout s'est fait en 10 minutes ! Les instructions sont claires et le support est disponible si besoin. Depuis 4 mois d'utilisation, je n'ai eu aucun problème majeur. Les chaînes arabes sont nombreuses et de qualité, parfait pour suivre les actualités de mon pays d'origine. Les séries et films sont mis à jour régulièrement. Je recommande sans hésitation !",
      date: "2024-01-01",
      verified: true,
      helpful: 19,
      subscription: "6 mois Multiculturel"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const averageRating = fullReviews.reduce((sum, review) => sum + review.rating, 0) / fullReviews.length;

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center mb-8">
              <Link 
                to="/" 
                className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </Link>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Full Customer Reviews
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                Detailed experiences from our satisfied customers
              </p>
              
              {/* Rating Summary */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-3xl font-bold">{averageRating.toFixed(1)}/5</div>
                <div className="text-sm text-white/80">Based on {fullReviews.length} verified reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            {fullReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{review.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {review.verified && (
                          <div className="flex items-center text-green-600">
                            <Check className="w-4 h-4 mr-1" />
                            Verified Purchase
                          </div>
                        )}
                        <span>•</span>
                        <span>{review.subscription}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{review.title}</h4>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-base">
                  {review.comment}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful} found this helpful</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join Our Satisfied Customers
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Experience premium IPTV services with our 30-day money-back guarantee. Over 10,000 happy customers can't be wrong!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/subscription"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Subscription
                </Link>
                <Link 
                  to="/support"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-all duration-300"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default FullReviews;
