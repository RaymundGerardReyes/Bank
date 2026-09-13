-- V68__make_payment_intent_customer_account_nullable.sql
-- Allow payment_intents to be created during checkout session creation before customer account selection.

ALTER TABLE payment_intents ALTER COLUMN customer_account_number DROP NOT NULL;

