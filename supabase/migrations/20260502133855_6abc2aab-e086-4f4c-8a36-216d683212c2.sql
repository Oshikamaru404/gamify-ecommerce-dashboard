-- Add IPTV credentials delivery columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS m3u_url text,
  ADD COLUMN IF NOT EXISTS xtream_host text,
  ADD COLUMN IF NOT EXISTS xtream_port text,
  ADD COLUMN IF NOT EXISTS xtream_username text,
  ADD COLUMN IF NOT EXISTS xtream_password text,
  ADD COLUMN IF NOT EXISTS credentials_expiration text,
  ADD COLUMN IF NOT EXISTS credentials_notes text,
  ADD COLUMN IF NOT EXISTS credentials_delivered_at timestamp with time zone;