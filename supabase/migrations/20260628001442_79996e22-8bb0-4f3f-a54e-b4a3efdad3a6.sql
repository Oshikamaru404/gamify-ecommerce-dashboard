
-- =========================================================
-- COUPONS
-- =========================================================
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage','fixed')),
  discount_value numeric NOT NULL CHECK (discount_value >= 0),
  currency text DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','expired','archived')),
  starts_at timestamptz,
  expires_at timestamptz,
  max_total_uses integer,
  max_uses_per_user integer,
  max_uses_per_device integer,
  minimum_order_amount numeric DEFAULT 0,
  applicable_product_types text[] DEFAULT '{}',
  applicable_product_ids uuid[] DEFAULT '{}',
  excluded_product_ids uuid[] DEFAULT '{}',
  allowed_user_ids uuid[] DEFAULT '{}',
  excluded_user_ids uuid[] DEFAULT '{}',
  total_uses integer NOT NULL DEFAULT 0,
  is_trial boolean NOT NULL DEFAULT false,
  created_by_admin_id uuid,
  linked_affiliate_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coupons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active coupons by code"
  ON public.coupons FOR SELECT
  USING (status = 'active');
CREATE POLICY "Admins manage coupons"
  ON public.coupons FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_status ON public.coupons(status);
CREATE INDEX idx_coupons_linked_affiliate ON public.coupons(linked_affiliate_id);

-- =========================================================
-- COUPON REDEMPTIONS
-- =========================================================
CREATE TABLE public.coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id uuid,
  order_id uuid,
  discount_amount numeric NOT NULL,
  original_amount numeric NOT NULL,
  final_amount numeric NOT NULL,
  currency text DEFAULT 'EUR',
  ip_address text,
  user_agent text,
  device_fingerprint text,
  cookie_id text,
  redeemed_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.coupon_redemptions TO authenticated;
GRANT ALL ON public.coupon_redemptions TO service_role;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own redemptions"
  ON public.coupon_redemptions FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin_user());
CREATE POLICY "Admins manage redemptions"
  ON public.coupon_redemptions FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE INDEX idx_redemptions_coupon ON public.coupon_redemptions(coupon_id);
CREATE INDEX idx_redemptions_user ON public.coupon_redemptions(user_id);
CREATE INDEX idx_redemptions_order ON public.coupon_redemptions(order_id);

-- =========================================================
-- COUPON USAGE ATTEMPTS (audit log)
-- =========================================================
CREATE TABLE public.coupon_usage_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid,
  user_id uuid,
  code text NOT NULL,
  success boolean NOT NULL DEFAULT false,
  failure_reason text,
  ip_address text,
  user_agent text,
  device_fingerprint text,
  cookie_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.coupon_usage_attempts TO service_role;
ALTER TABLE public.coupon_usage_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view coupon attempts"
  ON public.coupon_usage_attempts FOR SELECT
  USING (public.is_admin_user());

CREATE INDEX idx_attempts_code ON public.coupon_usage_attempts(code);
CREATE INDEX idx_attempts_created ON public.coupon_usage_attempts(created_at DESC);

-- =========================================================
-- AFFILIATES
-- =========================================================
CREATE TABLE public.affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  referral_code text NOT NULL UNIQUE,
  default_coupon_id uuid REFERENCES public.coupons(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','rejected')),
  commission_type text NOT NULL DEFAULT 'percentage' CHECK (commission_type IN ('percentage','fixed')),
  commission_value numeric NOT NULL DEFAULT 10,
  payout_method text,
  payout_details jsonb DEFAULT '{}'::jsonb,
  total_pending numeric NOT NULL DEFAULT 0,
  total_approved numeric NOT NULL DEFAULT 0,
  total_paid numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.affiliates TO authenticated;
GRANT ALL ON public.affiliates TO service_role;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own affiliate"
  ON public.affiliates FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin_user());
CREATE POLICY "Users insert own affiliate"
  ON public.affiliates FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own affiliate non-sensitive"
  ON public.affiliates FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage affiliates"
  ON public.affiliates FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- link FK back from coupons
ALTER TABLE public.coupons
  ADD CONSTRAINT coupons_linked_affiliate_fk
  FOREIGN KEY (linked_affiliate_id) REFERENCES public.affiliates(id) ON DELETE SET NULL;

-- =========================================================
-- AFFILIATE REFERRAL CLICKS
-- =========================================================
CREATE TABLE public.affiliate_referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  ip_address text,
  user_agent text,
  device_fingerprint text,
  cookie_id text,
  landing_page text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.affiliate_referral_clicks TO anon, authenticated;
GRANT ALL ON public.affiliate_referral_clicks TO service_role;
ALTER TABLE public.affiliate_referral_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record click"
  ON public.affiliate_referral_clicks FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Affiliates view own clicks"
  ON public.affiliate_referral_clicks FOR SELECT
  USING (
    public.is_admin_user()
    OR affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
  );

