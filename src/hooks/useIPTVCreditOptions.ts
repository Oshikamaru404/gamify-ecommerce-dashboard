
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
        .from('iptv_credit_options' as any)
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
      
      return data as unknown as IPTVCreditOption[];
    },
  });
};

export const useCreateIPTVCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (optionData: Omit<IPTVCreditOption, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('iptv_credit_options' as any)
        .insert([optionData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-credit-options'] });
      toast.success('Credit option created successfully');
    },
    onError: () => {
      toast.error('Failed to create credit option');
    },
  });
};

export const useUpdateIPTVCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...optionData }: Partial<IPTVCreditOption> & { id: string }) => {
      const cleanData = Object.fromEntries(
        Object.entries(optionData).filter(([_, value]) => value !== undefined)
      );
      
      const { data, error } = await supabase
        .from('iptv_credit_options' as any)
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-credit-options'] });
      toast.success('Credit option updated successfully');
    },
    onError: () => {
      toast.error('Failed to update credit option');
    },
  });
};

export const useDeleteIPTVCreditOption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('iptv_credit_options' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-credit-options'] });
      toast.success('Credit option deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete credit option');
    },
  });
};
