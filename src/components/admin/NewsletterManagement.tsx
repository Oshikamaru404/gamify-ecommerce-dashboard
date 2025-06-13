
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Mail, Users, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

const NewsletterManagement = () => {
  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['newsletter-subscriptions'],
    queryFn: async () => {
      console.log('Fetching newsletter subscriptions...');
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching newsletter subscriptions:', error);
        throw error;
      }
      
      console.log('Successfully fetched newsletter subscriptions:', data);
      return data;
    },
  });

  const exportSubscriptions = () => {
    const csvContent = [
      ['Email', 'Subscribed Date'],
      ...subscriptions.map(sub => [
        sub.email,
        format(parseISO(sub.subscribed_at), 'yyyy-MM-dd HH:mm:ss')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscriptions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Newsletter Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading subscriptions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Newsletter Subscriptions
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              <Users className="h-3 w-3 mr-1" />
              {subscriptions.length} subscribers
            </Badge>
            <Button
              variant="outline"
              onClick={exportSubscriptions}
              disabled={subscriptions.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Manage and export your newsletter subscriber list
        </p>
      </CardHeader>
      <CardContent>
        {subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscription Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.email}</TableCell>
                    <TableCell>{format(parseISO(subscription.subscribed_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscriptions</h3>
            <p className="text-gray-600">No newsletter subscriptions found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterManagement;
