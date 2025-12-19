# Farcaster Integration Testing Guide

## 🎯 Features to Test

### 1. Authentication & Profile Display
- [ ] Farcaster SDK loads correctly
- [ ] User authentication works (FID retrieved)
- [ ] Profile picture (pfp) displays in header
- [ ] Username shows as @username
- [ ] FID displays below username
- [ ] Verification badge (✓) shows for verified users
- [ ] Profile badge is responsive on mobile
- [ ] Splash screen hides after SDK ready

**How to Test:**
1. Open app in Farcaster Mini App
2. Check header for profile badge
3. Verify pfp, username, FID display
4. Check if verification badge appears (if verified)
5. Test on mobile viewport

**Expected Behavior:**
- Profile badge shows: [PFP] @username ✓ / FID: 12345
- Splash screen disappears immediately
- Profile is visible and properly styled

---

### 2. Voting with Farcaster FID
- [ ] Vote button works
- [ ] Vote is recorded with correct FID
- [ ] Vote confirmation banner appears
- [ ] Personal stats update after vote
- [ ] Can only vote once per day
- [ ] Vote persists in database

**How to Test:**
1. Click vote button on any mode
2. Check console for vote recording
3. Verify confirmation banner appears
4. Check personal stats update
5. Try voting again (should be prevented)

**Expected Behavior:**
- Vote recorded with user's FID
- Confirmation: "✓ Voted for [Mode]!"
- Stats increment (total votes, streak)
- Second vote attempt shows "already voted"

---

### 3. Share Modal & Content
- [ ] Share modal opens after voting
- [ ] Vote standings display correctly
- [ ] Visual progress bars render (█ blocks)
- [ ] Percentages calculate correctly
- [ ] Leader gets crown emoji (👑)
- [ ] Personalized message based on vote
- [ ] Milestone detection works (10, 25, 50, 100, etc.)

**How to Test:**
1. Vote on any mode
2. Check share modal appears
3. Verify standings show all 4 modes
4. Check progress bars and percentages
5. Verify leader has crown
6. Vote for leader vs non-leader (different messages)
7. Test at milestone vote counts

**Expected Behavior:**
```
🎬 Studio: 5 ███ 50% 👑
🛒 Market: 3 ██ 30%
🌐 Social: 1 █ 10%
⚔️ Battle: 1 █ 10%
Total: 10 votes
```

**Message Variations:**
- Leading: "Just voted 🎬 STUDIO - and we're LEADING! 👑"
- Not leading: "Voted 🎬 STUDIO on ZABAL! 🎨"
- Milestone: "🎉 Milestone: 50 total votes!"

---

### 4. Share to Farcaster
- [ ] "Share to Farcaster" button works
- [ ] Compose cast opens with correct text
- [ ] Mini app URL embedded
- [ ] Posts to /zao channel
- [ ] Modal closes after share (manual)
- [ ] Modal stays open (auto-share)

**How to Test:**
1. Click "🟣 Share to Farcaster" button
2. Verify compose cast opens
3. Check text includes standings and bars
4. Verify embed shows miniapp URL
5. Check channel is set to /zao
6. Share and verify modal behavior

**Expected Behavior:**
- Compose cast opens with pre-filled text
- Text includes visual bars and percentages
- Embed: https://zabal.art/live.html
- Channel: /zao
- Manual share closes modal

---

### 5. Auto-Share Preferences
- [ ] Settings section displays in modal
- [ ] Toggle switches work
- [ ] Settings save to localStorage
- [ ] Auto-share triggers after vote
- [ ] "Share only when leading" works
- [ ] Milestone celebrations work
- [ ] Settings persist across sessions

**How to Test:**
1. Open share modal
2. Toggle each setting on/off
3. Verify toggles turn yellow when active
4. Close and reopen modal (settings persist)
5. Enable auto-share and vote
6. Enable "share only when leading" and vote for non-leader
7. Vote at milestone with setting enabled

**Expected Behavior:**
- Toggles switch smoothly
- Yellow = active, gray = inactive
- Settings saved to localStorage
- Auto-share triggers 1s after vote
- "Share only when leading" prevents share if not winning
- Milestone share triggers at 10, 25, 50, 100, 250, 500

---

### 6. Personal Stats Integration
- [ ] Stats section shows after authentication
- [ ] Total votes increments
- [ ] Day streak calculates correctly
- [ ] Favorite mode updates
- [ ] Vote power displays
- [ ] Stats persist across sessions

**How to Test:**
1. Vote multiple times (different days)
2. Check stats update
3. Vote for same mode multiple times
4. Verify favorite mode updates
5. Refresh page and check persistence

**Expected Behavior:**
- Total votes: increments with each vote
- Day streak: consecutive voting days
- Favorite mode: most voted mode
- Vote power: 1x (base)

---

## 🐛 Known Issues to Check

1. **Profile Picture Loading**
   - Does pfp load from Farcaster?
   - Fallback if pfp fails to load?

2. **Verification Badge**
   - Does it check both `verified` and `verifications[]`?
   - Badge only shows for verified users?

3. **Share Content**
   - Do progress bars render correctly?
   - Are percentages accurate?
   - Does leader detection work?

4. **Auto-Share Logic**
   - Does it respect all preference combinations?
   - Does it trigger at correct time?
   - Does it handle errors gracefully?

5. **Mobile Responsiveness**
   - Profile badge readable on mobile?
   - Share modal scrollable?
   - Settings toggles work on touch?

---

## 📊 Test Scenarios

### Scenario 1: First-Time User
1. Open app in Farcaster
2. Verify profile loads
3. Vote on a mode
4. Check share modal
5. Enable auto-share
6. Vote next day

### Scenario 2: Returning User
1. Open app (settings should persist)
2. Check stats from previous votes
3. Vote with auto-share enabled
4. Verify streak increments

### Scenario 3: Milestone Vote
1. Vote when total is at 49
2. Next vote should trigger milestone (50)
3. Check special milestone message

### Scenario 4: Leader vs Non-Leader
1. Vote for leading mode
2. Check message: "we're LEADING! 👑"
3. Vote for non-leading mode
4. Check message: "Join the vote! 👇"

---

## ✅ Success Criteria

All features should:
- Work in Farcaster Mini App environment
- Handle errors gracefully
- Provide clear user feedback
- Persist data correctly
- Be mobile-responsive
- Load quickly (<3s)

---

## 🔧 Debugging Tools

**Console Logs to Check:**
- `✅ Farcaster user authenticated`
- `✅ Vote recorded`
- `✅ Vote shared to Farcaster`
- `📝 Share preference updated`
- `🔄 Auto-sharing vote...`

**LocalStorage Keys:**
- `sharePreferences`
- `userFID` (fallback mode)

**Network Requests:**
- Supabase vote insert
- Supabase stats query
- Farcaster SDK calls

---

## 📝 Testing Notes

Date: ___________
Tester: ___________

| Feature | Status | Notes |
|---------|--------|-------|
| Profile Display | ⬜ | |
| Voting | ⬜ | |
| Share Modal | ⬜ | |
| Share Content | ⬜ | |
| Auto-Share | ⬜ | |
| Settings | ⬜ | |
| Stats | ⬜ | |
| Mobile | ⬜ | |

**Issues Found:**
1. 
2. 
3. 

**Recommendations:**
1. 
2. 
3.
