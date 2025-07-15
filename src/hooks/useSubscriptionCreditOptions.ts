
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type SubscriptionCreditOption = {
  id: string;
  package_id: string;
  credits: number;
  months: number;
  price: number;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export const useSubscriptionCreditOptions = (packageId?: string) => {
  return useQuery({
    queryKey: ['subscription-credit-options', packageId],
    queryFn: async () => {
      console.log('Fetching subscription credit options from database...');
      
      let query = supabase
        .from('subscription_credit_options')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (packageId) {
        query = query.eq('package_id', packageId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching subscription credit options:', error);
        throw error;
      }
      
      console.log('Successfully fetched subscription credit options:', data);
      return data as SubscriptionCreditOption[];
    },
  });
};

export const useCreateSubscriptionCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (optionData: Omit<SubscriptionCreditOption, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating new subscription credit option:', optionData);
      
      const { data, error } = await supabase
        .from('subscription_credit_options')
        .insert([optionData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating subscription credit option:', error);
        throw error;
      }
      
      console.log('Successfully created subscription credit option:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-credit-options'] });
      toast.success('Credit option created successfully');
    },
    onError: (error) => {
      console.error('Error creating subscription credit option:', error);
      toast.error('Failed to create credit option');
    },
  });
};

export const useUpdateSubscriptionCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...optionData }: Partial<SubscriptionCreditOption> & { id: string }) => {
      console.log('Updating subscription credit option:', id, optionData);
      
      const cleanData = Object.fromEntries(
        Object.entries(optionData).filter(([_, value]) => value !== undefined)
      );
      
      const { data, error } = await supabase
        .from('subscription_credit_options')
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating subscription credit option:', error);
        throw error;
      }
      
      console.log('Successfully updated subscription credit option:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-credit-options'] });
      toast.success('Credit option updated successfully');
    },
    onError: (error) => {
      console.error('Error updating subscription credit option:', error);
      toast.error('Failed to update credit option');
    },
  });
};

export const useDeleteSubscriptionCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting subscription credit option:', id);
      
      const { error } = await supabase
        .from('subscription_credit_options')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting subscription credit option:', error);
        throw error;
      }
      
      console.log('Successfully deleted subscription credit option');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-credit-options'] });
      toast.success('Credit option deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting subscription credit option:', error);
      toast.error('Failed to delete credit option');
    },
  });
};
