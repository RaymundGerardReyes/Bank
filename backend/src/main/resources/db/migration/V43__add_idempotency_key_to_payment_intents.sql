-- V43__add_idempotency_key_to_payment_intents.sql
-- Add missing idempotency_key column to payment_intents table to reconcile JPA entity mapping with DB schema

ALTER TABLE payment_intents ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS uk_payment_intents_idempotency_key ON payment_intents (idempotency_key);
