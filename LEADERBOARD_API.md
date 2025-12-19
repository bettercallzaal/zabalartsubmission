# ZABAL Leaderboard API Specification

## Base URL
```
https://cbtvnuklqwdkpyeioafb.supabase.co/rest/v1
```

## Authentication
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidHZudWtscXdka3B5ZWlvYWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDUwODcsImV4cCI6MjA4MTU4MTA4N30.0-6wezGo6keB4b7CURNitfyEYKQdI99nYOyolVyfqis
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidHZudWtscXdka3B5ZWlvYWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDUwODcsImV4cCI6MjA4MTU4MTA4N30.0-6wezGo6keB4b7CURNitfyEYKQdI99nYOyolVyfqis
```

## Endpoints

### 1. Top Voters by Total Votes
**URL for Empire Builder:**
```
https://cbtvnuklqwdkpyeioafb.supabase.co/rest/v1/rpc/get_leaderboard_total_votes?limit=10
```

**Full cURL:**
```bash
curl -X POST 'https://cbtvnuklqwdkpyeioafb.supabase.co/rest/v1/rpc/get_leaderboard_total_votes' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidHZudWtscXdka3B5ZWlvYWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDUwODcsImV4cCI6MjA4MTU4MTA4N30.0-6wezGo6keB4b7CURNitfyEYKQdI99nYOyolVyfqis' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidHZudWtscXdka3B5ZWlvYWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDUwODcsImV4cCI6MjA4MTU4MTA4N30.0-6wezGo6keB4b7CURNitfyEYKQdI99nYOyolVyfqis' \
  -H 'Content-Type: application/json' \
  -d '{"limit": 10}'
```

**Response Format:**
```json
[
  {
    "fid": 19640,
    "total_votes": 42,
    "rank": 1
  },
  {
    "fid": 123456,
    "total_votes": 28,
    "rank": 2
  }
]
```

### 2. Get All Votes (for custom processing)
**URL:**
```
https://cbtvnuklqwdkpyeioafb.supabase.co/rest/v1/votes?select=*&order=created_at.desc&limit=100
```

**Response includes:**
- `fid` - Farcaster ID
- `mode` - Vote choice (studio/market/social/battle)
- `vote_power` - Vote weight
- `vote_date` - Date of vote
- `created_at` - Timestamp

### 3. Today's Vote Totals
**URL:**
```
https://cbtvnuklqwdkpyeioafb.supabase.co/rest/v1/rpc/get_todays_votes
```

**Response:**
```json
[
  {
    "mode": "studio",
    "total_votes": 42,
    "total_power": 45
  },
  {
    "mode": "market",
    "total_votes": 28,
    "total_power": 30
  }
]
```

## Required SQL Functions

Add these to Supabase if not already present:

```sql
-- Leaderboard by total votes
CREATE OR REPLACE FUNCTION get_leaderboard_total_votes(limit_count INT DEFAULT 10)
RETURNS TABLE (
  fid BIGINT,
  total_votes BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.fid,
    COUNT(*)::BIGINT as total_votes,
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)::BIGINT as rank
  FROM votes v
  GROUP BY v.fid
  ORDER BY total_votes DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

## Empire Builder Configuration

**For GET request:**
1. Method: POST
2. URL: `https://cbtvnuklqwdkpyeioafb.supabase.co/rest/v1/rpc/get_leaderboard_total_votes`
3. Headers:
   - `apikey`: [anon key above]
   - `Authorization`: Bearer [anon key above]
   - `Content-Type`: application/json
4. Body: `{"limit": 10}`

**Data Mapping:**
- `fid` → User ID
- `total_votes` → Score
- `rank` → Position
