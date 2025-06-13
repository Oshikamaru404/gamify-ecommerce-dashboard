
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Users, MessageSquare } from 'lucide-react';
import FeedbackManagement from '@/components/admin/FeedbackManagement';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import { useToast } from '@/hooks/use-toast';
import { deleteAllPublishedFeedback, resetProductSales } from '@/lib/adminUtils';

const Content = () => {
  const { toast } = useToast();

  const handleDeleteAllFeedback = async () => {
    if (!confirm('Are you sure you want to delete all published feedback? This action cannot be undone.')) {
      return;
    }

    try {
      const deletedCount = await deleteAllPublishedFeedback();
      toast({
        title: 'Success',
        description: `Successfully deleted ${deletedCount} published feedback entries`,
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete published feedback',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">
          Manage customer feedback, reviews, and newsletter subscriptions.
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={handleDeleteAllFeedback}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All Published Feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Management */}
      <FeedbackManagement />

      {/* Newsletter Management */}
      <NewsletterManagement />
    </div>
  );
};

export default Content;
