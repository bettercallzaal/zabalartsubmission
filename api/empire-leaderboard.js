// Empire Builder compatible leaderboard endpoint
// Returns leaderboard data with address and score fields
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
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

    // Get top 50 voters from leaderboard
    const { data: voters, error: fetchError } = await supabase
      .from('leaderboard_scores')
      .select('fid, username, total_votes')
      .order('total_votes', { ascending: false })
      .limit(50);

    if (fetchError) {
      throw fetchError;
    }

    if (!voters || voters.length === 0) {
      return res.status(200).json([]);
    }

    // Get verified addresses from Neynar for each FID
    const fids = voters.map(v => v.fid).join(',');
    const neynarResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`,
      {
        headers: {
          'accept': 'application/json',
          'api_key': neynarKey
        }
      }
    );

    if (!neynarResponse.ok) {
      throw new Error('Failed to fetch user data from Neynar');
    }

    const neynarData = await neynarResponse.json();
    
    // Map FIDs to their verified addresses
    const addressMap = {};
    neynarData.users.forEach(user => {
      // Get first verified address (custody or connected wallet)
      const verifiedAddress = user.verified_addresses?.eth_addresses?.[0] || 
                             user.custody_address;
      if (verifiedAddress) {
        addressMap[user.fid] = verifiedAddress;
      }
    });

    // Build Empire Builder compatible response
    const leaderboardData = voters
      .filter(voter => addressMap[voter.fid]) // Only include voters with addresses
      .map(voter => ({
        address: addressMap[voter.fid],
        score: voter.total_votes
      }));

    return res.status(200).json(leaderboardData);

  } catch (error) {
    console.error('Error fetching Empire leaderboard:', error);
    return res.status(500).json({
      error: error.message
    });
  }
}
