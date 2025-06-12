
-- First, let's see what packages currently exist
SELECT id, name, category, description FROM iptv_packages ORDER BY category, name;

-- Update packages to have correct categories based on their typical usage patterns
-- Subscription packages (month-based system)
UPDATE iptv_packages 
SET category = 'subscription'::package_category 
WHERE name ILIKE '%month%' 
   OR name ILIKE '%subscription%' 
   OR description ILIKE '%month%'
   OR description ILIKE '%subscription%';

-- Panel IPTV packages (credit-based system for resellers)
UPDATE iptv_packages 
SET category = 'panel-iptv'::package_category 
WHERE name ILIKE '%panel%' 
   OR name ILIKE '%reseller%' 
   OR name ILIKE '%credit%'
   OR description ILIKE '%panel%'
   OR description ILIKE '%reseller%'
   OR description ILIKE '%credit%';

-- Player packages (for streaming applications)
UPDATE iptv_packages 
SET category = 'player'::package_category 
WHERE name ILIKE '%player%' 
   OR description ILIKE '%player%'
   OR description ILIKE '%streaming%';

-- Activation Player packages (for device activation)
UPDATE iptv_packages 
SET category = 'activation-player'::package_category 
WHERE name ILIKE '%activation%' 
   OR name ILIKE '%device%'
   OR description ILIKE '%activation%'
   OR description ILIKE '%device%';

-- If there are no packages, let's create sample packages for each category
INSERT INTO iptv_packages (name, category, description, icon, features, price_10_credits, price_25_credits, price_50_credits, price_100_credits, status, sort_order)
SELECT 
  new_packages.name,
  new_packages.category::package_category,
  new_packages.description,
  new_packages.icon,
  new_packages.features,
  new_packages.price_10_credits,
  new_packages.price_25_credits,
  new_packages.price_50_credits,
  new_packages.price_100_credits,
  new_packages.status::package_status,
  new_packages.sort_order
FROM (
  VALUES 
    ('Basic Subscription', 'subscription', 'Monthly IPTV subscription with basic channels', '📺', ARRAY['HD Quality', '1000+ Channels', 'VOD Library'], 10.99, 25.99, 45.99, 85.99, 'active', 1),
    ('Premium Subscription', 'subscription', 'Premium monthly IPTV subscription', '⭐', ARRAY['4K Quality', '5000+ Channels', 'Premium VOD', 'Multi-device'], 19.99, 45.99, 85.99, 160.99, 'featured', 2),
    ('Reseller Panel', 'panel-iptv', 'IPTV panel for resellers with credit system', '💼', ARRAY['Admin Panel', 'User Management', 'Credit System', 'White Label'], 50.00, 120.00, 230.00, 450.00, 'active', 1),
    ('Premium Panel', 'panel-iptv', 'Advanced IPTV panel with extended features', '🚀', ARRAY['Advanced Analytics', 'API Access', 'Custom Branding', 'Priority Support'], 100.00, 240.00, 460.00, 900.00, 'featured', 2),
    ('Basic Player', 'player', 'Simple IPTV player application', '▶️', ARRAY['Easy Setup', 'EPG Support', 'Parental Control'], 15.00, 35.00, 65.00, 125.00, 'active', 1),
    ('Pro Player', 'player', 'Professional IPTV player with advanced features', '🎮', ARRAY['Multi-format Support', 'Recording', 'Timeshift', 'Cloud Storage'], 30.00, 70.00, 135.00, 260.00, 'featured', 2),
    ('Device Activation', 'activation-player', 'Activate your device for IPTV streaming', '🔓', ARRAY['One-time Setup', 'Device Binding', 'Auto Configuration'], 25.00, 60.00, 115.00, 220.00, 'active', 1),
    ('Premium Activation', 'activation-player', 'Premium device activation with extended support', '👑', ARRAY['Priority Activation', 'Extended Warranty', '24/7 Support', 'Multi-device'], 45.00, 105.00, 200.00, 390.00, 'featured', 2)
) AS new_packages(name, category, description, icon, features, price_10_credits, price_25_credits, price_50_credits, price_100_credits, status, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM iptv_packages WHERE category = new_packages.category::package_category
);

-- Update timestamps
UPDATE iptv_packages SET updated_at = now();
