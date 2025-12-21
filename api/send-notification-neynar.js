// Send notifications using Neynar REST API directly
// SDK method doesn't exist, using direct API call instead

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📤 Sending notification via Neynar REST API...');

  try {
    const { title, body, targetUrl, targetFids } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({ error: 'Missing required fields: title, body' });
    }

    // Call Neynar REST API directly
    const response = await fetch('https://api.neynar.com/v2/farcaster/frame/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': process.env.NEYNAR_API_KEY
      },
      body: JSON.stringify({
        target_fids: targetFids || [], // empty array = all users
        notification: {
          title: title,
          body: body,
          target_url: targetUrl || 'https://zabal.art'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Neynar API error:', data);
      return res.status(response.status).json({
        error: 'Neynar API error',
        details: data
      });
    }

    console.log('✅ Notification sent via Neynar:', data);

    return res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      response: data
    });

  } catch (error) {
    console.error('❌ Neynar notification error:', error);
    return res.status(500).json({ 
      error: 'Failed to send notification',
      details: error.message 
    });
  }
}
