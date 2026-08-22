ALTER TABLE api_keys ADD COLUMN merchant_id bigint;

-- Backfill existing keys (if any) to merchant_id 1
UPDATE api_keys SET merchant_id = 1 WHERE merchant_id IS NULL;

-- Enforce the constraint
ALTER TABLE api_keys ALTER COLUMN merchant_id SET NOT NULL;
