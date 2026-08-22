-- V13__add_card_details_to_accounts.sql
-- Add strict ISO standard card and settlement details to the accounts ledger

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS swift_code VARCHAR(20) DEFAULT 'NOVBUS33XXX';
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS card_expiry VARCHAR(5);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS card_cvv VARCHAR(4);