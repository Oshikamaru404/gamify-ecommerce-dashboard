# Self-Hosted Crypto Payments — Implementation Plan

Build a 0-fee crypto checkout that sends payments **directly to your wallets**, while keeping PayGate as a one-click fallback in admin.

## Confirmed decisions
- **Mode:** Both providers, admin toggle (`crypto_provider = self_hosted | paygate`)
- **Tolerance:** ±2% on amount matching
- **Prices:** CoinGecko first (free, no key), PayGate `convert.php` as fallback (also free)

---

## 1. Database (migration)

```sql
ALTER TABLE crypto_wallets
  ADD COLUMN min_confirmations INT DEFAULT 1,
  ADD COLUMN coingecko_id TEXT;   -- 'bitcoin','ethereum','tether',...

CREATE TABLE crypto_payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  network TEXT NOT NULL,
  coin TEXT NOT NULL,
  receiving_address TEXT NOT NULL,
  expected_amount NUMERIC(28,10) NOT NULL,  -- crypto amount with dust offset
  amount_usd NUMERIC(10,2) NOT NULL,
  tolerance_pct NUMERIC NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'pending',   -- pending|detected|confirmed|expired|underpaid
  tx_hash TEXT,
  confirmations INT DEFAULT 0,
  detected_amount NUMERIC(28,10),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);
CREATE INDEX ON crypto_payment_intents (status, expires_at);
CREATE INDEX ON crypto_payment_intents (receiving_address, status);

ALTER TABLE crypto_payment_intents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full" ON crypto_payment_intents FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Public read by id" ON crypto_payment_intents FOR SELECT USING (true);
```

`crypto_provider` toggle stored in existing `site_settings` (key = `crypto_provider`, value = `self_hosted` or `paygate`).

Enable `pg_cron` + `pg_net`; schedule `crypto-watcher` every 60s.

## 2. Edge functions (4 new)

| Function | Role |
|---|---|
| `crypto-price` | `?coin=btc&fiat=usd` → CoinGecko, falls back to PayGate `convert.php`. 30s in-memory cache. |
| `crypto-create-payment` | Reads wallet from `crypto_wallets`, fetches price, applies dust offset for uniqueness vs other pending intents, inserts `crypto_payment_intents`, returns `{address, expectedAmount, qrUrl, expiresAt, intentId}`. |
| `crypto-payment-status` | `?intentId=...` → returns current status (polled every 8s by frontend). |
| `crypto-watcher` | Cron every 60s. For each pending non-expired intent: query explorer, match TX by `(amount within ±2%) AND (timestamp > intent.created_at)`. On match → `detected`; once `confirmations >= threshold` → `confirmed`, set `orders.payment_status='paid'`, fire WhatsApp notification. Mark expired past `expires_at`. |

### Explorer endpoints (free, no key)
- BTC → `blockstream.info/api/address/{addr}/txs`
- ETH/ERC20 → `api.etherscan.io` (txlist + tokentx)
- BSC/BEP20 → `api.bscscan.com`
- Polygon → `api.polygonscan.com`
- Base → `api.basescan.org`
- Linea → `api.lineascan.build`
- Solana → `public-api.solscan.io`
- Tron/TRC20 → `api.trongrid.io`

Wrapped behind `getIncomingTxs(chain, address, sinceTs)` adapter — easy to add API keys later (just env vars, no code change).

## 3. Frontend changes

- **New hook** `useCryptoPrice(coin)` → calls `crypto-price`, refreshes every 30s.
- **New hook** `useCryptoPaymentIntent(orderId, network, coin)` → creates intent, polls status every 8s.
- **Modify** `src/components/DirectCryptoPayment.tsx`:
  - Reads `crypto_provider` site setting.
  - If `self_hosted`: live converter (`$49.99 ≈ 0.000812 BTC` + "updated 12s ago" + refresh icon), exact-amount warning, copy-amount button, QR code, status pill (Pending → Detected → Confirmed).
  - If `paygate`: existing flow untouched.
- **Admin** `Settings.tsx`: provider radio toggle + per-wallet `min_confirmations` field added to `CryptoWalletsManager`.

## 4. Dust-offset (uniqueness without per-customer wallets)

```ts
const base = usdToCoin(amountUsd, coin);
const collisions = countPendingIntents({coin, network, near: base});
const expectedAmount = round(base + collisions * smallestUnit(coin), decimals(coin));
```

Each concurrent pending intent gets a unique amount → no ambiguous matches.

## 5. Files

**Added**
- `supabase/functions/{crypto-price,crypto-create-payment,crypto-payment-status,crypto-watcher}/index.ts`
- `src/hooks/useCryptoPrice.ts`
- `src/hooks/useCryptoPaymentIntent.ts`
- DB migration

**Modified**
- `src/components/DirectCryptoPayment.tsx`
- `src/components/admin/CryptoWalletsManager.tsx`
- `src/pages/admin/Settings.tsx`

PayGate functions stay untouched.

## 6. Rollout

1. Migration + cron job
2. Deploy 4 edge functions
3. Frontend toggle defaults to `paygate` (zero risk)
4. Flip to `self_hosted` in admin → test with a small BTC payment
5. Leave PayGate as one-click fallback

## 7. Honest limitations

- One wallet per chain reused across customers — dust offset prevents collisions.
- Buyer must send the exact amount shown (clear UI warning + copy button).
- Free explorer APIs ~5 req/s; fine for current volume; API keys pluggable later.
- Refunds remain manual wallet sends (PayGate doesn't automate this either).
- Only new dependency: `qrcode` npm. CoinGecko + PayGate price = $0/month.

Approve and I'll ship migration + functions + UI in one pass.