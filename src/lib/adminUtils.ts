
import { supabase } from '@/integrations/supabase/client';

export const deleteAllPublishedFeedback = async (): Promise<number> => {
  const { data, error } = await supabase.rpc('delete_all_published_feedback');
  
  if (error) {
    console.error('Error deleting published feedback:', error);
    throw error;
  }
  
  return data || 0;
};

export const resetProductSales = async (): Promise<number> => {
  const { data, error } = await supabase.rpc('reset_product_sales');
  
  if (error) {
    console.error('Error resetting product sales:', error);
    throw error;
  }
  
  return data || 0;
};
