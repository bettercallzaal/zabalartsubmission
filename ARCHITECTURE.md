# ZABAL Live Hub - Architecture Documentation

## 🏛️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Farcaster Miniapp                        │
│                      (Client-Side)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   UI Layer   │  │  State Mgmt  │  │   Modules    │     │
│  │              │  │              │  │              │     │
│  │ - HTML/CSS   │  │ - StateManager│ │ - Config     │     │
│  │ - Components │  │ - Validation │  │ - Validation │     │
│  │ - Modals     │  │ - Lifecycle  │  │ - Error      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                     API Layer                                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Supabase    │  │   Neynar     │  │  Farcaster   │     │
│  │   Client     │  │     API      │  │     SDK      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Supabase    │  │   Neynar     │  │  Farcaster   │     │
│  │  Database    │  │   Service    │  │   Network    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Module Architecture

### Core Modules

#### 1. Configuration Management (`js/config.js`)
**Purpose**: Centralized configuration and environment variables

**Responsibilities**:
- Load environment variables
- Validate configuration
- Provide feature flags
- Manage API endpoints

**Key Features**:
- Singleton pattern
- Environment detection (dev/prod)
- Configuration validation
- Default values

**Usage**:
```javascript
window.appConfig.SUPABASE_URL
window.appConfig.NEYNAR_API_KEY
window.appConfig.VOTE_COOLDOWN_MS
```

---

#### 2. Validation (`js/validation.js`)
**Purpose**: Input validation and sanitization

**Responsibilities**:
- Validate all user inputs
- Sanitize text to prevent XSS
- Rate limiting
- Type checking

**Key Classes**:
- `Validator` - Static validation methods
- `RateLimiter` - Rate limiting implementation

**Validation Rules**:
- FIDs: Positive integers, safe range
- Modes: Enum validation (studio, market, social, battle)
- Usernames: Alphanumeric + underscore/hyphen
- URLs: HTTPS only
- Arrays: Length limits, no duplicates

**Usage**:
```javascript
const validFID = Validator.validateFID(userFID);
const validMode = Validator.validateMode('studio');
rateLimiter.canPerform('vote_123', 1000);
```

---

#### 3. Error Handler (`js/error-handler.js`)
**Purpose**: Global error handling and recovery

**Responsibilities**:
- Catch uncaught errors
- Handle promise rejections
- Classify error severity
- Show user-friendly messages
- Track errors in analytics

**Error Severity Levels**:
- **Critical**: Database, auth failures → "Refresh page"
- **High**: Vote, share failures → "Try again"
- **Medium**: API, network errors → "Check connection"
- **Low**: Non-critical errors → Silent logging

**Usage**:
```javascript
window.errorHandler.handleError(error, { 
    type: 'vote_error', 
    context: 'submitVote' 
});
```

---

#### 4. Lifecycle Manager (`js/lifecycle.js`)
**Purpose**: Prevent memory leaks

**Responsibilities**:
- Track intervals and timeouts
- Track event listeners
- Automatic cleanup on unload
- Resource management

**Tracked Resources**:
- Vote refresh interval (30s)
- Countdown timer (1s)
- Live status check (2m)
- All event listeners

**Usage**:
```javascript
appLifecycle.addInterval(loadVotes, 30000, 'vote-refresh');
appLifecycle.addEventListener(element, 'click', handler);
```

---

#### 5. State Manager (`js/state-manager.js`)
**Purpose**: Centralized state management

**Responsibilities**:
- Single source of truth
- State validation
- Change notifications
- State persistence

**State Structure**:
```javascript
{
    auth: { isAuthenticated, userFID, username },
    stream: { currentState, lockTime, isLive },
    votes: { studio, market, social, battle },
    selections: { selectedModes, selectedFriends },
    friends: { bestFriends, topFriend, displayCount },
    ui: { isOnline, activeModal, isLoading },
    history: { userVotes, lastVoteDate }
}
```

