-- ============================================================================
-- WEEKLY VOTING RPC FIX
-- ============================================================================
-- This SQL creates/replaces the submit_weekly_social_vote RPC to match the
-- daily voting pattern with vote_power support.
--
-- USAGE:
-- 1. Run this in Supabase SQL Editor
-- 2. Test the RPC with: SELECT * FROM submit_weekly_social_vote(19640, 'Lens', 3);
-- 3. Verify it returns JSON with success, previous_platform, new_platform, changed
-- ============================================================================

-- First, drop any existing versions of the function to avoid conflicts
DROP FUNCTION IF EXISTS public.submit_weekly_social_vote(BIGINT, TEXT);
DROP FUNCTION IF EXISTS public.submit_weekly_social_vote(BIGINT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS public.submit_weekly_social_vote(BIGINT, TEXT, NUMERIC);

-- Create the corrected function with vote_power parameter
CREATE OR REPLACE FUNCTION public.submit_weekly_social_vote(
    user_fid BIGINT,
    platform_choice TEXT,
    p_vote_power NUMERIC
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_previous_platform TEXT;
    v_new_platform TEXT;
    v_changed BOOLEAN;
    v_week_key TEXT;
BEGIN
    -- Generate week key (e.g., "2026-W03")
    v_week_key := TO_CHAR(CURRENT_DATE, 'IYYY-"W"IW');
    
    -- Get previous vote for this week
    SELECT platform INTO v_previous_platform
    FROM weekly_social_votes
    WHERE fid = user_fid::INTEGER
      AND week_key = v_week_key
    LIMIT 1;
    
    v_new_platform := platform_choice;
    v_changed := (v_previous_platform IS NOT NULL AND v_previous_platform != platform_choice);
    
    -- Delete any existing vote for this week (overrideable model)
    DELETE FROM weekly_social_votes 
    WHERE fid = user_fid::INTEGER 
      AND week_key = v_week_key;
    
    -- Insert new vote with vote_power
    INSERT INTO weekly_social_votes (fid, week_key, platform, vote_power, voted_at)
    VALUES (
        user_fid::INTEGER,
        v_week_key,
        platform_choice,
        p_vote_power::INTEGER,
        NOW()
    );
    
    -- Return JSON response (matching daily voting pattern)
    RETURN json_build_object(
        'success', true,
        'previous_platform', v_previous_platform,
        'new_platform', v_new_platform,
        'changed', v_changed
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.submit_weekly_social_vote(BIGINT, TEXT, NUMERIC) TO anon, authenticated;

-- ============================================================================
-- VERIFY TABLE SCHEMA
-- ============================================================================
-- The weekly_social_votes table should have these columns:
--
-- CREATE TABLE IF NOT EXISTS public.weekly_social_votes (
--     id SERIAL PRIMARY KEY,
--     fid INTEGER NOT NULL,
--     week_key TEXT NOT NULL,
--     platform TEXT NOT NULL,
--     vote_power INTEGER NOT NULL DEFAULT 1,
--     voted_at TIMESTAMPTZ DEFAULT NOW(),
--     UNIQUE(fid, week_key)
-- );
--
-- If your table is missing the vote_power column, run:
-- ALTER TABLE public.weekly_social_votes ADD COLUMN IF NOT EXISTS vote_power INTEGER NOT NULL DEFAULT 1;
-- ============================================================================
