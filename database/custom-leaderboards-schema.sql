-- Empire Builder-Style Custom Leaderboards Schema
-- Allows creation of multiple custom leaderboards with different metrics
-- Run this after leaderboard-schema.sql

-- Custom leaderboards table - stores leaderboard configurations
CREATE TABLE IF NOT EXISTS custom_leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  empire_address TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('votes', 'holdings', 'activity', 'custom')),
  icon_url TEXT,
  api_endpoint TEXT,
  scoring_rules JSONB DEFAULT '{}',
  reset_frequency TEXT DEFAULT 'never' CHECK (reset_frequency IN ('never', 'daily', 'weekly', 'monthly')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom leaderboard entries - stores scores for each leaderboard
CREATE TABLE IF NOT EXISTS custom_leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leaderboard_id UUID NOT NULL REFERENCES custom_leaderboards(id) ON DELETE CASCADE,
  fid INTEGER NOT NULL,
  username TEXT,
  address TEXT,
  score NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(leaderboard_id, fid)
);

-- Indexes for performance
CREATE INDEX idx_custom_leaderboards_empire ON custom_leaderboards(empire_address);
CREATE INDEX idx_custom_leaderboards_active ON custom_leaderboards(is_active);
CREATE INDEX idx_custom_entries_leaderboard ON custom_leaderboard_entries(leaderboard_id);
CREATE INDEX idx_custom_entries_score ON custom_leaderboard_entries(leaderboard_id, score DESC);
CREATE INDEX idx_custom_entries_fid ON custom_leaderboard_entries(fid);

-- Function to update leaderboard entry score
CREATE OR REPLACE FUNCTION upsert_leaderboard_entry(
  p_leaderboard_id UUID,
  p_fid INTEGER,
  p_username TEXT,
  p_address TEXT,
  p_score NUMERIC,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE (
  id UUID,
  score NUMERIC,
  rank BIGINT
) AS $$
DECLARE
  v_entry_id UUID;
  v_score NUMERIC;
  v_rank BIGINT;
BEGIN
  -- Upsert entry
  INSERT INTO custom_leaderboard_entries (
    leaderboard_id,
    fid,
    username,
    address,
    score,
    metadata,
    last_updated
  )
  VALUES (
    p_leaderboard_id,
    p_fid,
    p_username,
    p_address,
    p_score,
    p_metadata,
    NOW()
  )
  ON CONFLICT (leaderboard_id, fid)
  DO UPDATE SET
    score = EXCLUDED.score,
    username = COALESCE(EXCLUDED.username, custom_leaderboard_entries.username),
    address = COALESCE(EXCLUDED.address, custom_leaderboard_entries.address),
    metadata = EXCLUDED.metadata,
    last_updated = NOW()
  RETURNING custom_leaderboard_entries.id, custom_leaderboard_entries.score
  INTO v_entry_id, v_score;
  
  -- Calculate rank
  SELECT COUNT(*) + 1
  INTO v_rank
  FROM custom_leaderboard_entries
  WHERE leaderboard_id = p_leaderboard_id
    AND score > v_score;
  
  RETURN QUERY SELECT v_entry_id, v_score, v_rank;
END;
$$ LANGUAGE plpgsql;

-- Function to get leaderboard with rankings
CREATE OR REPLACE FUNCTION get_custom_leaderboard(
  p_leaderboard_id UUID,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  rank BIGINT,
  fid INTEGER,
  username TEXT,
  address TEXT,
  score NUMERIC,
  metadata JSONB,
  last_updated TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY e.score DESC) as rank,
    e.fid,
    e.username,
    e.address,
    e.score,
    e.metadata,
    e.last_updated
  FROM custom_leaderboard_entries e
  WHERE e.leaderboard_id = p_leaderboard_id
  ORDER BY e.score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's rank in a leaderboard
CREATE OR REPLACE FUNCTION get_user_leaderboard_rank(
  p_leaderboard_id UUID,
  p_fid INTEGER
)
RETURNS TABLE (
  rank BIGINT,
  score NUMERIC,
  total_entries BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH ranked_entries AS (
    SELECT 
      e.fid,
      e.score,
      ROW_NUMBER() OVER (ORDER BY e.score DESC) as user_rank
    FROM custom_leaderboard_entries e
    WHERE e.leaderboard_id = p_leaderboard_id
  )
  SELECT 
    re.user_rank as rank,
    re.score,
    (SELECT COUNT(*) FROM custom_leaderboard_entries WHERE leaderboard_id = p_leaderboard_id) as total_entries
  FROM ranked_entries re
  WHERE re.fid = p_fid;
END;
$$ LANGUAGE plpgsql;

-- Function to sync votes to custom leaderboard
CREATE OR REPLACE FUNCTION sync_votes_to_leaderboard()
RETURNS TRIGGER AS $$
DECLARE
  v_leaderboard_id UUID;
BEGIN
  -- Find active vote-based leaderboards
  FOR v_leaderboard_id IN 
    SELECT id FROM custom_leaderboards 
    WHERE metric_type = 'votes' AND is_active = TRUE
  LOOP
    -- Update score based on total votes
    PERFORM upsert_leaderboard_entry(
      v_leaderboard_id,
      NEW.fid,
      NEW.username,
      NULL,
      (SELECT COUNT(*) FROM votes WHERE fid = NEW.fid),
      jsonb_build_object('last_vote_date', NEW.vote_date)
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-sync votes to vote-based leaderboards
CREATE TRIGGER trigger_sync_votes_to_leaderboard
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION sync_votes_to_leaderboard();

-- Enable Row Level Security
ALTER TABLE custom_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access on custom_leaderboards"
  ON custom_leaderboards FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert/update on custom_leaderboards"
  ON custom_leaderboards FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on custom_leaderboard_entries"
  ON custom_leaderboard_entries FOR SELECT
  USING (true);

CREATE POLICY "Allow system update on custom_leaderboard_entries"
  ON custom_leaderboard_entries FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default vote-based leaderboard
INSERT INTO custom_leaderboards (
  name,
  description,
  empire_address,
  metric_type,
  is_active
)
VALUES (
  'ZABAL Daily Voters',
  'Leaderboard tracking total votes cast by community members',
  '0x0000000000000000000000000000000000000000',
  'votes',
  true
)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Custom leaderboards schema created successfully!';
  RAISE NOTICE '📊 Tables: custom_leaderboards, custom_leaderboard_entries';
  RAISE NOTICE '🔧 Functions: upsert_leaderboard_entry(), get_custom_leaderboard(), get_user_leaderboard_rank()';
  RAISE NOTICE '🎯 Auto-sync enabled for vote-based leaderboards';
END $$;
