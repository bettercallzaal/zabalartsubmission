# Notifications Setup Guide

## 🎯 Overview
Daily notifications will be sent at **11 AM EST (4 PM UTC)** to remind users to vote.

## 📋 Setup Steps

### 1. Database Setup (Supabase)

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor:
```bash
# Tables created:
- notification_tokens (stores user notification tokens)
- notification_history (tracks sent notifications)
```

### 2. Environment Variables

Add to Vercel Environment Variables:
```bash
SUPABASE_URL=https://cbtvnuklqwdkpyeioafb.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here  # Get from Supabase Settings
CRON_SECRET=generate_random_secret_here     # For cron job security
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "feat: add daily notifications at 11 AM EST"
git push origin main
```

Vercel will automatically:
- Deploy the webhook handler (`/api/webhook.js`)
- Deploy the send notification API (`/api/send-notification.js`)
- Deploy the cron job (`/api/cron/daily-reminder.js`)
- Schedule the cron to run at 11 AM EST daily

### 4. Update Farcaster Manifest

Your manifest already has `webhookUrl: "https://zabal.art/api/webhook"` ✅

### 5. Test the Flow

#### Test Webhook (Manual):
```bash
curl -X POST https://zabal.art/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "miniapp_added",
    "fid": 19640,
    "notificationDetails": {
      "token": "test_token_123",
      "url": "https://api.warpcast.com/v1/frame-notifications"
    }
  }'
```

#### Test Notification Send (Manual):
```bash
curl -X POST https://zabal.art/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "notificationId": "test-notification",
    "title": "🗳️ Test Notification",
    "body": "This is a test notification",
    "targetUrl": "https://zabal.art"
  }'
```

#### Test Cron Job (Manual):
```bash
curl -X POST https://zabal.art/api/cron/daily-reminder \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 6. User Flow

1. User opens miniapp in Warpcast
2. User clicks profile icon → Settings dropdown
3. User clicks "Enable" under "🔔 Daily Reminders"
4. Warpcast prompts to add miniapp
5. User accepts → notification token sent to webhook
6. Token stored in database
7. Every day at 11 AM EST, cron job runs
8. Notification sent to all enabled users

## 📱 Notification Content

**Daily Reminder (11 AM EST):**
```
Title: 🗳️ Time to Vote!
Body: Cast your vote for today's ZABAL stream direction. Voting closes soon!
```

## 🔍 Monitoring

### Check Notification Tokens:
```sql
SELECT fid, enabled, created_at 
FROM notification_tokens 
WHERE enabled = true;
```

### Check Notification History:
```sql
SELECT notification_id, COUNT(*) as sent_count, sent_at
FROM notification_history
GROUP BY notification_id, sent_at
ORDER BY sent_at DESC
LIMIT 10;
```

### Vercel Logs:
- Go to Vercel Dashboard → Your Project → Logs
- Filter by `/api/cron/daily-reminder` to see cron execution
- Filter by `/api/webhook` to see incoming events

## ⚠️ Important Notes

1. **Rate Limits:** Warpcast limits to:
   - 1 notification per 30 seconds per user
   - 100 notifications per day per user

2. **Deduplication:** Use unique `notificationId` per day:
   - Format: `daily-voting-reminder-YYYY-MM-DD`
   - Prevents duplicate notifications within 24 hours

3. **Cron Schedule:** `0 16 * * *` = 4 PM UTC = 11 AM EST
   - Adjust if daylight saving time changes

4. **Production Only:** `addMiniApp()` only works on production domain
   - Won't work with localhost or ngrok during development

## 🚀 Future Enhancements

- **Stream Live Notification:** Send when stream goes live
- **Vote Results:** Send when voting closes with results
- **Milestone Notifications:** Send on 100th, 500th vote
- **Personalized Timing:** Let users choose notification time

## 📊 Success Metrics

Track in `notification_history` table:
- Opt-in rate (users who enable notifications)
- Click-through rate (users who click notifications)
- Daily active users (users who vote after notification)

## 🐛 Troubleshooting

**Notifications not sending:**
1. Check Supabase has notification tokens
2. Check Vercel cron logs for errors
3. Verify CRON_SECRET matches in env vars
4. Check notification_url is valid

**Webhook not receiving events:**
1. Verify webhookUrl in manifest matches deployed URL
2. Check Vercel function logs for incoming requests
3. Test with curl command above

**Users not receiving notifications:**
1. Verify user has enabled notifications in Warpcast
2. Check notification token is in database and enabled=true
3. Verify notification_url is correct for that user
4. Check rate limits haven't been exceeded

## 📚 Resources

- [Farcaster Notifications Docs](https://miniapps.farcaster.xyz/docs/guides/notifications)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Supabase Docs](https://supabase.com/docs)
