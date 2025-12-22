# Vote Power System - Setup Guide

## 🎯 Overview

Your ZABAL app now has a **dynamic vote power system** that rewards users based on:
1. **Activity in /zao channel** (base power)
2. **Neynar quality score** (multiplier)

---

## 📊 How It Works

### **Formula:**
```
Final Vote Power = (Base Power from /zao posts) × (Neynar Score Multiplier)
```

### **Base Power Tiers (from /zao channel posts):**

| /zao Posts | Base Power | Badge |
|------------|------------|-------|
| 50+ | 4x | 🔥 Super Active |
| 20-49 | 3x | ⭐ Very Active |
| 5-19 | 2x | ✨ Active |
| 0-4 | 1x | 👤 Member |

### **Neynar Score Multipliers:**

| Neynar Score | Multiplier | Badge | Effect |
|--------------|------------|-------|--------|
| 0.9+ | 1.5x | 💎 Elite | Top-tier users get 50% bonus |
| 0.7-0.89 | 1.25x | ⭐ Quality | Quality users get 25% bonus |
| 0.5-0.69 | 1.0x | - | No bonus or penalty |
| <0.5 | 0.5x | ⚠️ Low Quality | Spam/bot penalty (50% reduction) |

### **Examples:**

1. **Super Active Elite User:**
   - 50+ /zao posts = 4x base
   - Neynar score 0.95 = 1.5x multiplier
   - **Final: 6x vote power** (capped at 6x)

2. **Very Active Quality User:**
   - 25 /zao posts = 3x base
   - Neynar score 0.75 = 1.25x multiplier
   - **Final: 3.75x vote power** (rounds to 3.8x)

3. **Active Member:**
   - 10 /zao posts = 2x base
   - Neynar score 0.6 = 1.0x multiplier
   - **Final: 2x vote power**

4. **Low Quality User:**
   - 5 /zao posts = 2x base
   - Neynar score 0.4 = 0.5x multiplier
   - **Final: 1x vote power** (penalty applied)

---

## ⚙️ Setup Instructions

### **1. Add Neynar API Key to Config**

Your Neynar API key needs to be accessible in the app config.

**Edit `config.js` or inline config:**
```javascript
window.appConfig = {
    SUPABASE_URL: 'your-supabase-url',
    SUPABASE_ANON_KEY: 'your-supabase-key',
    NEYNAR_API_KEY: 'YOUR_NEYNAR_API_KEY_HERE' // Add this line
};
```

**Or if using environment variables in Vercel:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `NEYNAR_API_KEY` = `your-key-here`
3. Redeploy

### **2. Update Database Schema (Optional but Recommended)**

Add columns to cache vote power calculations:

```sql
-- Add to vote_power_cache table
ALTER TABLE vote_power_cache 
ADD COLUMN IF NOT EXISTS zao_channel_casts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS neynar_score DECIMAL(3,2) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS calculated_power DECIMAL(3,1) DEFAULT 1.0;
```

This allows caching to reduce API calls.

### **3. Test the System**

1. **Open your miniapp** in Warpcast
2. **Check the console** for vote power calculation logs:
   ```
   🎯 Calculating vote power for FID: 19640
   📊 Fetching /zao channel casts for FID: 19640
   ✅ Found 25 /zao channel casts
   ⭐ Very Active: +2 (20+ /zao posts)
   📊 Fetching Neynar score for FID: 19640
   ✅ Neynar score: 0.85
   ⭐ Quality User: 1.25x multiplier (Neynar 0.7+)
   ✅ Final vote power: 3.8 (base: 3 x multiplier: 1.25)
   ```

3. **Check the UI** at the top:
   - Should show your vote power (e.g., "3.8x")
   - Should show badge (e.g., "⭐ Very Active • ⭐ Quality • 25 /zao posts")

4. **Submit a vote** and verify it's recorded with correct power in database

---

## 🎨 UI Display

### **Location:**
The vote power is displayed in the **Personal Stats** section at the top of the page:

```
📊 Your Stats
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Votes │ Day Streak  │ Favorite    │ Vote Power  │
│     12      │      3      │     🎬      │    3.8x     │
│             │             │             │ ⭐ Very Active│
│             │             │             │ • ⭐ Quality  │
│             │             │             │ • 25 /zao    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **Badge Meanings:**
- 🔥 **Super Active**: 50+ posts in /zao
- ⭐ **Very Active**: 20-49 posts in /zao
- ✨ **Active**: 5-19 posts in /zao
- 👤 **Member**: 0-4 posts in /zao
- 💎 **Elite**: Neynar score 0.9+ (top quality)
- ⭐ **Quality**: Neynar score 0.7+ (quality user)

---

## 🔧 Customization Options

### **Adjust /zao Post Thresholds:**

In `index.html`, find the `calculateVotePower` function and modify:

```javascript
// Current thresholds
if (zaoCasts >= 50) power += 3;      // Super active
else if (zaoCasts >= 20) power += 2; // Very active
else if (zaoCasts >= 5) power += 1;  // Active

// Example: Make it easier to get bonuses
if (zaoCasts >= 30) power += 3;      // Lower threshold
else if (zaoCasts >= 10) power += 2;
else if (zaoCasts >= 3) power += 1;
```

### **Adjust Neynar Multipliers:**

```javascript
// Current multipliers
if (neynarScore >= 0.9) multiplier = 1.5;      // Elite
else if (neynarScore >= 0.7) multiplier = 1.25; // Quality
else if (neynarScore < 0.5) multiplier = 0.5;   // Spam penalty

