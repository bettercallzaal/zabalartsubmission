-- Cleanup script: Remove duplicate votes before weekly migration
-- Run this BEFORE weekly-voting-migration.sql

-- Step 1: Identify duplicates
SELECT 
    fid,
    DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day' as week_start,
    COUNT(*) as vote_count,
    array_agg(id ORDER BY voted_at DESC) as vote_ids,
    array_agg(mode ORDER BY voted_at DESC) as modes,
    array_agg(voted_at ORDER BY voted_at DESC) as timestamps
FROM votes
GROUP BY fid, DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day'
HAVING COUNT(*) > 1
ORDER BY vote_count DESC, fid;

-- Step 2: Keep only the most recent vote per user per week
-- Delete older votes, keeping the latest one
WITH ranked_votes AS (
    SELECT 
        id,
        fid,
        voted_at,
        ROW_NUMBER() OVER (
            PARTITION BY fid, DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day'
            ORDER BY voted_at DESC
        ) as rn
    FROM votes
)
DELETE FROM votes
WHERE id IN (
    SELECT id 
    FROM ranked_votes 
    WHERE rn > 1
);

-- Step 3: Verify no duplicates remain
SELECT 
    fid,
    DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day' as week_start,
    COUNT(*) as vote_count
FROM votes
GROUP BY fid, DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day'
HAVING COUNT(*) > 1;

-- Should return 0 rows if cleanup successful
