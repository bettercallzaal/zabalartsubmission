# Empire Builder-Style Custom Leaderboard Integration Guide

## Overview

This guide provides a complete implementation of Empire Builder-style custom leaderboards for the ZABAL voting platform. The system allows creation of multiple custom leaderboards with different metrics, automatic score syncing, and a full management UI.

## What Was Built

### **1. Database Schema**
**File:** `database/custom-leaderboards-schema.sql`

Two main tables:
- `custom_leaderboards` - Stores leaderboard configurations
- `custom_leaderboard_entries` - Stores individual scores

**Key Features:**
- Multiple metric types (votes, holdings, activity, custom)
- Automatic syncing for vote-based leaderboards
- Reset frequency options (never, daily, weekly, monthly)
- Full JSONB support for custom metadata

### **2. API Endpoints**

#### **Main Leaderboard API**
**File:** `api/custom-leaderboards/apiLeaderboards.js`

**Endpoints:**
- `GET /api/custom-leaderboards/apiLeaderboards` - List all leaderboards
- `GET /api/custom-leaderboards/apiLeaderboards?id=uuid` - Get specific leaderboard
- `GET /api/custom-leaderboards/apiLeaderboards?empire_address=0x...` - Filter by empire
- `POST /api/custom-leaderboards/apiLeaderboards` - Create new leaderboard
- `PUT /api/custom-leaderboards/apiLeaderboards?id=uuid` - Update leaderboard
- `DELETE /api/custom-leaderboards/apiLeaderboards?id=uuid` - Deactivate leaderboard

#### **Score Submission API**
**File:** `api/custom-leaderboards/submitScore.js`

**Endpoint:**
- `POST /api/custom-leaderboards/submitScore` - Submit/update score

### **3. Management UI**
**File:** `custom-leaderboards.html`

Beautiful interface with:
- Create new leaderboards
- Manage existing leaderboards
- API documentation
- Real-time character counters
- Responsive design

## Installation Steps

### **Step 1: Run Database Schema**

```bash
# In Supabase SQL Editor, run in order:
1. database/supabase-schema-fid.sql (if not already run)
2. database/leaderboard-schema.sql (if not already run)
3. database/custom-leaderboards-schema.sql (NEW)
```

### **Step 2: Deploy to Vercel**

```bash
git add .
git commit -m "Add Empire Builder-style custom leaderboards"
git push origin main
```

The API endpoints will deploy automatically.

### **Step 3: Access Management UI**

```
https://zabal.art/custom-leaderboards.html
```

## API Usage Examples

### **Create a Custom Leaderboard**

```javascript
const response = await fetch('/api/custom-leaderboards/apiLeaderboards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Top ZABAL Voters',
    description: 'Leaderboard tracking total votes cast by community members',
    empire_address: '0x0000000000000000000000000000000000000000',
    metric_type: 'votes',  // votes, holdings, activity, custom
    icon_url: 'https://example.com/icon.png',
    reset_frequency: 'never'  // never, daily, weekly, monthly
  })
});

const result = await response.json();
console.log('Leaderboard created:', result.data);
// { id: 'uuid', name: 'Top ZABAL Voters', ... }
```

### **Submit a Score**

```javascript
await fetch('/api/custom-leaderboards/submitScore', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    leaderboard_id: 'uuid-from-creation',
    fid: 12345,
    username: 'zaal',
    address: '0x...',
    score: 100,
    metadata: {
      streak: 7,
      last_vote: '2026-01-29'
    }
  })
});
```

### **Get Leaderboard with Entries**

```javascript
const response = await fetch('/api/custom-leaderboards/apiLeaderboards?id=uuid&limit=100');
const result = await response.json();

console.log(result.data);
// {
//   id: 'uuid',
//   name: 'Top ZABAL Voters',
//   entries: [
//     { rank: 1, fid: 12345, username: 'zaal', score: 100 },
//     { rank: 2, fid: 67890, username: 'alice', score: 95 }
//   ]
// }
```

### **Get All Leaderboards for an Empire**

```javascript
const response = await fetch('/api/custom-leaderboards/apiLeaderboards?empire_address=0x...');
const result = await response.json();

console.log(result.data); // Array of leaderboards
```

## Automatic Vote Syncing

For leaderboards with `metric_type: 'votes'`, scores are **automatically updated** when users vote:

```sql
-- This happens automatically via database trigger
-- When a vote is inserted, all vote-based leaderboards are updated
-- No manual API calls needed!
```

**How it works:**
1. User casts a vote in the main ZABAL app
2. Vote is inserted into `votes` table
3. Database trigger `trigger_sync_votes_to_leaderboard` fires
4. All active vote-based leaderboards are updated
5. User's score = total number of votes they've cast

## Metric Types

### **1. Votes (Auto-Synced)**
```javascript
{
  metric_type: 'votes'
  // Automatically syncs from votes table
  // Score = total votes cast by user
}
```

### **2. Token Holdings**
```javascript
{
  metric_type: 'holdings'
  // Manual score submission required
  // Score = token balance
}
```

### **3. Activity Score**
```javascript
{
  metric_type: 'activity'
  // Manual score submission required
  // Score = custom activity metric
}
```

### **4. Custom Metric**
```javascript
{
  metric_type: 'custom'
  // Manual score submission required
  // Score = any custom value
}
```

## Database Functions

### **upsert_leaderboard_entry**
```sql
SELECT * FROM upsert_leaderboard_entry(
  'leaderboard-uuid',  -- p_leaderboard_id
  12345,               -- p_fid
  'zaal',              -- p_username
  '0x...',             -- p_address
  100,                 -- p_score
  '{"streak": 7}'      -- p_metadata (JSONB)
);
-- Returns: { id, score, rank }
```

