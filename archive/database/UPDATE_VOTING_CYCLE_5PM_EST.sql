-- Update voting cycle to reset at 5 PM EST instead of midnight
-- Run this in your Supabase SQL Editor

-- 1. Create function to get current vote date (resets at 5 PM EST)
CREATE OR REPLACE FUNCTION get_current_vote_date()
RETURNS DATE AS $$
DECLARE
  est_now TIMESTAMP;
  vote_date DATE;
BEGIN
  -- Get current time in EST (UTC-5)
  est_now := (NOW() AT TIME ZONE 'UTC') AT TIME ZONE 'America/New_York';
  
  -- If before 5 PM EST, use previous day's date
  IF EXTRACT(HOUR FROM est_now) < 17 THEN
    vote_date := (est_now - INTERVAL '1 day')::DATE;
  ELSE
    vote_date := est_now::DATE;
  END IF;
  
  RETURN vote_date;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. Update get_todays_votes to use new vote date function
CREATE OR REPLACE FUNCTION get_todays_votes()
RETURNS TABLE (
  mode TEXT,
  total_votes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.mode,
    SUM(v.vote_power)::BIGINT as total_votes
  FROM votes v
  WHERE v.vote_date = get_current_vote_date()
  GROUP BY v.mode;
END;
$$ LANGUAGE plpgsql;

-- 3. Update has_voted_today to use new vote date function
CREATE OR REPLACE FUNCTION has_voted_today(user_fid INTEGER)
RETURNS TABLE (
  has_voted BOOLEAN,
  voted_mode TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    EXISTS (
      SELECT 1 FROM votes
      WHERE fid = user_fid
      AND vote_date = get_current_vote_date()
    ) as has_voted,
    (
      SELECT mode FROM votes
      WHERE fid = user_fid
      AND vote_date = get_current_vote_date()
      LIMIT 1
    ) as voted_mode;
END;
$$ LANGUAGE plpgsql;

-- 4. Create view for current voting period results
CREATE OR REPLACE VIEW current_vote_results AS
SELECT 
  v.mode,
  COUNT(DISTINCT v.fid) as unique_voters,
  SUM(v.vote_power) as total_power,
  ROUND(AVG(v.vote_power), 2) as avg_power,
  MAX(v.vote_power) as max_power,
  MIN(v.vote_power) as min_power,
  get_current_vote_date() as vote_date
FROM votes v
WHERE v.vote_date = get_current_vote_date()
GROUP BY v.mode;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Voting cycle updated to reset at 5 PM EST!';
  RAISE NOTICE '📅 New vote date function: get_current_vote_date()';
  RAISE NOTICE '📊 Updated functions: get_todays_votes(), has_voted_today()';
  RAISE NOTICE '🔍 New view: current_vote_results (with detailed stats)';
END $$;
