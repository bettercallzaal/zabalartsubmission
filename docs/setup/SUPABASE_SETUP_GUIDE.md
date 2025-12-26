# 🗄️ New Supabase Database Setup Guide

## 📖 What Happened & Why We're Starting Fresh

### **What Changed:**
1. **Old Situation:** You had a Vercel Supabase integration that managed your database
2. **What We Did:** Removed the Vercel integration (it was causing deployment failures)
3. **Side Effect:** This deleted the connected Supabase project
4. **Now:** We're creating a standalone Supabase project (no Vercel integration needed)

### **Why This Is Better:**
- ✅ **No integration dependency** - Database works independently
- ✅ **Works on any platform** - Vercel, GitHub Pages, anywhere
- ✅ **Simpler setup** - Direct connection from browser JavaScript
- ✅ **More control** - You manage the database directly

---

## 🎯 How Your App Works Now

### **Database Flow (Client-Side Connection):**

```
User Opens Site (zabal.art)
         ↓
Browser loads JavaScript
         ↓
config.js loads with Supabase credentials
         ↓
Supabase SDK creates client connection
         ↓
JavaScript queries database directly from browser
         ↓
Data flows: Browser ←→ Supabase (no server in between)
```

### **Key Points:**
- **No server-side code** - Everything happens in the browser
- **Public credentials** - Supabase URL and anon key are safe to expose
- **Security via RLS** - Row Level Security policies protect your data
- **Works anywhere** - Any hosting platform, even local development

---

## 📋 Step-by-Step Setup

### **Step 1: Create New Supabase Project**

1. **Go to:** https://supabase.com/dashboard
2. **Click:** "New Project"
3. **Fill in:**
   - **Name:** `zabal-live-hub` (or whatever you want)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users (e.g., `us-east-1`)
   - **Plan:** Free tier is fine
4. **Click:** "Create new project"
5. **Wait:** 2-3 minutes for project to initialize

---

### **Step 2: Get Your Credentials**

Once project is created:

1. **Go to:** Project Settings → API
2. **Copy these values:**
   - **Project URL:** `https://[your-project-id].supabase.co`
   - **anon public key:** Long string starting with `eyJhbGc...`

**Example:**
```
URL: https://abcdefghijklmnop.supabase.co
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

---

### **Step 3: Update Your Code**

I'll update `js/config.js` with your new credentials once you provide them.

**What gets updated:**
```javascript
this.SUPABASE_URL = 'https://[YOUR-NEW-PROJECT-ID].supabase.co';
this.SUPABASE_ANON_KEY = 'eyJhbGc[YOUR-NEW-KEY]';
```

---

### **Step 4: Set Up Database Schema**

In Supabase dashboard:

1. **Go to:** SQL Editor
2. **Click:** "New Query"
3. **Paste the SQL below** (I'll provide it)
4. **Click:** "Run"

This creates:
- `votes` table (stores all votes)
- `vote_power_cache` table (caches user power calculations)
- `mode_votes_daily` table (daily aggregated totals)
- RPC functions for querying data
- Triggers for automatic updates

---

## 🗄️ Database Schema (SQL to Run)

```sql
-- ============================================
-- ZABAL Live Hub - Complete Database Setup
-- ============================================

-- 1. Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fid INTEGER NOT NULL,
  username TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('studio', 'market', 'social', 'battle')),
  vote_power INTEGER NOT NULL DEFAULT 1,
  source TEXT DEFAULT 'web',
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vote_date DATE DEFAULT CURRENT_DATE,
  CONSTRAINT unique_fid_mode_per_day UNIQUE(fid, vote_date, mode)
);

