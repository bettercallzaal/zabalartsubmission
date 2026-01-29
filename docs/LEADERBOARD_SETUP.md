# ZABAL Leaderboard Setup Guide

## Overview

The ZABAL Leaderboard system tracks voter participation and awards 1 point per vote per day. It includes:

- **Database tracking** - Automatic score updates via triggers
- **API endpoint** - RESTful API for leaderboard data
- **Web interface** - Beautiful UI for viewing and configuring the leaderboard
- **Streak tracking** - Consecutive voting day streaks
- **Real-time updates** - Auto-refresh every 30 seconds

## Features

### Scoring System
- ✅ **1 point per vote per day** - Users can only vote once per day
- ✅ **Streak tracking** - Consecutive voting days are tracked
- ✅ **Real-time leaderboard** - Updates automatically with new votes
- ✅ **Top 100 rankings** - Displays top 100 voters

### Configuration Options
- ✅ **Custom name** - Up to 20 characters
- ✅ **Custom description** - Up to 80 characters
- ✅ **Custom icon** - Upload PNG, JPG, or GIF (max 1MB)
- ✅ **API endpoint** - Returns JSON with address and score fields

## Installation

### Step 1: Database Setup

Run the leaderboard schema SQL in your Supabase SQL Editor:

```bash
# Location: database/leaderboard-schema.sql
```

**Important:** Run this AFTER setting up the main voting schema (`supabase-schema-fid.sql`)

The schema creates:
- `leaderboard_config` - Stores leaderboard configuration
- `leaderboard_scores` - Tracks user scores and streaks
- Automatic triggers to update scores when votes are cast
- Functions for retrieving leaderboard data

### Step 2: Verify Database Tables

After running the SQL, verify these tables exist in Supabase:

1. `leaderboard_config`
2. `leaderboard_scores`

Check that these functions exist:
1. `get_leaderboard(limit_count INTEGER)`
2. `get_user_rank(user_fid INTEGER)`
3. `update_leaderboard_score()` (trigger function)

### Step 3: Deploy API Endpoint

The API endpoint is located at `/api/leaderboard.js` and will be automatically deployed with Vercel.

**Environment Variables Required:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

These should already be configured from the main app setup.

### Step 4: Access the Leaderboard

Once deployed, access the leaderboard at:

```
https://your-domain.com/leaderboard.html
```

Or locally:

```
http://localhost:3000/leaderboard.html
```

## API Documentation

### GET /api/leaderboard

Get the leaderboard rankings.

**Query Parameters:**
- `limit` (optional) - Number of entries to return (default: 100)
- `fid` (optional) - Get rank for specific user FID

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "address": "12345",
      "fid": 12345,
      "username": "zaal",
      "score": 42,
      "streak": 7,
      "lastVote": "2026-01-29"
    }
  ],
  "total": 100
}
```

**Get User Rank:**

```bash
GET /api/leaderboard?fid=12345
```

Response:
```json
{
  "success": true,
  "data": {
    "rank": 15,
    "score": 28,
    "streak": 5,
    "total_users": 500
  }
}
```

### POST /api/leaderboard

Update leaderboard configuration.

**Request Body:**

```json
{
  "name": "ZABAL Voters",
  "description": "Top voters who participate daily",
  "icon_url": "data:image/png;base64,..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ZABAL Voters",
    "description": "Top voters who participate daily",
    "icon_url": "data:image/png;base64,..."
  }
}
```

## Usage

### Viewing the Leaderboard

1. Navigate to `/leaderboard.html`
2. The leaderboard automatically loads and refreshes every 30 seconds
3. Top 3 users are highlighted with medals (🥇🥈🥉)
4. Streaks are displayed with fire emoji 🔥

### Configuring the Leaderboard

1. Scroll to the "Leaderboard Configuration" section
2. Enter a name (max 20 characters)
3. Enter a description (max 80 characters)
4. Optionally upload an icon (PNG, JPG, or GIF, max 1MB)
5. Click "Save Configuration"

### Integrating with Your App

Use the JavaScript module to integrate leaderboard functionality:

```javascript
import leaderboardManager from './js/leaderboard.js';

// Get leaderboard
const leaderboard = await leaderboardManager.getLeaderboard(100);

