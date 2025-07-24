
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
    staleTime: 5000,
    gcTime: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      console.log('=== MUTATION STARTED ===');
      console.log('Updating site setting:', key, 'with value:', value);
      
      // Validate input
      if (!key || typeof key !== 'string' || key.trim() === '') {
        const error = new Error('Setting key is required and must be a non-empty string');
        console.error('Validation error:', error);
        throw error;
      }
      
      if (!value || typeof value !== 'string') {
        const error = new Error('Setting value is required and must be a string');
        console.error('Validation error:', error);
        throw error;
      }
      
      // The RLS policies will handle authentication, so we can proceed directly
      console.log('Attempting upsert operation...');
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(
          {
            setting_key: key.trim(),
            setting_value: value.trim(),
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'setting_key',
            ignoreDuplicates: false
          }
        )
        .select()
        .single();
      
      if (error) {
        console.error('=== MUTATION ERROR ===');
        console.error('Error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        throw error;
      }
      
      console.log('=== MUTATION SUCCESS ===');
      console.log('Successfully updated site setting:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Mutation onSuccess called with:', data);
      // Invalidate and refetch the site settings
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success(`${data.setting_key} updated successfully`);
    },
    onError: (error) => {
      console.error('=== MUTATION ON ERROR ===');
      console.error('Error in mutation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update setting';
      toast.error(errorMessage);
    },
  });
};
