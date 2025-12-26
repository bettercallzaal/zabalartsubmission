# ZABAL Live Hub - API Documentation

## 📡 API Overview

This document describes the APIs and integrations used in ZABAL Live Hub.

---

## 🗄️ Supabase API

### Base URL
```
https://cbtvnuklqwdkpyeioafb.supabase.co
```

### Authentication
Uses `anon` key for client-side access. Row-Level Security (RLS) enforces permissions.

---

### Endpoints

#### Get Today's Votes
```javascript
const { data, error } = await supabase
    .rpc('get_todays_votes');
```

**Response**:
```json
[
    { "mode": "studio", "total_votes": 42 },
    { "mode": "market", "total_votes": 38 },
    { "mode": "social", "total_votes": 51 },
    { "mode": "battle", "total_votes": 29 }
]
```

---

#### Check User Vote
```javascript
const { data, error } = await supabase
    .rpc('has_voted_today', { user_fid: 12345 });
```

**Response**:
```json
[
    {
        "has_voted": true,
        "voted_mode": "studio"
    }
]
```

---

#### Submit Vote
```javascript
const { data, error } = await supabase
    .from('votes')
    .insert([{
        fid: 12345,
        mode: 'studio',
        vote_power: 1,
        source: 'web'
    }])
    .select();
```

**Response**:
```json
[
    {
        "id": 1,
        "fid": 12345,
        "mode": "studio",
        "vote_date": "2024-12-21",
        "vote_power": 1,
        "source": "web",
        "created_at": "2024-12-21T20:00:00Z"
    }
]
```

---

#### Delete Vote
```javascript
const { data, error } = await supabase
    .from('votes')
    .delete()
    .eq('fid', 12345)
    .eq('vote_date', '2024-12-21')
    .select();
```

---

#### Get Vote History
```javascript
const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('fid', 12345)
    .order('vote_date', { ascending: false })
    .limit(10);
```

**Response**:
```json
[
    {
        "id": 1,
        "fid": 12345,
        "mode": "studio",
        "vote_date": "2024-12-21",
        "vote_power": 1,
        "source": "web",
        "created_at": "2024-12-21T20:00:00Z"
    }
]
```

---

## 🟣 Neynar API

### Base URL
```
https://api.neynar.com/v2/farcaster
```

### Authentication
```
Headers: {
    'api_key': 'YOUR_NEYNAR_API_KEY',
    'accept': 'application/json'
}
```

---

### Endpoints

#### Get User by FID
```javascript
const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=12345`,
    {
        headers: {
            'api_key': NEYNAR_API_KEY,
            'accept': 'application/json'
        }
    }
);
```

**Response**:
```json
{
    "users": [{
        "fid": 12345,
        "username": "zaal",
        "display_name": "Zaal",
        "pfp_url": "https://...",
        "follower_count": 1234,
        "following_count": 567
    }]
}
```

---

#### Get User's Following
```javascript
const response = await fetch(
    `https://api.neynar.com/v2/farcaster/following?fid=12345&limit=100`,
    {
        headers: {
            'api_key': NEYNAR_API_KEY,
            'accept': 'application/json'
        }
    }
);
```

**Response**:
```json
{
    "users": [
        {
            "fid": 67890,
            "username": "friend1",
            "display_name": "Friend One",
            "pfp_url": "https://..."
        }
    ],
    "next": {
        "cursor": "..."
    }
}
```

---

#### Get Relevant Users (Best Friends)
```javascript
const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=12345`,
    {
        headers: {
            'api_key': NEYNAR_API_KEY,
            'accept': 'application/json'
        }
    }
);
```

---

## 🎯 Farcaster SDK

### Initialization
```javascript
await window.farcasterSDK.context.ready();
```

### Get User Context
```javascript
const context = await window.farcasterSDK.context.user;
// Returns: { fid, username, displayName, pfpUrl }
```

### Compose Cast
```javascript
await window.farcasterSDK.actions.composeCast({
    text: "I just voted 🎬 STUDIO on ZABAL Live Hub!",
    embeds: ["https://zabal.art"]
});
```

