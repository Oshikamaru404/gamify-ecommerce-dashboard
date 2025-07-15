
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

export type FeedbackType = Database['public']['Enums']['feedback_type'];

export type Feedback = Database['public']['Tables']['feedbacks']['Row'];

export const useFeedbacks = () => {
  return useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      console.log('Fetching feedbacks from database...');
      
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
      }
      
      console.log('Successfully fetched feedbacks:', data);
      return data;
    },
  });
};

export const useApprovedFeedbacks = () => {
  return useQuery({
    queryKey: ['approved-feedbacks'],
    queryFn: async () => {
      console.log('Fetching approved feedbacks from database...');
      
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching approved feedbacks:', error);
        throw error;
      }
      
      console.log('Successfully fetched approved feedbacks:', data);
      return data;
    },
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (feedbackData: Database['public']['Tables']['feedbacks']['Insert']) => {
      console.log('Creating new feedback:', feedbackData);
      
      const { data, error } = await supabase
        .from('feedbacks')
        .insert([{ ...feedbackData, status: 'pending' }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating feedback:', error);
        throw error;
      }
      
      console.log('Successfully created feedback:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast.success('Feedback submitted successfully! It will be reviewed before appearing on the site.');
    },
    onError: (error) => {
      console.error('Error creating feedback:', error);
      toast.error('Failed to submit feedback');
    },
  });
};

export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      console.log('Updating feedback status:', id, status);
      
      const { data, error } = await supabase
        .from('feedbacks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating feedback status:', error);
        throw error;
      }
      
      console.log('Successfully updated feedback status:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['approved-feedbacks'] });
      toast.success('Feedback status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating feedback status:', error);
      toast.error('Failed to update feedback status');
    },
  });
};
