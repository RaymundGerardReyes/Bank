-- V66__add_scheduled_execution_at_to_transactions.sql
-- Adds scheduled_execution_at column to transactions table for deferred payment execution tracking

ALTER TABLE transactions 
    ADD COLUMN IF NOT EXISTS scheduled_execution_at TIMESTAMP WITHOUT TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_transactions_scheduled_exec ON transactions(scheduled_execution_at) 
    WHERE status = 'SCHEDULED';

