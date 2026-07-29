ALTER TABLE customers 
ADD COLUMN employment_status VARCHAR(50),
ADD COLUMN job_title VARCHAR(100),
ADD COLUMN monthly_income VARCHAR(50),
ADD COLUMN source_of_funds VARCHAR(100),
ADD COLUMN kyc_status VARCHAR(50) DEFAULT 'ACTIVE';
