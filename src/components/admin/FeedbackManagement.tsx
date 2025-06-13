
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, MessageSquare, Star } from 'lucide-react';
import { useFeedbacks, useUpdateFeedbackStatus } from '@/hooks/useFeedback';

const FeedbackManagement = () => {
  const { data: feedbacks = [], isLoading } = useFeedbacks();
  const updateFeedbackStatus = useUpdateFeedbackStatus();

  const pendingFeedbacks = feedbacks.filter(feedback => feedback.status === 'pending');

  const handleApprove = (id: string) => {
    updateFeedbackStatus.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: string) => {
    updateFeedbackStatus.mutate({ id, status: 'rejected' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading reviews...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Customer Reviews Management
        </CardTitle>
        <p className="text-sm text-gray-600">
          Review and approve customer feedback to display on the home page
        </p>
      </CardHeader>
      <CardContent>
        {pendingFeedbacks.length > 0 ? (
          <div className="space-y-4">
            {pendingFeedbacks.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{feedback.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {feedback.feedback_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{feedback.comment}</p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(feedback.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(feedback.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(feedback.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Reviews</h3>
            <p className="text-gray-600">All customer reviews have been processed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackManagement;
