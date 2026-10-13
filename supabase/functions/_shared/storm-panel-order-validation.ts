import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

type Order = {
  id: string;
  amount: number | string;
  original_amount: number | string | null;
  discount_amount: number | string | null;
  package_id: string | null;
  package_category: string;
  duration_months: number | string;
  quantity: number | string | null;
  order_type: string;
  customer_email: string;
  coupon_id: string | null;
  coupon_code: string | null;
  credentials_notes: string | null;
  mac_addresses: unknown;
};

type Product = Record<string, unknown> & {
  category?: string;
  status: string | null;
  storm_panel_bouquet_id: string | null;
};

function parseNotes(value: string | null): Record<string, unknown> {
  if (!value) return {};
  try {
    const notes: unknown = JSON.parse(value);
    return typeof notes === "object" && notes !== null ? notes as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getUnitPrice(product: Product, duration: number): number | null {
  const candidates = duration === 1
    ? ["price_1_month"]
    : duration === 3
      ? ["price_3_months", "price_3_credits"]
      : duration === 6
        ? ["price_6_months", "price_6_credits"]
        : duration === 12
          ? ["price_12_months", "price_12_credits"]
          : [];
  for (const key of candidates) {
    const value = Number(product[key]);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return null;
}

function promoTotal(unitPrice: number, quantity: number, mode: unknown, rawTiers: unknown): number {
  const base = unitPrice * quantity;
  if (!Array.isArray(rawTiers)) return roundMoney(base);
  const tiers = rawTiers
    .map((tier) => {
      if (typeof tier !== "object" || tier === null) return null;
      const value = tier as Record<string, unknown>;
      return { qty: Number(value.qty ?? value.quantity), value: Number(value.value) };
    })
    .filter((tier): tier is { qty: number; value: number } =>
      tier !== null && Number.isInteger(tier.qty) && tier.qty > 0 && Number.isFinite(tier.value) && tier.value >= 0
    )
    .filter((tier) => tier.qty <= quantity)
    .sort((a, b) => b.qty - a.qty);
  const selected = tiers[0];
  if (!selected) return roundMoney(base);
  if (mode === "fixed") return roundMoney(selected.value);
  return roundMoney(base * (1 - Math.min(100, Math.max(0, selected.value)) / 100));
}

function readMacs(order: Order, notes: Record<string, unknown>): string[] {
  const source = Array.isArray(order.mac_addresses)
    ? order.mac_addresses
    : Array.isArray(notes.mac_addresses)
      ? notes.mac_addresses
      : [];
  return source.flatMap((entry) => {
    if (typeof entry === "string") return [entry.trim()];
    if (typeof entry === "object" && entry !== null && "mac" in entry) {
      return [String(entry.mac).trim()];
    }
    return [];
  }).filter(Boolean);
}

export async function validateStormPanelOrder(
  supabase: SupabaseClient,
  order: Order,
): Promise<{ eligible: boolean; error?: string }> {
  const notes = parseNotes(order.credentials_notes);
  if (
    order.package_category.toLowerCase() !== "subscription" ||
    notes.offer_kind !== "iptv_subscription"
  ) {
    return { eligible: false };
  }

  if (!order.package_id) return { eligible: true, error: "The IPTV package is missing" };
  const { data: iptvProduct, error: iptvError } = await supabase
    .from("iptv_packages")
    .select("id, category, status, storm_panel_bouquet_id, price_1_month, price_3_months, price_6_months, price_12_months, quantity_promo_mode, quantity_promos")
    .eq("id", order.package_id)
    .maybeSingle();
  if (iptvError) throw iptvError;

  let product: Product | null = iptvProduct as Product | null;
  if (!product) {
    const { data: subscriptionProduct, error: subscriptionError } = await supabase
      .from("subscription_packages")
      .select("id, status, storm_panel_bouquet_id, price_3_credits, price_6_credits, price_12_credits, quantity_promo_mode, quantity_promos")
      .eq("id", order.package_id)
      .maybeSingle();
    if (subscriptionError) throw subscriptionError;
    product = subscriptionProduct as Product | null;
  }

  const duration = Number(order.duration_months);
  const quantity = Number(order.quantity ?? 1);
  if (
    !product ||
    ("category" in product && String(product.category).toLowerCase() !== "subscription") ||
    !["active", "featured"].includes(String(product.status)) ||
    !product.storm_panel_bouquet_id ||
    ![1, 3, 6, 12].includes(duration) ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 50
  ) {
    return { eligible: true, error: "The IPTV package is not active or correctly mapped to Storm Panel" };
  }

  const connectionType = notes.connection_type;
  const isMag = connectionType === "mag_stb";
  if (connectionType !== "m3u_xtream" && !isMag) {
    return { eligible: true, error: "The IPTV connection type is invalid" };
  }
  if (order.order_type === "renewal") {
    if (!isMag && quantity !== 1) {
      return { eligible: true, error: "M3U renewals are limited to one account per order" };
    }
    if (!isMag && (
      typeof notes.iptv_username !== "string" ||
      !notes.iptv_username.trim() ||
      typeof notes.iptv_password !== "string" ||
      !notes.iptv_password
    )) {
      return { eligible: true, error: "M3U renewal requires the existing username and password" };
    }
  }
  if (isMag) {
    const macs = readMacs(order, notes);
    if (macs.length !== quantity || macs.some((mac) => !/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(mac))) {
      return { eligible: true, error: "Every MAG access must have one valid MAC address" };
    }
  }

  const unitPrice = getUnitPrice(product, duration);
  if (unitPrice === null) {
    return { eligible: true, error: "The IPTV plan has no matching price in the product catalog" };
  }
  const originalAmount = Number(order.original_amount);
  const amount = Number(order.amount);
  if (!Number.isFinite(originalAmount) || !Number.isFinite(amount)) {
    return { eligible: true, error: "The order has invalid price totals" };
  }
  const expectedOriginal = promoTotal(unitPrice, quantity, product.quantity_promo_mode, product.quantity_promos);
  if (Math.abs(originalAmount - expectedOriginal) > 0.01) {
    return { eligible: true, error: "The order total does not match the current IPTV product price" };
  }

  const discount = roundMoney(Number(order.discount_amount ?? 0));
  if (!Number.isFinite(discount) || discount < 0 || discount > expectedOriginal) {
    return { eligible: true, error: "The order discount is invalid" };
  }
  if (!order.coupon_id) {
    if (discount !== 0 || Math.abs(amount - expectedOriginal) > 0.01) {
      return { eligible: true, error: "The order contains an unverified discount" };
    }
  } else {
    const { data: coupon, error: couponError } = await supabase
      .from("coupons")
      .select("id, code, discount_type, discount_value, status, starts_at, expires_at, max_total_uses, max_uses_per_user, total_uses, minimum_order_amount, applicable_product_types, applicable_product_ids, excluded_product_ids, allowed_user_ids, excluded_user_ids, linked_affiliate_id")
      .eq("id", order.coupon_id)
      .maybeSingle();
    if (couponError) throw couponError;
    const now = Date.now();
    const codeMatches = coupon && order.coupon_code?.trim().toLowerCase() === String(coupon.code).toLowerCase();
    const typeAllowed = !coupon?.applicable_product_types?.length ||
      coupon.applicable_product_types.includes(order.package_category);
    const idAllowed = !coupon?.applicable_product_ids?.length ||
      coupon.applicable_product_ids.includes(order.package_id);
    const notExcluded = !coupon?.excluded_product_ids?.includes(order.package_id);
    if (
      !coupon ||
      !codeMatches ||
      coupon.status !== "active" ||
      (coupon.starts_at && Date.parse(coupon.starts_at) > now) ||
      (coupon.expires_at && Date.parse(coupon.expires_at) < now) ||
      (coupon.max_total_uses && coupon.total_uses >= coupon.max_total_uses) ||
      Number(coupon.minimum_order_amount ?? 0) > expectedOriginal ||
      !typeAllowed ||
      !idAllowed ||
      !notExcluded
    ) {
      return { eligible: true, error: "The coupon is no longer valid for this IPTV order" };
    }

    let profileId: string | null = null;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", order.customer_email)
      .maybeSingle();
    if (profileError) throw profileError;
    profileId = profile?.id ?? null;

    if (
      (coupon.allowed_user_ids?.length && (!profileId || !coupon.allowed_user_ids.includes(profileId))) ||
      (profileId && coupon.excluded_user_ids?.includes(profileId))
    ) {
      return { eligible: true, error: "This customer is not eligible for the coupon" };
    }
    if (coupon.max_uses_per_user) {
      if (!profileId) return { eligible: true, error: "Sign in is required to use this coupon" };
      const { count: redemptionCount, error: redemptionError } = await supabase
        .from("coupon_redemptions")
        .select("id", { count: "exact", head: true })
        .eq("coupon_id", coupon.id)
        .eq("user_id", profileId);
      if (redemptionError) throw redemptionError;
      if ((redemptionCount ?? 0) >= coupon.max_uses_per_user) {
        return { eligible: true, error: "This customer has reached the coupon usage limit" };
      }
    }
    if (profileId && coupon.linked_affiliate_id) {
      const { data: affiliate, error: affiliateError } = await supabase
        .from("affiliates")
        .select("user_id")
        .eq("id", coupon.linked_affiliate_id)
        .maybeSingle();
      if (affiliateError) throw affiliateError;
      if (affiliate?.user_id === profileId) {
        return { eligible: true, error: "Affiliate coupons cannot be used by their owner" };
      }
    }

    const discountValue = Number(coupon.discount_value);
    const expectedDiscount = roundMoney(Math.min(
      expectedOriginal,
      coupon.discount_type === "percentage"
        ? expectedOriginal * discountValue / 100
        : discountValue,
    ));
    if (Math.abs(discount - expectedDiscount) > 0.01) {
      return { eligible: true, error: "The coupon discount does not match its current value" };
    }
    if (Math.abs(amount - roundMoney(expectedOriginal - expectedDiscount)) > 0.01) {
      return { eligible: true, error: "The final order total does not match the coupon discount" };
    }
  }

  return { eligible: true };
}
