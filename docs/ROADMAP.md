# ZABAL Miniapp Development Roadmap

## 🎯 Current Status (Completed)
- ✅ Professional toast notification system
- ✅ Optimized performance (30s vote refresh)
- ✅ Fixed splash screen handling
- ✅ Validated Farcaster manifest (100%)
- ✅ Social sharing with friend tagging (up to 50 friends, 10 max tags)
- ✅ Comprehensive console logging for debugging
- ✅ Works in Farcaster Debug Tool

---

## 📱 Phase 1: Farcaster Push Notifications

### Overview
Send push notifications to users when:
- Voting opens (stream state changes to DECIDING)
- Stream goes live
- Vote results are in
- Daily reminders to vote

### Technical Requirements

#### 1. Backend Setup (Vercel Serverless Functions)
**File: `/api/webhook.js`**
- Receive webhook events from Farcaster
- Store notification tokens in database
- Handle `miniapp_added`, `miniapp_removed`, `notifications_enabled`, `notifications_disabled` events

**File: `/api/send-notification.js`**
- Send notifications to users
- Batch up to 100 users per request
- Handle rate limits (1 per 30s, 100 per day per user)

#### 2. Database Schema (Supabase)
```sql
-- Notification tokens table
CREATE TABLE notification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fid INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  notification_url TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification history (for analytics)
CREATE TABLE notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id TEXT NOT NULL,
  fid INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  clicked BOOLEAN DEFAULT false
);
```

#### 3. Frontend Changes
**File: `index.html`**
- Add "Enable Notifications" button
- Call `sdk.actions.addMiniApp()` to prompt user
- Show notification preferences in UI

#### 4. Notification Types

**Voting Opens:**
```javascript
{
  notificationId: `voting-open-${date}`,
  title: "🗳️ Voting is Open!",
  body: "Cast your vote for today's ZABAL stream direction",
  targetUrl: "https://zabal.art"
}
```

**Stream Live:**
```javascript
{
  notificationId: `stream-live-${timestamp}`,
  title: "🔴 ZABAL is LIVE!",
  body: "Your vote counted! Stream is live now",
  targetUrl: "https://zabal.art"
}
```

**Vote Results:**
```javascript
{
  notificationId: `results-${date}`,
  title: "📊 Vote Results Are In!",
  body: "Studio Mode won with 45% of votes",
  targetUrl: "https://zabal.art"
}
```

### Implementation Steps
1. ✅ Already have `webhookUrl` in manifest
2. Create `/api/webhook.js` to receive events
3. Set up Supabase tables for tokens
4. Create `/api/send-notification.js` for sending
5. Add "Enable Notifications" UI to miniapp
6. Test with Farcaster Debug Tool
7. Deploy and monitor

