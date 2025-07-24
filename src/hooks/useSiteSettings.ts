
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type SiteSetting = {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key');
      
      if (error) {
        throw error;
      }
      
      return data as SiteSetting[];
    },
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Setting updated successfully');
    },
    onError: (error) => {
      console.error('Error updating site setting:', error);
      toast.error('Failed to update setting');
    },
  });
};
