# Farcaster Notifications Research

## 🔍 Key Findings

### **The Problem with Our Current Implementation:**

1. **Missing Signature Verification** - Webhook events must be verified using `@farcaster/miniapp-node`
2. **Wrong Approach** - We tried to build custom webhook handling without proper verification
3. **Serverless Function Issues** - CommonJS/ES6 module conflicts in Vercel
4. **No FID in Webhook** - Events don't include FID directly, need to extract from signature

---

## ✅ **Correct Implementation (Two Options)**

### **Option 1: Use Neynar Managed Service (RECOMMENDED)**

**Why:** Neynar handles all the complexity for you.

**Steps:**
1. Get Neynar API key from https://neynar.com
2. Set webhook URL to: `https://api.neynar.com/f/app/<your_client_id>/event`
3. Use Neynar API to send notifications (no token storage needed)
4. Neynar automatically handles token management

**Benefits:**
- ✅ No webhook server needed
- ✅ No token storage needed
- ✅ No signature verification needed
- ✅ Analytics built-in
- ✅ Filtering by user cohorts
- ✅ Send via API or dev portal

**Implementation:**
```javascript
// Install Neynar SDK
npm install @neynar/nodejs-sdk

// Send notification
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

await client.publishFrameNotifications({
  targetFids: [], // empty = all users who added app
  notification: {
    title: "🗳️ Time to Vote!",
    body: "Cast your vote for today's ZABAL stream direction",
    target_url: "https://zabal.art"
  }
});
```

---

### **Option 2: Custom Webhook Handler (COMPLEX)**

**Why:** Full control, but requires proper implementation.

**Required:**
1. Install `@farcaster/miniapp-node` package
2. Install `@neynar/nodejs-sdk` for signature verification
3. Verify webhook signatures
4. Store tokens securely
5. Handle all event types correctly

**Implementation:**
```javascript
// Install packages
npm install @farcaster/miniapp-node @neynar/nodejs-sdk

// Webhook handler
import { parseWebhookEvent, verifyAppKeyWithNeynar } from "@farcaster/miniapp-node";

export default async function handler(req, res) {
  try {
    // Verify and parse the webhook event
    const data = await parseWebhookEvent(
      req.body,
      verifyAppKeyWithNeynar(process.env.NEYNAR_API_KEY)
    );
    
    // Extract FID from verified data
    const fid = data.fid;
    
    // Handle different event types
    switch (data.event) {
      case 'miniapp_added':
        if (data.notificationDetails) {
          // Store token in database
          await saveToken(fid, data.notificationDetails.token, data.notificationDetails.url);
        }
        break;
        
      case 'miniapp_removed':
        await deleteToken(fid);
        break;
        
      case 'notifications_enabled':
        await updateToken(fid, data.notificationDetails.token, data.notificationDetails.url);
        break;
        
      case 'notifications_disabled':
        await disableToken(fid);
        break;
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ error: 'Invalid webhook' });
  }
}
```

**Sending Notifications:**
```javascript
// Batch send to all users
const tokens = await getEnabledTokens();

for (const { token, url } of tokens) {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notificationId: `daily-${date}`,
      title: "🗳️ Time to Vote!",
      body: "Cast your vote for today's ZABAL stream direction",
      targetUrl: "https://zabal.art",
      tokens: [token] // Can batch up to 100
    })
  });
}
```

---

## 📋 **What We Did Wrong:**

1. ❌ **No signature verification** - Webhooks weren't verified
2. ❌ **Missing FID extraction** - Didn't get user FID from webhook
3. ❌ **Wrong packages** - Used `@supabase/supabase-js` instead of `@farcaster/miniapp-node`
4. ❌ **Module system issues** - CommonJS vs ES6 conflicts
5. ❌ **No error handling** - Functions failed silently

---

## 🎯 **Recommended Path Forward:**

### **Use Neynar Managed Service**

**Reasons:**
1. **Simpler** - No webhook server to maintain
2. **Reliable** - Neynar handles all edge cases
3. **Analytics** - Built-in tracking
4. **Filtering** - Target specific user cohorts
5. **Free tier** - Available on Neynar free plan

**Steps:**
1. Sign up at https://neynar.com
2. Get your client ID from dashboard
3. Update manifest webhook URL to: `https://api.neynar.com/f/app/<client_id>/event`
4. Install `@neynar/nodejs-sdk`
5. Use API to send notifications (no token management needed)

---

## 📚 **Official Resources:**

- [Farcaster Notifications Guide](https://miniapps.farcaster.xyz/docs/guides/notifications)
- [Neynar Notifications Tutorial](https://docs.neynar.com/docs/send-notifications-to-mini-app-users)
- [Official Demo App](https://github.com/farcasterxyz/frames-v2-demo)
- [Webhook Handler Example](https://github.com/farcasterxyz/frames-v2-demo/blob/main/src/app/api/webhook/route.ts)

---

## 🚀 **Next Steps:**

1. **Sign up for Neynar** (5 minutes)
2. **Update manifest** with Neynar webhook URL
3. **Install Neynar SDK** (`npm install @neynar/nodejs-sdk`)
4. **Create notification API** using Neynar client
5. **Test** with real users in Warpcast
6. **Schedule cron** to send daily at 11 AM EST

---

**Last Updated:** December 21, 2025
**Status:** Ready to implement with Neynar
