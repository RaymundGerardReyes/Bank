-- V64__seed_deterministic_api_keys.sql
-- Seeds the deterministic integration API keys directly via standard ANSI SQL.
-- Compatible with both PostgreSQL (production) and H2 in PostgreSQL mode (integration tests).
--
-- Key 1: University ERP Sandbox Test Key
-- Raw secret  : sk_test_2026_university_erp_sandbox_key
-- SHA-256 hash: c6091128769d52852f21154340b32b40b116dc8edeb747c91cb3e2674347e771

INSERT INTO api_keys (
    key_prefix, merchant_id, key_hash,
    name, environment, cidr_whitelist, scopes, linked_account_id,
    application_id, application_name, per_transaction_limit, daily_limit,
    expires_at, created_at
)
SELECT
    'sk_test_',
    m.id,
    'c6091128769d52852f21154340b32b40b116dc8edeb747c91cb3e2674347e771',
    'University ERP Sandbox Test Key',
    'SANDBOX',
    '0.0.0.0/0',
    'payments:write,payments:read,accounts:read,accounts:write,treasury:write,treasury:read',
    '4859220013371001',
    'app_university_erp',
    'University ERP Gateway Client',
    100000.0000,
    1000000.0000,
    CURRENT_TIMESTAMP + INTERVAL '3650' DAY,
    CURRENT_TIMESTAMP
FROM merchants m
WHERE m.merchant_code = 'M-UNIV-ERP'
  AND NOT EXISTS (
      SELECT 1 FROM api_keys
      WHERE key_hash = 'c6091128769d52852f21154340b32b40b116dc8edeb747c91cb3e2674347e771'
  );

-- Key 2: University ERP Live Production Key
-- Raw secret  : sk_live_2026_university_erp_production_key
-- SHA-256 hash: 79b734a56ee2d178d19e85ab2fb4870976f0ba4baeda616ef47fa21baada6096

INSERT INTO api_keys (
    key_prefix, merchant_id, key_hash,
    name, environment, cidr_whitelist, scopes, linked_account_id,
    application_id, application_name, per_transaction_limit, daily_limit,
    expires_at, created_at
)
SELECT
    'sk_live_',
    m.id,
    '79b734a56ee2d178d19e85ab2fb4870976f0ba4baeda616ef47fa21baada6096',
    'University ERP Live Production Key',
    'LIVE',
    '0.0.0.0/0',
    'payments:write,payments:read,accounts:read,accounts:write,treasury:write,treasury:read',
    '4859220013371001',
    'app_university_erp',
    'University ERP Gateway Client',
    100000.0000,
    1000000.0000,
    CURRENT_TIMESTAMP + INTERVAL '3650' DAY,
    CURRENT_TIMESTAMP
FROM merchants m
WHERE m.merchant_code = 'M-UNIV-ERP'
  AND NOT EXISTS (
      SELECT 1 FROM api_keys
      WHERE key_hash = '79b734a56ee2d178d19e85ab2fb4870976f0ba4baeda616ef47fa21baada6096'
  );

-- Key 3: Raymund FinTech Master Live Key
-- Raw secret  : sk_live_2026_raymund_fintech_production_key_01
-- SHA-256 hash: 8786115c2a5befc51373cc1fd65fab6b56c60c46f2227634ab6d4a2d9567e2ae

INSERT INTO api_keys (
    key_prefix, merchant_id, key_hash,
    name, environment, cidr_whitelist, scopes, linked_account_id,
    application_id, application_name, per_transaction_limit, daily_limit,
    expires_at, created_at
)
SELECT
    'sk_live_',
    m.id,
    '8786115c2a5befc51373cc1fd65fab6b56c60c46f2227634ab6d4a2d9567e2ae',
    'Raymund FinTech Master Live Key',
    'LIVE',
    '0.0.0.0/0',
    'payments:write,payments:read,accounts:read,accounts:write,treasury:write,treasury:read',
    '4859220013371001',
    'app_university_erp',
    'University ERP Gateway Client',
    100000.0000,
    1000000.0000,
    CURRENT_TIMESTAMP + INTERVAL '3650' DAY,
    CURRENT_TIMESTAMP
FROM merchants m
WHERE m.merchant_code = 'M-UNIV-ERP'
  AND NOT EXISTS (
      SELECT 1 FROM api_keys
      WHERE key_hash = '8786115c2a5befc51373cc1fd65fab6b56c60c46f2227634ab6d4a2d9567e2ae'
  );
