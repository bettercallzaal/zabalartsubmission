// Scheduled function to send daily voting reminders at 11 AM EST
// Vercel Cron: Configure in vercel.json

module.exports = async function handler(req, res) {
  // Verify this is a cron request (Vercel sets this header)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('⏰ Running daily reminder cron job...');

  try {
    // Get current date for unique notification ID
    const today = new Date().toISOString().split('T')[0];
    const notificationId = `daily-voting-reminder-${today}`;

    // Call our send-notification API
    const response = await fetch(`${process.env.VERCEL_URL || 'https://zabal.art'}/api/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId,
        title: '🗳️ Time to Vote!',
        body: 'Cast your vote for today\'s ZABAL stream direction. Voting closes soon!',
        targetUrl: 'https://zabal.art'
      })
    });

    const result = await response.json();

    console.log('✅ Daily reminder sent:', result);

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
