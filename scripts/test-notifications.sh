#!/bin/bash

echo "🧪 Testing ZABAL Notification System"
echo "======================================"
echo ""

# Test 1: Webhook endpoint
echo "📥 Test 1: Testing webhook endpoint..."
echo "Sending test notification token..."
curl -X POST https://zabal.art/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "miniapp_added",
    "fid": 19640,
    "notificationDetails": {
      "token": "test_token_'$(date +%s)'",
      "url": "https://api.warpcast.com/v1/frame-notifications"
    }
  }'

echo ""
echo ""
echo "✅ Check Supabase notification_tokens table for new row with FID 19640"
echo ""
echo "======================================"
echo ""

# Test 2: Send notification endpoint
echo "📤 Test 2: Testing send notification endpoint..."
echo "Sending test notification..."
curl -X POST https://zabal.art/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "notificationId": "test-notification-'$(date +%s)'",
    "title": "🧪 Test Notification",
    "body": "This is a test notification from ZABAL!",
    "targetUrl": "https://zabal.art"
  }'

echo ""
echo ""
echo "✅ Check Supabase notification_history table for sent notifications"
echo ""
echo "======================================"
echo ""

# Test 3: Cron endpoint (requires CRON_SECRET)
echo "⏰ Test 3: Testing cron endpoint..."
echo "Note: This requires CRON_SECRET from your .env"
echo ""
echo "Run this command manually with your CRON_SECRET:"
echo ""
echo 'curl -X POST https://zabal.art/api/cron/daily-reminder \'
echo '  -H "Authorization: Bearer YOUR_CRON_SECRET"'
echo ""
echo "======================================"
echo ""

echo "🎉 Tests complete!"
echo ""
echo "Next steps:"
echo "1. Check Supabase tables for test data"
echo "2. Enable notifications in Warpcast miniapp"
echo "3. Wait for 11 AM EST tomorrow for real notification"
