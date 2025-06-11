
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type IPTVPackage = {
  id: string;
  name: string;
  category: 'subscription' | 'reseller' | 'player' | 'panel-iptv' | 'activation-player';
  description: string | null;
  icon: string | null;
  features: string[] | null;
  price_10_credits: number | null;
  price_25_credits: number | null;
  price_50_credits: number | null;
  price_100_credits: number | null;
  status: 'active' | 'inactive' | 'featured' | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export const useIPTVPackages = () => {
  return useQuery({
    queryKey: ['iptv-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('iptv_packages')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching IPTV packages:', error);
        throw error;
      }
      
      return data as IPTVPackage[];
    },
  });
};

export const useCreateIPTVPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (packageData: Omit<IPTVPackage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('iptv_packages')
        .insert([packageData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-packages'] });
      toast.success('Package created successfully');
    },
    onError: (error) => {
      console.error('Error creating package:', error);
      toast.error('Failed to create package');
    },
  });
};

export const useUpdateIPTVPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...packageData }: Partial<IPTVPackage> & { id: string }) => {
      const { data, error } = await supabase
        .from('iptv_packages')
        .update(packageData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-packages'] });
      toast.success('Package updated successfully');
    },
    onError: (error) => {
      console.error('Error updating package:', error);
      toast.error('Failed to update package');
    },
  });
};

export const useDeleteIPTVPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('iptv_packages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iptv-packages'] });
      toast.success('Package deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    },
  });
};
