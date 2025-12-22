# ZABAL Live Hub - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the ZABAL Live Hub miniapp to production on Vercel with Supabase backend.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Supabase account (free tier works)
- ✅ Neynar API key
- ✅ Farcaster account
- ✅ Domain (optional, Vercel provides free subdomain)

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Set database password (save this!)
5. Select region (closest to your users)
6. Wait for project to be created (~2 minutes)

### Step 2: Run Database Migrations

1. Go to SQL Editor in Supabase dashboard
2. Create the `votes` table:

```sql
CREATE TABLE votes (
    id BIGSERIAL PRIMARY KEY,
    fid INTEGER NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('studio', 'market', 'social', 'battle')),
    vote_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vote_power INTEGER DEFAULT 1,
    source TEXT DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(fid, vote_date, mode)
);

-- Add indexes for performance
CREATE INDEX idx_votes_fid ON votes(fid);
CREATE INDEX idx_votes_date ON votes(vote_date);
CREATE INDEX idx_votes_mode ON votes(mode);
```

3. Create the `daily_vote_totals` table:

```sql
CREATE TABLE daily_vote_totals (
    id BIGSERIAL PRIMARY KEY,
    vote_date DATE NOT NULL,
    mode TEXT NOT NULL,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vote_date, mode)
);

-- Add indexes
CREATE INDEX idx_daily_totals_date ON daily_vote_totals(vote_date);
CREATE INDEX idx_daily_totals_mode ON daily_vote_totals(mode);
```

4. Create RPC functions:

```sql
-- Get today's votes
CREATE OR REPLACE FUNCTION get_todays_votes()
RETURNS TABLE (mode TEXT, total_votes BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.mode,
        COUNT(*) as total_votes
    FROM votes v
    WHERE v.vote_date = CURRENT_DATE
    GROUP BY v.mode;
END;
$$ LANGUAGE plpgsql;

-- Check if user voted today
CREATE OR REPLACE FUNCTION has_voted_today(user_fid INTEGER)
RETURNS TABLE (has_voted BOOLEAN, voted_mode TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM votes WHERE fid = user_fid AND vote_date = CURRENT_DATE) as has_voted,
        (SELECT mode FROM votes WHERE fid = user_fid AND vote_date = CURRENT_DATE LIMIT 1) as voted_mode;
END;
$$ LANGUAGE plpgsql;
```

5. Create trigger for daily totals:

```sql
CREATE OR REPLACE FUNCTION update_daily_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO daily_vote_totals (vote_date, mode, total_votes)
        VALUES (NEW.vote_date, NEW.mode, 1)
        ON CONFLICT (vote_date, mode) 
        DO UPDATE SET 
            total_votes = daily_vote_totals.total_votes + 1,
            updated_at = NOW();
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE daily_vote_totals
        SET 
            total_votes = GREATEST(total_votes - 1, 0),
            updated_at = NOW()
        WHERE vote_date = OLD.vote_date AND mode = OLD.mode;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_daily_totals
AFTER INSERT OR DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_daily_totals();
```

### Step 3: Configure Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_vote_totals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read votes
CREATE POLICY "Allow public read access" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON daily_vote_totals
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own votes
CREATE POLICY "Allow insert own votes" ON votes
    FOR INSERT WITH CHECK (true);

-- Allow users to delete their own votes
CREATE POLICY "Allow delete own votes" ON votes
    FOR DELETE USING (true);
```

### Step 4: Get Supabase Credentials

1. Go to Project Settings > API
2. Copy:
   - Project URL (e.g., `https://xxx.supabase.co`)
   - `anon` public key (safe to expose in client)

---

## 🔑 API Keys Setup

### Neynar API Key

