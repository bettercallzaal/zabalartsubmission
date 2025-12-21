// Scheduled function to send daily voting reminders at 11 AM EST
// Uses Neynar managed service - much simpler!

module.exports = async function handler(req, res) {
  // Verify this is a cron request (Vercel sets this header)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('⏰ Running daily reminder cron job...');

  try {
    // Call Neynar notification API
    const response = await fetch(`${process.env.VERCEL_URL || 'https://zabal.art'}/api/send-notification-neynar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '🗳️ Time to Vote!',
        body: 'Cast your vote for today\'s ZABAL stream direction. Voting closes soon!',
        targetUrl: 'https://zabal.art'
      })
    });

    const result = await response.json();

    console.log('✅ Daily reminder sent via Neynar:', result);

    return res.status(200).json({
      success: true,
      message: 'Daily reminder sent',
      ...result
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    return res.status(500).json({ 
      error: 'Failed to send daily reminder',
      details: error.message 
    });
  }
}
