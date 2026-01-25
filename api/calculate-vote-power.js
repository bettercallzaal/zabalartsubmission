// Vercel Serverless Function to calculate vote power server-side
// This prevents client-side manipulation of vote power values

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fid } = req.query;

    if (!fid) {
        return res.status(400).json({ error: 'Missing fid parameter' });
    }

    try {
        const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

        if (!NEYNAR_API_KEY) {
            console.error('NEYNAR_API_KEY not configured');
            return res.status(500).json({ error: 'API key not configured' });
        }

        console.log('🎯 Calculating vote power for FID:', fid);

        // Base power
        let power = 1;

        // 1. Fetch /zao channel casts
        let zaoCasts = 0;
        try {
            const castsResponse = await fetch(
                `https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${fid}&limit=100`,
                {
                    headers: {
                        'api_key': NEYNAR_API_KEY,
                        'accept': 'application/json'
                    }
                }
            );

            if (castsResponse.ok) {
                const castsData = await castsResponse.json();
                const zaoFiltered = castsData.casts?.filter(cast => 
                    cast.channel?.id === 'zao' || cast.parent_url?.includes('/zao')
                ) || [];
                zaoCasts = zaoFiltered.length;
                console.log('📊 /zao casts:', zaoCasts);
            }
        } catch (error) {
            console.error('Error fetching casts:', error);
        }

        // Activity bonus based on /zao casts
        if (zaoCasts >= 50) {
            power += 3;
        } else if (zaoCasts >= 20) {
            power += 2;
        } else if (zaoCasts >= 5) {
            power += 1;
        }

        // 2. Fetch Neynar score
        let neynarScore = 0.5;
        try {
            const scoreResponse = await fetch(
                `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
                {
                    headers: {
                        'api_key': NEYNAR_API_KEY,
                        'accept': 'application/json'
                    }
                }
            );

            if (scoreResponse.ok) {
                const scoreData = await scoreResponse.json();
                neynarScore = scoreData.users?.[0]?.experimental?.neynar_user_score || 0.5;
                console.log('📊 Neynar score:', neynarScore);
            }
        } catch (error) {
            console.error('Error fetching score:', error);
        }

        // Quality multiplier based on Neynar score
        let multiplier = 1.0;
        if (neynarScore >= 0.9) {
            multiplier = 1.5;
        } else if (neynarScore >= 0.7) {
            multiplier = 1.25;
        } else if (neynarScore < 0.5) {
            multiplier = 0.5;
        }

        // Calculate final power (capped at 6)
        const finalPower = Math.round(power * multiplier);
        const cappedPower = Math.min(finalPower, 6);

        console.log('✅ Vote power calculated:', {
            fid,
            zaoCasts,
            neynarScore,
            basePower: power,
            multiplier,
            finalPower: cappedPower
        });

        // Return result
        return res.status(200).json({
            success: true,
            fid: parseInt(fid),
            power: cappedPower,
            zaoCasts: zaoCasts,
            neynarScore: neynarScore,
            multiplier: multiplier,
            calculatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error calculating vote power:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            // Return default power on error
            power: 1
        });
    }
}
