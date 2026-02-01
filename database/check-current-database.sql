-- ZABAL Database Inventory Check
-- Run this in your Supabase SQL Editor to see what currently exists
-- This is 100% safe - it only reads data, doesn't modify anything

-- ============================================
-- 1. LIST ALL TABLES
-- ============================================
SELECT 
  tablename as table_name,
  schemaname as schema
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- ============================================
-- 2. LIST ALL FUNCTIONS
-- ============================================
SELECT 
  routine_name as function_name,
  routine_type as type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ============================================
-- 3. LIST ALL TRIGGERS
-- ============================================
SELECT 
  trigger_name,
  event_object_table as table_name,
  action_timing as timing,
  event_manipulation as event
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 4. CHECK IF LEADERBOARD TABLES EXIST
-- ============================================
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'leaderboard_scores') 
    THEN '✅ leaderboard_scores EXISTS'
    ELSE '❌ leaderboard_scores DOES NOT EXIST'
  END as leaderboard_scores_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'leaderboard_config') 
    THEN '✅ leaderboard_config EXISTS'
    ELSE '❌ leaderboard_config DOES NOT EXIST'
  END as leaderboard_config_status;

-- ============================================
-- 5. COUNT VOTES IN DATABASE
-- ============================================
SELECT 
  COUNT(*) as total_votes,
  COUNT(DISTINCT fid) as unique_voters,
  COUNT(DISTINCT vote_date) as unique_days,
  MIN(vote_date) as first_vote_date,
  MAX(vote_date) as last_vote_date
FROM votes;

-- ============================================
-- 6. SAMPLE OF RECENT VOTES
-- ============================================
SELECT 
  fid,
  username,
  mode,
  vote_power,
  vote_date,
  voted_at
FROM votes
ORDER BY voted_at DESC
LIMIT 5;

-- ============================================
-- INSTRUCTIONS:
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and click "Run"
-- 4. Copy ALL the output and send it back
-- ============================================
