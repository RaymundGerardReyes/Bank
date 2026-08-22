-- Add dispute tracking columns to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_disputed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS dispute_reason VARCHAR(500);
