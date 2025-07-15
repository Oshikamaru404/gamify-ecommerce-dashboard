
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Check, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';
import { useApprovedFeedbacks } from '@/hooks/useFeedback';
import { useLanguage } from '@/contexts/LanguageContext';

const FullReviews = () => {
  const { t } = useLanguage();
  const { data: feedbacks = [], isLoading } = useApprovedFeedbacks();

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return { emoji: '😊', color: 'text-green-600' };
      case 'neutral':
        return { emoji: '😐', color: 'text-yellow-600' };
      case 'negative':
        return { emoji: '☹️', color: 'text-red-600' };
      default:
        return { emoji: '😊', color: 'text-green-600' };
    }
  };

  const renderStars = (type: string) => {
    let rating = 5;
    if (type === 'neutral') rating = 3;
    if (type === 'negative') rating = 2;
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, feedback) => {
        if (feedback.feedback_type === 'positive') return sum + 5;
        if (feedback.feedback_type === 'neutral') return sum + 3;
        if (feedback.feedback_type === 'negative') return sum + 2;
        return sum + 5;
      }, 0) / feedbacks.length
    : 5;

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                  Loading customer experiences...
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, j) => (
                        <div key={j} className="w-5 h-5 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

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
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                Authentic experiences from our satisfied customers
              </p>
              
              {/* Rating Summary */}
              {feedbacks.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center mb-2">
                    {renderStars('positive')}
                  </div>
                  <div className="text-3xl font-bold">{averageRating.toFixed(1)}/5</div>
                  <div className="text-sm text-white/80">Based on {feedbacks.length} verified reviews</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {feedbacks.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Reviews Yet
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Be the first to share your experience with our IPTV services!
              </p>
              <Link 
                to="/feedback"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Write a Review
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {feedbacks.map((feedback) => {
                const { emoji, color } = getFeedbackIcon(feedback.feedback_type);
                
                return (
                  <div key={feedback.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-semibold text-lg">
                            {feedback.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{feedback.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <div className="flex items-center text-green-600">
                              <Check className="w-4 h-4 mr-1" />
                              Verified Customer
                            </div>
                            <span>•</span>
                            <span className={`flex items-center ${color}`}>
                              <span className="mr-1">{emoji}</span>
                              {feedback.feedback_type.charAt(0).toUpperCase() + feedback.feedback_type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(feedback.feedback_type)}
                      </div>
                    </div>
                    
                    <blockquote className="text-gray-700 mb-6 leading-relaxed text-base italic">
                      "{feedback.comment}"
                    </blockquote>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(feedback.created_at)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Shield className="w-4 h-4" />
                        <span>Verified Purchase</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join Our Satisfied Customers
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Experience premium IPTV services with our 30-day money-back guarantee. 
                {feedbacks.length > 0 && ` Over ${feedbacks.length} happy customers can't be wrong!`}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/subscription"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Subscription
                </Link>
                <Link 
                  to="/feedback"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-all duration-300"
                >
                  Write a Review
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
