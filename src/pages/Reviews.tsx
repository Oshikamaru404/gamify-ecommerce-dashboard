
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Check } from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const Reviews = () => {
  const { t } = useLanguage();

  const reviews = [
    {
      id: 1,
      name: "Jean-Marc L.",
      rating: 5,
      comment: "Excellent service IPTV! Qualité 4K parfaite, jamais de coupures. Le support client répond rapidement.",
      date: "2024-01-15",
      verified: true
    },
    {
      id: 2,
      name: "Sophie M.",
      rating: 5,
      comment: "Très satisfaite de mon abonnement. Large choix de chaînes et films, interface facile à utiliser.",
      date: "2024-01-10",
      verified: true
    },
    {
      id: 3,
      name: "Ahmed K.",
      rating: 5,
      comment: "Service fiable et stable. Les chaînes sportives sont excellentes, pas de décalage pendant les matchs.",
      date: "2024-01-08",
      verified: true
    },
    {
      id: 4,
      name: "Marie D.",
      rating: 4,
      comment: "Bon rapport qualité/prix. Installation simple et rapide. Quelques petites coupures mais globalement satisfaisant.",
      date: "2024-01-05",
      verified: true
    },
    {
      id: 5,
      name: "Carlos R.",
      rating: 5,
      comment: "Parfait pour ma famille! Nous pouvons regarder différentes chaînes en même temps sur plusieurs appareils.",
      date: "2024-01-03",
      verified: true
    },
    {
      id: 6,
      name: "Fatima B.",
      rating: 5,
      comment: "Je recommande vivement! Activation instantanée et large choix de chaînes internationales.",
      date: "2024-01-01",
      verified: true
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

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
                Customer Reviews
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                What our customers say about BWIVOX IPTV services
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold text-sm">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.name}</h3>
                      {review.verified && (
                        <div className="flex items-center text-xs text-green-600">
                          <Check className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  "{review.comment}"
                </p>
                
                <div className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Experience BWIVOX IPTV?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of satisfied customers and enjoy premium IPTV services with our 30-day money-back guarantee.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/subscription"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  View Subscriptions
                </Link>
                <Link 
                  to="/full-reviews"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-all duration-300"
                >
                  Read Full Reviews
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Reviews;
