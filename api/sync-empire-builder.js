// Sync ZABAL voter scores to Empire Builder leaderboard
// POST /api/sync-empire-builder
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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
    const empireApiKey = process.env.EMPIRE_BUILDER_API_KEY;
    const empirePrivateKey = process.env.EMPIRE_BUILDER_PRIVATE_KEY;
    const empireTokenAddress = process.env.EMPIRE_TOKEN_ADDRESS || '0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    if (!empireApiKey || !empirePrivateKey) {
      return res.status(400).json({
        success: false,
        error: 'Empire Builder API credentials not configured. Set EMPIRE_BUILDER_API_KEY and EMPIRE_BUILDER_PRIVATE_KEY in Vercel environment variables.'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get top voters from leaderboard (limit to top 50 for Empire Builder)
    const { data: voters, error: fetchError } = await supabase
      .from('leaderboard_scores')
      .select('fid, username, total_votes')
      .order('total_votes', { ascending: false })
      .limit(50);

    if (fetchError) {
      throw fetchError;
    }

    if (!voters || voters.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No voters to sync',
        synced: 0
      });
    }

    console.log(`Syncing ${voters.length} voters to Empire Builder...`);

    // Convert FIDs to addresses (you'll need to map FIDs to wallet addresses)
    // For now, we'll use a placeholder - you'll need to get actual wallet addresses
    // Option 1: Store wallet addresses in your database when users connect
    // Option 2: Use Neynar API to get verified addresses for FIDs
    
    // Get verified addresses from Neynar for each FID
    const neynarKey = process.env.NEYNAR_API_KEY;
    if (!neynarKey) {
      throw new Error('Missing Neynar API key - needed to get wallet addresses for FIDs');
    }

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

    // Build arrays for Empire Builder API
    const addresses = [];
    const scores = [];

    voters.forEach(voter => {
      const address = addressMap[voter.fid];
      if (address) {
        addresses.push(address);
        // Convert total votes to wei format (multiply by 10^18)
        // This makes the scores compatible with Empire Builder's format
        const scoreInWei = (BigInt(voter.total_votes) * BigInt(10 ** 18)).toString();
        scores.push(scoreInWei);
      }
    });

    if (addresses.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No verified addresses found for voters',
        synced: 0
      });
    }

    console.log(`Submitting ${addresses.length} scores to Empire Builder...`);

    // Submit to Empire Builder
    const empireResponse = await fetch(
      `https://www.empirebuilder.world/api/refresh-leaderboard/${empireTokenAddress}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': empireApiKey
        },
        body: JSON.stringify({
          addresses: addresses,
          scores: scores,
          privateKey: empirePrivateKey
        })
      }
    );

    const empireData = await empireResponse.json();

    if (!empireResponse.ok) {
      console.error('Empire Builder API error:', empireData);
      throw new Error(empireData.error || 'Failed to sync with Empire Builder');
    }

    console.log('✅ Successfully synced to Empire Builder:', empireData);

    return res.status(200).json({
      success: true,
      message: `Synced ${addresses.length} voters to Empire Builder`,
      synced: addresses.length,
      total: voters.length,
      transactionHash: empireData.transactionHash,
      empireData: empireData
    });

  } catch (error) {
    console.error('Error syncing to Empire Builder:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
