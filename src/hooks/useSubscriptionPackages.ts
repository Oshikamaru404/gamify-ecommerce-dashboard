
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type SubscriptionPackage = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  icon_url: string | null;
  features: string[] | null;
  price_3_credits: number | null;
  price_6_credits: number | null;
  price_12_credits: number | null;
  credits_3_months: number | null;
  credits_6_months: number | null;
  credits_12_months: number | null;
  status: string | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export const useSubscriptionPackages = () => {
  return useQuery({
    queryKey: ['subscription-packages'],
    queryFn: async () => {
      console.log('Fetching subscription packages from database...');
      
      const { data, error } = await supabase
        .from('subscription_packages')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscription packages:', error);
        throw error;
      }
      
      console.log('Successfully fetched subscription packages:', data);
      return data as SubscriptionPackage[];
    },
  });
};

export const useCreateSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (packageData: Omit<SubscriptionPackage, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating new subscription package:', packageData);
      
      const { data, error } = await supabase
        .from('subscription_packages')
        .insert([packageData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating subscription package:', error);
        throw error;
      }
      
      console.log('Successfully created subscription package:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-packages'] });
      toast.success('Subscription package created successfully');
    },
    onError: (error) => {
      console.error('Error creating subscription package:', error);
      toast.error('Failed to create subscription package');
    },
  });
};

export const useUpdateSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...packageData }: Partial<SubscriptionPackage> & { id: string }) => {
      console.log('Updating subscription package:', id, packageData);
      
      // Remove undefined values to avoid database errors
      const cleanData = Object.fromEntries(
        Object.entries(packageData).filter(([_, value]) => value !== undefined)
      );
      
      console.log('Clean update data:', cleanData);
      
      const { data, error } = await supabase
        .from('subscription_packages')
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating subscription package:', error);
        throw error;
      }
      
      console.log('Successfully updated subscription package:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-packages'] });
      toast.success('Subscription package updated successfully');
    },
    onError: (error) => {
      console.error('Error updating subscription package:', error);
      toast.error('Failed to update subscription package');
    },
  });
};

export const useDeleteSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting subscription package:', id);
      
      const { error } = await supabase
        .from('subscription_packages')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting subscription package:', error);
        throw error;
      }
      
      console.log('Successfully deleted subscription package');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-packages'] });
      toast.success('Subscription package deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting subscription package:', error);
      toast.error('Failed to delete subscription package');
    },
  });
};
