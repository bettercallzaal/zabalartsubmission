-- ZABAL Live Hub - FID-Based Voting Schema
-- Run this in your Supabase SQL Editor
-- This updates the schema to use Farcaster IDs instead of wallet addresses

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop old tables if they exist (CAUTION: This deletes existing data)
-- Comment out these lines if you want to keep old data
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS token_holdings CASCADE;
DROP TABLE IF EXISTS vote_power_cache CASCADE;
DROP TABLE IF EXISTS mode_votes_daily CASCADE;

-- Votes table - stores all votes with FID and power
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fid INTEGER NOT NULL,
  username TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('studio', 'market', 'social', 'battle')),
  vote_power INTEGER NOT NULL CHECK (vote_power BETWEEN 1 AND 4),
  source TEXT DEFAULT 'web' CHECK (source IN ('miniapp', 'web')),
  voted_at TIMESTAMP DEFAULT NOW(),
  vote_date DATE DEFAULT CURRENT_DATE,
  CONSTRAINT unique_fid_per_day UNIQUE(fid, vote_date)
);

-- Indexes for faster queries
CREATE INDEX idx_votes_fid ON votes(fid);
CREATE INDEX idx_votes_date ON votes(vote_date);
CREATE INDEX idx_votes_mode_date ON votes(mode, vote_date);

-- Vote power cache - stores Farcaster activity checks to reduce API calls
CREATE TABLE vote_power_cache (
  fid INTEGER PRIMARY KEY,
  username TEXT,
  follows_zao BOOLEAN DEFAULT FALSE,
  zao_channel_casts INTEGER DEFAULT 0,
  has_zao_token BOOLEAN DEFAULT FALSE,
  has_loanz_token BOOLEAN DEFAULT FALSE,
  vote_power INTEGER DEFAULT 1 CHECK (vote_power BETWEEN 1 AND 4),
  last_checked TIMESTAMP DEFAULT NOW()
);

-- Index for cache cleanup
CREATE INDEX idx_cache_last_checked ON vote_power_cache(last_checked);

-- Daily mode totals - aggregated view for performance
CREATE TABLE mode_votes_daily (
  mode TEXT NOT NULL CHECK (mode IN ('studio', 'market', 'social', 'battle')),
  vote_date DATE DEFAULT CURRENT_DATE,
  total_votes INTEGER DEFAULT 0,
  unique_voters INTEGER DEFAULT 0,
  PRIMARY KEY (mode, vote_date)
);

-- Function to update daily totals (called by trigger)
CREATE OR REPLACE FUNCTION update_daily_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert daily totals
  INSERT INTO mode_votes_daily (mode, vote_date, total_votes, unique_voters)
  VALUES (
    NEW.mode,
    NEW.vote_date,
    NEW.vote_power,
    1
  )
  ON CONFLICT (mode, vote_date)
  DO UPDATE SET
    total_votes = mode_votes_daily.total_votes + NEW.vote_power,
    unique_voters = mode_votes_daily.unique_voters + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update daily totals when vote is inserted
CREATE TRIGGER trigger_update_daily_totals
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION update_daily_totals();

-- Function to get current vote totals for today
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
  WHERE v.vote_date = CURRENT_DATE
  GROUP BY v.mode;
END;
$$ LANGUAGE plpgsql;

-- Function to check if FID has voted today
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
      AND vote_date = CURRENT_DATE
    ) as has_voted,
    (
      SELECT mode FROM votes
      WHERE fid = user_fid
      AND vote_date = CURRENT_DATE
      LIMIT 1
    ) as voted_mode;
END;
$$ LANGUAGE plpgsql;

-- Function to get vote power for FID
CREATE OR REPLACE FUNCTION get_vote_power(user_fid INTEGER)
RETURNS INTEGER AS $$
DECLARE
  cached_power INTEGER;
  cache_age INTERVAL;
BEGIN
  -- Check cache
  SELECT 
    vote_power,
    NOW() - last_checked
  INTO cached_power, cache_age
  FROM vote_power_cache
  WHERE fid = user_fid;
  
  -- Return cached value if less than 24 hours old
  IF cached_power IS NOT NULL AND cache_age < INTERVAL '24 hours' THEN
    RETURN cached_power;
  END IF;
  
  -- Default to 1 if no cache (will be updated by app)
  RETURN 1;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_power_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE mode_votes_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read/write for now (tighten later)
CREATE POLICY "Allow public read access on votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on votes"
  ON votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete on votes"
  ON votes FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access on vote_power_cache"
  ON vote_power_cache FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert/update on vote_power_cache"
  ON vote_power_cache FOR ALL
  USING (true);

CREATE POLICY "Allow public read access on mode_votes_daily"
  ON mode_votes_daily FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert/update on mode_votes_daily"
  ON mode_votes_daily FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert initial daily totals for today
INSERT INTO mode_votes_daily (mode, vote_date, total_votes, unique_voters)
VALUES 
  ('studio', CURRENT_DATE, 0, 0),
  ('market', CURRENT_DATE, 0, 0),
  ('social', CURRENT_DATE, 0, 0),
  ('battle', CURRENT_DATE, 0, 0)
ON CONFLICT (mode, vote_date) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ ZABAL Live Hub database schema created successfully!';
  RAISE NOTICE '📊 Tables: votes, vote_power_cache, mode_votes_daily';
  RAISE NOTICE '🔧 Functions: get_todays_votes(), has_voted_today(), get_vote_power()';
  RAISE NOTICE '🎯 Ready for FID-based voting!';
END $$;
