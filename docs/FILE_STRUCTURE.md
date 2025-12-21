# ZABAL Miniapp File Structure

## 📁 Root Directory
```
/
├── index.html              # Main voting hub page
├── submissions.html        # Submission form page
├── gallery.html           # Gallery/research page
├── vercel.json            # Vercel deployment config
├── .env                   # Environment variables (gitignored)
├── .env.example           # Example env vars
└── .gitignore            # Git ignore rules
```

## 📁 `/api` - Serverless Functions
```
/api
├── neynar.js              # Neynar API proxy
├── webhook.js             # Farcaster notification webhook
├── send-notification.js   # Send notifications to users
└── /cron
    └── daily-reminder.js  # Daily 11 AM EST notification cron
```

## 📁 `/assets` - Images & Media
```
/assets
├── logo.png              # ZABAL logo
├── preview.png           # OG preview image
└── splash.png            # Miniapp splash screen
```

## 📁 `/docs` - Documentation
```
/docs
├── README.md                    # Main documentation
├── ROADMAP.md                   # Development roadmap
├── DEPLOYMENT.md                # Deployment guide
├── NOTIFICATIONS_SETUP.md       # Notification system setup
├── LEADERBOARD_API.md          # Leaderboard API docs
├── FARCASTER_ECOSYSTEM.md      # Farcaster integration guide
├── FARCASTER_TESTING.md        # Testing guide
├── VIRAL_FEATURES.md           # Viral features documentation
└── FILE_STRUCTURE.md           # This file
```

## 📁 `/database` - SQL Schemas
```
/database
├── supabase-schema.sql         # Notification tables schema
└── supabase-schema-fid.sql     # Main voting schema
```

## 📁 `/scripts` - Utility Scripts
```
/scripts
└── test-notifications.sh       # Test notification system
```

## 📁 `/.well-known` - Farcaster Manifest
```
/.well-known
└── farcaster.json             # Farcaster miniapp manifest
```

## 📁 `/public` - Static Assets (if needed)
```
/public
└── (future static files)
```

---

## 🔑 Key Files Explained

### **index.html**
Main voting interface where users:
- Vote for stream modes (Studio, Market, Social, Battle)
- See real-time vote counts
- Enable notifications
- Share votes to Farcaster
- Tag friends

### **api/webhook.js**
Receives events from Farcaster when users:
- Add the miniapp
- Enable/disable notifications
- Remove the miniapp

Stores notification tokens in Supabase.

### **api/send-notification.js**
Sends push notifications to users.
- Batches up to 100 users per request
- Logs to notification_history table
- Rate limited by Farcaster

### **api/cron/daily-reminder.js**
Scheduled function that runs daily at 11 AM EST.
Sends "Time to Vote!" notifications to all enabled users.

### **.well-known/farcaster.json**
Farcaster miniapp manifest containing:
- App metadata (name, icon, description)
- Splash screen configuration
- Webhook URL for notifications
- Domain verification signature

---

## 🚀 Deployment Structure

**Vercel automatically deploys:**
- HTML files as static pages
- `/api/*` as serverless functions
- `/assets/*` as static assets
- `/.well-known/*` as static files

**Environment Variables (Vercel):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `CRON_SECRET`

---

## 📊 Database Tables (Supabase)

**Voting System:**
- `votes` - Individual votes
- `mode_votes_daily` - Daily vote totals
- `vote_power_cache` - User voting power

**Notification System:**
- `notification_tokens` - User notification tokens
- `notification_history` - Sent notification log

---

## 🔄 File Organization Benefits

1. **Cleaner root** - Only essential files visible
2. **Logical grouping** - Related files together
3. **Easier navigation** - Find files faster
4. **Better git diffs** - Changes easier to track
5. **Professional structure** - Industry standard layout

---

**Last Updated:** December 21, 2025
