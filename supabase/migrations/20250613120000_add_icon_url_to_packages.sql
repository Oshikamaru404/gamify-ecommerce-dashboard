
-- Add icon_url column to iptv_packages table
ALTER TABLE iptv_packages ADD COLUMN icon_url TEXT;

-- Update the existing packages to have some example image URLs
-- You can replace these with your actual image URLs
UPDATE iptv_packages SET icon_url = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop&crop=center' WHERE icon = '📺';
UPDATE iptv_packages SET icon_url = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop&crop=center' WHERE icon = '🚀';
UPDATE iptv_packages SET icon_url = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop&crop=center' WHERE icon = '⚡';
UPDATE iptv_packages SET icon_url = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop&crop=center' WHERE icon = '🎬';
UPDATE iptv_packages SET icon_url = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop&crop=center' WHERE icon = '🦖';
