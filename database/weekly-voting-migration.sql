-- Migration: Change from daily to weekly voting (Monday 5pm streams)
-- Run this in Supabase SQL Editor

-- 1. Create function to get current voting week (Monday-Sunday)
CREATE OR REPLACE FUNCTION get_current_voting_week()
RETURNS DATE AS $$
BEGIN
  -- Return the Monday of the current week
  RETURN DATE_TRUNC('week', CURRENT_DATE AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Update the upsert_daily_vote function to work weekly
-- Rename to upsert_weekly_vote
CREATE OR REPLACE FUNCTION upsert_weekly_vote(
    p_fid INTEGER,
    p_mode TEXT
)
RETURNS TABLE (
    previous_mode TEXT,
    new_mode TEXT,
    changed BOOLEAN
) AS $$
DECLARE
    v_current_week DATE;
    v_username TEXT;
    v_vote_power INTEGER;
    v_previous_mode TEXT;
BEGIN
    -- Get current voting week (Monday of this week)
    v_current_week := get_current_voting_week();
    
    -- Get cached username and vote power
    SELECT username, vote_power 
    INTO v_username, v_vote_power
    FROM vote_power_cache 
    WHERE fid = p_fid;
    
    -- Default vote power if not cached
    IF v_vote_power IS NULL THEN
        v_vote_power := 1;
    END IF;
    
    -- Check if user already voted this week
    SELECT mode INTO v_previous_mode
    FROM votes
    WHERE fid = p_fid 
      AND voted_at >= v_current_week
      AND voted_at < v_current_week + INTERVAL '7 days'
    ORDER BY voted_at DESC
    LIMIT 1;
    
    -- Delete any existing vote for this week (if changing vote)
    DELETE FROM votes
    WHERE fid = p_fid
      AND voted_at >= v_current_week
      AND voted_at < v_current_week + INTERVAL '7 days';
    
    -- Insert new vote for this week
    INSERT INTO votes (fid, username, mode, vote_power, voted_at)
    VALUES (p_fid, v_username, p_mode, v_vote_power, NOW());
    
    -- Return results
    RETURN QUERY
    SELECT 
        v_previous_mode as previous_mode,
        p_mode as new_mode,
        (v_previous_mode IS NULL OR v_previous_mode != p_mode) as changed;
END;
$$ LANGUAGE plpgsql;

-- 3. Create function to check if user voted this week
CREATE OR REPLACE FUNCTION has_voted_this_week(p_fid INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_week DATE;
    v_vote_count INTEGER;
BEGIN
    v_current_week := get_current_voting_week();
    
    SELECT COUNT(*) INTO v_vote_count
    FROM votes
    WHERE fid = p_fid
      AND voted_at >= v_current_week
      AND voted_at < v_current_week + INTERVAL '7 days';
    
    RETURN v_vote_count > 0;
END;
$$ LANGUAGE plpgsql;

-- 4. Update get_todays_votes to get_this_weeks_votes
CREATE OR REPLACE FUNCTION get_this_weeks_votes()
RETURNS TABLE (
    mode TEXT,
    vote_count BIGINT,
    total_power BIGINT
) AS $$
DECLARE
    v_current_week DATE;
BEGIN
    v_current_week := get_current_voting_week();
    
    RETURN QUERY
    SELECT 
        v.mode,
        COUNT(*)::BIGINT as vote_count,
        COALESCE(SUM(v.vote_power), 0)::BIGINT as total_power
    FROM votes v
    WHERE v.voted_at >= v_current_week
      AND v.voted_at < v_current_week + INTERVAL '7 days'
    GROUP BY v.mode
    ORDER BY total_power DESC;
END;
$$ LANGUAGE plpgsql;

-- 5. Update leaderboard to use weekly voting
-- Modify update_leaderboard_score trigger function
CREATE OR REPLACE FUNCTION update_leaderboard_score()
RETURNS TRIGGER AS $$
DECLARE
    v_current_week DATE;
    v_total_votes INTEGER;
    v_streak_days INTEGER;
    v_last_vote_date DATE;
BEGIN
    v_current_week := get_current_voting_week();
    
    -- Count total votes (all time)
    SELECT COUNT(DISTINCT DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day')
    INTO v_total_votes
    FROM votes
    WHERE fid = NEW.fid;
    
    -- Calculate streak (consecutive weeks)
    WITH RECURSIVE week_series AS (
        SELECT 
            DATE_TRUNC('week', MAX(voted_at) AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day' as week_start,
            0 as weeks_back
        FROM votes
        WHERE fid = NEW.fid
        
        UNION ALL
        
        SELECT 
            week_start - INTERVAL '7 days',
            weeks_back + 1
        FROM week_series
        WHERE weeks_back < 52 -- Max 1 year lookback
          AND EXISTS (
              SELECT 1 FROM votes
              WHERE fid = NEW.fid
                AND voted_at >= week_start - INTERVAL '7 days'
                AND voted_at < week_start
          )
    )
    SELECT COALESCE(MAX(weeks_back) + 1, 1)
    INTO v_streak_days
    FROM week_series;
    
    -- Get last vote date
    SELECT MAX(voted_at::DATE)
    INTO v_last_vote_date
    FROM votes
    WHERE fid = NEW.fid;
    
    -- Upsert leaderboard score
    INSERT INTO leaderboard_scores (fid, username, total_votes, streak_days, last_vote_date)
    VALUES (NEW.fid, NEW.username, v_total_votes, v_streak_days, v_last_vote_date)
    ON CONFLICT (fid)
    DO UPDATE SET
        username = EXCLUDED.username,
        total_votes = EXCLUDED.total_votes,
        streak_days = EXCLUDED.streak_days,
        last_vote_date = EXCLUDED.last_vote_date,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Add unique constraint for weekly voting (one vote per week per user)
-- Drop old daily constraint if exists
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_fid_date_key;

-- Drop old weekly index if exists
DROP INDEX IF EXISTS idx_votes_fid_week;

-- Create unique index for weekly voting (one vote per week per user)
-- This prevents duplicate votes in the same week
CREATE UNIQUE INDEX idx_votes_fid_week ON votes (
    fid, 
    (DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day')
);

-- 7. Verification queries
-- Check current week
SELECT get_current_voting_week() as current_voting_week;

-- Check this week's votes
SELECT * FROM get_this_weeks_votes();

-- Test if a user voted this week (replace 19640 with actual FID)
SELECT has_voted_this_week(19640);
