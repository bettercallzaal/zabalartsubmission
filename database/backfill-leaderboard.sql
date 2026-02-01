-- Backfill leaderboard_scores with historical votes
-- Run this AFTER deploying leaderboard-schema.sql

-- Populate leaderboard_scores from existing votes
INSERT INTO leaderboard_scores (fid, username, total_votes, last_vote_date, streak_days, created_at, updated_at)
SELECT 
  fid,
  MAX(username) as username,
  COUNT(DISTINCT vote_date) as total_votes,
  MAX(vote_date) as last_vote_date,
  -- Calculate current streak
  (
    SELECT COUNT(*)
    FROM generate_series(
      MAX(vote_date) - INTERVAL '365 days',
      MAX(vote_date),
      INTERVAL '1 day'
    ) AS day
    WHERE EXISTS (
      SELECT 1 FROM votes v2
      WHERE v2.fid = v1.fid
      AND v2.vote_date = day::date
    )
    AND day::date <= MAX(vote_date)
    AND day::date > (
      SELECT COALESCE(MAX(vote_date), MAX(vote_date) - INTERVAL '365 days')
      FROM votes v3
      WHERE v3.fid = v1.fid
      AND v3.vote_date < day::date
      AND NOT EXISTS (
        SELECT 1 FROM votes v4
        WHERE v4.fid = v1.fid
        AND v4.vote_date = (day::date - INTERVAL '1 day')::date
      )
    )
  ) as streak_days,
  MIN(voted_at) as created_at,
  NOW() as updated_at
FROM votes v1
GROUP BY fid
ON CONFLICT (fid) 
DO UPDATE SET
  username = EXCLUDED.username,
  total_votes = EXCLUDED.total_votes,
  last_vote_date = EXCLUDED.last_vote_date,
  streak_days = EXCLUDED.streak_days,
  updated_at = NOW();

-- Verify the backfill
SELECT 
  COUNT(*) as total_users,
  SUM(total_votes) as total_votes_tracked,
  MAX(total_votes) as highest_vote_count,
  AVG(total_votes) as avg_votes_per_user
FROM leaderboard_scores;

-- Show top 10 voters
SELECT 
  fid,
  username,
  total_votes,
  streak_days,
  last_vote_date
FROM leaderboard_scores
ORDER BY total_votes DESC, streak_days DESC
LIMIT 10;
