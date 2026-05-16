# P5 — Customer Account Space (plan complet, 3 sous-phases)

Objectif : transformer `/account` en un vrai espace client SaaS, responsive, sécurisé, multilingue (EN/FR/AR), avec auto-fill, renouvellement 1-clic et préparation au système referral.

---

## Layout global (commun aux 3 phases)

**Shell** : `AccountLayout` avec `SidebarProvider` (shadcn) + `Outlet`.

- Sidebar **collapsible="icon"** desktop, **drawer** mobile, **NavLink** actif highlighté.
- Header compact : avatar, langue, bouton retour boutique, logout.
- Sidebar groupée :
  - **Account** : Dashboard · Orders · Subscriptions · Activation Details
  - **Wallet** : Payment History · Coupons
  - **Growth** : Affiliate Program
  - **Settings** : Profile · Security · Notifications · Linked Accounts · Saved Profiles · Language · Danger Zone

Routes : `/account`, `/account/orders`, `/account/orders/:id`, `/account/subscriptions`, `/account/activations`, `/account/payments`, `/account/coupons`, `/account/affiliate`, `/account/settings/profile`, `/account/settings/security`, `/account/settings/notifications`, `/account/settings/linked`, `/account/settings/saved-profiles`, `/account/settings/danger`.

Toutes les pages protégées par un `RequireAuth` wrapper (redirige vers `/` + ouvre `AuthDialog`).

---

## P5.1 — Core (priorité 1, livraison immédiate)

Tout ce qui apporte de la valeur sans nouveau backend lourd.

### 1. Dashboard `/account`
Vue d'ensemble :
- Carte **Welcome** (avatar + display_name + provider badge)
- 4 KPI cards : commandes totales, abos actifs, prochaine expiration, économies réalisées (somme remises)
- **Active subscriptions** (3 max) avec compte à rebours visuel + bouton "Renew"
- **Recent orders** (5 dernières) avec statut coloré
- CTA "Explore packages" si 0 commande

### 2. My Orders `/account/orders` + `/account/orders/:id`
- Liste filtrable (statut, date, catégorie), search, pagination
- Card mobile / table desktop
- Détail commande : récap, items, paiement, credentials (si livrés), timeline statut
- Boutons : **Renew** (pre-fill checkout), **Download invoice PDF**, **Contact support** (WhatsApp pré-rempli)
- ⚙️ *Payment History* fusionné ici via filtre "Paid only" + colonne méthode/montant

### 3. My Subscriptions `/account/subscriptions`
- Calcul depuis `orders` où `package_category in (iptv_subscription, iptv_panel, player_panel)` + `credentials_delivered_at` + `duration_months`
- Card par abo : nom, expiration, jours restants (barre de progression), statut (active / expiring soon ≤7j / expired)
- **Renew 1-clic** : ouvre checkout pre-rempli avec credentials du précédent

### 4. Activation Details `/account/activations`
- Liste des activations Player (IBO, Smarters, etc.) avec credentials masqués
- Bouton "Show credentials" (révèle 30s) + **Copy** par champ
- QR code M3U (pratique mobile)
- Tutoriel rapide par device

### 5. Settings — Profile `/account/settings/profile`
- Edit display_name, phone (WhatsApp), avatar upload (bucket `avatars` à créer, public, 2MB max)
- Email read-only (avec badge "Verified" / "Change requires re-auth")
- Langue préférée (EN/FR/AR — persistée dans `profiles.preferred_language`)

### 6. Settings — Security `/account/settings/security`
- **Change Password** (re-auth via current password si provider=email)
- Sessions actives (liste devices `supabase.auth.getSession` + bouton "Logout all other")
- 2FA optionnel (placeholder, badge "Coming soon" si tu veux)

### 7. Settings — Linked Accounts `/account/settings/linked`
- Liste providers liés (Google, Facebook, Apple, Discord, X, Steam) avec badges
- Bouton "Connect" / "Disconnect" par provider via `supabase.auth.linkIdentity` / `unlinkIdentity`

### 8. Settings — Saved Profiles `/account/settings/saved-profiles`
- Réutilise `useCheckoutAutofill` → liste MAC/Xtream usernames sauvegardés
- Nommer, éditer, supprimer
- Bouton "Use at next checkout" (pin)

### 9. Settings — Danger Zone `/account/settings/danger`
- Export mes données (JSON download — RGPD)
- Supprimer mon compte (confirmation typée + cascade côté Supabase)

### Backend P5.1
- Migration : `profiles` += `preferred_language text`, `saved_profiles jsonb default '[]'`
- Bucket storage `avatars` (public) + RLS user upload son propre dossier
- Edge function `generate-invoice-pdf` (React-PDF ou simple HTML→PDF) appelée depuis le bouton
- RLS : utilisateur peut SELECT ses `orders` où `customer_email = (select email from profiles where id = auth.uid())`

---

## P5.2 — Engagement (après P5.1 validé)

### 10. Notifications system
**Backend** :
- Table `notifications` (user_id, type, title, body, link, is_read, created_at)
- RLS : user voit/update les siennes
- Triggers PG :
  - sur INSERT `orders` → notif "Order received"
  - sur UPDATE `orders.status` → notif statut
  - cron quotidien : abos expirant dans 7j / 3j / 1j → notif

**Frontend** :
- Cloche dans header avec badge unread count + dropdown 5 dernières
- Page `/account/settings/notifications` :
  - Préférences (email on/off par type, WhatsApp on/off, in-app)
  - Liste full historique avec mark all as read