// Example: More generous multipliers
if (neynarScore >= 0.9) multiplier = 2.0;      // Double for elite
else if (neynarScore >= 0.7) multiplier = 1.5;
else if (neynarScore < 0.4) multiplier = 0.5;  // Stricter spam threshold
```

### **Change Maximum Cap:**

```javascript
// Current cap: 6x
const cappedPower = Math.min(finalPower, 6);

// Example: Higher cap for super users
const cappedPower = Math.min(finalPower, 10);
```

---

## 📈 Performance Optimization

### **Caching Strategy:**

The system makes 2 API calls per vote:
1. Neynar API for user casts (to count /zao posts)
2. Neynar API for user score

**To reduce API calls, implement caching:**

```javascript
// Cache vote power for 1 hour
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

async function getCachedVotePower(fid) {
    const cached = localStorage.getItem(`votePower_${fid}`);
    if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_DURATION) {
            return data.powerData;
        }
    }
    return null;
}

async function setCachedVotePower(fid, powerData) {
    localStorage.setItem(`votePower_${fid}`, JSON.stringify({
        powerData,
        timestamp: Date.now()
    }));
}

// Update calculateVotePower to use cache
async function calculateVotePower(fid) {
    // Check cache first
    const cached = await getCachedVotePower(fid);
    if (cached) {
        console.log('✅ Using cached vote power');
        return cached;
    }
    
    // ... existing calculation code ...
    
    // Cache result
    await setCachedVotePower(fid, powerData);
    return powerData;
}
```

---

## 🐛 Troubleshooting

### **Issue: Vote power shows as 1x for everyone**

**Solution:**
1. Check Neynar API key is set correctly in config
2. Open browser console and look for errors
3. Verify API key has correct permissions

### **Issue: /zao posts count is 0**

**Solution:**
1. The API only fetches last 100 casts - if user has 100+ casts but none in /zao, it will show 0
2. Increase limit in API call: `limit=100` → `limit=500` (but this costs more API credits)
3. Or adjust thresholds to be more lenient

### **Issue: Neynar score is always 0.5**

**Solution:**
1. Check if user has `experimental.neynar_user_score` field
2. Some new accounts may not have scores yet
3. Default fallback is 0.5 (neutral)

### **Issue: Vote power calculation is slow**

**Solution:**
1. Implement caching (see Performance Optimization above)
2. Consider pre-calculating for active users
3. Show loading state while calculating

---

## 📊 Analytics & Monitoring

### **Track Vote Power Distribution:**

Add to your analytics:

```javascript
// After calculating vote power
window.analytics?.track('vote_power_calculated', {
    fid: fid,
    power: powerData.power,
    zaoCasts: powerData.zaoCasts,
    neynarScore: powerData.neynarScore,
    multiplier: powerData.multiplier
});
```

### **Monitor in Supabase:**

Query to see vote power distribution:

```sql
-- Average vote power by day
SELECT 
    vote_date,
    AVG(vote_power) as avg_power,
    MIN(vote_power) as min_power,
    MAX(vote_power) as max_power
FROM votes
GROUP BY vote_date
ORDER BY vote_date DESC;

-- Power distribution
SELECT 
    FLOOR(vote_power) as power_tier,
    COUNT(*) as vote_count
FROM votes
WHERE vote_date = CURRENT_DATE
GROUP BY FLOOR(vote_power)
ORDER BY power_tier;
```

---

## 🚀 Next Steps

1. **Deploy to Vercel** with Neynar API key
2. **Test with multiple users** to verify calculations
3. **Monitor vote power distribution** to ensure fairness
4. **Adjust thresholds** based on community feedback
5. **Add caching** to improve performance
6. **Consider adding** more signals (token holdings, follows, etc.)

---

## 💡 Future Enhancements

### **Potential Additional Signals:**
- **Token holdings**: +1x for holding $ZAO or $LOANZ
- **Follows @zao**: +0.5x bonus
- **Voting streak**: +0.1x per consecutive day
- **Early voter bonus**: +0.5x if voted in first hour
- **Channel membership**: +0.5x for /zao channel members

### **Dynamic Thresholds:**
Adjust thresholds based on community growth:
```javascript
// Scale thresholds with total /zao posts
const totalZaoPosts = await getTotalZaoPosts();
const threshold = Math.floor(totalZaoPosts / 1000); // Adjust as community grows
```

---

## 📚 Resources

- **Neynar API Docs**: https://docs.neynar.com
- **Neynar Score Guide**: https://docs.neynar.com/docs/neynar-user-quality-score
- **Your Database Schema**: `/database/supabase-schema-fid.sql`
- **Vote Power Code**: `index.html` lines 3585-3732

---

## ✅ Checklist

- [ ] Add Neynar API key to config
- [ ] Deploy to Vercel
- [ ] Test vote power calculation
- [ ] Verify UI display shows correctly
- [ ] Check database records vote power
- [ ] Monitor for API errors
- [ ] Implement caching (optional)
- [ ] Adjust thresholds if needed
- [ ] Share with community!

---

**Questions?** Check the console logs for detailed calculation breakdowns!