---

## 🔄 Internal APIs

### Vote Function
```javascript
await window.vote('studio');
```

**Parameters**:
- `mode`: string - One of: 'studio', 'market', 'social', 'battle'

**Returns**: Promise<void>

**Errors**:
- Validation error if mode invalid
- Rate limit error if too fast
- Database error if connection fails
- Auth error if not authenticated

---

### Load Votes
```javascript
await loadVotes();
```

**Returns**: Promise<void>

**Side Effects**:
- Updates global `votes` object
- Updates UI with new vote counts
- Updates leader display

---

### Share Vote
```javascript
await shareVote(['studio', 'market']);
```

**Parameters**:
- `modes`: string[] - Array of voted modes

**Returns**: Promise<void>

**Side Effects**:
- Opens Farcaster compose modal
- Includes tagged friends
- Includes vote counts

---

## 📊 Analytics API

### Track Vote
```javascript
window.analytics.trackVote('studio');
```

### Track Share
```javascript
window.analytics.trackShare('studio', ['friend1', 'friend2']);
```

### Track Error
```javascript
window.analytics.trackError(error, { context: 'vote' });
```

### Track User Action
```javascript
window.analytics.trackUserAction('button_click', { button: 'vote' });
```

---

## 🔐 Rate Limits

### Supabase
- **Reads**: Unlimited (free tier)
- **Writes**: ~500/hour (free tier)
- **Connections**: 60 concurrent

### Neynar
- **Free Tier**: 100 requests/day
- **Paid Tier**: Custom limits
- **Rate Limit**: 1 request/second

### Internal
- **Vote**: 1 per second per user
- **Load Votes**: 1 per 5 seconds
- **Neynar API**: 1 per 2 seconds

---

## 🚨 Error Codes

### Supabase Errors
```javascript
{
    "code": "23505",
    "message": "duplicate key value violates unique constraint",
    "details": "Key (fid, vote_date, mode)=(12345, 2024-12-21, studio) already exists"
}
```

**Common Codes**:
- `23505`: Duplicate vote
- `42501`: Permission denied (RLS)
- `PGRST116`: No rows returned
- `PGRST301`: Connection timeout

### Validation Errors
```javascript
{
    "message": "Invalid mode. Must be one of: studio, market, social, battle"
}
```

### Rate Limit Errors
```javascript
{
    "message": "Please wait 1 seconds before trying again"
}
```

---

## 📝 Request Examples

### Complete Vote Flow
```javascript
// 1. Validate mode
const mode = Validator.validateMode('studio');

// 2. Check rate limit
rateLimiter.canPerform('vote_12345', 1000);

// 3. Delete existing vote
await supabase
    .from('votes')
    .delete()
    .eq('fid', 12345)
    .eq('vote_date', '2024-12-21');

// 4. Insert new vote
await supabase
    .from('votes')
    .insert([{
        fid: 12345,
        mode: 'studio',
        vote_power: 1,
        source: 'web'
    }]);

// 5. Reload votes
await loadVotes();

// 6. Track analytics
analytics.trackVote('studio');
```

---

## 🧪 Testing

### Test Vote Submission
```javascript
// In browser console
await window.vote('studio');
```

### Test API Throttle
```javascript
// Should succeed
await window.throttledAPI('test', async () => {
    console.log('First call');
});

// Should wait 5 seconds
await window.throttledAPI('test', async () => {
    console.log('Second call');
}, { minInterval: 5000 });
```

### Test State Management
```javascript
// Set state
window.setState('auth.userFID', 12345);

// Get state
const fid = window.getState('auth.userFID');

// Subscribe to changes
window.subscribeToState('votes.*', (newValue) => {
    console.log('Votes changed:', newValue);
});
```

---

## 📚 Additional Resources

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Neynar API Docs](https://docs.neynar.com)
- [Farcaster SDK Docs](https://docs.farcaster.xyz/developers/frames/v2)

---

**Last Updated**: December 2024
**Version**: 2.0.0