### Resources
- [Farcaster Notifications Guide](https://miniapps.farcaster.xyz/docs/guides/notifications)
- [Neynar Managed Notifications](https://docs.neynar.com/docs/send-notifications-to-mini-app-users)
- [Example Implementation](https://github.com/farcasterxyz/frames-v2-demo)

---

## 🎛️ Phase 2: Admin Dashboard

### Overview
A secure admin panel to:
- View real-time voting stats
- Send manual notifications
- Manage stream state
- View user engagement metrics
- Export data

### Features

#### 1. Authentication
- Admin login with password
- JWT token for session
- Protected routes

#### 2. Dashboard Pages

**Main Dashboard (`/admin/index.html`)**
- Live vote counts (real-time)
- Total voters today
- Vote distribution chart
- Recent votes list
- Stream state controls

**Notifications Panel (`/admin/notifications.html`)**
- Send custom notification to all users
- Schedule notifications
- View notification history
- See delivery rates
- Test notifications

**Analytics (`/admin/analytics.html`)**
- Daily vote trends (chart)
- User retention metrics
- Most active voters
- Share rate statistics
- Friend tagging analytics

**Users (`/admin/users.html`)**
- List all voters
- Search by FID/username
- View user vote history
- See notification preferences
- Export user data

#### 3. API Endpoints

**File: `/api/admin/stats.js`**
```javascript
// GET /api/admin/stats
// Returns: current votes, total voters, trends
```

**File: `/api/admin/send-notification.js`**
```javascript
// POST /api/admin/send-notification
// Body: { title, body, targetUrl, userFids? }
// Sends to all or specific users
```

**File: `/api/admin/stream-state.js`**
```javascript
// POST /api/admin/stream-state
// Body: { state: 'DECIDING' | 'LOCKED' | 'LIVE' }
// Updates stream state
```

**File: `/api/admin/export.js`**
```javascript
// GET /api/admin/export?type=votes|users|notifications
// Returns CSV download
```

#### 4. Tech Stack
- **Frontend:** HTML/CSS/JS (keep it simple, match main app style)
- **Charts:** Chart.js for visualizations
- **Auth:** Simple JWT with bcrypt password
- **Real-time:** Supabase real-time subscriptions

### Security
- Password-protected (env variable)
- Rate limiting on admin endpoints
- CORS restrictions
- Audit log for admin actions

### UI Design
- Match ZABAL brand colors
- Responsive (desktop-first)
- Dark theme
- Toast notifications for actions

---

## 🚀 Phase 3: Advanced Features (Future)

### 1. Leaderboards
- Top voters (most consistent)
- Prediction accuracy (vote with winner)
- Share champions (most shares)

### 2. Rewards System
- NFT badges for milestones
- Points for voting
- Special perks for top voters

### 3. Polls & Surveys
- Quick polls during stream
- Feedback collection
- Community suggestions

### 4. Integration Improvements
- Twitch API integration (auto-detect live)
- Discord webhook for votes
- Twitter/X auto-posts

---

## 📋 Implementation Priority

### High Priority (Next 1-2 weeks)
1. **Notifications System** - Critical for user retention
2. **Basic Admin Dashboard** - Essential for management

### Medium Priority (2-4 weeks)
3. **Analytics Dashboard** - Important for insights
4. **Notification Scheduling** - Automate daily reminders

### Low Priority (1-2 months)
5. **Leaderboards** - Nice to have
6. **Rewards System** - Future growth

---

## 🛠️ Development Setup

### Environment Variables Needed
```bash
# .env
SUPABASE_URL=https://cbtvnuklqwdkpyeioafb.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc... # For admin operations
ADMIN_PASSWORD_HASH=bcrypt_hash_here
JWT_SECRET=random_secret_here
NEYNAR_API_KEY=15CC284E-9C7E-44C8-9D32-BC82D3C05320
```

### File Structure
```
/api
  /admin
    stats.js
    send-notification.js
    stream-state.js
    export.js
  webhook.js
  send-notification.js
  neynar.js (existing)

/admin
  index.html
  notifications.html
  analytics.html
  users.html
  login.html
  admin.css
  admin.js

index.html (existing)
submissions.html (existing)
gallery.html (existing)
```

---

## 📊 Success Metrics

### Notifications
- Opt-in rate: Target 60%+
- Click-through rate: Target 30%+
- Daily active users: Track growth

### Admin Dashboard
- Time saved managing votes
- Faster response to issues
- Better data-driven decisions

---

## 🎯 Next Immediate Steps

1. **Research Neynar Managed Notifications** (easiest path)
   - Sign up for Neynar account
   - Use their API for notifications
   - Avoid building webhook server initially

2. **Create Basic Admin Dashboard**
   - Start with `/admin/index.html`
   - Add authentication
   - Show real-time vote stats

3. **Test Notifications**
   - Use Farcaster Debug Tool
   - Send test notification
   - Verify delivery

---

## 📚 Resources

- [Farcaster Miniapps Docs](https://miniapps.farcaster.xyz/)
- [Neynar API Docs](https://docs.neynar.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Chart.js](https://www.chartjs.org/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

---

**Last Updated:** December 21, 2025
**Status:** Phase 1 (Notifications) - Ready to Start
