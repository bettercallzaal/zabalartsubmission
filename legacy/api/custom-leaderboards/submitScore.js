import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase configuration'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      leaderboard_id,
      fid,
      username,
      address,
      score,
      metadata = {}
    } = req.body;

    // Validation
    if (!leaderboard_id) {
      return res.status(400).json({
        success: false,
        error: 'Leaderboard ID is required'
      });
    }

    if (!fid) {
      return res.status(400).json({
        success: false,
        error: 'FID is required'
      });
    }

    if (score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        error: 'Score is required'
      });
    }

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({
        success: false,
        error: 'Score must be a non-negative number'
      });
    }

    // Verify leaderboard exists and is active
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('custom_leaderboards')
      .select('*')
      .eq('id', leaderboard_id)
      .eq('is_active', true)
      .single();

    if (leaderboardError || !leaderboard) {
      return res.status(404).json({
        success: false,
        error: 'Leaderboard not found or inactive'
      });
    }

    // Submit score using the upsert function
    const { data, error } = await supabase
      .rpc('upsert_leaderboard_entry', {
        p_leaderboard_id: leaderboard_id,
        p_fid: fid,
        p_username: username,
        p_address: address,
        p_score: score,
        p_metadata: metadata
      });

    if (error) {
      console.error('Error submitting score:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Failed to submit score'
      });
    }

    const result = data && data.length > 0 ? data[0] : null;

    return res.status(200).json({
      success: true,
      data: {
        leaderboard_id,
        fid,
        score: result?.score || score,
        rank: result?.rank || null,
        message: 'Score submitted successfully'
      }
    });

  } catch (error) {
    console.error('Submit score API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
