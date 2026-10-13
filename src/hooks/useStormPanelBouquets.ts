import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StormPanelBouquet {
  id: string;
  name: string;
}

export const useStormPanelBouquets = (enabled = true) => {
  return useQuery({
    queryKey: ['storm-panel-bouquets'],
    enabled,
    staleTime: 60_000,
    queryFn: async (): Promise<StormPanelBouquet[]> => {
      const { data, error } = await supabase.functions.invoke('storm-panel-bouquets', {
        method: 'GET',
      });
      if (error) throw error;
      if (!Array.isArray(data?.bouquets)) {
        throw new Error('Storm Panel returned an invalid channel package list');
      }
      return data.bouquets as StormPanelBouquet[];
    },
  });
};
