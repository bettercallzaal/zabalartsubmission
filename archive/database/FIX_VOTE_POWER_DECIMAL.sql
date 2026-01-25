-- Fix vote_power column to support decimal values
-- Run this in your Supabase SQL Editor

-- 1. Change votes table vote_power to DECIMAL
ALTER TABLE votes 
ALTER COLUMN vote_power TYPE DECIMAL(3,1);

-- Update the check constraint to allow decimals up to 6.0
ALTER TABLE votes 
DROP CONSTRAINT IF EXISTS votes_vote_power_check;

ALTER TABLE votes 
ADD CONSTRAINT votes_vote_power_check CHECK (vote_power >= 0.5 AND vote_power <= 6.0);

-- 2. Change vote_power_cache table to DECIMAL
ALTER TABLE vote_power_cache 
ALTER COLUMN vote_power TYPE DECIMAL(3,1);

ALTER TABLE vote_power_cache 
DROP CONSTRAINT IF EXISTS vote_power_cache_vote_power_check;

ALTER TABLE vote_power_cache 
ADD CONSTRAINT vote_power_cache_vote_power_check CHECK (vote_power >= 0.5 AND vote_power <= 6.0);

-- 3. Update mode_votes_daily if it has vote_power column
-- (Check if this column exists first)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'mode_votes_daily' 
        AND column_name = 'vote_power'
    ) THEN
        ALTER TABLE mode_votes_daily 
        ALTER COLUMN vote_power TYPE DECIMAL(3,1);
    END IF;
END $$;

-- Verify changes
SELECT 
    table_name, 
    column_name, 
    data_type, 
    numeric_precision, 
    numeric_scale
FROM information_schema.columns
WHERE table_name IN ('votes', 'vote_power_cache', 'mode_votes_daily')
AND column_name = 'vote_power';
