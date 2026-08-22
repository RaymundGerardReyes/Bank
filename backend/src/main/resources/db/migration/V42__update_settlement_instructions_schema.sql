ALTER TABLE settlement_instructions ADD COLUMN settlement_batch_id BIGINT UNIQUE;
ALTER TABLE settlement_instructions ALTER COLUMN settlement_window_id DROP NOT NULL;