### **get_custom_leaderboard**
```sql
SELECT * FROM get_custom_leaderboard(
  'leaderboard-uuid',  -- p_leaderboard_id
  100                  -- p_limit
);
-- Returns: ranked entries with all details
```

### **get_user_leaderboard_rank**
```sql
SELECT * FROM get_user_leaderboard_rank(
  'leaderboard-uuid',  -- p_leaderboard_id
  12345                -- p_fid
);
-- Returns: { rank, score, total_entries }
```

## Integration with Existing ZABAL App

### **Option 1: Display User's Rank After Voting**

```javascript
// In your voting success handler
async function onVoteSuccess(fid) {
  // Get all vote-based leaderboards
  const response = await fetch('/api/custom-leaderboards/apiLeaderboards');
  const { data: leaderboards } = await response.json();
  
  const voteLeaderboards = leaderboards.filter(lb => lb.metric_type === 'votes');
  
  // Show user's rank in each leaderboard
  for (const lb of voteLeaderboards) {
    const rankResponse = await fetch(
      `/api/custom-leaderboards/apiLeaderboards?id=${lb.id}`
    );
    const { data } = await rankResponse.json();
    
    const userEntry = data.entries.find(e => e.fid === fid);
    if (userEntry) {
      console.log(`Your rank in ${lb.name}: #${userEntry.rank}`);
    }
  }
}
```

### **Option 2: Leaderboard Widget**

```javascript
// Add to your main app
async function createLeaderboardWidget(containerId, leaderboardId) {
  const response = await fetch(
    `/api/custom-leaderboards/apiLeaderboards?id=${leaderboardId}&limit=10`
  );
  const { data } = await response.json();
  
  const html = `
    <div class="leaderboard-widget">
      <h3>${data.name}</h3>
      <ul>
        ${data.entries.map(entry => `
          <li>
            <span class="rank">#${entry.rank}</span>
            <span class="username">${entry.username}</span>
            <span class="score">${entry.score}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
  
  document.getElementById(containerId).innerHTML = html;
}
```

## Comparison: Empire Builder vs ZABAL Implementation

| Feature | Empire Builder | ZABAL Implementation |
|---------|---------------|---------------------|
| **Create Leaderboards** | ✅ Via UI | ✅ Via UI (`custom-leaderboards.html`) |
| **Multiple Metrics** | ✅ Token holdings, activity | ✅ Votes, holdings, activity, custom |
| **Auto-Sync** | ✅ Blockchain data | ✅ Vote data (database triggers) |
| **API Endpoint** | `/api/custom-leaderboards/apiLeaderboards` | ✅ Same endpoint |
| **Score Submission** | ✅ Manual API calls | ✅ `/api/custom-leaderboards/submitScore` |
| **Metadata Support** | ✅ JSONB | ✅ JSONB |
| **Reset Frequency** | ✅ Configurable | ✅ Never, daily, weekly, monthly |
| **Farcaster Integration** | ✅ FID-based | ✅ FID + username |

## Advanced Features

### **Custom Scoring Rules**

Store complex scoring logic in the `scoring_rules` JSONB field:

```javascript
{
  name: 'Weighted Voter Score',
  scoring_rules: {
    base_points: 1,
    streak_multiplier: 0.1,
    max_multiplier: 2.0,
    formula: 'base_points * (1 + streak * streak_multiplier)'
  }
}
```

### **Metadata Tracking**

Track additional data with each score:

```javascript
await fetch('/api/custom-leaderboards/submitScore', {
  method: 'POST',
  body: JSON.stringify({
    leaderboard_id: 'uuid',
    fid: 12345,
    score: 100,
    metadata: {
      streak: 7,
      last_vote_date: '2026-01-29',
      total_votes: 42,
      favorite_mode: 'studio',
      nft_boost: 1.5
    }
  })
});
```

### **Reset Frequencies**

Leaderboards can automatically reset:

- **Never** - Permanent leaderboard
- **Daily** - Resets at midnight
- **Weekly** - Resets on Monday
- **Monthly** - Resets on 1st of month

(Note: Reset logic needs to be implemented via cron job or scheduled function)

## Troubleshooting

### **Leaderboard Not Creating**

Check validation errors:
- Name must be ≤ 50 characters
- Description must be ≤ 200 characters
- Empire address is required
- Metric type must be valid

### **Scores Not Auto-Syncing**

For vote-based leaderboards:
1. Verify `metric_type` is set to `'votes'`
2. Check trigger is active:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trigger_sync_votes_to_leaderboard';
   ```
3. Ensure leaderboard `is_active = true`

### **API Returns 400 Error**

Common causes:
- Missing required fields
- Invalid data types
- Leaderboard not found or inactive
- Score is negative

## Security Considerations

- ✅ Row Level Security (RLS) enabled
- ✅ Input validation on all fields
- ✅ CORS configured
- ✅ SQL injection prevention via parameterized queries
- ✅ No sensitive data in responses

## Performance Optimization

- ✅ Database indexes on frequently queried fields
- ✅ Efficient ranking via window functions
- ✅ JSONB for flexible metadata
- ✅ Automatic aggregation via triggers

## Next Steps

1. **Run the database schema** in Supabase
2. **Deploy the API endpoints** via Git push
3. **Access the management UI** at `/custom-leaderboards.html`
4. **Create your first leaderboard**
5. **Integrate with your main app** using the examples above

## Support

For issues or questions:
- Check API responses for error messages
- Review Supabase logs
- Verify database schema is correct
- Test API endpoints with curl or Postman

---

**Built with ❤️ for the ZABAL community - Empire Builder style!**
