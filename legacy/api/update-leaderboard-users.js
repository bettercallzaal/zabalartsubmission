// API endpoint to fetch and update usernames and profile pictures from Neynar
// Call this endpoint to populate leaderboard user data
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const neynarKey = process.env.NEYNAR_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    if (!neynarKey) {
      throw new Error('Missing Neynar API key');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all FIDs from leaderboard that need updates
    const { data: scores, error: fetchError } = await supabase
      .from('leaderboard_scores')
      .select('fid, username, pfp_url');

    if (fetchError) {
      throw fetchError;
    }

    // Filter FIDs that need updates (missing username or pfp)
    const fidsToUpdate = scores
      .filter(s => !s.username || !s.pfp_url)
      .map(s => s.fid);

    if (fidsToUpdate.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'All users already have usernames and profile pictures',
        updated: 0
      });
    }

    console.log(`Updating ${fidsToUpdate.length} users...`);

    // Fetch user data from Neynar (max 100 FIDs per request)
    const batchSize = 100;
    let updated = 0;

    for (let i = 0; i < fidsToUpdate.length; i += batchSize) {
      const batch = fidsToUpdate.slice(i, i + batchSize);
      const fidsParam = batch.join(',');

      const neynarResponse = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fidsParam}`,
        {
          headers: {
            'accept': 'application/json',
            'api_key': neynarKey
          }
        }
      );

      if (!neynarResponse.ok) {
        console.error('Neynar API error:', neynarResponse.status);
        continue;
      }

      const neynarData = await neynarResponse.json();

      // Update each user in the database
      for (const user of neynarData.users) {
        const { error: updateError } = await supabase
          .from('leaderboard_scores')
          .update({
            username: user.username,
            pfp_url: user.pfp_url,
            updated_at: new Date().toISOString()
          })
          .eq('fid', user.fid);

        if (!updateError) {
          updated++;
          console.log(`Updated FID ${user.fid} → @${user.username}`);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Updated ${updated} users`,
      updated: updated,
      total: fidsToUpdate.length
    });

  } catch (error) {
    console.error('Error updating leaderboard users:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
