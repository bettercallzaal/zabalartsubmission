-- Database schema for notification system
-- Run this in Supabase SQL Editor

-- Notification tokens table
CREATE TABLE IF NOT EXISTS notification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fid INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  notification_url TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_tokens_fid ON notification_tokens(fid);
CREATE INDEX IF NOT EXISTS idx_notification_tokens_enabled ON notification_tokens(enabled);

-- Notification history table (for analytics)
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id TEXT NOT NULL,
  fid INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_notification_history_fid ON notification_history(fid);
CREATE INDEX IF NOT EXISTS idx_notification_history_sent_at ON notification_history(sent_at);
CREATE INDEX IF NOT EXISTS idx_notification_history_notification_id ON notification_history(notification_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your security requirements)
CREATE POLICY "Allow service role full access to notification_tokens" ON notification_tokens
  FOR ALL USING (true);

CREATE POLICY "Allow service role full access to notification_history" ON notification_history
  FOR ALL USING (true);
