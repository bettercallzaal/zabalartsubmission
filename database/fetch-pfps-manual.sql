-- Manual profile picture population
-- Since we can't call external APIs from SQL, you'll need to:
-- 1. Get the list of FIDs that need pfps
-- 2. Fetch them from Neynar
-- 3. Update the database

-- Step 1: Get list of FIDs that need profile pictures
SELECT fid, username
FROM leaderboard_scores
WHERE pfp_url IS NULL
ORDER BY total_votes DESC;

-- Step 2: After fetching pfp URLs from Neynar, update them like this:
-- UPDATE leaderboard_scores SET pfp_url = 'https://...' WHERE fid = 19640;
-- UPDATE leaderboard_scores SET pfp_url = 'https://...' WHERE fid = 1065937;
-- etc.

-- Or use this template for batch updates:
-- UPDATE leaderboard_scores
-- SET pfp_url = CASE fid
--   WHEN 19640 THEN 'https://imagedelivery.net/...'
--   WHEN 1065937 THEN 'https://imagedelivery.net/...'
--   WHEN 409857 THEN 'https://imagedelivery.net/...'
--   -- add more FIDs here
--   ELSE pfp_url
-- END
-- WHERE fid IN (19640, 1065937, 409857);