### 11. Coupons system
**Backend (prérequis)** :
- Table `coupons` (code, type [percent|fixed], value, min_amount, max_uses, used_count, valid_from, valid_until, applicable_categories[], created_by)
- Table `coupon_redemptions` (coupon_id, user_id, order_id, amount_saved)
- Admin panel pour CRUD coupons (à ajouter dans `/diza`)
- Edge function `validate-coupon` (vérifie validité + applique au total)

**Frontend** :
- Champ "Promo code" dans checkout step 3 → calcul live
- Page `/account/coupons` :
  - Coupons disponibles (welcome, fidélité, anniversaire auto-générés)
  - Historique utilisation avec montants économisés
  - Bouton "Copy code"

---

## P5.3 — Growth (Affiliate Program, gros chantier dédié)

### 12. Affiliate Program complet
**Backend** :
- Table `affiliate_accounts` (user_id, referral_code unique, tier, commission_rate, total_earned, balance, payout_method, payout_details_encrypted)
- Table `affiliate_referrals` (affiliate_id, referred_user_id, first_order_id, status [pending|confirmed|paid])
- Table `affiliate_commissions` (referral_id, order_id, amount, status, paid_at)
- Table `affiliate_payouts` (affiliate_id, amount, method, status, processed_at, tx_ref)
- Tracking : cookie `?ref=CODE` 30j → assigné à signup
- Edge function `process-affiliate-commission` (trigger sur order paid)
- Edge function `request-payout` (crypto/PayPal/wire)

**Frontend `/account/affiliate`** :
- Onboarding (si pas encore affilié) : "Become an affiliate" + acceptation T&C
- Dashboard : code unique + lien copyable, QR, stats (clicks, signups, conversions, earnings)
- Graph revenus 30j (Recharts)
- Liste referrals avec statuts
- Marketing kit (banners téléchargeables, textes pré-rédigés EN/FR/AR)
- Demande de payout (seuil minimum configurable)
- Tier system (Bronze/Silver/Gold) avec progression visible

---

## Détails techniques transverses

### Composants à créer
```
src/layouts/AccountLayout.tsx
src/components/account/AccountSidebar.tsx
src/components/account/RequireAuth.tsx
src/components/account/KPICard.tsx
src/components/account/SubscriptionCountdown.tsx
src/components/account/OrderStatusBadge.tsx
src/components/account/CredentialsReveal.tsx
src/components/account/AvatarUploader.tsx
src/components/account/NotificationBell.tsx (P5.2)
src/components/account/CouponCard.tsx (P5.2)
src/components/account/AffiliateStatsCard.tsx (P5.3)
src/pages/account/Dashboard.tsx
src/pages/account/Orders.tsx
src/pages/account/OrderDetail.tsx
src/pages/account/Subscriptions.tsx
src/pages/account/Activations.tsx
src/pages/account/Payments.tsx (alias filtré Orders)
src/pages/account/Coupons.tsx (P5.2)
src/pages/account/Affiliate.tsx (P5.3)
src/pages/account/settings/Profile.tsx
src/pages/account/settings/Security.tsx
src/pages/account/settings/Notifications.tsx (P5.2)
src/pages/account/settings/Linked.tsx
src/pages/account/settings/SavedProfiles.tsx
src/pages/account/settings/Danger.tsx
```

### Hooks
```
useUserOrders, useUserSubscriptions, useUserActivations,
useNotifications (P5.2), useCoupons (P5.2),
useAffiliate, useAffiliateStats (P5.3),
useLinkedProviders, useAvatarUpload
```

### Design system
- Garde les tokens HSL de `index.css` (pas de couleurs hardcodées)
- Animations Motion : fade-in cards stagger 50ms, counters animés sur KPI
- États vides illustrés (svg simple) pour chaque page vide
- Skeleton loaders cohérents
- Responsive mobile-first (sidebar drawer, KPI cards 2-col mobile / 4-col desktop)

### i18n
- Toutes les strings via `useTranslations` (clés `account.*`)
- Génération auto FR/AR par edge function `generate-translations` existante

### Sécurité
- Tous les uploads avatar → bucket `avatars/{user_id}/...` (RLS scoped)
- Re-auth obligatoire pour : change password, delete account, change email
- Invoice PDF générée server-side avec user JWT validé
- Affiliate payout details chiffrés (pgcrypto)

---

## Roadmap d'exécution

| Phase | Contenu | Effort estimé |
|---|---|---|
| **P5.1** | Layout + 9 pages core + bucket avatars + invoice PDF | 1 grosse itération |
| **P5.2** | Notifications (DB + triggers + UI) + Coupons (admin + checkout + page) | 1 itération |
| **P5.3** | Affiliate Program complet (4 tables + tracking + dashboard + payout) | 1-2 itérations |

Ordre conseillé : **P5.1 d'abord (livré complet)** → tester en prod → **P5.2** → **P5.3**.

---

## Suggestions bonus (à valider)
- **Auto-renew** opt-in : carte bancaire tokenisée via PayGate pour renouvellement auto
- **Loyalty points** : 1€ dépensé = 1 point, échangeable contre coupon (à intégrer avec P5.2)
- **Wishlist** : sauvegarder packages favoris pour plus tard
- **Multi-device alerts** : email/WhatsApp quand un device se connecte à ton compte

Veux-tu que j'attaque **P5.1 maintenant** ? Si oui, confirme aussi : sidebar verticale (recommandé) ou tabs horizontales pour les settings ?
