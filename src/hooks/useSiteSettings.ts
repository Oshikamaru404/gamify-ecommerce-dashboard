
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
      console.log('Fetching site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key');
      
      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
      
      console.log('Successfully fetched site settings:', data);
      return data as SiteSetting[];
    },
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      console.log('Updating site setting:', key, 'with value:', value);
      
      // Validate input
      if (!key || typeof key !== 'string' || key.trim() === '') {
        throw new Error('Setting key is required and must be a non-empty string');
      }
      
      if (!value || typeof value !== 'string') {
        throw new Error('Setting value is required and must be a string');
      }
      
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key.trim(),
          setting_value: value.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating site setting:', error);
        throw error;
      }
      
      console.log('Successfully updated site setting:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success(`${data.setting_key} updated successfully`);
    },
    onError: (error) => {
      console.error('Error updating site setting:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update setting';
      toast.error(errorMessage);
    },
  });
};
