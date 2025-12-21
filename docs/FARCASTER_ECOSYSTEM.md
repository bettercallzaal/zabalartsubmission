# Farcaster Ecosystem & Mini Apps: Complete Research & Implementation Guide

## Executive Summary

This document contains comprehensive research on the Farcaster ecosystem, Mini Apps best practices, successful case studies, and specific recommendations for building ZABAL's voting Mini App. Based on analysis of 20+ successful apps, official documentation, and ecosystem insights.

**Key Finding**: Mini Apps that succeed combine social features, shareable moments, gamification, and tight feedback loops. The most critical technical requirement is calling `sdk.actions.ready()` to hide the splash screen.

---

## Table of Contents

1. [Farcaster Ecosystem Overview](#farcaster-ecosystem-overview)
2. [Mini Apps vs Frames](#mini-apps-vs-frames)
3. [User Demographics & Behavior](#user-demographics--behavior)
4. [Successful Mini Apps Analysis](#successful-mini-apps-analysis)
5. [8 Principles for Viral Mini Apps](#8-principles-for-viral-mini-apps)
6. [Discovery & Ranking Algorithm](#discovery--ranking-algorithm)
7. [Technical Implementation](#technical-implementation)
8. [Neynar API Integration](#neynar-api-integration)
9. [Voting Apps on Farcaster](#voting-apps-on-farcaster)
10. [ZABAL-Specific Strategy](#zabal-specific-strategy)
11. [Implementation Roadmap](#implementation-roadmap)

---

## Farcaster Ecosystem Overview

### What is Farcaster?

Farcaster is a **decentralized social protocol** built on Ethereum that enables users to own their social identity and data. Unlike traditional social media, users control their accounts via cryptographic keys and can use multiple clients to access the network.

### Key Statistics (2024-2025)

- **546,494 registered users**
- **Daily active users**: 5,000 → 24,700 (400% increase after Frames launch)
- **Daily casts**: 200,000 → 2 million (200% spike in one week)
- **Valuation**: $1 billion (after $150M Series A, May 2024)
- **Revenue**: $194K (2023) → $1.91M (July 2024) = 883.5% growth
- **Funding**: $180M total raised

### Ecosystem Components

**1. Protocol Layer**
- Decentralized identity (FIDs)
- On-chain account ownership
- Hub network for data storage
- Ethereum/Base for transactions

**2. Client Layer**
- **Warpcast** (flagship client, most users)
- Supercast, Neynar, and others
- Each client can have unique features

**3. Application Layer**
- Mini Apps (formerly Frames v2)
- Frames (embedded interactions)
- Bots and integrations

**4. Economic Layer**
- **Creator Rewards**: $25,000 USDC/week to top casters
- **Storage fees**: Revenue distributed to creators
- **USDC integration**: Primary currency on Base
- **NFT minting**: Built-in support

---

## Mini Apps vs Frames

### Frames (v1)
- **Launched**: January 2024
- **Format**: Embedded interactions in casts
- **Technology**: Open Graph protocol
- **Capabilities**: Buttons, images, simple interactions
- **Use case**: Quick actions (vote, mint, play)

### Mini Apps (Frames v2)
- **Launched**: Late 2024
- **Format**: Full web applications in iframe/WebView
- **Technology**: JavaScript SDK + postMessage
- **Capabilities**: Full app functionality, wallet access, notifications
- **Use case**: Complex experiences (games, DeFi, social apps)

### Key Differences

| Feature | Frames | Mini Apps |
|---------|--------|-----------|
| Complexity | Simple | Full apps |
| UI | Static images + buttons | HTML/CSS/JS |
| State | Stateless | Stateful |
| Wallet | Limited | Full EIP-1193 |
| Notifications | No | Yes |
| Discovery | Cast embeds only | App store + embeds |

**Note**: "Frames v2" and "Mini Apps" are the same thing. The ecosystem now uses "Mini Apps" as the official term.

---

## User Demographics & Behavior

### Who Uses Farcaster?

**Primary Audience:**
- Crypto-native builders and creators
- Early adopters and tech enthusiasts
- NFT collectors and artists
- DeFi users and traders
- Web3 developers

**Engagement Patterns:**
- High daily activity (multiple sessions)
- Strong community participation
- Willing to transact on-chain
- Value authenticity and transparency
- Engaged in governance and voting

### Growth Drivers

**1. Frames Launch (Feb 2024)**
- 400% increase in DAU in one week
- Viral spread through social sharing
- New use cases (games, mints, votes)

**2. Wallet Integration**
- In-app USDC deposits on Base
- Seamless transaction signing
- 10% deposit rewards campaign

**3. Creator Rewards**
- $25K/week distributed to top casters
- Incentivizes quality content
- Drives daily engagement

**4. Channel System**
- Community-specific feeds
- Topic-based discovery
- Moderation and curation

---

## Successful Mini Apps Analysis

### Top 20 Mini Apps by Category

#### Games (Highest Engagement)
1. **Clankermon** - Pokémon-style collecting game
2. **FarVille** - FarmVille-style resource management
3. **Megapot** - Transparent lottery ($1 → $100K)
4. **Warpslot** - Casino slots with token rewards
5. **FarGuesser** - GeoGuessr for Farcaster
6. **Farcade** - Arcade mini-games collection
7. **Arrows** - Blend mints to win ETH prizes

**Why they work:**
- Leaderboards and competition
- Social proof (see friends' scores)
- Rewards and prizes
- Easy to share results
- Quick gameplay loops

#### Token Tools
1. **Clanker** - Natural language token launcher
2. **Earn on Morpho** - DeFi yield vaults
3. **Mint.Club** - Bonding curve tokens

**Why they work:**
- Financial incentives
- Low friction onboarding
- Clear value proposition
- Transaction transparency

#### Social/Community
1. **FC Audio Chat** - Clubhouse for Farcaster
2. **Rewards** - Track Warpcast earnings
3. **Rounds.wtf** - Community token rewards
4. **Warpcast Labels** - Spam score checker

**Why they work:**
- Network effects
- Social graph integration
- Community building
- Reputation systems

#### Creators
1. **Paragraph** - Decentralized publishing
2. **TITLES** - AI art training/remixing
3. **Amps** - Boost casts with USDC
4. **Mint** - NFT minting interface
5. **Pods** - Onchain podcasts

**Why they work:**
- Monetization opportunities
- Distribution channels
- Creator tools
- Content ownership

---

## 8 Principles for Viral Mini Apps

Based on analysis of successful apps and builder recommendations:

### 1. Make It Social or It's a Miss

**You're building inside a social network - don't waste that context.**

✅ **Do:**
- Use Farcaster social graph to pre-fill friends
- Pull in usernames, avatars, bios from profiles
- Add leaderboards, badges, stats
- Show activity feeds: "your friends just did X"
- Think multiplayer, even for solo experiences

❌ **Don't:**
- Build isolated experiences
- Ignore social connections
- Hide user activity
- Make it single-player only

**Example:**
```javascript
// Show friends who voted
const friends = await getFriendsWhoVoted(userFID);
displayFriends(friends); // "Alice, Bob, and 5 others voted for Studio"
```

### 2. Create Shareable Moments

**Make it effortless and fun for users to cast what's happening.**

✅ **Do:**
- Add "Share to Warpcast" button at key moments
- Auto-compose cast text with fun copy
- Embed mini-app URL in cast
- Use Open Graph tags for custom preview
- Customize preview with dynamic data

❌ **Don't:**
- Make sharing hard to find
- Auto-tag users (feels spammy)
- Use generic preview images
- Forget to embed app URL

**Key Moments to Share:**
- After voting/completing action
- Achieving milestone or badge
- Winning or ranking high
- Inviting friends
- Celebrating results

**Example:**
```javascript
await sdk.actions.composeCast({
  text: `Just voted for ${mode} on ZABAL! 🎨\n\nCurrent standings:\n🎬 Studio: ${votes.studio}\n🛒 Market: ${votes.market}\n\nWhat's your vote?`,
  embeds: ['https://zabal.art/live.html']
});
```

### 3. Design for Feed Virality

**Your mini-app should look good in the feed - that's where new users discover it.**

✅ **Do:**
- Make preview image eye-catching
- Ensure legibility in small format
- Include social proof (avatars, stats)
- Show engagement signals
- Use dynamic Open Graph images

❌ **Don't:**
- Use generic/boring previews
- Make text too small
- Ignore visual hierarchy
- Use static images only

**Preview Image Best Practices:**
- Size: 1200x630px (Open Graph standard)
- Format: PNG or JPG
- Text: Large, readable fonts
- Branding: Clear but not overwhelming
- Data: Show real-time stats

### 4. Add Friendly Entry Points

**Make it easy to jump in.**

✅ **Do:**
- Auto-sign in users (they're already authenticated)
- Support deep linking with context
- Let users bring friends (invite URLs)
- Autofill names/avatars from Farcaster
- Minimize onboarding steps

❌ **Don't:**
- Require separate login
- Make users fill out forms
- Ignore invite/referral mechanics
- Have complex setup

**Deep Linking Examples:**
```
https://zabal.art/live.html?invite=alice
https://zabal.art/live.html?mode=studio&challenge=bob
```

### 5. Reward People

**People love to flex. People love dopamine.**

✅ **Do:**
- Highlight who did what (recent activity)
- Let people earn/collect things (badges, access)
- Show who brought in new users
- Reward people for casting your app
- Create achievement systems

❌ **Don't:**
- Hide user contributions
- Make rewards unclear
- Ignore referrals
- Forget to celebrate wins

**Reward Types:**
- **Social**: Badges, titles, leaderboard position
- **Access**: Early features, exclusive content
- **Financial**: Token rewards, NFTs, USDC
- **Recognition**: Shoutouts, highlights

### 6. Keep the Loop Tight

**Interact → feedback → share → bring others → repeat.**

✅ **Do:**
- Provide immediate feedback
- Make sharing one-click
- Show social proof instantly
- Enable viral loops
- Track and optimize funnel

❌ **Don't:**
- Have long delays
- Make sharing optional/hidden
- Ignore network effects
- Break the loop

**Key Principle**: If someone uses your app and no one else knows, you failed.

### 7. Use Notifications to Bring People Back

**Farcaster lets you reach users in their notification inbox.**

✅ **Do:**
- Broadcast important events
- Send async/delayed reminders
- Trigger on social actions
- Personalize messages
- Respect user preferences

❌ **Don't:**
- Spam users
- Send irrelevant notifications
- Ignore opt-out preferences
- Use generic messages

**Notification Types:**

**Broadcast:**
- "Voting closes in 1 hour!"
- "New mode just launched"
- "Weekly results are in"

**Async/Delayed:**
- "You haven't voted in 3 days"
- "Your streak is about to break"
- "New features available"

**Social Triggers:**
- "Alice just voted for Studio"
- "Your friend challenged you"
- "You're in the top 10!"

### 8. Plan the Launch Like a Pro

**First impressions matter.**

✅ **Do:**
- Validate manifest before launch
- Test in Warpcast developer mode
- Share in relevant channels
- Engage with early users
- Monitor and iterate quickly

❌ **Don't:**
- Launch without testing
- Ignore early feedback
- Spam channels
- Disappear after launch

**Launch Checklist:**
- [ ] Manifest validates
- [ ] Images load correctly
- [ ] `sdk.actions.ready()` called
- [ ] Sharing works
- [ ] Notifications configured
- [ ] Channel created
- [ ] Launch cast prepared
- [ ] Monitoring setup

---

## Discovery & Ranking Algorithm

### How Apps Are Ranked

Farcaster's search algorithm ranks apps based on **engagement signals**:

**1. Opens (40% weight)**
- How often users access your app
- Unique users vs repeat visits
- Session duration

**2. Additions (30% weight)**
- Users adding app to their collection
- Indicates long-term value
- Strong retention signal

**3. Transactions (20% weight)**
- EVM and Solana transactions within app
- Shows real utility
- Financial engagement

**4. Trending Score (10% weight)**
- Recent growth and momentum
- Velocity of new users
- Viral coefficient

### Requirements for Search Visibility

**Minimum Criteria:**
- ✅ Valid manifest with all required fields
- ✅ Recent user activity (within 30 days)
- ✅ Minimum engagement threshold (varies)
- ✅ Working images with proper headers
- ✅ Production domain (not ngrok/localhost)
- ✅ Complete description and metadata

**Required Manifest Fields:**
- `name` - Clear, descriptive app name
- `iconUrl` - Working image URL (512x512px)
- `homeUrl` - Main entry point
- `description` - Helpful description
- `imageUrl` - Preview image (1200x630px)

**Image Requirements:**
- Must return proper `image/*` content-type header
- Must be accessible (no 404s)
- Must return valid image content
- Recommended: Use CDN for speed

**Domain Requirements:**
- Production domains only
- No development tunnels (ngrok, replit.dev, localtunnel)
- HTTPS required
- Stable domain (can't change later)

### Reindexing & Updates

- **Refresh frequency**: Daily for all domains
- **Hosted manifests**: Changes reflected immediately
- **Self-hosted**: Picked up in next refresh cycle
- **Expedite**: Use manifest tool to trigger reindex

### Optimization Strategies

**To Improve Ranking:**

1. **Increase Opens**
   - Share in channels
   - Post regular updates
   - Use notifications
   - Create compelling preview images

2. **Drive Additions**
   - Prompt users to add app
   - Explain benefits of adding
   - Show what they'll miss
   - Use `sdk.actions.addMiniApp()`

3. **Enable Transactions**
   - Integrate wallet features
   - Add rewards/incentives
   - Make transactions meaningful
   - Use Base for low fees

4. **Build Momentum**
   - Launch with community
   - Engage early users
   - Iterate based on feedback
   - Share milestones

---

## Technical Implementation

### Critical: Call `sdk.actions.ready()`

**This is the #1 reason Mini Apps fail.**

Without calling `ready()`, users see an infinite loading screen and will close your app immediately.

```javascript
import { sdk } from '@farcaster/miniapp-sdk';

// After your app is fully loaded
await sdk.actions.ready();
```

**When to call:**
- After DOM is ready
- After initial data is loaded
- After critical resources loaded
- Before user interaction

**When NOT to call:**
- Before app is ready
- Multiple times
- In error states

### Proper SDK Integration

```javascript
// 1. Import SDK
import { sdk } from '@farcaster/miniapp-sdk';

// 2. Initialize and get context
async function initializeFarcaster() {
  try {
    const context = await sdk.context;
    
    if (context && context.user) {
      // User is authenticated
      const userFID = context.user.fid;
      const username = context.user.username;
      
      // CRITICAL: Hide splash screen
      await sdk.actions.ready();
      
      return { authenticated: true, fid: userFID, username };
    }
  } catch (error) {
    console.log('Not in Farcaster context');
    // Fallback for web browsers
    return { authenticated: false };
  }
}

// 3. Use in app initialization
async function initialize() {
  const farcasterData = await initializeFarcaster();
  
  if (farcasterData.authenticated) {
    // Setup Farcaster-specific features
    setupVoting(farcasterData.fid);
    enableSharing();
    loadSocialGraph();
  } else {
    // Show web version
    showFallbackUI();
  }
}

initialize();
```

### Error Handling

```javascript
try {
  const context = await sdk.context;
  // Use context
} catch (error) {
  if (error.code === 'NOT_IN_MINIAPP') {
    // Not in Farcaster client
    showWebVersion();
  } else if (error.code === 'USER_REJECTED') {
    // User cancelled action
    showCancelMessage();
  } else {
    // Other error
    console.error('SDK error:', error);
  }
}
```

### Available SDK Actions

```javascript
// Compose a cast
await sdk.actions.composeCast({
  text: 'Check this out!',
  embeds: ['https://myapp.com']
});

// View a profile
await sdk.actions.viewProfile({ fid: 3621 });

// View a cast
await sdk.actions.viewCast({ 
  hash: '0xa2fbef8c8e4d00d8f84ff45f9763b8bae2c5c544' 
});

// Open external URL
await sdk.actions.openUrl({ 
  url: 'https://example.com' 
});

// Close the mini app
await sdk.actions.close();

// Prompt user to add app
await sdk.actions.addMiniApp();

// Sign in (for trusted auth)
const { message, signature } = await sdk.actions.signIn({
  nonce: 'random-nonce',
  domain: 'myapp.com'
});
```

### Wallet Integration

```javascript
// Get Ethereum provider
const provider = await sdk.wallet.getEthereumProvider();

// Request accounts
const accounts = await provider.request({ 
  method: 'eth_requestAccounts' 
});

// Get balance
const balance = await provider.request({
  method: 'eth_getBalance',
  params: [accounts[0], 'latest']
});

// Send transaction
const txHash = await provider.request({
  method: 'eth_sendTransaction',
  params: [{
    from: accounts[0],
    to: '0x...',
    value: '0x...',
    data: '0x...'
  }]
});
```

---

## Neynar API Integration

### What is Neynar?

Neynar provides APIs to access Farcaster protocol data without running your own hub. It's the easiest way to:
- Fetch user profiles
- Get social graph data
- Access feeds and casts
- Query followers/following
- Calculate engagement metrics

### Setup

```bash
npm install @neynar/nodejs-sdk
```

```javascript
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: process.env.VITE_NEYNAR_API_KEY,
});

const neynar = new NeynarAPIClient(config);
```

### Fetch User Data

```javascript
// Get user by FID
const { users } = await neynar.fetchBulkUsers({ 
  fids: [userFID],
  viewerFid: userFID 
});

const user = users[0];
console.log({
  fid: user.fid,
  username: user.username,
  displayName: user.display_name,
  pfpUrl: user.pfp_url,
  followerCount: user.follower_count,
  followingCount: user.following_count,
  powerBadge: user.power_badge
});
```

### Get Social Graph

```javascript
// Get followers
const followers = await neynar.fetchUserFollowers({
  fid: userFID,
  limit: 100
});

// Get following
const following = await neynar.fetchUserFollowing({
  fid: userFID,
  limit: 100
});

// Get mutual follows
const mutuals = await neynar.fetchMutualFollowers({
  fid: userFID,
  viewerFid: otherFID
});
```

### Calculate Vote Power

```javascript
async function calculateVoteWeight(fid) {
  const { users } = await neynar.fetchBulkUsers({ fids: [fid] });
  const user = users[0];
  
  let weight = 1; // Base vote
  
  // Follower bonus (logarithmic scale)
  if (user.follower_count > 0) {
    weight += Math.log10(user.follower_count) * 0.5;
  }
  
  // Power badge bonus
  if (user.power_badge) {
    weight += 2;
  }
  
  // Following ZAO bonus
  const following = await neynar.fetchUserFollowing({ fid });
  const followsZao = following.users.some(u => u.fid === 19640);
  if (followsZao) {
    weight += 1;
  }
  
  return Math.round(weight * 10) / 10; // Round to 1 decimal
}
```

---

## Voting Apps on Farcaster

### Votecaster (Vocdoni)

**Architecture:**
- Farcaster Frame for voting interface
- Vocdoni protocol for vote storage
- Warpcast authentication
- Bearer token system (15-day expiration)
- QR code authentication flow

**Key Features:**
- Cryptographically verified votes
- Anonymous voting options
- Real-time results
- Multiple vote types (single choice, ranked, approval)
- Gasless voting

**Authentication Flow:**
1. User opens voting frame
2. Server generates auth link
3. User scans QR code with Warpcast
4. User approves authentication
5. Server receives bearer token
6. Token used for subsequent votes

**Lessons for ZABAL:**
- Proper authentication is critical
- Token expiration needs handling
- QR codes work well for desktop
- Real-time updates engage users
- Clear vote confirmation matters

---

## ZABAL-Specific Strategy

### Current State Analysis

**What's Working:**
- ✅ Supabase database voting
- ✅ Vote changing functionality
- ✅ Real-time vote updates
- ✅ Clean UI design

**What's Missing:**
- ❌ `sdk.actions.ready()` call
- ❌ Manifest file
- ❌ Sharing functionality
- ❌ Social proof
- ❌ Gamification
- ❌ Notifications
- ❌ Vote power weighting

### Optimization Strategy

#### 1. Fix Core SDK (Priority 1)

```javascript
async function initializeFarcaster() {
  try {
    const context = await window.farcasterSDK.context;
    
    if (context && context.user) {
      userFID = context.user.fid;
      username = context.user.username;
      pfpUrl = context.user.pfpUrl;
      isAuthenticated = true;
      
      // CRITICAL: Hide splash screen
      await window.farcasterSDK.actions.ready();
      
      console.log('✅ Farcaster initialized:', { fid: userFID, username });
    }
  } catch (error) {
    console.log('ℹ️ Not in Farcaster, using fallback');
    userFID = localStorage.getItem('userFID') || Math.floor(Math.random() * 1000000);
    isAuthenticated = false;
  }
}
```

#### 2. Add Sharing (Priority 1)

```javascript
async function shareVote(mode, currentVotes) {
  const modeEmojis = {
    studio: '🎬',
    market: '🛒',
    social: '🌐',
    battle: '⚔️'
  };
  
  const castText = `Just voted for ${modeEmojis[mode]} ${mode.toUpperCase()} mode on ZABAL Live Hub! 🎨

Current standings:
🎬 Studio: ${currentVotes.studio}
🛒 Market: ${currentVotes.market}
🌐 Social: ${currentVotes.social}
⚔️ Battle: ${currentVotes.battle}

What's your vote?`;

  try {
    await window.farcasterSDK.actions.composeCast({
      text: castText,
      embeds: ['https://zabal.art/live.html']
    });
  } catch (error) {
    console.error('Failed to share:', error);
  }
}

// Add share button after voting
function showShareButton(mode) {
  const shareBtn = document.createElement('button');
  shareBtn.textContent = '📢 Share Your Vote';
  shareBtn.className = 'share-button';
  shareBtn.onclick = () => shareVote(mode, currentVotes);
  document.querySelector('.vote-section').appendChild(shareBtn);
}
```

#### 3. Add Social Proof (Priority 2)

```javascript
// Show recent voters
async function displayRecentVoters() {
  const { data: recentVotes } = await supabase
    .from('votes')
    .select('fid, mode, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  
  const votersHTML = recentVotes.map(vote => `
    <div class="recent-voter">
      <img src="https://farcaster.xyz/avatar/${vote.fid}" />
      <span>@fid${vote.fid} voted ${vote.mode}</span>
    </div>
  `).join('');
  
  document.querySelector('.recent-voters').innerHTML = votersHTML;
}

// Show friends who voted
async function displayFriendsVotes(userFID) {
  // Get user's following list from Neynar
  const following = await neynar.fetchUserFollowing({ fid: userFID });
  const followingFIDs = following.users.map(u => u.fid);
  
  // Get votes from friends
  const { data: friendVotes } = await supabase
    .from('votes')
    .select('*')
    .in('fid', followingFIDs)
    .eq('vote_date', new Date().toISOString().split('T')[0]);
  
  // Group by mode
  const votesByMode = friendVotes.reduce((acc, vote) => {
    acc[vote.mode] = (acc[vote.mode] || 0) + 1;
    return acc;
  }, {});
  
  // Display
  Object.entries(votesByMode).forEach(([mode, count]) => {
    const modeElement = document.querySelector(`[data-mode="${mode}"]`);
    modeElement.querySelector('.friend-count').textContent = 
      `${count} friend${count > 1 ? 's' : ''} voted`;
  });
}
```

#### 4. Add Gamification (Priority 2)

```javascript
// Voting streak tracking
async function updateVotingStreak(fid) {
  const { data: votes } = await supabase
    .from('votes')
    .select('vote_date')
    .eq('fid', fid)
    .order('vote_date', { ascending: false });
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const vote of votes) {
    const voteDate = new Date(vote.vote_date);
    const dayDiff = Math.floor((currentDate - voteDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Achievement badges
const ACHIEVEMENTS = {
  first_vote: { name: 'First Vote', emoji: '🎯', requirement: 1 },
  week_streak: { name: 'Week Warrior', emoji: '🔥', requirement: 7 },
  month_streak: { name: 'Monthly Master', emoji: '👑', requirement: 30 },
  kingmaker: { name: 'Kingmaker', emoji: '⚡', requirement: 'voted_for_winner_5x' }
};

function displayAchievements(userStats) {
  const earned = [];
  
  if (userStats.totalVotes >= 1) earned.push(ACHIEVEMENTS.first_vote);
  if (userStats.streak >= 7) earned.push(ACHIEVEMENTS.week_streak);
  if (userStats.streak >= 30) earned.push(ACHIEVEMENTS.month_streak);
  if (userStats.winnerVotes >= 5) earned.push(ACHIEVEMENTS.kingmaker);
  
  const badgesHTML = earned.map(badge => `
    <div class="badge" title="${badge.name}">
      ${badge.emoji}
    </div>
  `).join('');
  
  document.querySelector('.achievements').innerHTML = badgesHTML;
}
```

#### 5. Implement Vote Power (Priority 3)

```javascript
async function calculateVotePower(fid) {
  try {
    const { users } = await neynar.fetchBulkUsers({ fids: [fid] });
    const user = users[0];
    
    let power = 1; // Base vote
    
    // Follower bonus (logarithmic)
    if (user.follower_count > 0) {
      power += Math.log10(user.follower_count) * 0.5;
    }
    
    // Power badge bonus
    if (user.power_badge) {
      power += 2;
    }
    
    // Following @thezao bonus
    const following = await neynar.fetchUserFollowing({ fid });
    const followsZao = following.users.some(u => u.fid === 19640);
    if (followsZao) {
      power += 1;
    }
    
    return Math.round(power * 10) / 10;
  } catch (error) {
    console.error('Failed to calculate vote power:', error);
    return 1; // Default to base vote
  }
}

// Update vote submission
async function vote(mode) {
  if (!isAuthenticated) {
    alert('🔐 Please open in Warpcast to vote!');
    return;
  }
  
  // Calculate vote power
  const votePower = await calculateVotePower(userFID);
  
  // Show user their vote power
  displayVotePower(votePower);
  
  // Submit vote with power
  const { data, error } = await supabase
    .from('votes')
    .insert([{
      fid: parseInt(userFID),
      mode: mode,
      vote_power: votePower,
      source: 'miniapp'
    }]);
  
  if (!error) {
    showShareButton(mode);
  }
}
```

#### 6. Add Notifications (Priority 3)

**Webhook Setup:**
```javascript
// Server-side webhook endpoint
app.post('/api/webhook', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'miniapp.added') {
    // User added the app
    await sendWelcomeNotification(data.fid);
  }
  
  res.status(200).send('OK');
});

async function sendWelcomeNotification(fid) {
  await fetch('https://api.farcaster.xyz/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FARCASTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fid: fid,
      title: 'Welcome to ZABAL Live Hub! 🎨',
      body: 'Vote daily to shape the creative direction',
      url: 'https://zabal.art/live.html'
    })
  });
}
```

**Notification Types:**
- Welcome notification when user adds app
- Daily reminder to vote (if haven't voted)
- "Voting closes soon" alerts
- "Your choice is winning!" updates
- Weekly results summary

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Day 1)

**Goal**: Make app functional in Farcaster

- [ ] Add `await sdk.actions.ready()` call
- [ ] Fix context access with proper error handling
- [ ] Test in Warpcast developer mode
- [ ] Verify splash screen disappears
- [ ] Confirm voting works with real FID

**Files to modify:**
- `live.html` (SDK integration)

### Phase 2: Manifest & Discovery (Day 1-2)

**Goal**: Make app discoverable

- [ ] Create `/.well-known/farcaster.json`
- [ ] Use Farcaster Hosted Manifests
- [ ] Create high-quality icon (512x512px)
- [ ] Create preview image (1200x630px)
- [ ] Write compelling description
- [ ] Set category to `art-creativity`
- [ ] Validate manifest
- [ ] Test in preview tool

**Files to create:**
- `public/.well-known/farcaster.json` (or use hosted)
- `public/icon.png`
- `public/preview.png`

### Phase 3: Viral Features (Day 2-3)

**Goal**: Enable sharing and growth

- [ ] Add "Share Vote" button
- [ ] Implement `composeCast` with results
- [ ] Create dynamic OG images
- [ ] Add "Invite Friends" feature
- [ ] Track referrals
- [ ] Show share count

**Files to modify:**
- `live.html` (add sharing UI and logic)

### Phase 4: Social Proof (Day 3-4)

**Goal**: Show community engagement

- [ ] Display recent voters with avatars
- [ ] Show "X friends voted"
- [ ] Add leaderboard (top voters)
- [ ] Display vote history
- [ ] Show voting streaks
- [ ] Add achievement badges

**Files to modify:**
- `live.html` (add social proof sections)
- `supabase-schema-fid.sql` (add leaderboard queries)

### Phase 5: Neynar Integration (Day 4-5)

**Goal**: Add vote power and social graph

- [ ] Set up Neynar API client
- [ ] Fetch user follower count
- [ ] Calculate vote weight
- [ ] Display vote power to user
- [ ] Show social graph connections
- [ ] Add "Following @thezao" bonus

**Files to create:**
- `api/neynar.js` (API integration)

**Files to modify:**
- `live.html` (display vote power)
- `supabase-schema-fid.sql` (update vote_power calculation)

### Phase 6: Notifications (Day 5-6)

**Goal**: Re-engage users

- [ ] Set up webhook endpoint
- [ ] Implement notification sending
- [ ] Add welcome notification
- [ ] Add daily vote reminders
- [ ] Add "voting closes" alerts
- [ ] Add results notifications

**Files to create:**
- `api/webhook.js` (webhook handler)
- `api/notifications.js` (notification logic)

### Phase 7: Channel & Community (Day 6-7)

**Goal**: Build community

- [ ] Create `/zabal` channel
- [ ] Post daily vote updates
- [ ] Share weekly results
- [ ] Engage with voters
- [ ] Cross-promote in art channels
- [ ] Feature top voters

**Actions:**
- Create channel in Warpcast
- Schedule daily posts
- Engage with community

### Phase 8: Polish & Optimize (Day 7+)

**Goal**: Improve based on data

- [ ] Monitor engagement metrics
- [ ] A/B test preview images
- [ ] Optimize sharing copy
- [ ] Improve leaderboard
- [ ] Add more achievements
- [ ] Iterate based on feedback

---

## Success Metrics

### Primary Metrics
1. **Opens** - Daily active users
2. **Additions** - Users adding to collection
3. **Votes cast** - Participation rate
4. **Shares** - Casts with app embed
5. **Retention** - Users returning to vote

### Secondary Metrics
6. **Trending score** - Ranking in discovery
7. **Channel engagement** - Activity in `/zabal`
8. **Referrals** - New users from shares
9. **Streak completion** - Daily voting rate
10. **Transaction volume** - If rewards added

### Targets (30 days)
- 1,000+ opens
- 100+ additions
- 500+ votes cast
- 50+ shares
- 30% retention rate

---

## Resources

- **Farcaster Docs**: https://docs.farcaster.xyz/
- **Mini Apps Docs**: https://miniapps.farcaster.xyz/
- **Neynar Docs**: https://docs.neynar.com/
- **Warpcast**: https://warpcast.com/
- **Developer Tools**: https://farcaster.xyz/~/developers
- **Preview Tool**: https://farcaster.xyz/~/developers/mini-apps/preview
- **Manifest Tool**: https://farcaster.xyz/~/developers/mini-apps/manifest

---

## Conclusion

Building a successful Farcaster Mini App requires:

1. **Technical Excellence** - Proper SDK integration, especially `ready()`
2. **Social Design** - Leverage social graph and network effects
3. **Viral Mechanics** - Make sharing effortless and rewarding
4. **Gamification** - Badges, streaks, leaderboards
5. **Community** - Engage in channels and with users
6. **Iteration** - Monitor metrics and optimize

For ZABAL, the voting app has strong fundamentals. With proper Farcaster integration, viral features, and community engagement, it can become one of the top apps in the art-creativity category.

**Next steps**: Implement Phase 1 (critical fixes), create manifest, add sharing, and launch! 🚀
