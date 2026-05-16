
-- P5.1 Account Space: profile extensions + avatars bucket + orders read policy for owners

-- 1) Extend profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS saved_profiles jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2) Avatars bucket (public read, scoped write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read avatars
DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users upload only into their own folder {user_id}/...
DROP POLICY IF EXISTS "Users upload their own avatar" ON storage.objects;
CREATE POLICY "Users upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users update their own avatar" ON storage.objects;
CREATE POLICY "Users update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users delete their own avatar" ON storage.objects;
CREATE POLICY "Users delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3) Orders: let authenticated users read their own orders (matched by email on profile)
DROP POLICY IF EXISTS "Users read their own orders" ON public.orders;
CREATE POLICY "Users read their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (
  customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
);
