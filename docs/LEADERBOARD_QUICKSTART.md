# Leaderboard Quick Start Guide

Get your ZABAL Leaderboard up and running in 5 minutes!

## Prerequisites

- Supabase project already set up for ZABAL voting app
- Main voting schema (`supabase-schema-fid.sql`) already deployed
- Vercel deployment configured

## Quick Setup (5 Steps)

### 1. Run Database Schema (2 minutes)

1. Open Supabase SQL Editor
2. Copy contents of `database/leaderboard-schema.sql`
3. Paste and run the SQL
4. Verify success message appears

### 2. Deploy to Vercel (1 minute)

The API endpoint deploys automatically with your existing Vercel setup:

```bash
vercel --prod
```

Or push to your connected Git repository for automatic deployment.

### 3. Access Leaderboard (30 seconds)

Navigate to:
```
https://your-domain.com/leaderboard.html
```

### 4. Configure (1 minute)

On the leaderboard page:
1. Enter leaderboard name (e.g., "ZABAL Voters")
2. Enter description (e.g., "Top daily voters")
3. Optionally upload an icon
4. Click "Save Configuration"

### 5. Test (30 seconds)

1. Cast a vote in the main app
2. Refresh leaderboard page
3. See your score appear!

## That's It! 🎉

Your leaderboard is now live and will automatically track all votes.

## Key Features

- ✅ **1 point per vote per day** - Automatic scoring
- ✅ **Streak tracking** - Consecutive voting days
- ✅ **Auto-refresh** - Updates every 30 seconds
- ✅ **Top 100** - Shows top 100 voters
- ✅ **Medals** - 🥇🥈🥉 for top 3

## API Endpoint

Your leaderboard API is available at:
```
https://your-domain.com/api/leaderboard
```

Returns JSON with:
- `address` - User FID as string
- `fid` - User FID as integer
- `username` - Farcaster username
- `score` - Total votes
- `streak` - Consecutive days
- `rank` - Leaderboard position

## Example API Response

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

## Troubleshooting

**Leaderboard empty?**
- Make sure votes are being cast in the main app
- Check Supabase logs for errors
- Verify trigger is active in database

**Configuration not saving?**
- Check browser console for errors
- Verify Supabase credentials in environment variables
- Ensure name ≤ 20 chars and description ≤ 80 chars

**Scores not updating?**
- Refresh the page (auto-refresh is every 30s)
- Check that votes are being recorded in Supabase
- Verify the trigger function is working

## Next Steps

- Customize styling in `leaderboard.html`
- Share leaderboard link with community
- Monitor top voters and engagement
- Consider adding rewards for top voters

## Need More Help?

See full documentation: `docs/LEADERBOARD_SETUP.md`

---

**Happy voting! 🗳️**
