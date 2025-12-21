// Webhook handler for Farcaster miniapp events
// Receives notification tokens when users enable notifications

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📥 Webhook received:', JSON.stringify(req.body, null, 2));

  try {
    const { event, notificationDetails } = req.body;

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (event) {
      case 'miniapp_added':
        console.log('✅ Miniapp added event');
        
        if (notificationDetails) {
          const { token, url } = notificationDetails;
          const fid = req.body.fid;

          // Store notification token in database
          const { data, error } = await supabase
            .from('notification_tokens')
            .upsert({
              fid: fid,
              token: token,
              notification_url: url,
              enabled: true,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'token'
            });

          if (error) {
            console.error('❌ Error storing token:', error);
            return res.status(500).json({ error: 'Failed to store token' });
          }

          console.log('💾 Stored notification token for FID:', fid);
        }
        break;

      case 'miniapp_removed':
        console.log('🗑️ Miniapp removed event');
        const removeFid = req.body.fid;

        // Mark tokens as disabled
        await supabase
          .from('notification_tokens')
          .update({ enabled: false, updated_at: new Date().toISOString() })
          .eq('fid', removeFid);

        console.log('🔕 Disabled notifications for FID:', removeFid);
        break;

      case 'notifications_enabled':
        console.log('🔔 Notifications enabled event');
        
        if (notificationDetails) {
          const { token, url } = notificationDetails;
          const enableFid = req.body.fid;

          await supabase
            .from('notification_tokens')
            .upsert({
              fid: enableFid,
              token: token,
              notification_url: url,
              enabled: true,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'token'
            });

          console.log('🔔 Enabled notifications for FID:', enableFid);
        }
        break;

      case 'notifications_disabled':
        console.log('🔕 Notifications disabled event');
        const disableFid = req.body.fid;

        await supabase
          .from('notification_tokens')
          .update({ enabled: false, updated_at: new Date().toISOString() })
          .eq('fid', disableFid);

        console.log('🔕 Disabled notifications for FID:', disableFid);
        break;

      default:
        console.log('⚠️ Unknown event type:', event);
    }

    // Always return 200 OK to acknowledge receipt
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