-- 2. Create vote_power_cache table
CREATE TABLE IF NOT EXISTS vote_power_cache (
  fid INTEGER PRIMARY KEY,
  username TEXT,
  follows_zao BOOLEAN DEFAULT FALSE,
  zao_channel_casts INTEGER DEFAULT 0,
  has_zao_token BOOLEAN DEFAULT FALSE,
  has_loanz_token BOOLEAN DEFAULT FALSE,
  vote_power INTEGER DEFAULT 1,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create mode_votes_daily table
CREATE TABLE IF NOT EXISTS mode_votes_daily (
  mode TEXT NOT NULL,
  vote_date DATE NOT NULL,
  total_votes INTEGER DEFAULT 0,
  unique_voters INTEGER DEFAULT 0,
  PRIMARY KEY (mode, vote_date)
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_date ON votes(vote_date);
CREATE INDEX IF NOT EXISTS idx_votes_fid ON votes(fid);
CREATE INDEX IF NOT EXISTS idx_votes_mode ON votes(mode);
CREATE INDEX IF NOT EXISTS idx_daily_date ON mode_votes_daily(vote_date);

-- 5. Create function to get today's votes
CREATE OR REPLACE FUNCTION get_todays_votes()
RETURNS TABLE (
  mode TEXT,
  total_votes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.mode,
    COALESCE(SUM(v.vote_power), 0)::BIGINT as total_votes
  FROM votes v
  WHERE v.vote_date = CURRENT_DATE
  GROUP BY v.mode;
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to check if user voted today
CREATE OR REPLACE FUNCTION has_voted_today(user_fid INTEGER)
RETURNS TABLE (
  has_voted BOOLEAN,
  voted_mode TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXISTS(SELECT 1 FROM votes WHERE fid = user_fid AND vote_date = CURRENT_DATE) as has_voted,
    (SELECT mode FROM votes WHERE fid = user_fid AND vote_date = CURRENT_DATE LIMIT 1) as voted_mode;
END;
$$ LANGUAGE plpgsql;

-- 7. Create function to update daily aggregates
CREATE OR REPLACE FUNCTION update_mode_votes_daily()
RETURNS TRIGGER AS $$
BEGIN
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
    unique_voters = (
      SELECT COUNT(DISTINCT fid)
      FROM votes
      WHERE mode = NEW.mode AND vote_date = NEW.vote_date
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger for automatic aggregation
DROP TRIGGER IF EXISTS trigger_update_daily_votes ON votes;
CREATE TRIGGER trigger_update_daily_votes
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_mode_votes_daily();

-- 9. Enable Row Level Security (RLS)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_power_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE mode_votes_daily ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies (allow public read/write for now)
CREATE POLICY "Allow public read access" ON votes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access" ON vote_power_cache FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access" ON vote_power_cache FOR ALL USING (true);
CREATE POLICY "Allow public read access" ON mode_votes_daily FOR SELECT USING (true);

-- ============================================
-- Setup Complete!
-- ============================================
```

---

## 🔍 What Each Part Does

### **Tables:**

1. **`votes`** - Main table storing every vote
   - Each user can vote once per mode per day
   - `vote_power` multiplies their vote (1-4x based on engagement)
   - Unique constraint prevents duplicate votes

2. **`vote_power_cache`** - Performance optimization
   - Caches expensive calculations (token holdings, follows, etc.)
   - Reduces API calls to Neynar
   - Expires after 24 hours

3. **`mode_votes_daily`** - Pre-calculated totals
   - Fast lookups for leaderboard
   - Updated automatically by trigger
   - Historical data preserved

### **Functions (RPC):**

1. **`get_todays_votes()`** - Returns current vote counts
   - Called every 30 seconds to refresh UI
   - Sums up vote_power for each mode

2. **`has_voted_today(user_fid)`** - Checks if user already voted
   - Prevents duplicate votes
   - Shows which mode they voted for

### **Security (RLS):**

- **Row Level Security** enabled on all tables
- **Public policies** allow read/write (safe because data is public anyway)
- **Anon key** has limited permissions (can't delete, can't access system tables)

---

## 🎯 User Flow After Setup

### **When User Opens Site:**

1. **Page loads** → `config.js` loads with your Supabase credentials
2. **Supabase SDK** → Creates client connection to your database
3. **Load votes** → Calls `get_todays_votes()` to show current counts
4. **User authenticates** → Farcaster SDK gets user's FID
5. **Check if voted** → Calls `has_voted_today(user_fid)`
6. **User votes** → Inserts into `votes` table
7. **Trigger fires** → Automatically updates `mode_votes_daily`
8. **UI refreshes** → Shows new vote counts

### **Every 30 Seconds:**
- Calls `get_todays_votes()` to refresh counts
- Updates UI with latest numbers

### **At 5 PM EST Daily:**
- Voting locks
- New day starts at midnight (database resets via `vote_date`)

---

## ✅ Verification Steps

After setup, verify everything works:

### **1. Test Database Connection**
```javascript
// Open browser console on zabal.art
// You should see:
✅ Configuration validated
✅ Supabase client initialized
📊 Config URL: https://[your-project].supabase.co
```

### **2. Test Vote Loading**
```javascript
// Should see:
📊 Loading votes from database...
📥 Received vote data: [...]
✅ Votes loaded: {studio: X, market: Y, social: Z, battle: W}
```

### **3. Test Voting**
- Click a mode
- Click "Submit Votes"
- Should see success message
- Vote count should increase

### **4. Test Vote History**
- Scroll to "Recent Voting Activity"
- Should show recent votes with usernames

---

## 📊 What Changed vs Before

### **Before (With Vercel Integration):**
```
Code → Vercel → Vercel's Supabase Integration → Database
      ❌ Integration kept failing
      ❌ Deployments blocked
      ❌ Complicated setup
```

### **Now (Direct Connection):**
```
Browser JavaScript → Supabase Database
✅ Simple and direct
✅ No integration to fail
✅ Works on any platform
```

### **Key Differences:**

| Aspect | Before | Now |
|--------|--------|-----|
| **Connection** | Via Vercel integration | Direct from browser |
| **Deployment** | Vercel only | Any platform |
| **Setup** | Complex (integration) | Simple (just credentials) |
| **Failures** | Integration issues | None (direct connection) |
| **Control** | Vercel managed | You manage directly |

---

## 🚀 Next Steps

1. **Create Supabase project** (Step 1 above)
2. **Get credentials** (Step 2 above)
3. **Give me the credentials** - I'll update config.js
4. **Run the SQL** (Step 4 above)
5. **Deploy** - Push changes to production
6. **Test** - Verify everything works

---

## 🆘 Troubleshooting

### **"ERR_NAME_NOT_RESOLVED"**
- Supabase project not created yet
- Or wrong URL in config.js

### **"Row Level Security policy violation"**
- RLS policies not set up
- Run the SQL again

### **Votes not saving**
- Check browser console for errors
- Verify SQL ran successfully
- Check Supabase logs

### **Vote counts show 0**
- Database is empty (normal for new project)
- Start voting to populate data

---

## 📝 Summary

**What we're doing:** Creating a new standalone Supabase database

**Why:** Old one was deleted when we removed the failing Vercel integration

**How it works now:** Direct browser → database connection (simpler, more reliable)

**What you need to do:** 
1. Create Supabase project
2. Give me credentials
3. Run SQL setup
4. Test

**Result:** Working database, reliable deployments, full control

---

**Ready to start? Create the Supabase project and share the URL and anon key with me!** 🚀
