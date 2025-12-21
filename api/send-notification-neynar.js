// Send notifications using Neynar managed service
// Much simpler - no token storage, no webhook handling needed

const { NeynarAPIClient } = require('@neynar/nodejs-sdk');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📤 Sending notification via Neynar...');

  try {
    const { title, body, targetUrl, targetFids } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({ error: 'Missing required fields: title, body' });
    }

    // Initialize Neynar client
    const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

    // Send notification using Neynar Frame API
    const response = await client.publishFrameNotification({
      target_fids: targetFids || [], // empty array = all users
      notification: {
        title: title,
        body: body,
        target_url: targetUrl || 'https://zabal.art'
      }
    });

    console.log('✅ Notification sent via Neynar:', response);

    return res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      response: response
    });

  } catch (error) {
    console.error('❌ Neynar notification error:', error);
    return res.status(500).json({ 
      error: 'Failed to send notification',
      details: error.message 
    });
  }
}
