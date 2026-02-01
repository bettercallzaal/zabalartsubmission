-- Simple Database Check - Returns one combined result
-- Run this in Supabase SQL Editor

SELECT 
  'TABLES' as check_type,
  string_agg(tablename, ', ' ORDER BY tablename) as result
FROM pg_tables 
WHERE schemaname = 'public'

UNION ALL

SELECT 
  'LEADERBOARD_TABLES',
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('leaderboard_scores', 'leaderboard_config'))
    THEN 'ALREADY EXISTS - DO NOT DEPLOY SCHEMA'
    ELSE 'NOT FOUND - SAFE TO DEPLOY'
  END

UNION ALL

SELECT 
  'TOTAL_VOTES',
  COUNT(*)::text
FROM votes

UNION ALL

SELECT 
  'UNIQUE_VOTERS',
  COUNT(DISTINCT fid)::text
FROM votes

UNION ALL

SELECT 
  'DATE_RANGE',
  MIN(vote_date)::text || ' to ' || MAX(vote_date)::text
FROM votes;
