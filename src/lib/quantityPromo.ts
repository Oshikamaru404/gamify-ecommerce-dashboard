// Quantity-based promo helper

export type QuantityPromoMode = 'percentage' | 'fixed';

// A single tier:
// - percentage mode: { qty: 3, value: 10 } => -10% on the line (applies when ordered qty >= 3)
// - fixed mode:      { qty: 3, value: 25 } => total line = 25 (fixed total price for that exact qty bracket)
export type QuantityPromoTier = { qty: number; value: number };

export interface PromoConfig {
  mode: QuantityPromoMode;
  tiers: QuantityPromoTier[];
}

export function normalizePromoTiers(raw: unknown): QuantityPromoTier[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t: any) => ({
      qty: Number(t?.qty),
      value: Number(t?.value),
    }))
    .filter((t) => Number.isFinite(t.qty) && t.qty >= 1 && Number.isFinite(t.value) && t.value >= 0)
    .sort((a, b) => a.qty - b.qty);
}

/**
 * Returns the final TOTAL price for `quantity` units of an item priced at `unitPrice`,
 * given the package promo config.
 *
 * - percentage: pick the highest tier whose qty <= quantity; apply that % discount to unit*qty.
 * - fixed: pick the highest tier whose qty <= quantity; total = value (the fixed bundle price).
 *          If no tier matches, fallback to unit*qty.
 */
export function computeLineTotal(
  unitPrice: number,
  quantity: number,
  config?: PromoConfig | null,
): { total: number; discount: number; appliedTier: QuantityPromoTier | null } {
  const safeUnit = Math.max(0, Number(unitPrice) || 0);
  const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));
  const base = safeUnit * safeQty;

  const tiers = normalizePromoTiers(config?.tiers);
  const eligible = tiers.filter((t) => t.qty <= safeQty);
  const applied = eligible.length ? eligible[eligible.length - 1] : null;

  if (!applied) return { total: base, discount: 0, appliedTier: null };

  if (config?.mode === 'fixed') {
    return { total: applied.value, discount: Math.max(0, base - applied.value), appliedTier: applied };
  }
  // percentage
  const pct = Math.min(100, Math.max(0, applied.value));
  const total = base * (1 - pct / 100);
  return { total, discount: base - total, appliedTier: applied };
}
