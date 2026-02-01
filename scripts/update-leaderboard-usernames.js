// Script to fetch and update usernames and profile pictures for leaderboard
// Run this with: node scripts/update-leaderboard-usernames.js

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!NEYNAR_API_KEY) {
  console.error('❌ Missing Neynar API key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchUserData(fids) {
  const url = 'https://api.neynar.com/v2/farcaster/user/bulk';
  const params = new URLSearchParams({ fids: fids.join(',') });
  
  const response = await fetch(`${url}?${params}`, {
    headers: {
      'accept': 'application/json',
      'api_key': NEYNAR_API_KEY
    }
  });
  
  if (!response.ok) {
    throw new Error(`Neynar API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.users;
}

async function updateLeaderboardUsernames() {
  console.log('🚀 Starting leaderboard username update...\n');
  
  // Get all FIDs from leaderboard
  const { data: scores, error: fetchError } = await supabase
    .from('leaderboard_scores')
    .select('fid, username, pfp_url');
  
  if (fetchError) {
    console.error('❌ Error fetching leaderboard scores:', fetchError);
    return;
  }
  
  console.log(`📊 Found ${scores.length} users in leaderboard\n`);
  
  // Filter FIDs that need updates (missing username or pfp)
  const fidsToUpdate = scores
    .filter(s => !s.username || !s.pfp_url)
    .map(s => s.fid);
  
  if (fidsToUpdate.length === 0) {
    console.log('✅ All users already have usernames and profile pictures!');
    return;
  }
  
  console.log(`🔄 Updating ${fidsToUpdate.length} users...\n`);
  
  // Fetch user data from Neynar in batches of 100
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < fidsToUpdate.length; i += batchSize) {
    batches.push(fidsToUpdate.slice(i, i + batchSize));
  }
  
  let updated = 0;
  
  for (const batch of batches) {
    try {
      const users = await fetchUserData(batch);
      
      // Update each user in the database
      for (const user of users) {
        const { error: updateError } = await supabase
          .from('leaderboard_scores')
          .update({
            username: user.username,
            pfp_url: user.pfp_url,
            updated_at: new Date().toISOString()
          })
          .eq('fid', user.fid);
        
        if (updateError) {
          console.error(`❌ Error updating FID ${user.fid}:`, updateError);
        } else {
          updated++;
          console.log(`✅ Updated FID ${user.fid} → @${user.username}`);
        }
      }
      
      // Rate limit: wait 1 second between batches
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('❌ Error fetching batch:', error);
    }
  }
  
  console.log(`\n🎉 Updated ${updated} users successfully!`);
}

updateLeaderboardUsernames().catch(console.error);
