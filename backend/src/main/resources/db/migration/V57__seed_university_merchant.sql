-- V57__seed_university_merchant.sql
-- Fixes foreign key violation when creating payment intents for the University ERP.
-- The API Key assigned to the University ERP has merchant_id = 3, but merchant 3 was missing.

INSERT INTO merchants (id, merchant_code, legal_name, business_registration_number, status, created_at)
VALUES (3, 'M-UNIV-ERP', 'University ERP System', 'BRN-UNIV-003', 'ACTIVE', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Adjust the sequence if needed, though 999 and 1001 were already seeded.
SELECT setval('merchants_id_seq', (SELECT MAX(id) FROM merchants));
