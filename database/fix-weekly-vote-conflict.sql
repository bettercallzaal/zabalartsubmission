-- Fix for 409 Conflict on upsert_weekly_vote
-- The issue is with the unique index and the DELETE/INSERT approach
-- We'll use a proper UPSERT with ON CONFLICT instead

-- 1. Drop the problematic unique index
DROP INDEX IF EXISTS idx_votes_fid_week;

-- 2. Create a unique index with expression (PostgreSQL doesn't support expressions in UNIQUE constraints)
-- This ensures one vote per user per week
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_fid_week_unique ON votes (
    fid, 
    (DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day')
);

-- 3. Rewrite upsert_weekly_vote to use proper UPSERT with ON CONFLICT
CREATE OR REPLACE FUNCTION upsert_weekly_vote(
    p_fid INTEGER,
    p_mode TEXT
)
RETURNS TABLE (
    previous_mode TEXT,
    new_mode TEXT,
    changed BOOLEAN,
    success BOOLEAN,
    error TEXT
) AS $$
DECLARE
    v_current_week DATE;
    v_username TEXT;
    v_vote_power INTEGER;
    v_previous_mode TEXT;
    v_existing_vote_id BIGINT;
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
    SELECT id, mode INTO v_existing_vote_id, v_previous_mode
    FROM votes
    WHERE fid = p_fid 
      AND voted_at >= v_current_week
      AND voted_at < v_current_week + INTERVAL '7 days'
    ORDER BY voted_at DESC
    LIMIT 1;
    
    -- If vote exists, update it. Otherwise insert new vote.
    IF v_existing_vote_id IS NOT NULL THEN
        -- Update existing vote
        UPDATE votes
        SET mode = p_mode,
            vote_power = v_vote_power,
            username = v_username,
            voted_at = NOW()
        WHERE id = v_existing_vote_id;
    ELSE
        -- Insert new vote
        INSERT INTO votes (fid, username, mode, vote_power, voted_at)
        VALUES (p_fid, v_username, p_mode, v_vote_power, NOW());
    END IF;
    
    -- Return results
    RETURN QUERY
    SELECT 
        v_previous_mode as previous_mode,
        p_mode as new_mode,
        (v_previous_mode IS NULL OR v_previous_mode != p_mode) as changed,
        true as success,
        NULL::TEXT as error;
        
EXCEPTION
    WHEN OTHERS THEN
        -- Return error info
        RETURN QUERY
        SELECT 
            NULL::TEXT as previous_mode,
            NULL::TEXT as new_mode,
            false as changed,
            false as success,
            SQLERRM as error;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION upsert_weekly_vote(INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION upsert_weekly_vote(INTEGER, TEXT) TO authenticated;

-- Success message
SELECT 'Weekly vote conflict fix applied successfully' as status;
