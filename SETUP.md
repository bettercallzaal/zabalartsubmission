# ZABAL Live Hub - Farcaster Mini App Setup

## 🔑 Credentials

**Neynar API:**
- API Key: (get from dev.neynar.com)
- Free tier: 100 req/min, 10k req/day

**Farcaster:**
- @thezao FID: (lookup required)
- Custody wallet: (for signing manifest)

**Token Addresses (Optional):**
- ZAO (Optimism): `0x34cE89baA7E4a4B00E17F7E4C0cb97105C216957`
- LOANZ (Base): `0x03315307b202bf9c55ebebb8e9341d30411a0bc4`

---

## 📊 Voting Rules

**Vote Power Based on Farcaster Activity:**
- **Base**: 1 vote (any Farcaster user)
- **Follower**: 2 votes (following @thezao)
- **Active**: 3 votes (following + 5+ casts in /zao channel)
- **Holder**: 4 votes (active + holds ZAO/LOANZ tokens - future)

**Daily Limit:**
- Each FID can vote once per day (resets at midnight UTC)
- Vote power is weighted based on Farcaster activity
- Votes are stored in Supabase with FID

---

## 🗄️ Database Setup

### Step 1: Update SQL Schema for FIDs

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Run the updated schema:

```sql
-- Update votes table to use FID instead of wallet
ALTER TABLE votes 
  DROP COLUMN IF EXISTS wallet_address,
  ADD COLUMN IF NOT EXISTS fid INTEGER NOT NULL,
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'miniapp' CHECK (source IN ('miniapp', 'web'));

-- Update unique constraint
ALTER TABLE votes 
  DROP CONSTRAINT IF EXISTS unique_wallet_per_day,
  ADD CONSTRAINT unique_fid_per_day UNIQUE(fid, vote_date);

-- Update vote power cache for FIDs
DROP TABLE IF EXISTS token_holdings;
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_votes_fid ON votes(fid);
CREATE INDEX IF NOT EXISTS idx_cache_last_checked ON vote_power_cache(last_checked);
```

This creates:
- `votes` table - stores all votes with FID
- `vote_power_cache` table - caches Neynar API results
- `mode_votes_daily` table - aggregated daily totals
- Helper functions for vote counting
- Row Level Security policies

### Step 2: Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### Step 3: Add to Vercel Environment Variables

1. Go to Vercel project settings
2. Click **Environment Variables**
3. Add these variables:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_NEYNAR_API_KEY=your-neynar-api-key
   VITE_ZAO_FID=your-zao-fid
   ```
4. Redeploy the project

### Step 4: Create Farcaster Manifest

1. Visit https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter domain: `zabal.art`
3. Fill in app details:
   - Name: ZABAL Live Hub
   - Description: Vote for today's stream mode
   - Icon URL: https://zabal.art/icon-512.png
   - Home URL: https://zabal.art/live.html
4. Click "Generate Account Association"
5. Sign with your Farcaster custody wallet
6. Copy the generated JSON
7. Create `/.well-known/farcaster.json` with the manifest

---

## 🔧 Architecture

### Flow:

```
1. User opens app (Warpcast or web)
   ↓
2. Detect environment (mini app vs web)
   ↓
3. If mini app:
   - SDK provides user context (FID, username, pfp)
   - No authentication needed!
   ↓
4. If web:
   - Show "Sign in with Farcaster" button
   - User authenticates via Neynar
   ↓
5. Calculate vote power via Neynar API:
   - Check if following @thezao
   - Check /zao channel activity (5+ casts)
   - Optional: Check token holdings
   ↓
6. Cache vote power (24hr TTL)
   ↓
7. Display vote power in UI
   ↓
8. User clicks vote button
   ↓
9. Check if already voted today (Supabase)
   ↓
10. If not voted:
    - Submit vote with FID and power to Supabase
    - Update UI with new totals
    - Prompt to share via composeCast()
    ↓
11. If already voted:
    - Show "Already voted today" message
```

### Tech Stack:

**Frontend:**
- Farcaster Mini App SDK (`@farcaster/miniapp-sdk`)
- Neynar API - Farcaster data
- Supabase JS Client - Database operations
- Vanilla JS - UI updates

**Backend:**
- Supabase - PostgreSQL database
- Neynar API - Social graph queries
- Vercel - Hosting & serverless functions

---

## 🧪 Testing

### Test Scenarios:

1. **Base User (New to Farcaster)**
   - Open app in Warpcast
   - Should show "1 vote" power
   - Vote should count as 1

2. **Follower (@thezao)**
   - User follows @thezao
   - Should show "2 votes" power
   - Vote should count as 2

3. **Active in /zao Channel**
   - User has 5+ casts in /zao
   - Should show "3 votes" power
   - Vote should count as 3

4. **Daily Limit**
   - Vote once
   - Try to vote again same day
   - Should show "Already voted today"
   - Next day should allow voting again

5. **Vote Persistence**
   - Vote in Warpcast
   - Open in browser (web version)
   - Totals should persist
   - Should still show "Already voted today"

6. **Share Flow**
   - Vote for a mode
   - Share prompt appears
   - Click share
   - composeCast() opens with pre-filled text
   - Post to /zao channel

7. **Notifications**
   - Enable notifications
   - Receive notification when stream locks
   - Receive notification when stream goes live

---

## 🚀 Deployment Checklist

### Pre-deployment:
- [ ] Get Neynar API key from dev.neynar.com
- [ ] Look up @thezao FID
- [ ] Update Supabase schema for FIDs
- [ ] Get Supabase URL and Anon Key
- [ ] Create Farcaster manifest
- [ ] Generate account association signature
- [ ] Add environment variables to Vercel

### Development:
- [ ] Install Farcaster Mini App SDK
- [ ] Implement environment detection
- [ ] Add user context from SDK
- [ ] Integrate Neynar API
- [ ] Implement vote power calculation
- [ ] Update voting logic for FIDs
- [ ] Add composeCast() sharing
- [ ] Set up notification webhook

### Testing:
- [ ] Test in Warpcast debug tool
- [ ] Test vote power calculation
- [ ] Test voting with different activity levels
- [ ] Test daily limit
- [ ] Test share flow
- [ ] Test notifications
- [ ] Test web fallback

### Deployment:
- [ ] Deploy to production
- [ ] Verify manifest at zabal.art/.well-known/farcaster.json
- [ ] Test on zabal.art/live.html
- [ ] Test in Warpcast mobile app
- [ ] Share in /zao channel
- [ ] Monitor for errors

---

## 📝 Notes

**Security:**
- FID from SDK context (trusted by Farcaster protocol)
- Neynar API key server-side only (use Vercel functions)
- Supabase anon key is safe for client-side use (RLS policies protect data)
- No passwords or private keys needed

**Performance:**
- Vote power cached 24 hours in `vote_power_cache` table
- Daily totals pre-aggregated in `mode_votes_daily` table
- Neynar API calls minimized (only on first vote or cache expiry)
- Real-time updates via Supabase subscriptions

**Future Enhancements:**
- Add token-based vote power (ZAO/LOANZ holders)
- Show top voters leaderboard
- Add vote analytics dashboard
- Implement vote streaks (consecutive daily votes)
- Add channel-specific voting (different modes per channel)
- Create voter NFTs/POAPs

**Resources:**
- Farcaster Docs: https://docs.farcaster.xyz
- Mini Apps SDK: https://miniapps.farcaster.xyz
- Neynar API: https://docs.neynar.com
- ARCHITECTURE.md: Technical deep dive
