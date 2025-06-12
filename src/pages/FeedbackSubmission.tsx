import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Smile, Meh, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateFeedback, FeedbackType } from '@/hooks/useFeedback';
import StoreLayout from '@/components/store/StoreLayout';
const FeedbackSubmission = () => {
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const createFeedback = useCreateFeedback();
  const feedbackTypes = [{
    type: 'positive' as FeedbackType,
    label: 'Positive',
    emoji: '😊',
    icon: Smile,
    color: 'bg-green-500 hover:bg-green-600',
    borderColor: 'border-green-500'
  }, {
    type: 'neutral' as FeedbackType,
    label: 'Neutral',
    emoji: '😐',
    icon: Meh,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    borderColor: 'border-yellow-500'
  }, {
    type: 'negative' as FeedbackType,
    label: 'Negative',
    emoji: '☹️',
    icon: Frown,
    color: 'bg-red-500 hover:bg-red-600',
    borderColor: 'border-red-500'
  }];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !name.trim() || !comment.trim()) {
      return;
    }
    try {
      await createFeedback.mutateAsync({
        name: name.trim(),
        comment: comment.trim(),
        feedback_type: selectedType
      });
      navigate('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  return <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200 group">
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-gray-900">
                Share Your Feedback
              </CardTitle>
              <p className="text-center text-gray-600">
                We value your opinion! Please let us know about your experience with our IPTV services.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type Selection */}
                <div>
                  <Label className="text-lg font-semibold mb-4 block">
                    How was your experience?
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {feedbackTypes.map(feedback => {
                    const IconComponent = feedback.icon;
                    return <button key={feedback.type} type="button" onClick={() => setSelectedType(feedback.type)} className={`p-6 rounded-lg border-2 transition-all duration-200 ${selectedType === feedback.type ? `${feedback.borderColor} bg-white shadow-lg scale-105` : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                          <div className="text-center">
                            <div className="text-4xl mb-2">{feedback.emoji}</div>
                            
                            <div className="font-semibold text-gray-900">{feedback.label}</div>
                          </div>
                        </button>;
                  })}
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold">
                    Your Name
                  </Label>
                  <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="mt-2" required />
                </div>

                {/* Comment Input */}
                <div>
                  <Label htmlFor="comment" className="text-lg font-semibold">
                    Your Comment
                  </Label>
                  <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell us about your experience..." className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" rows={4} required />
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={!selectedType || !name.trim() || !comment.trim() || createFeedback.isPending} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg">
                  {createFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </StoreLayout>;
};
export default FeedbackSubmission;