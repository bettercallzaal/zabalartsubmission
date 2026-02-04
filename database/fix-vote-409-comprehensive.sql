-- Comprehensive fix for 409 Conflict on upsert_weekly_vote
-- This script will:
-- 1. Clean up any duplicate votes
-- 2. Drop all existing indexes
-- 3. Recreate the function with proper logic
-- 4. Add back the index

-- Step 1: Clean up duplicate votes (keep only the most recent vote per user per week)
DO $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    WITH ranked_votes AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY 
                    fid, 
                    DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day'
                ORDER BY voted_at DESC
            ) as rn
        FROM votes
    )
    DELETE FROM votes
    WHERE id IN (
        SELECT id FROM ranked_votes WHERE rn > 1
    );
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % duplicate votes', v_deleted_count;
END $$;

-- Step 2: Drop all existing weekly vote indexes
DROP INDEX IF EXISTS idx_votes_fid_week;
DROP INDEX IF EXISTS idx_votes_fid_week_unique;

-- Step 3: Drop existing function (required to change return type)
DROP FUNCTION IF EXISTS upsert_weekly_vote(INTEGER, TEXT);

-- Step 4: Rewrite upsert_weekly_vote function with proper UPDATE logic
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
      AND DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day' = v_current_week
    ORDER BY voted_at DESC
    LIMIT 1;
    
    -- If vote exists, update it. Otherwise insert new vote.
    IF v_existing_vote_id IS NOT NULL THEN
        -- Update existing vote
        UPDATE votes
        SET mode = p_mode,
            vote_power = v_vote_power,
            username = COALESCE(v_username, username),
            voted_at = NOW()
        WHERE id = v_existing_vote_id;
        
        RAISE NOTICE 'Updated vote % from % to %', v_existing_vote_id, v_previous_mode, p_mode;
    ELSE
        -- Insert new vote
        INSERT INTO votes (fid, username, mode, vote_power, voted_at)
        VALUES (p_fid, COALESCE(v_username, 'user_' || p_fid), p_mode, v_vote_power, NOW());
        
        RAISE NOTICE 'Inserted new vote for fid % with mode %', p_fid, p_mode;
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
        RAISE WARNING 'Error in upsert_weekly_vote: %', SQLERRM;
        RETURN QUERY
        SELECT 
            NULL::TEXT as previous_mode,
            NULL::TEXT as new_mode,
            false as changed,
            false as success,
            SQLERRM as error;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Recreate the unique index
CREATE UNIQUE INDEX idx_votes_fid_week ON votes (
    fid, 
    (DATE_TRUNC('week', voted_at AT TIME ZONE 'America/New_York')::DATE + INTERVAL '1 day')
);

-- Step 6: Grant permissions
GRANT EXECUTE ON FUNCTION upsert_weekly_vote(INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION upsert_weekly_vote(INTEGER, TEXT) TO authenticated;

-- Success message
SELECT 'Comprehensive weekly vote fix applied successfully' as status;
