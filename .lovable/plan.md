# P5.2 Coupons + P5.3 Affiliate/Referral — Implementation Plan

Massive scope (8 tables, 8+ edge functions, 6+ pages). I'll ship in 3 sequential migrations + code waves so each layer is reviewable. Confirm before I start — once approved I execute end-to-end without further questions.

---

## Wave 1 — Database (1 migration, ~8 tables)

**Coupon tables**
- `coupons` — all fields from spec (code unique, type, value, currency, status, dates, max_total/per_user/per_device, min_amount, applicable_product_types[], applicable_product_ids[], excluded_product_ids[], allowed/excluded_user_ids[], created_by_admin_id, linked_affiliate_id)
- `coupon_redemptions` — coupon_id, user_id, order_id, discount/original/final, currency, ip, user_agent, device_fingerprint, cookie_id
- `coupon_usage_attempts` — audit log of every validate call (success + failure_reason)

**Affiliate tables**
- `affiliates` — user_id unique, referral_code unique, default_coupon_id, status, commission_type/value, payout_method, payout_details (jsonb), totals
- `affiliate_referral_clicks` — anonymous click log
- `affiliate_referrals` — affiliate↔referred_user link (unique on referred_user_id)
- `affiliate_commissions` — order_id unique, status, validation_available_at (paid_at + 30d), approved/rejected/paid timestamps, rejection_reason
- `affiliate_payouts` — amount, method, reference, status
- `affiliate_fraud_flags` — reason, severity, metadata jsonb

**Orders** — add `coupon_id`, `coupon_code`, `discount_amount`, `original_amount`, `affiliate_id`, `referral_cookie_id` columns (nullable, additive only).

**RLS pattern**
- Public: none.
- `authenticated`: read own redemptions, own affiliate row, own commissions, own payouts, own referrals.
- Admin (`is_admin_user()`): full access on all.
- Inserts to coupons/commissions/payouts: admin or service_role only (edge functions use service role).
- Click tracking insert: anon allowed (with rate-limit handled in edge function).
- GRANTs follow the standard pattern (anon click-track only on `affiliate_referral_clicks`).

**Trigger**
- On `orders` UPDATE → payment_status='paid': call `process_affiliate_commission()` security-definer function to create pending commission row if `affiliate_id` set and no self-referral.

---

## Wave 2 — Edge Functions

1. `validate-coupon` (verify_jwt=false, accepts optional auth) — runs all 10 validation rules, returns discount calculation, logs attempt.
2. `track-referral-click` (verify_jwt=false) — inserts click row, returns cookie_id.
3. `register-referral` — called post-signup to bind `referred_user_id` to affiliate via cookie.
4. `validate-affiliate-commissions` (scheduled daily via pg_cron) — flips pending→approved after 30d if order still paid, else rejects.
5. `admin-affiliate-payout` — admin-only, creates payout, marks commissions paid.
6. `affiliate-join` — creates affiliate row for current user (auto-active or pending based on `site_settings.affiliate_auto_approve`).

Coupon application is handled inline in order-creation (server-side `apply-coupon-to-checkout` step inside the existing order flow) to avoid race with payment intent creation.

---

## Wave 3 — Frontend

**Checkout** (`PaymentOptionsCheckout.tsx`)
- New coupon input block above payment method: input + Apply button, calls `validate-coupon`, shows success/error.
- Order summary: subtotal / discount line (green) / final total.
- Stores `coupon_id`, codes, amounts in order on creation.
- Reads `?ref=CODE` from URL on app mount (new `useReferralTracking` hook in `App.tsx`), persists to `localStorage` + `document.cookie` for 30d, fires `track-referral-click`.

**User pages**
- `/account/coupons` — tabs Available / Used / Expired, with savings totals.
- `/account/affiliate` — gated onboarding + dashboard (referral link + code + coupon, copy buttons, stats cards, commissions/payouts tables).

**Admin pages**
- `/diza/coupons` — list, create/edit dialog, redemptions drawer, failed-attempts log.
- `/diza/affiliates` — affiliates list w/ status actions, commission rate edit, commissions table (manual approve/reject), payout creation, fraud flags panel.
- Routes added to `adminRoutes.tsx` + sidebar.

**Shared**
- `src/lib/coupons.ts` — types, format helpers.
- `src/lib/affiliate.ts` — referral cookie helpers, fingerprint (lightweight, no extra dep — UA + screen + tz hash).
- `src/hooks/useCoupon.ts`, `useAffiliate.ts`, `useReferralTracking.ts`.

---

## Wave 4 — Notifications

Plug into existing `send-transactional-email`:
- coupon applied (in-checkout toast only, no email — avoids noise).
- affiliate approved, commission created/approved, payout paid → user email.
- new affiliate, payout requested, fraud flag high → admin email (`bwivox@gmail.com`).

Adds 5 new template entries in the registry.

---

## Out of scope / limitations I'll document at the end
- Device fingerprint is heuristic (no FingerprintJS dep to keep bundle lean) — sufficient for soft anti-fraud, not bulletproof.
- Payout execution is manual (admin marks paid); no automated crypto/PayPal payout integration.
- Free-trial coupon type stored as `percentage` 100 + flag `is_trial` — full trial lifecycle not built.
- No auto-generated welcome/birthday coupons in this pass (table supports it; cron job can be added later).

---

## Execution order
1. Migration (await approval) →
2. Edge functions + scheduled job →
3. Checkout integration →
4. User pages →
5. Admin pages →
6. Email templates →
7. Final summary doc.

This is roughly 25–35 file changes. Reply **go** and I start with the migration.