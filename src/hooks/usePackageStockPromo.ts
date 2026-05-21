import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { normalizePromoTiers, type PromoConfig } from '@/lib/quantityPromo';

export interface PackageStockPromo {
  stock_enabled: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_by_plan: Record<string, number>;
  promo: PromoConfig;
}

/**
 * Fetches stock + quantity-promo config for a package id.
 * Tries iptv_packages first, falls back to subscription_packages.
 */
export const usePackageStockPromo = (packageId: string | undefined) => {
  return useQuery({
    queryKey: ['package-stock-promo', packageId],
    enabled: !!packageId,
    queryFn: async (): Promise<PackageStockPromo> => {
      const empty: PackageStockPromo = {
        stock_enabled: false,
        stock_quantity: 0,
        low_stock_threshold: 5,
        stock_by_plan: {},
        promo: { mode: 'percentage', tiers: [] },
      };
      if (!packageId) return empty;

      const cols = 'stock_enabled, stock_quantity, low_stock_threshold, stock_by_plan, quantity_promo_mode, quantity_promos';

      const { data: iptv } = await supabase
        .from('iptv_packages')
        .select(cols)
        .eq('id', packageId)
        .maybeSingle();

      const row: any = iptv ?? (await supabase
        .from('subscription_packages')
        .select(cols)
        .eq('id', packageId)
        .maybeSingle()).data;

      if (!row) return empty;

      const sbp = (row.stock_by_plan && typeof row.stock_by_plan === 'object' && !Array.isArray(row.stock_by_plan))
        ? row.stock_by_plan as Record<string, number>
        : {};

      return {
        stock_enabled: !!row.stock_enabled,
        stock_quantity: Number(row.stock_quantity ?? 0),
        low_stock_threshold: Number(row.low_stock_threshold ?? 5),
        stock_by_plan: sbp,
        promo: {
          mode: (row.quantity_promo_mode === 'fixed' ? 'fixed' : 'percentage'),
          tiers: normalizePromoTiers(row.quantity_promos),
        },
      };
    },
  });
};
