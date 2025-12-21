// Send notifications to users
// Can be called manually or by scheduled function

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📤 Sending notification...');

  try {
    const { notificationId, title, body, targetUrl, fids } = req.body;

    // Validate required fields
    if (!notificationId || !title || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get notification tokens
    let query = supabase
      .from('notification_tokens')
      .select('fid, token, notification_url')
      .eq('enabled', true);

    // Filter by specific FIDs if provided
    if (fids && fids.length > 0) {
      query = query.in('fid', fids);
    }

    const { data: tokens, error: fetchError } = await query;

    if (fetchError) {
      console.error('❌ Error fetching tokens:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch tokens' });
    }

    if (!tokens || tokens.length === 0) {
      console.log('⚠️ No enabled notification tokens found');
      return res.status(200).json({ 
        success: true, 
        sent: 0,
        message: 'No users to notify' 
      });
    }

    console.log(`📱 Sending to ${tokens.length} users...`);

    // Group tokens by notification URL (batch up to 100 per URL)
    const urlGroups = {};
    tokens.forEach(token => {
      if (!urlGroups[token.notification_url]) {
        urlGroups[token.notification_url] = [];
      }
      urlGroups[token.notification_url].push(token.token);
    });

    // Send notifications in batches
    let totalSent = 0;
    const errors = [];

    for (const [url, tokenList] of Object.entries(urlGroups)) {
      // Batch in groups of 100 (Farcaster limit)
      for (let i = 0; i < tokenList.length; i += 100) {
        const batch = tokenList.slice(i, i + 100);

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              notificationId,
              title,
              body,
              targetUrl: targetUrl || 'https://zabal.art',
              tokens: batch
            })
          });

          if (response.ok) {
            totalSent += batch.length;
            console.log(`✅ Sent batch of ${batch.length} notifications`);
          } else {
            const errorText = await response.text();
            console.error(`❌ Failed to send batch:`, errorText);
            errors.push({ batch: i, error: errorText });
          }
        } catch (error) {
          console.error(`❌ Error sending batch:`, error);
          errors.push({ batch: i, error: error.message });
        }
      }
    }

    // Log to notification history
    const historyRecords = tokens.map(token => ({
      notification_id: notificationId,
      fid: token.fid,
      title,
      body,
      sent_at: new Date().toISOString()
    }));

    await supabase
      .from('notification_history')
      .insert(historyRecords);

    console.log(`📊 Sent ${totalSent} notifications`);

    return res.status(200).json({
      success: true,
      sent: totalSent,
      total: tokens.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Send notification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
