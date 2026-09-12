-- V65__backfill_api_keys_customer_id_and_account_merchants.sql
-- Backfill customer_id for api_keys and merchant_id for accounts

-- 1. Backfill customer_id on api_keys from merchant owner or linked account customer
UPDATE api_keys k
SET customer_id = COALESCE(
    (SELECT m.owner_id FROM merchants m WHERE m.id = k.merchant_id),
    (SELECT a.customer_id FROM accounts a WHERE a.account_number = k.linked_account_id)
)
WHERE k.customer_id IS NULL;

-- 2. Associate accounts with merchant_id where customer owns a merchant
UPDATE accounts a
SET merchant_id = (
    SELECT m.id FROM merchants m 
    WHERE m.owner_id = a.customer_id 
    ORDER BY m.id ASC LIMIT 1
)
WHERE a.merchant_id IS NULL 
  AND EXISTS (SELECT 1 FROM merchants m WHERE m.owner_id = a.customer_id);

-- Explicitly ensure Account 12 / 4859222340669478 is associated with Merchant 1002
UPDATE accounts
SET merchant_id = 1002
WHERE account_number = '4859222340669478';

-- Explicitly ensure API Key 27 is linked to Customer 3
UPDATE api_keys
SET customer_id = 3
WHERE id = 27;
