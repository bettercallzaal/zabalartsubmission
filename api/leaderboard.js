import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      const { limit = 100, fid } = req.query;

      // If FID is provided, get user rank
      if (fid) {
        const { data: rankData, error: rankError } = await supabase
          .rpc('get_user_rank', { user_fid: parseInt(fid) });

        if (rankError) throw rankError;

        return res.status(200).json({
          success: true,
          data: rankData && rankData.length > 0 ? rankData[0] : null
        });
      }

      // Get leaderboard data
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .rpc('get_leaderboard', { limit_count: parseInt(limit) });

      if (leaderboardError) throw leaderboardError;

      // Format data to match expected API structure (address and score fields)
      const formattedData = leaderboardData.map((entry, index) => ({
        rank: index + 1,
        address: entry.fid.toString(),
        fid: entry.fid,
        username: entry.username || `User ${entry.fid}`,
        score: entry.score,
        streak: entry.streak,
        lastVote: entry.last_vote
      }));

      return res.status(200).json({
        success: true,
        data: formattedData,
        total: formattedData.length
      });
    }

    if (req.method === 'POST') {
      // Update leaderboard configuration
      const { name, description, icon_url } = req.body;

      if (!name || !description) {
        return res.status(400).json({
          success: false,
          error: 'Name and description are required'
        });
      }

      if (name.length > 20) {
        return res.status(400).json({
          success: false,
          error: 'Name must be 20 characters or less'
        });
      }

      if (description.length > 80) {
        return res.status(400).json({
          success: false,
          error: 'Description must be 80 characters or less'
        });
      }

      const { data, error } = await supabase
        .from('leaderboard_config')
        .update({
          name,
          description,
          icon_url,
          updated_at: new Date().toISOString()
        })
        .eq('is_active', true)
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: data[0]
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
