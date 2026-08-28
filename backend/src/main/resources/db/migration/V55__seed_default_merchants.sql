-- Seed default merchants for Gateway fallback and testing
INSERT INTO merchants (id, merchant_code, legal_name, business_registration_number, status, created_at)
VALUES (999, 'M-DEFAULT', 'Fallback Default Merchant', 'BRN-999999', 'ACTIVE', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO merchants (id, merchant_code, legal_name, business_registration_number, status, created_at)
VALUES (1001, 'M-1001', 'Test Client Merchant', 'BRN-100100', 'ACTIVE', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Adjust the sequence to avoid collisions if we insert more later
SELECT setval('merchants_id_seq', (SELECT MAX(id) FROM merchants));
