-- ============================================================================
-- FIX: Update vote_power_cache table schema
-- Issue: Missing neynar_score column and vote_power constraint too restrictive
-- ============================================================================

-- Add neynar_score column if it doesn't exist
ALTER TABLE vote_power_cache 
ADD COLUMN IF NOT EXISTS neynar_score NUMERIC DEFAULT 0.5;

-- Drop the old constraint that limits vote_power to 1-4
ALTER TABLE vote_power_cache 
DROP CONSTRAINT IF EXISTS vote_power_cache_vote_power_check;

-- Add new constraint that allows vote_power 1-6 (matching the new system)
ALTER TABLE vote_power_cache 
ADD CONSTRAINT vote_power_cache_vote_power_check 
CHECK (vote_power BETWEEN 1 AND 6);

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'vote_power_cache'
ORDER BY ordinal_position;
