-- Migration: Add user_id column and migrate from created_by
-- This migration adds proper user authentication support

-- Add user_id column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add user_id column to ingredients table
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS user_id TEXT;

-- For existing data without created_by, we can't assign a user
-- You'll need to either delete existing data or manually assign user IDs
-- Option 1: Delete existing data (uncomment if needed)
-- DELETE FROM products WHERE created_by IS NULL;
-- DELETE FROM ingredients WHERE created_by IS NULL;

-- Drop old created_by columns (after confirming data migration)
-- ALTER TABLE products DROP COLUMN IF EXISTS created_by;
-- ALTER TABLE ingredients DROP COLUMN IF EXISTS created_by;
