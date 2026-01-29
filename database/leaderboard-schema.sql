-- ZABAL Leaderboard Schema
-- Tracks voter participation with 1 point per vote per day
-- Run this in your Supabase SQL Editor after running supabase-schema-fid.sql

-- Leaderboard configuration table
CREATE TABLE IF NOT EXISTS leaderboard_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(20) NOT NULL,
  description VARCHAR(80) NOT NULL,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard scores table - aggregates total votes per user
CREATE TABLE IF NOT EXISTS leaderboard_scores (
  fid INTEGER PRIMARY KEY,
  username TEXT,
  total_votes INTEGER DEFAULT 0,
  last_vote_date DATE,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for leaderboard ranking
CREATE INDEX idx_leaderboard_scores_total ON leaderboard_scores(total_votes DESC);
CREATE INDEX idx_leaderboard_scores_streak ON leaderboard_scores(streak_days DESC);

-- Function to update leaderboard scores when a vote is cast
CREATE OR REPLACE FUNCTION update_leaderboard_score()
RETURNS TRIGGER AS $$
DECLARE
  current_streak INTEGER;
  last_vote DATE;
BEGIN
  -- Get current streak and last vote date
  SELECT streak_days, last_vote_date
  INTO current_streak, last_vote
  FROM leaderboard_scores
  WHERE fid = NEW.fid;
  
  -- Calculate new streak
  IF last_vote IS NULL THEN
    current_streak := 1;
  ELSIF last_vote = CURRENT_DATE - INTERVAL '1 day' THEN
    current_streak := COALESCE(current_streak, 0) + 1;
  ELSIF last_vote < CURRENT_DATE - INTERVAL '1 day' THEN
    current_streak := 1;
  ELSE
    current_streak := COALESCE(current_streak, 1);
  END IF;
  
  -- Update or insert leaderboard score (1 point per vote per day)
  INSERT INTO leaderboard_scores (fid, username, total_votes, last_vote_date, streak_days, updated_at)
  VALUES (
    NEW.fid,
    NEW.username,
    1,
    NEW.vote_date,
    current_streak,
    NOW()
  )
  ON CONFLICT (fid)
  DO UPDATE SET
    total_votes = leaderboard_scores.total_votes + 1,
    username = COALESCE(NEW.username, leaderboard_scores.username),
    last_vote_date = NEW.vote_date,
    streak_days = current_streak,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update leaderboard when vote is inserted
CREATE TRIGGER trigger_update_leaderboard
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_score();

-- Function to get top leaderboard entries
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 100)
RETURNS TABLE (
  fid INTEGER,
  username TEXT,
  score INTEGER,
  streak INTEGER,
  last_vote DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ls.fid,
    ls.username,
    ls.total_votes as score,
    ls.streak_days as streak,
    ls.last_vote_date as last_vote
  FROM leaderboard_scores ls
  ORDER BY ls.total_votes DESC, ls.streak_days DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get user rank
CREATE OR REPLACE FUNCTION get_user_rank(user_fid INTEGER)
RETURNS TABLE (
  rank BIGINT,
  score INTEGER,
  streak INTEGER,
  total_users BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH ranked_users AS (
    SELECT 
      fid,
      total_votes,
      streak_days,
      ROW_NUMBER() OVER (ORDER BY total_votes DESC, streak_days DESC) as user_rank
    FROM leaderboard_scores
  )
  SELECT 
    ru.user_rank as rank,
    ru.total_votes as score,
    ru.streak_days as streak,
    (SELECT COUNT(*) FROM leaderboard_scores) as total_users
  FROM ranked_users ru
  WHERE ru.fid = user_fid;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE leaderboard_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access on leaderboard_config"
  ON leaderboard_config FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert/update on leaderboard_config"
  ON leaderboard_config FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on leaderboard_scores"
  ON leaderboard_scores FOR SELECT
  USING (true);

CREATE POLICY "Allow system update on leaderboard_scores"
  ON leaderboard_scores FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default leaderboard configuration
INSERT INTO leaderboard_config (name, description, is_active)
VALUES ('ZABAL Voters', 'Top voters who participate daily in stream direction voting', true)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Leaderboard schema created successfully!';
  RAISE NOTICE '📊 Tables: leaderboard_config, leaderboard_scores';
  RAISE NOTICE '🔧 Functions: get_leaderboard(), get_user_rank()';
  RAISE NOTICE '🏆 Leaderboard tracking: 1 point per vote per day';
END $$;
