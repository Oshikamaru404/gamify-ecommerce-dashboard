
# BWIVOX Sprint — Notifications + Chat Evolution

Large multi-module sprint. Will ship in 4 waves, each preserving backward compatibility, RLS, and the existing design system.

---

## Wave 1 — Database migrations

### 1.1 `notifications` table
Columns: `id, user_id, type, title, body, link, icon, severity (info|success|warning|error), category (order|payment|credentials|coupon|affiliate|chat|system), metadata jsonb, read_at, archived_at, created_at`.
- RLS: user reads/updates own rows; service_role full.
- Realtime publication enabled.
- Index on `(user_id, archived_at, read_at, created_at desc)`.

### 1.2 Extend `chat_conversations`
Add columns (nullable / defaults to preserve existing rows):
- `conversation_type text default 'support'` (`support` | `general_room`)
- `assigned_admin_id uuid null`
- `color text null`, `emoji text null`
- `pinned boolean default false`
- `archived boolean default false`
- `internal_notes text null`
- `muted boolean default false`
- `last_seen_user_at timestamptz null`, `last_seen_admin_at timestamptz null`
- `typing_user_at timestamptz null`, `typing_admin_at timestamptz null`
(`priority`, `status`, `tags`, `admin_notes` already exist — keep `admin_notes`, mirror into `internal_notes` via default.)

### 1.3 Extend `chat_messages`
- `delivered_at timestamptz default now()`
- `read_at timestamptz null`
- `edited_at timestamptz null`
- `reply_to_id uuid null` (FK self)
- `attachments jsonb default '[]'`

### 1.4 Triggers (notification fanout)
Postgres trigger functions to insert into `notifications`:
- `orders` INSERT → `order_created` for `user_id`
- `orders` UPDATE: `payment_status` → `paid` → `payment_confirmed`
- `orders` UPDATE: `status` change → `order_status_updated`
- `orders` UPDATE: `credentials_delivered_at` set → `credentials_delivered`
- `coupon_redemptions` INSERT → `coupon_applied`
- `affiliates` UPDATE: status change → `affiliate_status`
- `affiliate_commissions` INSERT → `commission_created`; UPDATE→approved → `commission_approved`
- `affiliate_payouts` UPDATE→paid → `payout_completed`
- `chat_messages` INSERT where sender=admin → `chat_reply` to conv owner
(Subscription-expiring and coupon-expiring run from existing scheduler/edge function — add lightweight cron entries later if user wants.)

---

## Wave 2 — Notification Center frontend

- `src/hooks/useNotifications.ts` — list, unread count, mark read/all-read/archive, realtime subscription.
- `src/components/notifications/NotificationBell.tsx` — bell icon + badge + popover with latest 10 + "See all".
- `src/pages/account/Notifications.tsx` — full page with tab filters (All/Unread/Read/Archived), bulk actions, click-to-navigate.
- Wire bell into `StoreHeaderWithLanguage.tsx` (desktop + mobile, beside chat icon).
- Route `/account/notifications` in `App.tsx` + nav entry in `AccountSidebar.tsx`.

---

## Wave 3 — Quick Chat (General Room)

- Update `src/pages/Chat.tsx` `quick=1` handler: require auth; query existing `general_room` conversation for current user; if found, open; else create with `conversation_type='general_room'`, category `'general_room'`, priority `'normal'`.
- Keep existing categorized flow at `/chat` (no `?quick`).
- `StoreHeaderWithLanguage` chat icon already passes `?quick=1` — confirm.
- RLS: enforce conversations scoped to `user_id = auth.uid()` for general_room.

---

## Wave 4 — Admin Chat CRM + UX improvements

### 4.1 `/diza/chat` refactor
Two top-level tabs in `ChatAdmin.tsx`:
- **Support Chat** — filters by `conversation_type='support'`, grouped by category.
- **General Room** — filters by `conversation_type='general_room'`.

Per-conversation side panel:
- Rename, priority, status, assign admin (dropdown of `admin_users`), tags, color, emoji, pin, archive, mute.
- Internal notes textarea (admin-only via RLS).
- Customer info card: email, phone, country, language, signup date, total orders, active subs, affiliate status, total spent (queries `orders`, `affiliates`).
- Quick actions: open profile/orders/subs/payments, copy email/phone.
- Search + advanced filter bar (status, priority, assigned, tags, unread, pinned).

### 4.2 Customer + Admin chat UX
- Typing indicator: write `typing_*_at` on input; show indicator if recent (<5s).
- Delivered/Read ticks: based on `delivered_at` / `read_at`; mark read on view.
- Online indicator: `last_seen_*_at` heartbeat.
- Reply preview (click message → quote into composer).
- Copy message, edit own message within 5 min.
- Emoji picker (`emoji-picker-react` lightweight).
- Attachment-ready: composer accepts files into `attachments[]` (UI scaffold; upload to `avatars`-style bucket follow-up).
- Mobile spacing polish.

### 4.3 Notification integration
- Each notification has `link` → React Router navigates on click (`/account/orders/:id`, `/chat?token=…`, `/account/affiliate`, etc.).

---

## Files touched (high level)
- New: `src/hooks/useNotifications.ts`, `src/components/notifications/NotificationBell.tsx`, `src/pages/account/Notifications.tsx`, `src/components/chat/EmojiPicker.tsx`, `src/components/admin/chat/ConversationSidePanel.tsx`, `src/components/admin/chat/CustomerInfoCard.tsx`.
- Edit: `Chat.tsx`, `useChat.ts`, `ChatAdmin.tsx`, `StoreHeaderWithLanguage.tsx`, `App.tsx`, `AccountSidebar.tsx`, `lib/chatCategories.ts`.
- Migrations: 1 file covering tables/columns/triggers/RLS/realtime/grants.

## Out of scope (will note for follow-up)
- File upload backend for attachments (UI ready, storage bucket policy in follow-up).
- Push notifications (web push) — only in-app + realtime here.
- Cron for "subscription expiring" / "coupon expiring" reminders — schema ready, scheduler is a follow-up.

Confirm and I'll start Wave 1 (migration).
