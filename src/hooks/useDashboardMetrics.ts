
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DashboardMetric = {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string | null;
  created_at: string | null;
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching dashboard metrics:', error);
        throw error;
      }
      
      return data as DashboardMetric[];
    },
  });
};

export const usePackagesByCategory = () => {
  return useQuery({
    queryKey: ['packages-by-category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('iptv_packages')
        .select('category')
        .eq('status', 'active');
      
      if (error) throw error;
      
      const categoryCounts = data.reduce((acc, pkg) => {
        acc[pkg.category] = (acc[pkg.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return categoryCounts;
    },
  });
};
