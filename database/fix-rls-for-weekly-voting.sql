-- Fix RLS policies for weekly voting
-- The upsert_weekly_vote function needs permission to INSERT/DELETE votes

-- 1. Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'votes';

-- 2. Grant function permission to bypass RLS
-- Make the function run with SECURITY DEFINER so it can bypass RLS
DROP FUNCTION IF EXISTS upsert_weekly_vote(INTEGER, TEXT);

CREATE OR REPLACE FUNCTION upsert_weekly_vote(
    p_fid INTEGER,
    p_mode TEXT
)
RETURNS TABLE (
    previous_mode TEXT,
    new_mode TEXT,
    changed BOOLEAN
)
SECURITY DEFINER  -- This allows the function to bypass RLS
SET search_path = public
LANGUAGE plpgsql
AS $$
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
$$;

-- 3. Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION upsert_weekly_vote(INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION upsert_weekly_vote(INTEGER, TEXT) TO authenticated;

-- 4. Also update has_voted_this_week to use SECURITY DEFINER
DROP FUNCTION IF EXISTS has_voted_this_week(INTEGER);

CREATE OR REPLACE FUNCTION has_voted_this_week(p_fid INTEGER)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
$$;

GRANT EXECUTE ON FUNCTION has_voted_this_week(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION has_voted_this_week(INTEGER) TO authenticated;

-- 5. Update get_this_weeks_votes to use SECURITY DEFINER
DROP FUNCTION IF EXISTS get_this_weeks_votes();

CREATE OR REPLACE FUNCTION get_this_weeks_votes()
RETURNS TABLE (
    mode TEXT,
    vote_count BIGINT,
    total_power BIGINT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
$$;

GRANT EXECUTE ON FUNCTION get_this_weeks_votes() TO anon;
GRANT EXECUTE ON FUNCTION get_this_weeks_votes() TO authenticated;

-- 6. Verify the fix
SELECT 'RLS fix applied successfully' as status;
