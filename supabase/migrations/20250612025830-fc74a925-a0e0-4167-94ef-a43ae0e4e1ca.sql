
-- First, clear existing packages to avoid confusion
DELETE FROM iptv_packages;

-- Insert Subscription packages (for Home and Subscribe pages) - monthly options (1,3,6,12)
INSERT INTO iptv_packages (name, category, description, icon, features, price_10_credits, price_25_credits, price_50_credits, price_100_credits, status, sort_order) VALUES
('STRONG 8K IPTV', 'subscription', '8K Ultra HD IPTV subscription with premium channels', '🔥', ARRAY['8K Quality', '5000+ Channels', 'VOD Library', 'Multi-device'], 12.99, 35.99, 65.99, 120.99, 'featured', 1),
('TREX 8K IPTV', 'subscription', '8K IPTV service with extensive channel lineup', '🦖', ARRAY['8K Quality', '4500+ Channels', 'Sports Packages', '24/7 Support'], 11.99, 32.99, 59.99, 110.99, 'active', 2),
('PROMAX 4K IPTV', 'subscription', '4K IPTV with premium content and features', '⭐', ARRAY['4K Quality', '3500+ Channels', 'Premium VOD', 'EPG Support'], 9.99, 27.99, 49.99, 89.99, 'active', 3),
('TIVIONE 4K IPTV', 'subscription', '4K IPTV solution with reliable streaming', '📺', ARRAY['4K Quality', '3000+ Channels', 'Catch-up TV', 'Parental Control'], 8.99, 24.99, 44.99, 79.99, 'active', 4),
('B1G 4K IPTV', 'subscription', '4K IPTV with big entertainment package', '🎬', ARRAY['4K Quality', '2500+ Channels', 'Movie Library', 'Series Collection'], 7.99, 21.99, 39.99, 69.99, 'active', 5);

-- Insert Panel IPTV packages - credit options (10,25,50,100)
INSERT INTO iptv_packages (name, category, description, icon, features, price_10_credits, price_25_credits, price_50_credits, price_100_credits, status, sort_order) VALUES
('STRONG 8K IPTV', 'panel-iptv', 'Reseller panel for STRONG 8K IPTV with credit system', '🔥', ARRAY['Admin Panel', '8K Streams', 'User Management', 'Credit System'], 25.00, 60.00, 115.00, 220.00, 'featured', 1),
('TREX 8K IPTV', 'panel-iptv', 'Reseller panel for TREX 8K IPTV with advanced features', '🦖', ARRAY['Panel Access', '8K Quality', 'Bulk Operations', 'Analytics'], 23.00, 55.00, 105.00, 200.00, 'active', 2),
('PROMAX 4K IPTV', 'panel-iptv', 'Reseller panel for PROMAX 4K IPTV management', '⭐', ARRAY['Control Panel', '4K Streams', 'Client Management', 'Reports'], 20.00, 48.00, 90.00, 170.00, 'active', 3),
('TIVIONE 4K IPTV', 'panel-iptv', 'Reseller panel for TIVIONE 4K IPTV service', '📺', ARRAY['Admin Tools', '4K Quality', 'User Control', 'Statistics'], 18.00, 42.00, 80.00, 150.00, 'active', 4),
('B1G 4K IPTV', 'panel-iptv', 'Reseller panel for B1G 4K IPTV with credit management', '🎬', ARRAY['Panel Interface', '4K Streaming', 'Account Management', 'Credit Control'], 15.00, 35.00, 65.00, 125.00, 'active', 5);

-- Insert Player packages - credit options (10,25,50,100)
INSERT INTO iptv_packages (name, category, description, icon, features, price_10_credits, price_25_credits, price_50_credits, price_100_credits, status, sort_order) VALUES
('VU Player Pro', 'player', 'Professional VU Player with advanced streaming capabilities', '📱', ARRAY['Multi-format Support', 'EPG Integration', 'Recording', 'Timeshift'], 30.00, 70.00, 135.00, 260.00, 'featured', 1),
('IBO Pro Player', 'player', 'IBO Pro Player with premium features and interface', '🎮', ARRAY['User-friendly Interface', 'VOD Support', 'Parental Control', 'Favorites'], 28.00, 65.00, 125.00, 240.00, 'active', 2),
('STZ Player', 'player', 'STZ Player with streamlined design and performance', '⚡', ARRAY['Fast Performance', 'Clean Interface', 'Channel Guide', 'Settings Sync'], 25.00, 58.00, 110.00, 210.00, 'active', 3),
('RELAX Player', 'player', 'RELAX Player for comfortable viewing experience', '😌', ARRAY['Comfortable UI', 'Easy Navigation', 'Sleep Timer', 'Auto-update'], 22.00, 52.00, 95.00, 180.00, 'active', 4),
('HOT Player', 'player', 'HOT Player with trending features and hot content', '🔥', ARRAY['Trending Content', 'Hot Channels', 'Quick Access', 'Social Features'], 20.00, 48.00, 90.00, 170.00, 'active', 5),
('ARC Player', 'player', 'ARC Player with arc design and smooth performance', '🌈', ARRAY['Arc Design', 'Smooth Playback', 'Custom Themes', 'Advanced Settings'], 18.00, 42.00, 80.00, 150.00, 'active', 6);

-- Insert Activation Player packages - monthly options (1,3,6,12)
INSERT INTO iptv_packages (name, category, description, icon, features, price_10_credits, price_25_credits, price_50_credits, price_100_credits, status, sort_order) VALUES
('VU Player Pro', 'activation-player', 'VU Player Pro activation service with device setup', '📱', ARRAY['Device Activation', '12 Month License', 'Setup Support', 'Auto-configuration'], 99.00, 279.00, 539.00, 999.00, 'featured', 1),
('IBO Pro Player', 'activation-player', 'IBO Pro Player activation with premium support', '🎮', ARRAY['Instant Activation', '12 Month Validity', 'Premium Support', 'Multi-device'], 89.00, 249.00, 479.00, 889.00, 'active', 2),
('STZ Player', 'activation-player', 'STZ Player activation service with fast setup', '⚡', ARRAY['Quick Activation', '12 Month Access', 'Fast Setup', 'Performance Optimization'], 79.00, 219.00, 419.00, 779.00, 'active', 3),
('RELAX Player', 'activation-player', 'RELAX Player activation with comfortable setup', '😌', ARRAY['Easy Activation', '12 Month Service', 'User-friendly Setup', 'Comfort Features'], 69.00, 189.00, 359.00, 669.00, 'active', 4),
('HOT Player', 'activation-player', 'HOT Player activation with trending features', '🔥', ARRAY['Hot Activation', '12 Month Package', 'Trending Setup', 'Latest Features'], 59.00, 159.00, 299.00, 559.00, 'active', 5),
('ARC Player', 'activation-player', 'ARC Player activation with premium arc experience', '🌈', ARRAY['Arc Activation', '12 Month License', 'Premium Experience', 'Custom Configuration'], 49.00, 129.00, 239.00, 449.00, 'active', 6);

-- Update timestamps
UPDATE iptv_packages SET updated_at = now();
