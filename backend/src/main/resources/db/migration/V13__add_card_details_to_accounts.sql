-- V13__add_card_details_to_accounts.sql
-- Add strict ISO standard card and settlement details to the accounts ledger

ALTER TABLE accounts 
ADD COLUMN swift_code VARCHAR(20) DEFAULT 'NOVBUS33XXX',
ADD COLUMN card_expiry VARCHAR(5),
ADD COLUMN card_cvv VARCHAR(4);