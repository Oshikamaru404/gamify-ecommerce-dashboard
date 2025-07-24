
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Translation = {
  id: string;
  language_code: string;
  translation_key: string;
  translation_value: string;
  created_at: string;
  updated_at: string;
};

export const useTranslations = () => {
  return useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      console.log('Fetching translations...');
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('language_code, translation_key');
      
      if (error) {
        console.error('Error fetching translations:', error);
        throw error;
      }
      
      console.log('Successfully fetched translations:', data);
      return data as Translation[];
    },
  });
};

export const useUpdateTranslation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ languageCode, key, value }: { languageCode: string; key: string; value: string }) => {
      console.log('Updating translation:', languageCode, key, 'with value:', value);
      
      if (!languageCode || !key || !value) {
        throw new Error('Language code, key, and value are all required');
      }
      
      const { data, error } = await supabase
        .from('translations')
        .upsert({
          language_code: languageCode.trim(),
          translation_key: key.trim(),
          translation_value: value.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'language_code,translation_key'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating translation:', error);
        throw error;
      }
      
      console.log('Successfully updated translation:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success(`Translation for "${data.translation_key}" updated successfully`);
    },
    onError: (error) => {
      console.error('Error updating translation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update translation';
      toast.error(errorMessage);
    },
  });
};