**Features**:
- Path-based get/set
- Validation on changes
- Subscribe to changes
- Batch updates
- Change logging

**Usage**:
```javascript
setState('auth.userFID', 12345);
const fid = getState('auth.userFID');
subscribeToState('votes.*', (newValue) => updateUI());
```

---

#### 6. Database Manager (`js/database.js`)
**Purpose**: Reliable database connections

**Responsibilities**:
- Initialize Supabase client
- Connection health checks
- Retry logic (3 attempts)
- Query timeout handling
- Error recovery

**Features**:
- Exponential backoff
- Connection pooling
- Timeout protection (10s)
- Auto-reconnection

**Usage**:
```javascript
await databaseManager.initialize();
const result = await dbQuery(async (client) => {
    return await client.from('votes').select('*');
});
```

---

#### 7. API Throttle (`js/api-throttle.js`)
**Purpose**: Rate limiting and API protection

**Responsibilities**:
- Rate limiting (min intervals)
- Concurrency limiting (max 3)
- Retry with backoff
- Request queuing
- Debouncing

**Configuration**:
- `loadVotes`: 5 seconds minimum
- `callNeynarAPI`: 2 seconds minimum
- Max 3 concurrent requests
- 3 retry attempts

**Usage**:
```javascript
await throttledAPI('loadVotes', async () => {
    return await fetchVotes();
}, { minInterval: 5000 });
```

---

#### 8. Production Enhancements (`js/production-enhancements.js`)
**Purpose**: UX improvements and analytics

**Responsibilities**:
- Loading states
- Analytics tracking
- Data persistence
- Keyboard shortcuts
- Vote confirmations

**Features**:
- Loading spinners
- Analytics events
- LocalStorage persistence
- Keyboard navigation
- Offline detection

---

## 🔄 Data Flow

### Vote Submission Flow

```
User clicks vote
    │
    ▼
Validate mode ────────► Error? ──► Show error toast
    │                               │
    ▼                               │
Check rate limit ─────► Exceeded? ─┘
    │
    ▼
Check authentication ─► Not auth? ─┘
    │
    ▼
Check database ───────► Not ready? ┘
    │
    ▼
Show loading state
    │
    ▼
Delete existing vote
    │
    ▼
Insert new vote ──────► Error? ────┘
    │
    ▼
Update local state
    │
    ▼
Track analytics
    │
    ▼
Save to localStorage
    │
    ▼
Reload votes
    │
    ▼
Show confirmation
    │
    ▼
Open share modal
```

### State Update Flow

```
setState('path', value)
    │
    ▼
Validate value ────────► Invalid? ──► Throw error
    │
    ▼
Update state object
    │
    ▼
Log change
    │
    ▼
Notify listeners ─────► Listener 1
    │                   Listener 2
    │                   Listener 3
    ▼
Return validated value
```

### API Call Flow (with Throttle)

```
throttledAPI(key, fn)
    │
    ▼
Check rate limit ──────► Too soon? ──► Wait
    │
    ▼
Check concurrency ─────► Too many? ──► Queue
    │
    ▼
Mark in progress
    │
    ▼
Execute function ──────► Error? ────► Retry (3x)
    │                                  │
    ▼                                  │
Mark complete                          │
    │                                  │
    ▼                                  │
Update last call time                  │
    │                                  │
    ▼                                  │
Return result ◄────────────────────────┘
```

---

## 🗄️ Database Schema

### Tables

#### `votes`
```sql
CREATE TABLE votes (
    id BIGSERIAL PRIMARY KEY,
    fid INTEGER NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('studio', 'market', 'social', 'battle')),
    vote_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vote_power INTEGER DEFAULT 1,
    source TEXT DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(fid, vote_date, mode)
);
```

#### `daily_vote_totals`
```sql
CREATE TABLE daily_vote_totals (
    id BIGSERIAL PRIMARY KEY,
    vote_date DATE NOT NULL,
    mode TEXT NOT NULL,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vote_date, mode)
);
```

