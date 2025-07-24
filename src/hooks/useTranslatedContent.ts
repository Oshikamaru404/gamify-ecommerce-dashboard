
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type TranslatedContent = {
  id: string;
  content_key: string;
  content_value: string;
  language_code: string;
  created_at: string;
  updated_at: string;
};

export const useTranslatedContent = () => {
  return useQuery({
    queryKey: ['translated-content'],
    queryFn: async () => {
      console.log('Fetching translated content...');
      const { data, error } = await supabase
        .from('translated_content')
        .select('*')
        .order('content_key, language_code');
      
      if (error) {
        console.error('Error fetching translated content:', error);
        throw error;
      }
      
      console.log('Successfully fetched translated content:', data);
      return data as TranslatedContent[];
    },
  });
};

export const useUpdateTranslatedContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contentKey, languageCode, value }: { contentKey: string; languageCode: string; value: string }) => {
      console.log('Updating translated content:', contentKey, languageCode, 'with value:', value);
      
      if (!contentKey || !languageCode || !value) {
        throw new Error('Content key, language code, and value are all required');
      }
      
      const { data, error } = await supabase
        .from('translated_content')
        .upsert({
          content_key: contentKey.trim(),
          language_code: languageCode.trim(),
          content_value: value.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'content_key,language_code'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating translated content:', error);
        throw error;
      }
      
      console.log('Successfully updated translated content:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translated-content'] });
      toast.success(`Content for "${data.content_key}" updated successfully`);
    },
    onError: (error) => {
      console.error('Error updating translated content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update content';
      toast.error(errorMessage);
    },
  });
};

export const useCreateTranslatedContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contentKey, languageCode, value }: { contentKey: string; languageCode: string; value: string }) => {
      console.log('Creating translated content:', contentKey, languageCode, 'with value:', value);
      
      if (!contentKey || !languageCode || !value) {
        throw new Error('Content key, language code, and value are all required');
      }
      
      const { data, error } = await supabase
        .from('translated_content')
        .insert({
          content_key: contentKey.trim(),
          language_code: languageCode.trim(),
          content_value: value.trim(),
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating translated content:', error);
        throw error;
      }
      
      console.log('Successfully created translated content:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translated-content'] });
      toast.success(`Content for "${data.content_key}" created successfully`);
    },
    onError: (error) => {
      console.error('Error creating translated content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create content';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteTranslatedContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting translated content:', id);
      
      const { error } = await supabase
        .from('translated_content')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting translated content:', error);
        throw error;
      }
      
      console.log('Successfully deleted translated content');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translated-content'] });
      toast.success('Content deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting translated content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete content';
      toast.error(errorMessage);
    },
  });
};