1. Go to [neynar.com](https://neynar.com)
2. Sign up / Log in
3. Create new API key
4. Copy the key (starts with `NEYNAR_API_`)

### Farcaster Configuration

1. Go to [Farcaster Developer Portal](https://developers.farcaster.xyz)
2. Create new app
3. Get your FID (Farcaster ID)
4. Configure webhook URL (will be `https://your-domain.com/api/send-notification-neynar`)

---

## 🌐 Vercel Deployment

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/zabal-live-hub.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

### Step 3: Configure Environment Variables

In Vercel project settings, add:

```env
VITE_NEYNAR_API_KEY=your_neynar_api_key_here
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_ZAO_FID=19640
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Get your deployment URL (e.g., `https://zabal-live-hub.vercel.app`)

---

## 🎯 Farcaster Miniapp Configuration

### Step 1: Update Manifest

Edit `.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "your_header_here",
    "payload": "your_payload_here",
    "signature": "your_signature_here"
  },
  "frame": {
    "version": "1",
    "appId": "zabal-live-hub",
    "name": "ZABAL Live Hub",
    "iconUrl": "https://your-domain.com/assets/logo.png",
    "homeUrl": "https://your-domain.com",
    "imageUrl": "https://your-domain.com/assets/preview.png",
    "buttonTitle": "🎨 Vote Now",
    "splashImageUrl": "https://your-domain.com/assets/splash.png",
    "splashBackgroundColor": "#141e27",
    "webhookUrl": "https://api.neynar.com/f/app/your-app-id/event",
    "subtitle": "Vote on stream direction",
    "description": "Vote daily on ZABAL's direction! Choose Studio, Market, Social, or Battle mode to shape the stream. Community-driven art coordination.",
    "primaryCategory": "art-creativity",
    "tags": ["art", "voting", "community", "streaming", "creative"],
    "ogTitle": "ZABAL - Vote on Stream",
    "ogDescription": "Vote daily on ZABAL's direction! Choose Studio, Market, Social, or Battle mode to shape the stream.",
    "ogImageUrl": "https://your-domain.com/assets/preview.png"
  }
}
```

### Step 2: Domain Verification

1. Add your domain to Vercel
2. Configure DNS records
3. Wait for SSL certificate
4. Update all URLs in `farcaster.json` to use your domain

### Step 3: Submit to Farcaster

1. Ensure `.well-known/farcaster.json` is accessible at `https://your-domain.com/.well-known/farcaster.json`
2. Wait 15-60 minutes for Farcaster to index your miniapp
3. Search for your app in Warpcast Mini Apps

---

## ✅ Post-Deployment Checklist

### Verify Deployment

- [ ] Website loads at your domain
- [ ] Database connection works
- [ ] Votes can be submitted
- [ ] Friend tagging works
- [ ] Share to Farcaster works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Miniapp appears in Warpcast search

### Test Functionality

```bash
# Test vote submission
1. Open miniapp in Warpcast
2. Select a mode
3. Click "Submit Votes"
4. Verify vote is recorded in Supabase

# Test friend tagging
1. Click "Tag Friends"
2. Select friends
3. Share to Farcaster
4. Verify friends are mentioned

# Test vote history
1. Vote multiple times
2. Check vote history accordion
3. Verify history is accurate
```

### Monitor

- [ ] Check Vercel Analytics
- [ ] Monitor Supabase logs
- [ ] Check error tracking
- [ ] Review user feedback

---

## 🔧 Troubleshooting

### Common Issues

**1. "Database not connected"**
```
Solution:
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in Vercel
- Check Supabase project is not paused
- Verify RLS policies allow access
```

**2. "Votes not submitting"**
```
Solution:
- Check browser console for errors
- Verify user is authenticated in Warpcast
- Check Supabase logs for errors
- Verify database schema is correct
```

**3. "Friends not loading"**
```
Solution:
- Verify NEYNAR_API_KEY is valid
- Check Neynar API rate limits
- Verify network connection
- Check browser console
```

**4. "Miniapp not in search"**
```
Solution:
- Verify appId in farcaster.json
- Check .well-known/farcaster.json is accessible
- Wait 15-60 minutes for indexing
- Verify domain is correct
```

**5. "Environment variables not working"**
```
Solution:
- Redeploy after adding env vars
- Check env var names match exactly
- Verify no trailing spaces
- Check Vercel deployment logs
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# 4. Updates DNS
```

### Preview Deployments

Every pull request gets a preview deployment:

```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Create PR on GitHub
# Vercel creates preview URL
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable in Vercel dashboard
2. View metrics:
   - Page views
   - Unique visitors
   - Performance metrics
   - Error rates

### Supabase Monitoring

1. Go to Supabase dashboard
2. Check:
   - Database usage
   - API requests
   - Error logs
   - Query performance

### Custom Analytics

Check localStorage for custom analytics:

```javascript
// In browser console
console.log(localStorage.getItem('zabal_analytics'));
```

---

## 🔐 Security Checklist

- [ ] Environment variables in Vercel (not in code)
- [ ] RLS enabled on all tables
- [ ] HTTPS enforced
- [ ] API keys rotated regularly
- [ ] Error messages don't expose secrets
- [ ] Input validation on all inputs
- [ ] Rate limiting enabled
- [ ] CORS configured correctly

---

## 📈 Scaling Considerations

### When to Scale

Monitor these metrics:
- Database CPU > 80%
- API rate limits hit frequently
- Page load time > 3 seconds
- Error rate > 1%

### Scaling Options

1. **Database**
   - Upgrade Supabase tier
   - Add read replicas
   - Enable connection pooling

2. **API**
   - Upgrade Neynar tier
   - Implement caching
   - Add CDN

3. **Hosting**
   - Upgrade Vercel tier
   - Enable edge functions
   - Add regions

---

## 🆘 Support

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Farcaster Documentation](https://docs.farcaster.xyz)
- [Neynar Documentation](https://docs.neynar.com)

### Getting Help

- GitHub Issues: [Create issue](https://github.com/yourusername/zabal-live-hub/issues)
- Twitter: [@zabal](https://twitter.com/zabal)
- Farcaster: [@zaal](https://warpcast.com/zaal)

---

## 📝 Maintenance

### Regular Tasks

**Daily**:
- Check error logs
- Monitor vote counts
- Review user feedback

**Weekly**:
- Review analytics
- Check database performance
- Update dependencies

**Monthly**:
- Rotate API keys
- Review security
- Optimize queries
- Update documentation

---

**Last Updated**: December 2024
**Version**: 2.0.0
