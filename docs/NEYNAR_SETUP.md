# Neynar Notifications Setup Guide

## 🎯 Overview

We're using Neynar's managed notification service instead of custom webhooks. This is **much simpler** and recommended by Farcaster.

---

## 📋 Setup Steps

### **Step 1: Sign Up for Neynar**

1. Go to https://neynar.com
2. Sign up for a free account
3. Go to https://dev.neynar.com/app
4. Create a new app or select existing
5. Copy your **Client ID** (looks like: `abc123-def456-ghi789`)

---

### **Step 2: Get Your Webhook URL**

Your Neynar webhook URL format:
```
https://api.neynar.com/f/app/<YOUR_CLIENT_ID>/event
```

Example:
```
https://api.neynar.com/f/app/abc123-def456-ghi789/event
```

---

### **Step 3: Update Farcaster Manifest**

Edit `.well-known/farcaster.json`:

```json
{
  "frame": {
    "webhookUrl": "https://api.neynar.com/f/app/<YOUR_CLIENT_ID>/event"
  }
}
```

**Replace `<YOUR_CLIENT_ID>` with your actual client ID from Step 1.**

---

### **Step 4: Add Environment Variables to Vercel**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
NEYNAR_API_KEY=<your_neynar_api_key>
CRON_SECRET=<your_existing_cron_secret>
```

Get your Neynar API key from: https://dev.neynar.com/app → API Keys

---

### **Step 5: Deploy**

```bash
git add -A
git commit -m "feat: switch to Neynar managed notifications"
git push origin main
```

---

## 🧪 Testing

### **Test Notification API:**
```bash
curl -X POST https://zabal.art/api/send-notification-neynar \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🧪 Test Notification",
    "body": "Testing Neynar notifications!",
    "targetUrl": "https://zabal.art"
  }'
```

### **Test in Warpcast:**
1. Open miniapp in Warpcast
2. Click profile icon → Settings
3. Click "Enable" under "🔔 Daily Reminders"
4. Accept the prompt
5. Neynar automatically receives the token
6. Send a test notification via API

---

## 📊 Check Analytics

Go to https://dev.neynar.com/app → Your App → Analytics

You can see:
- Total notifications sent
- Open rates
- Click-through rates
- User engagement

---

## 🎯 How It Works

### **Old Way (Custom Webhooks):**
1. User enables notifications
2. Warpcast sends webhook to YOUR server
3. YOU verify signature
4. YOU extract FID
5. YOU store token in database
6. YOU batch send notifications
7. YOU handle errors

### **New Way (Neynar):**
1. User enables notifications
2. Warpcast sends webhook to NEYNAR
3. NEYNAR handles everything
4. YOU just call simple API to send
5. Done! ✨

---

## 🚀 Sending Notifications

### **Via API (Automated):**
```javascript
// api/send-notification-neynar.js handles this
POST /api/send-notification-neynar
{
  "title": "🗳️ Time to Vote!",
  "body": "Cast your vote for today's stream",
  "targetUrl": "https://zabal.art"
}
```

### **Via Neynar Dev Portal (Manual):**
1. Go to https://dev.neynar.com/app
2. Select your app
3. Click "Send Notification"
4. Fill in title, body, target URL
5. Click "Send"

---

## 🔄 Daily Cron Job

Already configured! Runs at 11 AM EST daily via:
- `api/cron/daily-reminder.js`
- Calls `api/send-notification-neynar.js`
- Sends to all users who enabled notifications

---

## ✅ Benefits

- ✅ **No database needed** - Neynar stores tokens
- ✅ **No webhook server** - Neynar handles it
- ✅ **No signature verification** - Done automatically
- ✅ **Built-in analytics** - Track engagement
- ✅ **Advanced filtering** - Target specific users
- ✅ **Free tier** - Generous limits
- ✅ **Reliable** - Managed by Farcaster team

---

## 🆘 Troubleshooting

**Notifications not working?**
1. Check Neynar API key is correct in Vercel
2. Verify webhook URL in manifest matches your client ID
3. Check Neynar dashboard for errors
4. Make sure users have enabled notifications in Warpcast

**API errors?**
1. Check Neynar API key is valid
2. Verify request format matches documentation
3. Check Vercel function logs

---

## 📚 Resources

- [Neynar Dashboard](https://dev.neynar.com/app)
- [Neynar API Docs](https://docs.neynar.com/)
- [Neynar Notifications Guide](https://docs.neynar.com/docs/send-notifications-to-mini-app-users)

---

**Last Updated:** December 21, 2025
**Status:** Ready to configure
