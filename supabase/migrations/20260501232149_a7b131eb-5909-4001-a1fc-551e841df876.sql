-- Self-hosted crypto payments: payment intents tracking table

CREATE TABLE public.crypto_payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  network TEXT NOT NULL,
  coin TEXT NOT NULL,
  receiving_address TEXT NOT NULL,
  expected_amount NUMERIC(38,18) NOT NULL,
  amount_usd NUMERIC(12,2) NOT NULL,
  tolerance_pct NUMERIC NOT NULL DEFAULT 2,
  min_confirmations INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  tx_hash TEXT,
  confirmations INT NOT NULL DEFAULT 0,
  detected_amount NUMERIC(38,18),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ
);

CREATE INDEX idx_cpi_status_expires ON public.crypto_payment_intents (status, expires_at);
CREATE INDEX idx_cpi_address_status ON public.crypto_payment_intents (receiving_address, status);
CREATE INDEX idx_cpi_order ON public.crypto_payment_intents (order_id);

ALTER TABLE public.crypto_payment_intents ENABLE ROW LEVEL SECURITY;

-- Admins can do anything
CREATE POLICY "Admins manage payment intents"
ON public.crypto_payment_intents
FOR ALL
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Public can read by intent ID (needed for polling status from frontend)
CREATE POLICY "Public read intents"
ON public.crypto_payment_intents
FOR SELECT
USING (true);

-- Service role inserts via edge function; allow anon inserts as our edge fn uses anon key
CREATE POLICY "Service inserts intents"
ON public.crypto_payment_intents
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service updates intents"
ON public.crypto_payment_intents
FOR UPDATE
USING (true)
WITH CHECK (true);

-- updated_at trigger
CREATE TRIGGER trg_cpi_updated_at
BEFORE UPDATE ON public.crypto_payment_intents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable pg_cron + pg_net for scheduled watcher
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the watcher every 60 seconds
SELECT cron.schedule(
  'crypto-watcher-every-minute',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://jtsnspszgsmkqxuoqywm.supabase.co/functions/v1/crypto-watcher',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0c25zcHN6Z3Nta3F4dW9xeXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTg0NzUsImV4cCI6MjA2NTIzNDQ3NX0.k4gAV17UWzVPCnHeXnqCfdJT12bTkK5ELKBuLvYIm_Q"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);