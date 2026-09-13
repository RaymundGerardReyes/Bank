-- V67__auto_heal_settlement_accounts_permissions.sql
-- Ensure all merchant settlement accounts have allow_incoming = TRUE and allow_outgoing = TRUE by default

UPDATE accounts
SET allow_incoming = TRUE,
    allow_outgoing = TRUE,
    status = 'ACTIVE'
WHERE account_number LIKE 'MERCHANT-SETTLEMENT-%'
  AND frozen = FALSE;

UPDATE accounts
SET allow_incoming = TRUE
WHERE allow_incoming IS NULL;

UPDATE accounts
SET allow_outgoing = TRUE
WHERE allow_outgoing IS NULL;

UPDATE accounts
SET frozen = FALSE
WHERE frozen IS NULL;

