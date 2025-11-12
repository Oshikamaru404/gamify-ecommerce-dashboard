import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HomepageSection {
  id: string;
  section_key: string;
  content_data: any;
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useHomepageContent = () => {
  return useQuery({
    queryKey: ['homepage-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('is_enabled', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as HomepageSection[];
    },
  });
};

export const useAllHomepageContent = () => {
  return useQuery({
    queryKey: ['homepage-content-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as HomepageSection[];
    },
  });
};

export const useUpdateHomepageSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content_data, is_enabled }: { id: string; content_data: any; is_enabled?: boolean }) => {
      const updateData: any = { content_data };
      if (is_enabled !== undefined) {
        updateData.is_enabled = is_enabled;
      }

      const { data, error } = await supabase
        .from('homepage_content')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-content-all'] });
      toast.success('Section updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    },
  });
};
