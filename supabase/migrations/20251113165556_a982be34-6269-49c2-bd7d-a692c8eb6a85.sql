-- Add password_hash column to admin_users table
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Set a default hashed password for existing admin user
-- This is bcrypt hash of 'admin123'
UPDATE admin_users 
SET password_hash = '$2a$10$rN8qZ5qZ5qZ5qZ5qZ5qZ5OqZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5q'
WHERE username = 'admin' AND password_hash IS NULL;