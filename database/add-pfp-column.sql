-- Add profile picture URL column to leaderboard_scores
-- Run this in Supabase SQL Editor

ALTER TABLE leaderboard_scores 
ADD COLUMN IF NOT EXISTS pfp_url TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leaderboard_scores'
ORDER BY ordinal_position;
