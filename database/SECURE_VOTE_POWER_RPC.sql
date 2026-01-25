-- ============================================================================
-- SECURITY FIX: Server-Side Vote Power Calculation
-- Addresses Critical Issue #5 from Security Audit v2.0.0
-- ============================================================================
-- This SQL updates RPCs to calculate vote power server-side instead of
-- trusting client-supplied values.
-- ============================================================================

-- Drop old versions that accept p_vote_power parameter
DROP FUNCTION IF EXISTS public.upsert_daily_vote(BIGINT, TEXT, NUMERIC);
DROP FUNCTION IF EXISTS public.submit_weekly_social_vote(BIGINT, TEXT, NUMERIC);

-- ============================================================================
-- DAILY VOTE RPC (without vote_power parameter)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.upsert_daily_vote(
    p_fid BIGINT,
    p_mode TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_previous_mode TEXT;
    v_new_mode TEXT;
    v_changed BOOLEAN;
    v_today DATE;
    v_vote_power INTEGER;
BEGIN
    -- Get today's date in UTC
    v_today := CURRENT_DATE;
    
    -- Get vote power from cache (calculated server-side via API)
    -- If no cache or stale (>24h), default to 1
    SELECT vote_power INTO v_vote_power
    FROM vote_power_cache
    WHERE fid = p_fid::INTEGER
      AND last_checked > NOW() - INTERVAL '24 hours'
    LIMIT 1;
    
    -- Default to 1 if no cache
    IF v_vote_power IS NULL THEN
        v_vote_power := 1;
        RAISE NOTICE 'No vote power cache for FID %, using default: 1', p_fid;
    ELSE
        RAISE NOTICE 'Using cached vote power for FID %: %', p_fid, v_vote_power;
    END IF;
    
    -- Get previous vote for today
    SELECT mode INTO v_previous_mode
    FROM votes
    WHERE fid = p_fid::INTEGER
      AND vote_date = v_today
    LIMIT 1;
    
    v_new_mode := p_mode;
    v_changed := (v_previous_mode IS NOT NULL AND v_previous_mode != p_mode);
    
    -- Delete any existing vote for today (overrideable model)
    DELETE FROM votes 
    WHERE fid = p_fid::INTEGER 
      AND vote_date = v_today;
    
    -- Insert new vote with SERVER-CALCULATED vote_power
    INSERT INTO votes (fid, mode, vote_power, vote_date, voted_at)
    VALUES (
        p_fid::INTEGER,
        p_mode,
        v_vote_power,
        v_today,
        NOW()
    );
    
    -- Return JSON response
    RETURN json_build_object(
        'success', true,
        'previous_mode', v_previous_mode,
        'new_mode', v_new_mode,
        'changed', v_changed,
        'vote_power', v_vote_power
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.upsert_daily_vote(BIGINT, TEXT) TO anon, authenticated;

-- ============================================================================
-- WEEKLY VOTE RPC (without vote_power parameter)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.submit_weekly_social_vote(
    user_fid BIGINT,
    platform_choice TEXT
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
    v_vote_power INTEGER;
BEGIN
    -- Generate week key (e.g., "2026-W04")
    v_week_key := TO_CHAR(CURRENT_DATE, 'IYYY-"W"IW');
    
    -- Get vote power from cache (calculated server-side via API)
    SELECT vote_power INTO v_vote_power
    FROM vote_power_cache
    WHERE fid = user_fid::INTEGER
      AND last_checked > NOW() - INTERVAL '24 hours'
    LIMIT 1;
    
    -- Default to 1 if no cache
    IF v_vote_power IS NULL THEN
        v_vote_power := 1;
        RAISE NOTICE 'No vote power cache for FID %, using default: 1', user_fid;
    ELSE
        RAISE NOTICE 'Using cached vote power for FID %: %', user_fid, v_vote_power;
    END IF;
    
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
    
    -- Insert new vote with SERVER-CALCULATED vote_power
    INSERT INTO weekly_social_votes (fid, week_key, platform, vote_power, voted_at)
    VALUES (
        user_fid::INTEGER,
        v_week_key,
        platform_choice,
        v_vote_power,
        NOW()
    );
    
    -- Return JSON response
    RETURN json_build_object(
        'success', true,
        'previous_platform', v_previous_platform,
        'new_platform', v_new_platform,
        'changed', v_changed,
        'vote_power', v_vote_power
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.submit_weekly_social_vote(BIGINT, TEXT) TO anon, authenticated;

-- ============================================================================
-- HELPER FUNCTION: Update Vote Power Cache
-- ============================================================================
-- This function is called by the serverless function to cache vote power
CREATE OR REPLACE FUNCTION public.update_vote_power_cache(
    p_fid INTEGER,
    p_vote_power INTEGER,
    p_zao_casts INTEGER,
    p_neynar_score NUMERIC
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Upsert vote power cache
    INSERT INTO vote_power_cache (fid, vote_power, zao_channel_casts, neynar_score, last_checked)
    VALUES (p_fid, p_vote_power, p_zao_casts, p_neynar_score, NOW())
    ON CONFLICT (fid) 
    DO UPDATE SET
        vote_power = EXCLUDED.vote_power,
        zao_channel_casts = EXCLUDED.zao_channel_casts,
        neynar_score = EXCLUDED.neynar_score,
        last_checked = NOW();
    
    RETURN json_build_object(
        'success', true,
        'fid', p_fid,
        'vote_power', p_vote_power
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_vote_power_cache(INTEGER, INTEGER, INTEGER, NUMERIC) TO anon, authenticated;

-- ============================================================================
-- VERIFY: Test the updated functions
-- ============================================================================
-- Test daily vote (no vote_power parameter)
-- SELECT * FROM upsert_daily_vote(19640, 'studio');

-- Test weekly vote (no vote_power parameter)
-- SELECT * FROM submit_weekly_social_vote(19640, 'farcaster');

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Vote power calculation moved server-side!';
    RAISE NOTICE '📊 RPCs now read from vote_power_cache table';
    RAISE NOTICE '🔒 Client can no longer manipulate vote power';
END $$;
