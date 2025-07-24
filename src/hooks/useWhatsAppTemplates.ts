
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type WhatsAppTemplate = {
  id: string;
  template_key: string;
  template_value: string;
  created_at: string;
  updated_at: string;
};

export const useWhatsAppTemplates = () => {
  return useQuery({
    queryKey: ['whatsapp-templates'],
    queryFn: async () => {
      console.log('Fetching WhatsApp templates...');
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .order('template_key');
      
      if (error) {
        console.error('Error fetching WhatsApp templates:', error);
        throw error;
      }
      
      console.log('Successfully fetched WhatsApp templates:', data);
      return data as WhatsAppTemplate[];
    },
  });
};

export const useUpdateWhatsAppTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      console.log('Updating WhatsApp template:', key, 'with value:', value);
      
      if (!key || typeof key !== 'string' || key.trim() === '') {
        throw new Error('Template key is required and must be a non-empty string');
      }
      
      if (!value || typeof value !== 'string') {
        throw new Error('Template value is required and must be a string');
      }
      
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .upsert({
          template_key: key.trim(),
          template_value: value.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'template_key'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating WhatsApp template:', error);
        throw error;
      }
      
      console.log('Successfully updated WhatsApp template:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] });
      toast.success(`Template "${data.template_key}" updated successfully`);
    },
    onError: (error) => {
      console.error('Error updating WhatsApp template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update template';
      toast.error(errorMessage);
    },
  });
};
