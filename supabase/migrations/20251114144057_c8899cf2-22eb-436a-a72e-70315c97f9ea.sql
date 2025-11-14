-- Add password_hash column to admin_users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users' 
        AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE public.admin_users 
        ADD COLUMN password_hash TEXT;
    END IF;
END $$;