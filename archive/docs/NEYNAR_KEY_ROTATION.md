# Neynar API Key Rotation - Security Fix

**Date:** January 25, 2026  
**Issue:** Critical Issue #1 from Security Audit v2.0.0  
**Status:** ✅ Code changes complete - awaiting key rotation in Vercel

---

## Changes Made

### 1. Removed Hardcoded API Key from Client-Side Code
- ✅ **File:** `js/config.js:23`
- **Before:** `this.NEYNAR_API_KEY = this.getEnvVar('NEYNAR_API_KEY', 'FE60D90E-8F00-4400-9C39-F67E6C46E3EA');`
- **After:** Removed - API key now server-side only

### 2. Updated .env.example
- ✅ **File:** `.env.example:1-2`
- **Before:** `VITE_NEYNAR_API_KEY=15CC284E-9C7E-44C8-9D32-BC82D3C05320`
- **After:** `NEYNAR_API_KEY=your_neynar_api_key_here`
- **Note:** Changed from `VITE_` prefix (client-exposed) to server-only

### 3. Updated All Neynar API Calls to Use Proxy
- ✅ **File:** `index.html`
- **Functions updated:**
  - `getZaoChannelCasts()` - Now uses `/api/neynar?endpoint=feed/user/casts&fid=${fid}&limit=100`
  - `getNeynarScore()` - Now uses `/api/neynar?endpoint=user/bulk&fids=${fid}`
  - `callNeynarAPI()` - Removed fallback direct API call

### 4. Verified Proxy Configuration
- ✅ **File:** `api/neynar.js`
- **Status:** Already properly configured
- **Security:** Reads `NEYNAR_API_KEY` from `process.env` (server-side only)

---

## Next Steps (Required)

### Step 1: Rotate API Key in Neynar Dashboard
1. Go to [Neynar Dashboard](https://neynar.com/dashboard)
2. Navigate to API Keys section
3. **Revoke old key:** `FE60D90E-8F00-4400-9C39-F67E6C46E3EA`
4. **Generate new key** and copy it

### Step 2: Update Vercel Environment Variable
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `zabal-art`
3. Go to **Settings** → **Environment Variables**
4. Add/Update variable:
   - **Name:** `NEYNAR_API_KEY`
   - **Value:** `[your new key]`
   - **Environments:** Production, Preview, Development
5. Click **Save**

### Step 3: Redeploy
1. Trigger a new deployment:
   ```bash
   git push origin main
   ```
2. Or manually redeploy in Vercel dashboard

### Step 4: Test
1. Open https://zabal.art in Farcaster
2. Vote daily (triggers vote power calculation)
3. Check browser console - should see:
   ```
   📊 Fetching /zao channel casts for FID: [your_fid]
   ✅ Found X /zao channel casts
   📊 Fetching Neynar score for FID: [your_fid]
   ✅ Neynar score: 0.XX
   ```
4. **No errors about API key**

---

## Security Improvements

### Before (Vulnerable)
```javascript
// Client-side code with exposed key
const response = await fetch('https://api.neynar.com/v2/farcaster/...', {
    headers: {
        'api_key': 'FE60D90E-8F00-4400-9C39-F67E6C46E3EA', // ❌ Exposed
        'accept': 'application/json'
    }
});
```

**Risk:** Anyone could extract key from DevTools and abuse API quota

### After (Secure)
```javascript
// Client calls proxy (no key exposed)
const response = await fetch('/api/neynar?endpoint=feed/user/casts&fid=123');
```

```javascript
// Server-side proxy (api/neynar.js)
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY; // ✅ Secure
const response = await fetch('https://api.neynar.com/v2/farcaster/...', {
    headers: { 'api_key': NEYNAR_API_KEY }
});
```

**Protection:** API key never leaves server, can't be extracted from browser

---

## Verification Checklist

- [x] Hardcoded key removed from `js/config.js`
- [x] `.env.example` updated with placeholder
- [x] All Neynar API calls use proxy
- [x] No fallback direct API calls
- [ ] Old key rotated in Neynar dashboard
- [ ] New key set in Vercel env vars
- [ ] Deployment successful
- [ ] Vote power calculation works in production

---

## Related Security Audit Items

This fix addresses:
- ✅ **Critical Issue #1:** Neynar API Key Exposed Client-Side
- ⏳ **Next:** Critical Issue #2 - Supabase Anon Key (separate fix)
- ⏳ **Next:** Critical Issue #3 - Weak RLS Policies (separate fix)

---

**Status:** Ready for key rotation and deployment