### Functions

#### `get_todays_votes()`
Returns today's vote totals by mode

#### `has_voted_today(user_fid INTEGER)`
Checks if user has voted today and returns their vote

### Triggers

#### `update_daily_totals`
Automatically updates `daily_vote_totals` when votes are inserted/deleted

---

## 🔐 Security Architecture

### Defense Layers

1. **Input Validation** (Client)
   - All inputs validated before processing
   - Type checking and sanitization
   - Rate limiting on actions

2. **Row-Level Security** (Database)
   - RLS policies on all tables
   - User can only modify their own votes
   - Read access controlled

3. **API Protection** (Server)
   - Rate limiting on endpoints
   - API key validation
   - CORS configuration

4. **Error Handling** (Global)
   - No sensitive data in errors
   - User-friendly messages
   - Error tracking for debugging

### Security Best Practices

✅ **Implemented**:
- Environment variables for secrets
- Input validation on all inputs
- XSS prevention through sanitization
- Rate limiting to prevent abuse
- HTTPS only
- No sensitive data in client code
- Error messages don't expose internals

❌ **Not Implemented** (Future):
- CSP headers
- CSRF tokens
- Request signing
- IP-based rate limiting
- Bot detection

---

## 📈 Performance Optimizations

### Current Optimizations

1. **API Throttling**
   - Minimum intervals between calls
   - Prevents excessive API usage
   - Reduces costs

2. **Memory Management**
   - Automatic cleanup of intervals
   - Event listener tracking
   - No memory leaks

3. **State Management**
   - Single source of truth
   - Batch updates
   - Efficient change detection

4. **Database Queries**
   - Indexed columns (fid, vote_date)
   - Efficient RPC functions
   - Connection pooling

### Future Optimizations

- [ ] Service worker for offline support
- [ ] Response caching
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle minification

---

## 🧪 Testing Strategy

### Current Testing

- Manual testing in Warpcast
- Browser console logging
- Error tracking
- Analytics validation

### Recommended Testing

1. **Unit Tests**
   - Validation functions
   - State management
   - Error handling

2. **Integration Tests**
   - Database operations
   - API calls
   - State updates

3. **E2E Tests**
   - Vote submission flow
   - Friend tagging
   - Share functionality

4. **Performance Tests**
   - Load testing
   - Memory leak detection
   - API rate limit testing

---

## 🚀 Deployment Architecture

### Hosting
- **Platform**: Vercel
- **Domain**: zabal.art
- **SSL**: Automatic (Vercel)

### Environment Variables
```
VITE_NEYNAR_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_ZAO_FID
```

### Build Process
1. Vercel detects push to main
2. Runs build command
3. Deploys to production
4. Updates DNS

### Monitoring
- Vercel Analytics
- Custom analytics in localStorage
- Error tracking via errorHandler
- Database logs in Supabase

---

## 📊 Scalability Considerations

### Current Capacity
- **Users**: Unlimited (client-side app)
- **Votes**: ~1000/day (database limit)
- **API Calls**: Rate limited per user

### Bottlenecks
1. Database writes (votes)
2. Neynar API rate limits
3. Supabase connection limits

### Scaling Strategy
1. **Horizontal Scaling**
   - Add read replicas
   - CDN for static assets
   - Edge functions

2. **Vertical Scaling**
   - Upgrade database tier
   - Increase connection pool
   - Optimize queries

3. **Caching**
   - Cache vote totals
   - Cache friend lists
   - Service worker

---

## 🔄 Future Architecture

### Planned Improvements

1. **Microservices**
   - Separate vote service
   - Separate notification service
   - API gateway

2. **Real-time Updates**
   - WebSocket connections
   - Live vote updates
   - Push notifications

3. **Advanced Analytics**
   - External analytics service
   - User behavior tracking
   - A/B testing

4. **Mobile App**
   - React Native app
   - Native notifications
   - Offline support

---

**Last Updated**: December 2024
**Version**: 2.0.0
