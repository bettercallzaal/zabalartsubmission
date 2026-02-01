# Voting Flow Streamlining & Weekly Schedule Migration

## Changes Overview

### 1. Instant Voting (No Submit Button)
- **Before:** Click mode → Click submit button → Vote recorded
- **After:** Click mode → Vote instantly recorded

### 2. Weekly Schedule (Monday 5pm)
- **Before:** Daily voting, resets every UTC day
- **After:** Weekly voting, opens Monday 5pm ET, one vote per week

### 3. UI Changes
- Remove submit button entirely
- Update all "daily" references to "weekly"
- Show "You voted this week" instead of "today"
- Display next Monday 5pm countdown

---

## Implementation Steps

### Step 1: Database Migration
Run `/database/weekly-voting-migration.sql` in Supabase SQL Editor

This creates:
- `get_current_voting_week()` - Returns Monday of current week
- `upsert_weekly_vote()` - Replaces daily vote function
- `has_voted_this_week()` - Check if user voted this week
- `get_this_weeks_votes()` - Get vote counts for current week
- Weekly unique constraint on votes table

### Step 2: Frontend Changes

#### A. Remove Submit Button UI
Delete lines in index.html:
- Lines 3549-3554 (submit button container)
- All `updateSubmitButton()` function calls
- `submitVotes()` function (lines 6076-6138)

#### B. Make Mode Cards Instant Vote
Change mode card onclick from:
```html
<div class="mode-card" onclick="selectMode('studio')">
```

To:
```html
<div class="mode-card" onclick="vote('studio')">
```

#### C. Update Vote Function
Change `upsert_daily_vote` RPC call to `upsert_weekly_vote`:
```javascript
const { data, error } = await supabase.rpc('upsert_weekly_vote', {
    p_fid: validatedFID,
    p_mode: mode
});
```

#### D. Update Text References
Replace all instances:
- "daily" → "weekly"
- "today" → "this week"
- "Day Streak" → "Week Streak"
- "Vote Today" → "Vote This Week"
- "Voted Today" → "Voted This Week"

#### E. Update Vote Checking
Change from:
```javascript
localStorage.getItem('daily_voted_today')
```

To:
```javascript
localStorage.getItem('weekly_voted_this_week')
```

And check against Monday of current week instead of UTC date.

### Step 3: API Updates

Update `/api/vote.js` and related endpoints to use:
- `has_voted_this_week()` instead of `has_voted_today()`
- `get_this_weeks_votes()` instead of `get_todays_votes()`

### Step 4: Voting Schedule Logic

Add function to check if voting is open (Monday 5pm ET):
```javascript
function isVotingOpen() {
    const now = new Date();
    const et = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const dayOfWeek = et.getDay(); // 0 = Sunday, 1 = Monday
    const hour = et.getHours();
    
    // Voting opens Monday 5pm ET
    // Closes before stream (you can set specific time)
    if (dayOfWeek === 1 && hour >= 17) {
        return true;
    }
    
    // Open Tuesday-Sunday until stream
    if (dayOfWeek > 1) {
        return true;
    }
    
    return false;
}
```

---

## Testing Checklist

- [ ] Database migration runs without errors
- [ ] Clicking mode card instantly records vote
- [ ] Submit button is removed from UI
- [ ] "Voted This Week" status shows correctly
- [ ] Can only vote once per week (Monday-Sunday)
- [ ] Leaderboard updates with weekly vote counts
- [ ] Streak counts weeks, not days
- [ ] All "daily" text changed to "weekly"
- [ ] Vote power calculation still works
- [ ] Share functionality still works
- [ ] Change vote functionality works

---

## Rollback Plan

If issues occur:
1. Restore old database functions from backup
2. Revert frontend changes via git
3. Clear localStorage for all users
4. Announce temporary return to daily voting

---

## User Communication

Announce changes:
- "🎉 New: Instant voting! Just click your choice."
- "📅 Weekly streams: Vote opens Monday 5pm ET"
- "🔥 Streaks now count weeks, not days"
- "⚡ Your votes carry more weight with weekly format"
