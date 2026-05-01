# Fix Crypto Provider Toggle + Default to Self-Hosted

The save already works — `crypto_provider = self_hosted` is in the DB. The toggle just can't *read* it back because the public RLS policy on `site_settings` only allows reading `whatsapp_number` and `telegram_username`. Also making `self_hosted` the new default everywhere.

## Changes

### 1. Database migration
Extend the public read policy to include `crypto_provider` (non-sensitive flag):

```sql
DROP POLICY "Anyone can read contact settings" ON site_settings;
CREATE POLICY "Anyone can read public settings" ON site_settings
  FOR SELECT USING (
    setting_key = ANY (ARRAY['whatsapp_number','telegram_username','crypto_provider'])
  );
```

Admin full-access policy stays untouched. No sensitive data exposed (value is just `self_hosted` or `paygate`).

### 2. Default to self_hosted in code
Update fallback values so when the setting is missing/loading, the app behaves as `self_hosted`:

- `src/components/admin/CryptoProviderToggle.tsx` — default selected = `self_hosted`
- `src/components/DirectCryptoPayment.tsx` — `provider ?? 'self_hosted'`
- Any other read of `crypto_provider` setting → fallback `self_hosted`

### 3. Verify
- Reload `/diza/settings` → toggle shows **Self-Hosted** selected
- Open checkout crypto tab → live converter + your wallet address shown (not PayGate)

## Files touched
- New migration (1 policy swap)
- `src/components/admin/CryptoProviderToggle.tsx`
- `src/components/DirectCryptoPayment.tsx`

Zero risk to payment flow — purely visibility + default value.