CREATE INDEX idx_clicks_affiliate ON public.affiliate_referral_clicks(affiliate_id);
CREATE INDEX idx_clicks_code ON public.affiliate_referral_clicks(referral_code);

-- =========================================================
-- AFFILIATE REFERRALS
-- =========================================================
CREATE TABLE public.affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL UNIQUE,
  first_click_id uuid REFERENCES public.affiliate_referral_clicks(id) ON DELETE SET NULL,
  referral_code text NOT NULL,
  cookie_id text,
  device_fingerprint text,
  ip_address text,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','converted','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz
);

GRANT SELECT ON public.affiliate_referrals TO authenticated;
GRANT ALL ON public.affiliate_referrals TO service_role;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own referrals"
  ON public.affiliate_referrals FOR SELECT
  USING (
    public.is_admin_user()
    OR affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
  );

-- =========================================================
-- AFFILIATE COMMISSIONS
-- =========================================================
CREATE TABLE public.affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id uuid,
  order_id uuid NOT NULL UNIQUE,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  commission_type text NOT NULL,
  commission_value numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','paid')),
  validation_available_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text,
  paid_at timestamptz,
  payout_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.affiliate_commissions TO authenticated;
GRANT ALL ON public.affiliate_commissions TO service_role;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own commissions"
  ON public.affiliate_commissions FOR SELECT
  USING (
    public.is_admin_user()
    OR affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
  );

CREATE INDEX idx_commissions_affiliate ON public.affiliate_commissions(affiliate_id);
CREATE INDEX idx_commissions_status ON public.affiliate_commissions(status);

-- =========================================================
-- AFFILIATE PAYOUTS
-- =========================================================
CREATE TABLE public.affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','rejected')),
  payout_method text,
  payout_reference text,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

GRANT SELECT ON public.affiliate_payouts TO authenticated;
GRANT ALL ON public.affiliate_payouts TO service_role;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own payouts"
  ON public.affiliate_payouts FOR SELECT
  USING (
    public.is_admin_user()
    OR affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
  );

ALTER TABLE public.affiliate_commissions
  ADD CONSTRAINT commissions_payout_fk
  FOREIGN KEY (payout_id) REFERENCES public.affiliate_payouts(id) ON DELETE SET NULL;

-- =========================================================
-- AFFILIATE FRAUD FLAGS
-- =========================================================
CREATE TABLE public.affiliate_fraud_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id uuid,
  order_id uuid,
  reason text NOT NULL,
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low','medium','high')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.affiliate_fraud_flags TO service_role;
ALTER TABLE public.affiliate_fraud_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view fraud flags"
  ON public.affiliate_fraud_flags FOR SELECT
  USING (public.is_admin_user());

-- =========================================================
-- ORDERS — extend
-- =========================================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES public.coupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS original_amount numeric,
  ADD COLUMN IF NOT EXISTS affiliate_id uuid REFERENCES public.affiliates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS referral_cookie_id text;

-- =========================================================
-- TRIGGER FUNCTIONS
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER affiliates_updated_at BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create pending commission when an affiliate-attributed order becomes paid
CREATE OR REPLACE FUNCTION public.process_affiliate_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  aff record;
  commission_amount numeric;
  base_amount numeric;
BEGIN
  IF NEW.affiliate_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.payment_status <> 'paid' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND COALESCE(OLD.payment_status,'') = 'paid' THEN RETURN NEW; END IF;

  SELECT * INTO aff FROM public.affiliates WHERE id = NEW.affiliate_id;
  IF NOT FOUND OR aff.status <> 'active' THEN RETURN NEW; END IF;

  -- self-referral guard: affiliate buying via their own code
  IF aff.user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = aff.user_id AND lower(p.email) = lower(NEW.customer_email)
  ) THEN
    INSERT INTO public.affiliate_fraud_flags(affiliate_id, order_id, reason, severity)
    VALUES (aff.id, NEW.id, 'self_referral_purchase', 'high');
    RETURN NEW;
  END IF;

  base_amount := COALESCE(NEW.amount, 0);
  IF aff.commission_type = 'percentage' THEN
    commission_amount := round((base_amount * aff.commission_value / 100.0)::numeric, 2);
  ELSE
    commission_amount := aff.commission_value;
  END IF;

  INSERT INTO public.affiliate_commissions(
    affiliate_id, referred_user_id, order_id, amount, currency,
    commission_type, commission_value, status, validation_available_at
  ) VALUES (
    aff.id, NULL, NEW.id, commission_amount, COALESCE(NEW.currency,'EUR'),
    aff.commission_type, aff.commission_value, 'pending', now() + interval '30 days'
  ) ON CONFLICT (order_id) DO NOTHING;

  UPDATE public.affiliates
     SET total_pending = total_pending + commission_amount
   WHERE id = aff.id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_affiliate_commission
  AFTER INSERT OR UPDATE OF payment_status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.process_affiliate_commission();
