
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useApprovedFeedbacks, FeedbackType } from '@/hooks/useFeedback';
import { Smile, Meh, Frown, Star } from 'lucide-react';

const FeedbackCards = () => {
  const { data: feedbacks, isLoading } = useApprovedFeedbacks();

  const getFeedbackIcon = (type: FeedbackType) => {
    switch (type) {
      case 'positive':
        return { icon: Smile, color: 'text-green-500' };
      case 'neutral':
        return { icon: Meh, color: 'text-yellow-500' };
      case 'negative':
        return { icon: Frown, color: 'text-red-500' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">Be the first to share your experience with our IPTV services!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {feedbacks.map((feedback) => {
        const { icon: IconComponent, color } = getFeedbackIcon(feedback.feedback_type);
        
        return (
          <Card key={feedback.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <IconComponent className={`w-8 h-8 ${color} mr-3`} />
                <span className="font-semibold text-gray-900 capitalize">
                  {feedback.feedback_type}
                </span>
              </div>
              
              <blockquote className="text-gray-700 mb-4 italic">
                "{feedback.comment}"
              </blockquote>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{feedback.name}</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(feedback.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FeedbackCards;
