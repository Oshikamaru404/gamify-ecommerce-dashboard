
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type IPTVCreditOption = {
  id: string;
  package_id: string;
  credits: number;
  price: number;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export const useIPTVCreditOptions = (packageId?: string) => {
  return useQuery({
    queryKey: ['iptv-credit-options', packageId],
    queryFn: async () => {
      let query = supabase
        .from('iptv_credit_options')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (packageId) {
        query = query.eq('package_id', packageId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching IPTV credit options:', error);
        throw error;
      }
      
      return data as IPTVCreditOption[];
    },
    staleTime: 0, // Always refetch when invalidated
  });
};

export const useCreateIPTVCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (optionData: Omit<IPTVCreditOption, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('iptv_credit_options')
        .insert([optionData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-credit-options'], refetchType: 'all' });
      toast.success('Credit option created successfully');
    },
    onError: (error) => {
      console.error('Failed to create credit option:', error);
      toast.error('Failed to create credit option');
    },
  });
};

export const useUpdateIPTVCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...optionData }: Partial<IPTVCreditOption> & { id: string }) => {
      // Only include defined, non-null fields
      const updatePayload: Record<string, any> = {};
      if (optionData.credits !== undefined) updatePayload.credits = optionData.credits;
      if (optionData.price !== undefined) updatePayload.price = optionData.price;
      if (optionData.sort_order !== undefined) updatePayload.sort_order = optionData.sort_order;
      if (optionData.package_id !== undefined) updatePayload.package_id = optionData.package_id;

      console.log('Updating IPTV credit option:', id, updatePayload);
      
      const { data, error } = await supabase
        .from('iptv_credit_options')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating IPTV credit option:', error);
        throw error;
      }
      
      console.log('Updated IPTV credit option result:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-credit-options'], refetchType: 'all' });
      toast.success('Credit option updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update credit option:', error);
      toast.error('Failed to update credit option');
    },
  });
};

export const useDeleteIPTVCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('iptv_credit_options')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-credit-options'], refetchType: 'all' });
      toast.success('Credit option deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete credit option:', error);
      toast.error('Failed to delete credit option');
    },
  });
};
