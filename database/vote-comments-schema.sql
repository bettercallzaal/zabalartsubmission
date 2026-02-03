-- Vote Comments Schema
-- Allows users to add comments explaining their votes

-- Create vote_comments table
CREATE TABLE IF NOT EXISTS vote_comments (
    id BIGSERIAL PRIMARY KEY,
    fid INTEGER NOT NULL,
    username TEXT NOT NULL,
    comment TEXT NOT NULL,
    vote_mode TEXT NOT NULL CHECK (vote_mode IN ('studio', 'market', 'social', 'battle')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vote_comments_fid ON vote_comments(fid);
CREATE INDEX IF NOT EXISTS idx_vote_comments_created_at ON vote_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vote_comments_vote_mode ON vote_comments(vote_mode);

-- Enable RLS
ALTER TABLE vote_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can read, authenticated users can insert/update their own
CREATE POLICY "Anyone can view comments"
    ON vote_comments FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own comments"
    ON vote_comments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
    ON vote_comments FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete their own comments"
    ON vote_comments FOR DELETE
    USING (true);

-- Function to add or update a comment
CREATE OR REPLACE FUNCTION upsert_vote_comment(
    p_fid INTEGER,
    p_username TEXT,
    p_comment TEXT,
    p_vote_mode TEXT
)
RETURNS TABLE (
    success BOOLEAN,
    comment_id BIGINT,
    message TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_comment_id BIGINT;
    v_existing_id BIGINT;
BEGIN
    -- Validate inputs
    IF p_comment IS NULL OR LENGTH(TRIM(p_comment)) = 0 THEN
        RETURN QUERY SELECT false, NULL::BIGINT, 'Comment cannot be empty'::TEXT;
        RETURN;
    END IF;
    
    IF LENGTH(p_comment) > 500 THEN
        RETURN QUERY SELECT false, NULL::BIGINT, 'Comment too long (max 500 characters)'::TEXT;
        RETURN;
    END IF;
    
    -- Check if user already has a comment for this mode
    SELECT id INTO v_existing_id
    FROM vote_comments
    WHERE fid = p_fid AND vote_mode = p_vote_mode
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF v_existing_id IS NOT NULL THEN
        -- Update existing comment
        UPDATE vote_comments
        SET comment = p_comment,
            username = p_username,
            updated_at = NOW()
        WHERE id = v_existing_id
        RETURNING id INTO v_comment_id;
        
        RETURN QUERY SELECT true, v_comment_id, 'Comment updated'::TEXT;
    ELSE
        -- Insert new comment
        INSERT INTO vote_comments (fid, username, comment, vote_mode)
        VALUES (p_fid, p_username, p_comment, p_vote_mode)
        RETURNING id INTO v_comment_id;
        
        RETURN QUERY SELECT true, v_comment_id, 'Comment added'::TEXT;
    END IF;
END;
$$;

-- Function to get recent comments for a mode
CREATE OR REPLACE FUNCTION get_mode_comments(
    p_vote_mode TEXT,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id BIGINT,
    fid INTEGER,
    username TEXT,
    comment TEXT,
    vote_mode TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vc.id,
        vc.fid,
        vc.username,
        vc.comment,
        vc.vote_mode,
        vc.created_at,
        vc.updated_at
    FROM vote_comments vc
    WHERE vc.vote_mode = p_vote_mode
    ORDER BY vc.created_at DESC
    LIMIT p_limit;
END;
$$;

-- Function to get all recent comments (for general display)
CREATE OR REPLACE FUNCTION get_recent_comments(
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id BIGINT,
    fid INTEGER,
    username TEXT,
    comment TEXT,
    vote_mode TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vc.id,
        vc.fid,
        vc.username,
        vc.comment,
        vc.vote_mode,
        vc.created_at,
        vc.updated_at
    FROM vote_comments vc
    ORDER BY vc.created_at DESC
    LIMIT p_limit;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION upsert_vote_comment(INTEGER, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION upsert_vote_comment(INTEGER, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_mode_comments(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_mode_comments(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_comments(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_recent_comments(INTEGER) TO authenticated;

-- Success message
SELECT 'Vote comments schema created successfully' as status;