// Get user rank
const userRank = await leaderboardManager.getUserRank(12345);

// Update configuration
await leaderboardManager.updateConfig({
  name: 'My Leaderboard',
  description: 'Top voters',
  icon_url: 'https://example.com/icon.png'
});
```

## Database Schema Details

### leaderboard_config Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(20) | Leaderboard name |
| description | VARCHAR(80) | Leaderboard description |
| icon_url | TEXT | Icon URL or data URI |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### leaderboard_scores Table

| Column | Type | Description |
|--------|------|-------------|
| fid | INTEGER | Farcaster ID (primary key) |
| username | TEXT | User's username |
| total_votes | INTEGER | Total votes cast |
| last_vote_date | DATE | Last vote date |
| streak_days | INTEGER | Consecutive voting days |
| created_at | TIMESTAMP | First vote timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## How It Works

### Automatic Score Updates

When a user votes:

1. Vote is inserted into `votes` table
2. `trigger_update_leaderboard` fires automatically
3. `update_leaderboard_score()` function executes:
   - Checks if user exists in `leaderboard_scores`
   - Calculates streak (consecutive days)
   - Adds 1 point to user's total score
   - Updates last vote date and streak

### Streak Calculation

- **New user**: Streak starts at 1
- **Voted yesterday**: Streak increments by 1
- **Missed days**: Streak resets to 1
- **Same day**: Streak stays the same (only 1 vote per day allowed)

### Ranking

Users are ranked by:
1. **Total votes** (descending)
2. **Streak days** (descending, tiebreaker)

## Customization

### Change Refresh Rate

Edit `leaderboard.html`:

```javascript
// Change from 30 seconds to 60 seconds
setInterval(loadLeaderboard, 60000);
```

### Change Leaderboard Limit

Edit the API call:

```javascript
const leaderboard = await leaderboardManager.getLeaderboard(50); // Top 50 instead of 100
```

### Custom Styling

Edit the `<style>` section in `leaderboard.html` to customize colors, fonts, and layout.

## Troubleshooting

### Leaderboard Not Loading

1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Ensure database schema is properly set up
4. Check that API endpoint is deployed

### Scores Not Updating

1. Verify the trigger is active:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_leaderboard';
   ```

2. Check if votes are being recorded:
   ```sql
   SELECT * FROM votes WHERE vote_date = CURRENT_DATE;
   ```

3. Manually check leaderboard scores:
   ```sql
   SELECT * FROM leaderboard_scores ORDER BY total_votes DESC LIMIT 10;
   ```

### Configuration Not Saving

1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check Supabase RLS policies allow updates
4. Ensure name and description meet length requirements

## Security

### Row Level Security (RLS)

The leaderboard tables have RLS enabled with these policies:

- **Read access**: Public (anyone can view)
- **Write access**: Public (system can update via triggers)

For production, you may want to restrict write access to authenticated users only.

### API Security

- Input validation on name (max 20 chars) and description (max 80 chars)
- File size validation for icons (max 1MB)
- File type validation (PNG, JPG, GIF only)
- CORS enabled for cross-origin requests

## Performance

### Caching

- Client-side cache: 30 seconds
- Database indexes on `total_votes` and `streak_days`
- Automatic aggregation via triggers (no expensive queries)

### Optimization Tips

1. Use the `limit` parameter to reduce data transfer
2. Cache leaderboard data on the client
3. Consider adding Redis cache for high-traffic sites
4. Use CDN for icon hosting

## Integration with Main App

The leaderboard automatically integrates with the existing voting system:

1. User votes in main app (`index.html`)
2. Vote is recorded in `votes` table
3. Trigger automatically updates `leaderboard_scores`
4. Leaderboard page displays updated rankings

No additional code changes needed in the main voting app!

## Future Enhancements

Potential features to add:

- [ ] Weekly/monthly leaderboards
- [ ] Achievement badges
- [ ] Social sharing of rank
- [ ] Leaderboard history/archives
- [ ] User profiles
- [ ] Vote power multipliers in leaderboard
- [ ] Leaderboard categories (by mode)

## Support

For issues or questions:
- Check the main README.md
- Review Supabase logs
- Check browser console for errors
- Verify database schema is correct

---

**Built with ❤️ for the ZABAL community**
