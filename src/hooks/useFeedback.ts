
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type FeedbackType = 'positive' | 'neutral' | 'negative';

export type Feedback = {
  id: string;
  name: string;
  comment: string;
  feedback_type: FeedbackType;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string | null;
};

export const useFeedbacks = () => {
  return useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      console.log('Fetching feedbacks from database...');
      
      const { data, error } = await supabase
        .from('feedbacks' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
      }
      
      console.log('Successfully fetched feedbacks:', data);
      return data as Feedback[];
    },
  });
};

export const useApprovedFeedbacks = () => {
  return useQuery({
    queryKey: ['approved-feedbacks'],
    queryFn: async () => {
      console.log('Fetching approved feedbacks from database...');
      
      const { data, error } = await supabase
        .from('feedbacks' as any)
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error('Error fetching approved feedbacks:', error);
        throw error;
      }
      
      console.log('Successfully fetched approved feedbacks:', data);
      return data as Feedback[];
    },
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (feedbackData: Omit<Feedback, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
      console.log('Creating new feedback:', feedbackData);
      
      const { data, error } = await supabase
        .from('feedbacks' as any)
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
        .from('feedbacks' as any)
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
