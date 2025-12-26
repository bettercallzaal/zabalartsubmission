// Database Check Script
// Run this to verify votes in Supabase

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cbtvnuklqwdkpyeioafb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidHZudWtscXdka3B5ZWlvYWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDUwODcsImV4cCI6MjA4MTU4MTA4N30.0-6wezGo6keB4b7CURNitfyEYKQdI99nYOyolVyfqis';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabase() {
    console.log('🔍 Checking Supabase database...\n');
    
    try {
        // 1. Check if votes table exists and get all votes
        console.log('📊 Checking votes table:');
        const { data: allVotes, error: votesError } = await supabase
            .from('votes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (votesError) {
            console.error('❌ Error querying votes:', votesError);
        } else {
            console.log(`✅ Total votes in database: ${allVotes.length}`);
            console.log('Recent votes:', allVotes.slice(0, 10));
        }
        
        // 2. Check today's votes
        const today = new Date().toISOString().split('T')[0];
        console.log(`\n📅 Checking votes for today (${today}):`);
        
        const { data: todayVotes, error: todayError } = await supabase
            .from('votes')
            .select('*')
            .eq('vote_date', today);
        
        if (todayError) {
            console.error('❌ Error querying today\'s votes:', todayError);
        } else {
            console.log(`✅ Votes today: ${todayVotes.length}`);
            
            // Count by mode
            const counts = {
                studio: 0,
                market: 0,
                social: 0,
                battle: 0
            };
            
            todayVotes.forEach(vote => {
                counts[vote.mode]++;
            });
            
            console.log('\nVotes by mode:');
            console.log(`🎨 Studio: ${counts.studio}`);
            console.log(`📊 Market: ${counts.market}`);
            console.log(`🌐 Social: ${counts.social}`);
            console.log(`⚔️ Battle: ${counts.battle}`);
        }
        
        // 3. Check daily_vote_totals table
        console.log('\n📈 Checking daily_vote_totals table:');
        const { data: totals, error: totalsError } = await supabase
            .from('daily_vote_totals')
            .select('*')
            .eq('vote_date', today);
        
        if (totalsError) {
            console.error('❌ Error querying daily totals:', totalsError);
        } else {
            console.log('✅ Daily totals:', totals);
        }
        
        // 4. Test the RPC function
        console.log('\n🔧 Testing get_todays_votes() RPC:');
        const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_todays_votes');
        
        if (rpcError) {
            console.error('❌ Error calling RPC:', rpcError);
        } else {
            console.log('✅ RPC result:', rpcData);
        }
        
        // 5. Check for any duplicate votes
        console.log('\n🔍 Checking for duplicate votes:');
        const duplicates = todayVotes.reduce((acc, vote) => {
            const key = `${vote.fid}_${vote.mode}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        
        const dupes = Object.entries(duplicates).filter(([_, count]) => count > 1);
        if (dupes.length > 0) {
            console.log('⚠️ Found duplicates:', dupes);
        } else {
            console.log('✅ No duplicates found');
        }
        
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

checkDatabase();
