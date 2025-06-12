
-- Add month-based pricing columns for subscription packages
ALTER TABLE iptv_packages 
ADD COLUMN price_1_month NUMERIC,
ADD COLUMN price_3_months NUMERIC,
ADD COLUMN price_6_months NUMERIC,
ADD COLUMN price_12_months NUMERIC;

-- Update subscription packages with correct month-based pricing
UPDATE iptv_packages 
SET 
  price_1_month = 12.99,
  price_3_months = 35.99,
  price_6_months = 65.99,
  price_12_months = 120.99,
  -- Clear credit pricing for subscription packages since they don't use credits
  price_10_credits = NULL,
  price_25_credits = NULL,
  price_50_credits = NULL,
  price_100_credits = NULL
WHERE category = 'subscription' AND name = 'STRONG 8K IPTV';

UPDATE iptv_packages 
SET 
  price_1_month = 10.99,
  price_3_months = 29.99,
  price_6_months = 55.99,
  price_12_months = 99.99,
  price_10_credits = NULL,
  price_25_credits = NULL,
  price_50_credits = NULL,
  price_100_credits = NULL
WHERE category = 'subscription' AND name = 'TREX 8K IPTV';

UPDATE iptv_packages 
SET 
  price_1_month = 18.99,
  price_3_months = 52.99,
  price_6_months = 99.99,
  price_12_months = 189.99,
  price_10_credits = NULL,
  price_25_credits = NULL,
  price_50_credits = NULL,
  price_100_credits = NULL
WHERE category = 'subscription' AND name = 'PROMAX 4K IPTV';

UPDATE iptv_packages 
SET 
  price_1_month = 13.99,
  price_3_months = 38.99,
  price_6_months = 72.99,
  price_12_months = 139.99,
  price_10_credits = NULL,
  price_25_credits = NULL,
  price_50_credits = NULL,
  price_100_credits = NULL
WHERE category = 'subscription' AND name = 'TIVIONE 4K IPTV';

UPDATE iptv_packages 
SET 
  price_1_month = 16.99,
  price_3_months = 47.99,
  price_6_months = 89.99,
  price_12_months = 169.99,
  price_10_credits = NULL,
  price_25_credits = NULL,
  price_50_credits = NULL,
  price_100_credits = NULL
WHERE category = 'subscription' AND name = 'B1G 4K IPTV';
