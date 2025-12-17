-- ZABAL Live Hub - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Votes table - stores all votes with wallet address and power
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('studio', 'market', 'social', 'battle')),
  vote_power INTEGER NOT NULL CHECK (vote_power IN (1, 2, 3)),
  voted_at TIMESTAMP DEFAULT NOW(),
  vote_date DATE DEFAULT CURRENT_DATE,
  CONSTRAINT unique_wallet_per_day UNIQUE(wallet_address, vote_date)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_votes_wallet ON votes(wallet_address);
CREATE INDEX IF NOT EXISTS idx_votes_date ON votes(vote_date);
CREATE INDEX IF NOT EXISTS idx_votes_mode_date ON votes(mode, vote_date);

-- Token holdings cache - stores token balance checks to reduce RPC calls
CREATE TABLE IF NOT EXISTS token_holdings (
  wallet_address TEXT PRIMARY KEY,
  has_zao BOOLEAN DEFAULT FALSE,
  has_loanz BOOLEAN DEFAULT FALSE,
  vote_power INTEGER DEFAULT 1 CHECK (vote_power IN (1, 2, 3)),
  last_checked TIMESTAMP DEFAULT NOW()
);

-- Daily mode totals - aggregated view for performance
CREATE TABLE IF NOT EXISTS mode_votes_daily (
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

-- Function to check if wallet has voted today
CREATE OR REPLACE FUNCTION has_voted_today(wallet TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM votes
    WHERE wallet_address = wallet
    AND vote_date = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mode_votes_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow read access to all, write only from authenticated users
CREATE POLICY "Allow public read access on votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on votes"
  ON votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access on token_holdings"
  ON token_holdings FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert/update on token_holdings"
  ON token_holdings FOR ALL
  USING (true);

CREATE POLICY "Allow public read access on mode_votes_daily"
  ON mode_votes_daily FOR SELECT
  USING (true);

-- Insert initial daily totals for today
INSERT INTO mode_votes_daily (mode, vote_date, total_votes, unique_voters)
VALUES 
  ('studio', CURRENT_DATE, 0, 0),
  ('market', CURRENT_DATE, 0, 0),
  ('social', CURRENT_DATE, 0, 0),
  ('battle', CURRENT_DATE, 0, 0)
ON CONFLICT (mode, vote_date) DO NOTHING;
