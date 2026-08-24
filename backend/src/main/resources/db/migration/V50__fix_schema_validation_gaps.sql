-- V50: Fix ALL schema-validation mismatches between JPA entities and the live database.
-- These tables are missing the 'version' column required by @Version (optimistic locking)
-- on their corresponding Java entity classes.

-- 1. payment_sessions — PaymentSession.java
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 2. payment_intents — PaymentIntent.java
ALTER TABLE payment_intents ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 3. payment_attempts — PaymentAttempt.java
ALTER TABLE payment_attempts ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 4. transactions — Transaction.java
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 5. settlement_batches — SettlementBatch.java
ALTER TABLE settlement_batches ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;
