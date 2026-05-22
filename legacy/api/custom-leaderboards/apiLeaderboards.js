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
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase configuration'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // GET - Retrieve custom leaderboards
    if (req.method === 'GET') {
      const { id, empire_address, limit = 100 } = req.query;

      // Get specific leaderboard by ID
      if (id) {
        const { data: leaderboard, error: leaderboardError } = await supabase
          .from('custom_leaderboards')
          .select('*')
          .eq('id', id)
          .single();

        if (leaderboardError) {
          return res.status(404).json({
            success: false,
            error: 'Leaderboard not found'
          });
        }

        // Get leaderboard entries
        const { data: entries, error: entriesError } = await supabase
          .from('custom_leaderboard_entries')
          .select('*')
          .eq('leaderboard_id', id)
          .order('score', { ascending: false })
          .limit(parseInt(limit));

        if (entriesError) throw entriesError;

        return res.status(200).json({
          success: true,
          data: {
            ...leaderboard,
            entries: entries || []
          }
        });
      }

      // Get all leaderboards for an empire
      if (empire_address) {
        const { data: leaderboards, error } = await supabase
          .from('custom_leaderboards')
          .select('*')
          .eq('empire_address', empire_address.toLowerCase())
          .eq('is_active', true);

        if (error) throw error;

        return res.status(200).json({
          success: true,
          data: leaderboards || []
        });
      }

      // Get all active leaderboards
      const { data: leaderboards, error } = await supabase
        .from('custom_leaderboards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: leaderboards || []
      });
    }

    // POST - Create new custom leaderboard
    if (req.method === 'POST') {
      const {
        name,
        description,
        empire_address,
        metric_type,
        icon_url,
        api_endpoint,
        scoring_rules,
        reset_frequency
      } = req.body;

      // Validation
      if (!name || name.length > 50) {
        return res.status(400).json({
          success: false,
          error: 'Name is required and must be 50 characters or less'
        });
      }

      if (!description || description.length > 200) {
        return res.status(400).json({
          success: false,
          error: 'Description is required and must be 200 characters or less'
        });
      }

      if (!empire_address) {
        return res.status(400).json({
          success: false,
          error: 'Empire address is required'
        });
      }

      if (!metric_type) {
        return res.status(400).json({
          success: false,
          error: 'Metric type is required (votes, holdings, activity, custom)'
        });
      }

      // Create leaderboard
      const { data: leaderboard, error: createError } = await supabase
        .from('custom_leaderboards')
        .insert({
          name,
          description,
          empire_address: empire_address.toLowerCase(),
          metric_type,
          icon_url,
          api_endpoint,
          scoring_rules: scoring_rules || {},
          reset_frequency: reset_frequency || 'never',
          is_active: true
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating leaderboard:', createError);
        return res.status(400).json({
          success: false,
          error: createError.message || 'Failed to create leaderboard'
        });
      }

      return res.status(201).json({
        success: true,
        data: leaderboard
      });
    }

    // PUT - Update leaderboard
    if (req.method === 'PUT') {
      const { id } = req.query;
      const updates = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Leaderboard ID is required'
        });
      }

      // Validate updates
      if (updates.name && updates.name.length > 50) {
        return res.status(400).json({
          success: false,
          error: 'Name must be 50 characters or less'
        });
      }

      if (updates.description && updates.description.length > 200) {
        return res.status(400).json({
          success: false,
          error: 'Description must be 200 characters or less'
        });
      }

      const { data, error } = await supabase
        .from('custom_leaderboards')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(404).json({
          success: false,
          error: 'Leaderboard not found or update failed'
        });
      }

      return res.status(200).json({
        success: true,
        data
      });
    }

    // DELETE - Deactivate leaderboard
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Leaderboard ID is required'
        });
      }

      const { data, error } = await supabase
        .from('custom_leaderboards')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(404).json({
          success: false,
          error: 'Leaderboard not found'
        });
      }

      return res.status(200).json({
        success: true,
        data
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Custom leaderboard API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
