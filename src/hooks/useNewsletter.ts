
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type NewsletterSubscription = {
  id: string;
  email: string;
  subscribed_at: string;
};

export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      console.log('Subscribing to newsletter:', email);
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions' as any)
        .insert([{ email }])
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('This email is already subscribed to our newsletter.');
        }
        console.error('Error subscribing to newsletter:', error);
        throw error;
      }
      
      console.log('Successfully subscribed to newsletter:', data);
      return data;
    },
    onSuccess: () => {
      toast.success('Successfully subscribed to our newsletter!');
    },
    onError: (error) => {
      console.error('Error subscribing to newsletter:', error);
      toast.error(error.message || 'Failed to subscribe to newsletter');
    },
  });
};
