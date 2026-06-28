export type DiscountType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired' | 'archived';

export interface CouponDTO {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  currency: string | null;
  status: CouponStatus;
  starts_at: string | null;
  expires_at: string | null;
  max_total_uses: number | null;
  max_uses_per_user: number | null;
  max_uses_per_device: number | null;
  minimum_order_amount: number | null;
  applicable_product_types: string[];
  applicable_product_ids: string[];
  excluded_product_ids: string[];
  total_uses: number;
  linked_affiliate_id: string | null;
  is_trial: boolean;
  created_at: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  error?: string;
  coupon?: {
    id: string;
    code: string;
    name: string | null;
    discount_type: DiscountType;
    discount_value: number;
    linked_affiliate_id: string | null;
  };
  original_amount?: number;
  discount_amount?: number;
  final_amount?: number;
}

export function formatDiscount(c: { discount_type: DiscountType; discount_value: number; currency?: string | null }): string {
  if (c.discount_type === 'percentage') return `-${c.discount_value}%`;
  return `-${c.discount_value} ${c.currency ?? 'EUR'}`;
}
