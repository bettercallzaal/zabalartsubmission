// Vercel Serverless Function to proxy Neynar API calls
// This keeps the API key secure on the server side

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

    const { endpoint, ...params } = req.query;

    if (!endpoint) {
        return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    try {
        // Get API key from environment variable
        const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

        if (!NEYNAR_API_KEY) {
            console.error('NEYNAR_API_KEY not configured');
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Build query string
        const queryString = new URLSearchParams(params).toString();
        const url = `https://api.neynar.com/v2/farcaster/${endpoint}${queryString ? '?' + queryString : ''}`;

        console.log('Proxying request to:', url);

        // Make request to Neynar API
        const response = await fetch(url, {
            headers: {
                'api_key': NEYNAR_API_KEY,
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Neynar API error:', response.status, errorText);
            return res.status(response.status).json({ 
                error: 'Neynar API error',
                details: errorText 
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error proxying Neynar request:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
