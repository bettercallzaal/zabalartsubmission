# ZABAL Live Hub - Deployment Guide

## 🚀 Vercel Deployment

### Environment Variables Setup

After deploying to Vercel, you need to configure the following environment variable:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

```
NEYNAR_API_KEY=15CC284E-9C7E-44C8-9D32-BC82D3C05320
```

**Important:** 
- This should be set for **Production**, **Preview**, and **Development** environments
- After adding, redeploy your application for changes to take effect

### Why This Setup?

**Supabase Keys (Client-Side - Safe):**
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are hardcoded in `live.html`
- This is **intentional and secure** - Supabase anon keys are designed for client-side use
- Protected by Row Level Security (RLS) policies in the database
- Cannot be used to bypass security

**Neynar API Key (Server-Side - Secure):**
- Stored as environment variable in Vercel
- Accessed only by serverless function at `/api/neynar.js`
- Never exposed to client-side code
- Prevents abuse and rate limit issues

### API Proxy Endpoint

The serverless function at `/api/neynar.js` proxies all Neynar API calls:

**Usage in client code:**
```javascript
// Instead of direct API calls:
// fetch('https://api.neynar.com/v2/farcaster/user/bulk?fids=123', {
//     headers: { 'api_key': NEYNAR_API_KEY }
// })

// Use the proxy:
const data = await callNeynarAPI('user/bulk', { fids: '123' });
```

**Supported endpoints:**
- `user/bulk` - Get user data by FIDs
- `user/best_friends` - Get user's best friends
- Any other Neynar v2 endpoint

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bettercallzaal/zabalartsubmission.git
   cd zabalartsubmission
   ```

2. **Environment variables are already in `.env`:**
   - The `.env` file is created with all necessary keys
   - `.gitignore` prevents it from being committed

3. **Run locally:**
   ```bash
   # Option 1: Direct file open
   open live.html
   
   # Option 2: Local server
   python -m http.server 8000
   # Visit http://localhost:8000
   
   # Option 3: Vercel CLI (for serverless functions)
   npm i -g vercel
   vercel dev
   ```

### Deployment Checklist

**Before deploying:**
- [ ] Test all features locally
- [ ] Verify Neynar API proxy works
- [ ] Check Supabase connection
- [ ] Test Farcaster SDK integration
- [ ] Verify mobile responsiveness

**After deploying:**
- [ ] Set `NEYNAR_API_KEY` in Vercel environment variables
- [ ] Redeploy the application
- [ ] Test vote functionality
- [ ] Test friend tagging
- [ ] Test live stream sharing
- [ ] Verify vote history loads
- [ ] Check all social shares work

### Security Best Practices

✅ **What's Secure:**
- Neynar API key hidden in serverless function
- Supabase RLS policies protect database
- CORS enabled only for necessary endpoints
- Environment variables encrypted at rest

⚠️ **What to Monitor:**
- Neynar API rate limits
- Supabase database usage
- Serverless function invocations

### Troubleshooting

**"API key not configured" error:**
- Ensure `NEYNAR_API_KEY` is set in Vercel environment variables
- Redeploy after adding the variable
- Check Vercel function logs for errors

**Neynar API calls failing:**
- Check serverless function logs in Vercel dashboard
- Verify API key is valid
- Check Neynar API status

**Supabase connection issues:**
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in code
- Check Supabase project status
- Review RLS policies in Supabase dashboard

### Monitoring

**Vercel Dashboard:**
- Function invocations: `/api/neynar`
- Error rates
- Response times

**Supabase Dashboard:**
- Database queries
- RLS policy hits
- Connection pool usage

---

**Built with ❤️ for the ZABAL community**
