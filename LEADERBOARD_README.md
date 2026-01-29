# 🏆 ZABAL Voter Leaderboard

A comprehensive leaderboard system for tracking and rewarding daily voter participation in the ZABAL Live Hub.

## Overview

The ZABAL Voter Leaderboard awards **1 point per vote per day** and tracks:
- Total votes cast by each user
- Consecutive voting streaks
- Real-time rankings
- Top 100 voters

## Features

### 🎯 Core Features
- **Automatic Scoring** - 1 point awarded per vote per day
- **Streak Tracking** - Consecutive voting days tracked with 🔥 emoji
- **Real-time Updates** - Auto-refresh every 30 seconds
- **Top Rankings** - Medal display for top 3 (🥇🥈🥉)
- **User Profiles** - FID and username display

### ⚙️ Configuration
- **Custom Name** - Up to 20 characters
- **Custom Description** - Up to 80 characters  
- **Custom Icon** - Upload PNG, JPG, or GIF (max 1MB)
- **API Endpoint** - RESTful API with JSON response

### 📊 Display Features
- Beautiful gradient design
- Responsive mobile layout
- Drag-and-drop icon upload
- Character counters for inputs
- Loading states and error handling
- Empty state messaging

## Quick Start

### 1. Database Setup
```bash
# Run in Supabase SQL Editor
database/leaderboard-schema.sql
```

### 2. Deploy
```bash
# Deploys automatically with Vercel
vercel --prod
```

### 3. Access
```
https://your-domain.com/leaderboard.html
```

See [Quick Start Guide](docs/LEADERBOARD_QUICKSTART.md) for detailed steps.

## API Documentation

### GET /api/leaderboard

Get leaderboard rankings or user rank.

**Parameters:**
- `limit` (optional) - Number of entries (default: 100)
- `fid` (optional) - Get specific user rank

**Example:**
```bash
# Get top 100
GET /api/leaderboard?limit=100

# Get user rank
GET /api/leaderboard?fid=12345
```

**Response:**
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

### POST /api/leaderboard

Update leaderboard configuration.

**Body:**
```json
{
  "name": "ZABAL Voters",
  "description": "Top voters who participate daily",
  "icon_url": "data:image/png;base64,..."
}
```

## Files

### Database
- `database/leaderboard-schema.sql` - Database schema and triggers

### API
- `api/leaderboard.js` - Serverless API endpoint

### Frontend
- `leaderboard.html` - Main leaderboard page
- `js/leaderboard.js` - JavaScript module

### Documentation
- `docs/LEADERBOARD_SETUP.md` - Complete setup guide
- `docs/LEADERBOARD_QUICKSTART.md` - Quick start guide

## How It Works

### Scoring System

1. User votes in main app
2. Vote recorded in `votes` table
3. Database trigger fires automatically
4. `leaderboard_scores` table updated:
   - Add 1 point to total score
   - Update streak if consecutive day
   - Reset streak if days missed

### Streak Calculation

- **First vote**: Streak = 1
- **Voted yesterday**: Streak + 1
- **Missed days**: Streak = 1
- **Same day**: No change (1 vote per day max)

### Ranking

Users ranked by:
1. Total votes (descending)
2. Streak days (tiebreaker)

## Integration

### JavaScript Module

```javascript
import leaderboardManager from './js/leaderboard.js';

// Get leaderboard
const data = await leaderboardManager.getLeaderboard(100);

// Get user rank
const rank = await leaderboardManager.getUserRank(12345);

// Update config
await leaderboardManager.updateConfig({
  name: 'My Leaderboard',
  description: 'Top voters',
  icon_url: 'https://example.com/icon.png'
});
```

### Standalone Usage

The leaderboard works independently - no changes needed to main voting app!

## Database Schema

### Tables

**leaderboard_config**
- Stores leaderboard name, description, icon
- Single active configuration

**leaderboard_scores**
- Tracks user scores and streaks
- Indexed for fast ranking queries

### Functions

**get_leaderboard(limit_count)**
- Returns top N users by score

**get_user_rank(user_fid)**
- Returns specific user's rank and stats

**update_leaderboard_score()**
- Trigger function for automatic updates

## Customization

### Change Refresh Rate

Edit `leaderboard.html`:
```javascript
setInterval(loadLeaderboard, 60000); // 60 seconds
```

### Change Display Limit

```javascript
const data = await leaderboardManager.getLeaderboard(50); // Top 50
```

### Custom Styling

Edit CSS in `leaderboard.html` `<style>` section.

## Security

- ✅ Input validation (name, description length)
- ✅ File size validation (max 1MB)
- ✅ File type validation (PNG, JPG, GIF)
- ✅ Row Level Security (RLS) enabled
- ✅ CORS configured
- ✅ No sensitive data exposed

## Performance

- Client-side caching (30s)
- Database indexes on score columns
- Automatic aggregation via triggers
- Efficient ranking queries

## Troubleshooting

### Leaderboard Empty
- Verify votes are being cast
- Check Supabase logs
- Ensure trigger is active

### Scores Not Updating
- Wait for auto-refresh (30s)
- Check votes table in Supabase
- Verify trigger function works

### Configuration Not Saving
- Check browser console
- Verify Supabase credentials
- Ensure input length limits met

## Requirements

- Supabase account
- Vercel deployment
- Main voting app already set up
- Environment variables configured:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android)

## Future Enhancements

- [ ] Weekly/monthly leaderboards
- [ ] Achievement badges
- [ ] Social sharing
- [ ] Historical archives
- [ ] User profiles
- [ ] Vote power multipliers
- [ ] Category leaderboards

## Support

- Documentation: `docs/LEADERBOARD_SETUP.md`
- Quick Start: `docs/LEADERBOARD_QUICKSTART.md`
- Main README: `README.md`

## License

MIT License - Same as main ZABAL Live Hub project

---

**Built with ❤️ for the ZABAL community**
