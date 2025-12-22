# ZABAL Database Tutorial - PostgreSQL & Supabase

## 📚 Table of Contents
1. [Database Overview](#database-overview)
2. [Table Structure](#table-structure)
3. [SQL Basics](#sql-basics)
4. [Common Queries](#common-queries)
5. [RPC Functions](#rpc-functions)
6. [Advanced Queries](#advanced-queries)
7. [Performance Tips](#performance-tips)

---

## 📊 Database Overview

Your ZABAL app uses **PostgreSQL** (via Supabase) with 3 main tables:

```
┌─────────────────┐
│     votes       │  ← Main voting data
├─────────────────┤
│ vote_power_cache│  ← Caches user power calculations
├─────────────────┤
│mode_votes_daily │  ← Aggregated daily totals
└─────────────────┘
```

---

## 🗂️ Table Structure

### 1. **`votes` Table** (Main Data)

Stores every individual vote cast by users.

```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY,              -- Unique vote ID
  fid INTEGER NOT NULL,             -- Farcaster user ID
  username TEXT,                    -- Farcaster username
  mode TEXT NOT NULL,               -- 'studio', 'market', 'social', 'battle'
  vote_power INTEGER NOT NULL,      -- 1-4 (based on user engagement)
  source TEXT DEFAULT 'web',        -- 'miniapp' or 'web'
  voted_at TIMESTAMP DEFAULT NOW(), -- When vote was cast
  vote_date DATE DEFAULT CURRENT_DATE, -- Date of vote
  CONSTRAINT unique_fid_mode_per_day UNIQUE(fid, vote_date, mode)
);
```

**Key Points:**
- Each user (FID) can vote once per mode per day
- `vote_power` multiplies their vote (1x to 4x)
- `vote_date` is used for daily aggregation

### 2. **`vote_power_cache` Table** (Performance)

Caches vote power calculations to reduce API calls.

```sql
CREATE TABLE vote_power_cache (
  fid INTEGER PRIMARY KEY,          -- Farcaster user ID
  username TEXT,                    -- Username
  follows_zao BOOLEAN,              -- Follows @zao?
  zao_channel_casts INTEGER,        -- Casts in /zao channel
  has_zao_token BOOLEAN,            -- Holds $ZAO token?
  has_loanz_token BOOLEAN,          -- Holds $LOANZ token?
  vote_power INTEGER DEFAULT 1,     -- Calculated power (1-4)
  last_checked TIMESTAMP            -- Cache timestamp
);
```

**Key Points:**
- Cache expires after 24 hours
- Reduces expensive API calls to check tokens/follows
- Vote power calculation: base 1 + bonuses

### 3. **`mode_votes_daily` Table** (Aggregation)

Pre-calculated daily totals for fast queries.

```sql
CREATE TABLE mode_votes_daily (
  mode TEXT NOT NULL,               -- Mode name
  vote_date DATE,                   -- Date
  total_votes INTEGER,              -- Sum of vote_power
  unique_voters INTEGER,            -- Count of unique FIDs
  PRIMARY KEY (mode, vote_date)
);
```

**Key Points:**
- Updated automatically by trigger
- Fast lookups for leaderboard
- Historical data preserved

---

## 📖 SQL Basics

### **SELECT** - Read Data

```sql
-- Get all votes from today
SELECT * FROM votes 
WHERE vote_date = CURRENT_DATE;

-- Get specific columns
SELECT fid, mode, vote_power 
FROM votes 
WHERE vote_date = CURRENT_DATE;

-- Count votes
SELECT COUNT(*) as total_votes 
FROM votes 
WHERE vote_date = CURRENT_DATE;
```

### **INSERT** - Add Data

```sql
-- Insert a new vote
INSERT INTO votes (fid, username, mode, vote_power, source)
VALUES (19640, 'zaal', 'studio', 1, 'miniapp');

-- Insert multiple votes
INSERT INTO votes (fid, mode, vote_power)
VALUES 
  (19640, 'studio', 1),
  (19640, 'market', 1),
  (19640, 'social', 1);
```

### **UPDATE** - Modify Data

```sql
-- Update vote power for a user
UPDATE votes 
SET vote_power = 2 
WHERE fid = 19640 AND vote_date = CURRENT_DATE;

-- Update cache
UPDATE vote_power_cache 
SET vote_power = 3, last_checked = NOW() 
WHERE fid = 19640;
```

### **DELETE** - Remove Data

```sql
-- Delete a specific vote
DELETE FROM votes 
WHERE fid = 19640 
  AND mode = 'studio' 
  AND vote_date = CURRENT_DATE;

-- Delete old cache entries (older than 7 days)
DELETE FROM vote_power_cache 
WHERE last_checked < NOW() - INTERVAL '7 days';
```

---

## 🔍 Common Queries

### **1. Get Today's Vote Totals**

```sql
-- Total votes per mode today
SELECT 
  mode,
  SUM(vote_power) as total_votes,
  COUNT(*) as vote_count
FROM votes
WHERE vote_date = CURRENT_DATE
GROUP BY mode
ORDER BY total_votes DESC;
```

**Result:**
```
mode    | total_votes | vote_count
--------|-------------|------------
social  | 42          | 38
studio  | 35          | 32
market  | 28          | 26
battle  | 21          | 20
```

### **2. Check if User Voted Today**

```sql
-- Check if FID 19640 voted today
SELECT 
  mode,
  vote_power,
  voted_at
FROM votes
WHERE fid = 19640 
  AND vote_date = CURRENT_DATE;
```

### **3. Get User's Vote History**

```sql
-- Last 10 votes by user
SELECT 
  vote_date,
  mode,
  vote_power,
  voted_at
FROM votes
WHERE fid = 19640
ORDER BY voted_at DESC
LIMIT 10;
```

### **4. Get Top Voters**

```sql
-- Users with most votes this week
SELECT 
  fid,
  username,
  COUNT(*) as total_votes,
  SUM(vote_power) as total_power
FROM votes
WHERE vote_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY fid, username
ORDER BY total_power DESC
LIMIT 10;
```

### **5. Daily Leaderboard**

```sql
-- Today's standings
SELECT 
  mode,
  total_votes,
  unique_voters,
  ROUND(total_votes::NUMERIC / NULLIF(unique_voters, 0), 2) as avg_power
FROM mode_votes_daily
WHERE vote_date = CURRENT_DATE
ORDER BY total_votes DESC;
```

---

## ⚡ RPC Functions

Your app uses **Remote Procedure Calls** (RPCs) - custom SQL functions callable from JavaScript.

### **1. `get_todays_votes()`**

Returns vote totals for today.

```sql
-- SQL Definition
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
```

**Usage in JavaScript:**
```javascript
const { data, error } = await supabase.rpc('get_todays_votes');
// Returns: [{ mode: 'studio', total_votes: 42 }, ...]
```

**Usage in SQL:**
```sql
SELECT * FROM get_todays_votes();
```

### **2. `has_voted_today(user_fid)`**

Checks if a user voted today.

```sql
-- SQL Definition
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
      WHERE fid = user_fid AND vote_date = CURRENT_DATE
    ) as has_voted,
    (
      SELECT mode FROM votes
      WHERE fid = user_fid AND vote_date = CURRENT_DATE
      LIMIT 1
    ) as voted_mode;
END;
$$ LANGUAGE plpgsql;
```

**Usage in JavaScript:**
```javascript
const { data, error } = await supabase
  .rpc('has_voted_today', { user_fid: 19640 });
// Returns: { has_voted: true, voted_mode: 'studio' }
```

### **3. `get_vote_power(user_fid)`**

Gets cached vote power for a user.

```sql
-- SQL Definition
CREATE OR REPLACE FUNCTION get_vote_power(user_fid INTEGER)
RETURNS INTEGER AS $$
DECLARE
  cached_power INTEGER;
  cache_age INTERVAL;
BEGIN
  SELECT vote_power, NOW() - last_checked
  INTO cached_power, cache_age
  FROM vote_power_cache
  WHERE fid = user_fid;
  
  -- Return cached if < 24 hours old
  IF cached_power IS NOT NULL AND cache_age < INTERVAL '24 hours' THEN
    RETURN cached_power;
  END IF;
  
  RETURN 1; -- Default
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 Advanced Queries

### **1. Vote Trends Over Time**

```sql
-- Daily vote trends for last 7 days
SELECT 
  vote_date,
  mode,
  total_votes,
  unique_voters
FROM mode_votes_daily
WHERE vote_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY vote_date DESC, total_votes DESC;
```

### **2. User Engagement Analysis**

```sql
-- Users by vote frequency
SELECT 
  CASE 
    WHEN vote_count >= 7 THEN 'Daily Voter'
    WHEN vote_count >= 3 THEN 'Regular Voter'
    ELSE 'Casual Voter'
  END as voter_type,
  COUNT(*) as user_count
FROM (
  SELECT 
    fid,
    COUNT(DISTINCT vote_date) as vote_count
  FROM votes
  WHERE vote_date >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY fid
) user_votes
GROUP BY voter_type;
```

### **3. Mode Popularity by Day of Week**

```sql
-- Which modes are popular on which days?
SELECT 
  TO_CHAR(vote_date, 'Day') as day_of_week,
  mode,
  AVG(total_votes) as avg_votes
FROM mode_votes_daily
WHERE vote_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY TO_CHAR(vote_date, 'Day'), mode
ORDER BY day_of_week, avg_votes DESC;
```

### **4. Vote Power Distribution**

```sql
-- How many users have each power level?
SELECT 
  vote_power,
  COUNT(DISTINCT fid) as user_count,
  SUM(vote_power) as total_power_contributed
FROM votes
WHERE vote_date = CURRENT_DATE
GROUP BY vote_power
ORDER BY vote_power;
```

---

## 🎯 Performance Tips

### **1. Use Indexes**

Your database has these indexes for fast queries:

```sql
-- Existing indexes
CREATE INDEX idx_votes_fid ON votes(fid);
CREATE INDEX idx_votes_date ON votes(vote_date);
CREATE INDEX idx_votes_mode_date ON votes(mode, vote_date);
```

**When to add more:**
- If you frequently query by `username`: `CREATE INDEX idx_votes_username ON votes(username);`
- If you query by `source`: `CREATE INDEX idx_votes_source ON votes(source);`

### **2. Use Aggregation Tables**

Instead of:
```sql
-- SLOW - scans all votes
SELECT mode, SUM(vote_power) 
FROM votes 
WHERE vote_date = CURRENT_DATE 
GROUP BY mode;
```

Use:
```sql
-- FAST - pre-aggregated
SELECT mode, total_votes 
FROM mode_votes_daily 
WHERE vote_date = CURRENT_DATE;
```

### **3. Limit Results**

Always use `LIMIT` for large queries:

```sql
-- Get recent votes (limited)
SELECT * FROM votes 
ORDER BY voted_at DESC 
LIMIT 100;
```

### **4. Use `EXPLAIN ANALYZE`**

See how PostgreSQL executes your query:

```sql
EXPLAIN ANALYZE
SELECT mode, SUM(vote_power) 
FROM votes 
WHERE vote_date = CURRENT_DATE 
GROUP BY mode;
```

---

## 🛠️ Useful Maintenance Queries

### **Clean Old Cache**

```sql
-- Remove cache older than 7 days
DELETE FROM vote_power_cache 
WHERE last_checked < NOW() - INTERVAL '7 days';
```

### **Reset Daily Totals**

```sql
-- Initialize today's totals
INSERT INTO mode_votes_daily (mode, vote_date, total_votes, unique_voters)
VALUES 
  ('studio', CURRENT_DATE, 0, 0),
  ('market', CURRENT_DATE, 0, 0),
  ('social', CURRENT_DATE, 0, 0),
  ('battle', CURRENT_DATE, 0, 0)
ON CONFLICT (mode, vote_date) DO NOTHING;
```

### **Check Database Size**

```sql
-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📚 Learning Resources

- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com/
- **Supabase SQL Editor**: Your Supabase dashboard → SQL Editor
- **SQL Practice**: https://sqlzoo.net/
- **Your Schema File**: `/database/supabase-schema-fid.sql`

---

## 🎓 Practice Exercises

Try these queries in your Supabase SQL Editor:

1. **Find the most popular mode this week**
2. **List users who voted for all 4 modes today**
3. **Calculate average vote power per mode**
4. **Find users who haven't voted in 3 days**
5. **Get hourly vote distribution for today**

**Solutions in next section!**

---

## ✅ Exercise Solutions

### 1. Most Popular Mode This Week
```sql
SELECT mode, SUM(total_votes) as weekly_total
FROM mode_votes_daily
WHERE vote_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY mode
ORDER BY weekly_total DESC
LIMIT 1;
```

### 2. Users Who Voted for All 4 Modes Today
```sql
SELECT fid, username
FROM votes
WHERE vote_date = CURRENT_DATE
GROUP BY fid, username
HAVING COUNT(DISTINCT mode) = 4;
```

### 3. Average Vote Power Per Mode
```sql
SELECT 
  mode,
  ROUND(AVG(vote_power), 2) as avg_power
FROM votes
WHERE vote_date = CURRENT_DATE
GROUP BY mode;
```

### 4. Users Who Haven't Voted in 3 Days
```sql
SELECT DISTINCT fid, username
FROM votes
WHERE fid NOT IN (
  SELECT DISTINCT fid 
  FROM votes 
  WHERE vote_date >= CURRENT_DATE - INTERVAL '3 days'
)
LIMIT 50;
```

### 5. Hourly Vote Distribution
```sql
SELECT 
  EXTRACT(HOUR FROM voted_at) as hour,
  COUNT(*) as vote_count
FROM votes
WHERE vote_date = CURRENT_DATE
GROUP BY EXTRACT(HOUR FROM voted_at)
ORDER BY hour;
```

---

## 🚨 Common Mistakes to Avoid

1. **Forgetting `WHERE` clause** - Can scan entire table
2. **Not using indexes** - Queries become slow
3. **Selecting `*`** - Only select columns you need
4. **No `LIMIT`** - Can return millions of rows
5. **Ignoring NULL values** - Use `IS NULL` not `= NULL`

---

## 💡 Quick Reference

```sql
-- Read
SELECT * FROM votes WHERE fid = 19640;

-- Insert
INSERT INTO votes (fid, mode, vote_power) VALUES (19640, 'studio', 1);

-- Update
UPDATE votes SET vote_power = 2 WHERE id = 'uuid-here';

-- Delete
DELETE FROM votes WHERE fid = 19640 AND vote_date = CURRENT_DATE;

-- Aggregate
SELECT mode, COUNT(*) FROM votes GROUP BY mode;

-- Join (if needed)
SELECT v.*, c.vote_power 
FROM votes v 
LEFT JOIN vote_power_cache c ON v.fid = c.fid;

-- Call RPC
SELECT * FROM get_todays_votes();
```
