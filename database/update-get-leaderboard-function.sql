-- Update get_leaderboard function to include pfp_url
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 100)
RETURNS TABLE (
  fid INTEGER,
  username TEXT,
  pfp_url TEXT,
  score INTEGER,
  streak INTEGER,
  last_vote DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ls.fid,
    ls.username,
    ls.pfp_url,
    ls.total_votes as score,
    ls.streak_days as streak,
    ls.last_vote_date as last_vote
  FROM leaderboard_scores ls
  ORDER BY ls.total_votes DESC, ls.streak_days DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
