ALTER TABLE public.iptv_packages
  ADD COLUMN IF NOT EXISTS storm_panel_bouquet_id text;

ALTER TABLE public.subscription_packages
  ADD COLUMN IF NOT EXISTS storm_panel_bouquet_id text;

ALTER TABLE public.iptv_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active IPTV packages" ON public.iptv_packages;
CREATE POLICY "Anyone can view active IPTV packages"
  ON public.iptv_packages
  FOR SELECT TO anon, authenticated
  USING (status IN ('active', 'featured'));

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS storm_panel_fulfillment_status text;

CREATE TABLE IF NOT EXISTS public.storm_panel_payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('paygate_card', 'paygate_crypto')),
  address_in text,
  invoice_id text,
  expected_amount numeric(38, 18) CHECK (expected_amount IS NULL OR expected_amount > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (address_in IS NOT NULL OR invoice_id IS NOT NULL),
  UNIQUE (order_id, provider)
);

CREATE TABLE IF NOT EXISTS public.storm_panel_payment_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('self_hosted', 'paygate')),
  transaction_id text NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (provider, transaction_id)
);

CREATE INDEX IF NOT EXISTS storm_panel_payment_proofs_order_idx
  ON public.storm_panel_payment_proofs (order_id, verified_at DESC);

CREATE TABLE IF NOT EXISTS public.storm_panel_fulfillments (
  order_id uuid PRIMARY KEY REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'partial', 'failed', 'not_applicable')),
  accounts jsonb NOT NULL DEFAULT '[]'::jsonb,
  error_message text,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  started_at timestamptz,
  completed_at timestamptz,
  credentials_email_sent_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS crypto_payment_intents_active_amount_uidx
  ON public.crypto_payment_intents (network, coin, receiving_address, expected_amount)
  WHERE status IN ('pending', 'detected');

ALTER TABLE public.storm_panel_payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storm_panel_payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storm_panel_fulfillments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages Storm Panel payment intents"
  ON public.storm_panel_payment_intents
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role manages Storm Panel payment proofs"
  ON public.storm_panel_payment_proofs
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role manages Storm Panel fulfillments"
  ON public.storm_panel_fulfillments
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.storm_panel_payment_intents,
     public.storm_panel_payment_proofs,
     public.storm_panel_fulfillments
  TO service_role;
REVOKE ALL
  ON public.storm_panel_payment_intents,
     public.storm_panel_payment_proofs,
     public.storm_panel_fulfillments
  FROM PUBLIC, anon, authenticated;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_storm_panel_fulfillment_status_chk
  CHECK (
    storm_panel_fulfillment_status IS NULL
    OR storm_panel_fulfillment_status IN ('pending', 'processing', 'completed', 'partial', 'failed', 'not_applicable')
  );

DROP POLICY IF EXISTS "Public read intents" ON public.crypto_payment_intents;
DROP POLICY IF EXISTS "Service inserts intents" ON public.crypto_payment_intents;
DROP POLICY IF EXISTS "Service updates intents" ON public.crypto_payment_intents;
DROP POLICY IF EXISTS "Admins manage payment intents" ON public.crypto_payment_intents;
REVOKE ALL ON public.crypto_payment_intents FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crypto_payment_intents TO service_role;

DROP POLICY IF EXISTS "Allow all operations on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read access for orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update for orders" ON public.orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable update for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert for orders" ON public.orders;
CREATE POLICY "Customers can create pending orders"
  ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (payment_status = 'pending' AND status = 'pending');

REVOKE UPDATE ON public.orders FROM anon;

CREATE OR REPLACE FUNCTION public.enforce_new_order_pending_payment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.payment_status := 'pending';
  NEW.status := 'pending';
  NEW.storm_panel_fulfillment_status := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_new_order_pending_payment ON public.orders;
CREATE TRIGGER enforce_new_order_pending_payment
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_new_order_pending_payment();