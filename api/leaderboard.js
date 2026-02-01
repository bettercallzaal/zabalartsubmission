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
    console.log('🔍 Leaderboard API called:', req.method, req.query);
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase credentials');
      throw new Error('Missing Supabase credentials');
    }

    console.log('✅ Supabase client created');
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      const { limit = 100, fid } = req.query;

      // If FID is provided, get user rank
      if (fid) {
        console.log('📊 Getting user rank for FID:', fid);
        const { data: rankData, error: rankError } = await supabase
          .rpc('get_user_rank', { user_fid: parseInt(fid) });

        if (rankError) {
          console.error('❌ Error getting user rank:', rankError);
          throw rankError;
        }

        console.log('✅ User rank data:', rankData);
        return res.status(200).json({
          success: true,
          data: rankData && rankData.length > 0 ? rankData[0] : null
        });
      }

      // Get leaderboard data
      console.log('📊 Fetching leaderboard with limit:', limit);
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .rpc('get_leaderboard', { limit_count: parseInt(limit) });

      if (leaderboardError) {
        console.error('❌ Error fetching leaderboard:', leaderboardError);
        throw leaderboardError;
      }

      console.log('✅ Raw leaderboard data:', leaderboardData);
      console.log('📈 Number of entries:', leaderboardData?.length || 0);

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

      console.log('✅ Formatted data:', formattedData);

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

      console.log('💾 Updating leaderboard config:', { name, description, icon_url });
      
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

      if (error) {
        console.error('❌ Error updating config:', error);
        throw error;
      }

      console.log('✅ Config updated:', data);

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
