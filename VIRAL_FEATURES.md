# ZABAL Viral Features Documentation

> Complete guide to friend tagging, social sharing, and live streaming features

---

## 🚀 Overview

ZABAL's Mini App includes comprehensive viral mechanics designed to spread ZABAL culture through Farcaster's social graph. These features leverage the Neynar API to identify and engage with users' closest friends.

---

## 🎯 Core Viral Features

### 1. Friend Tagging System

**What it does:**
- Fetches user's top 10 best friends via Neynar API
- Displays top 5 friends in share modal
- Allows click-to-select friend tagging
- Auto-mentions selected friends in casts

**User Flow:**
1. User votes on stream mode
2. Share modal opens automatically
3. Top 5 friends displayed with profile pictures
4. User clicks friends to tag (turns yellow)
5. Share includes: `@friend1 @friend2 @friend3 what's your vote?`

**Technical Implementation:**
```javascript
// Fetch best friends on auth
async function loadBestFriends(fid) {
    const response = await fetch(
        `https://api.neynar.com/v2/farcaster/user/best_friends?fid=${fid}&limit=10`,
        { headers: { 'api_key': NEYNAR_API_KEY } }
    );
    const data = await response.json();
    bestFriends = data.result?.users || [];
    topFriend = bestFriends[0];
}

// Display friend tags
function displayFriendTags() {
    list.innerHTML = bestFriends.slice(0, 5).map(friend => `
        <div class="friend-tag-item" onclick="toggleFriendTag('${friend.username}', this)">
            <img src="${friend.pfp_url}" class="friend-tag-pfp">
            <span>@${friend.username}</span>
        </div>
    `).join('');
}

// Toggle selection
function toggleFriendTag(username, element) {
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedFriends = selectedFriends.filter(u => u !== username);
    } else {
        element.classList.add('selected');
        selectedFriends.push(username);
    }
}
```

**CSS Styling:**
```css
.friend-tag-item {
    padding: 6px 12px;
    background: var(--secondary-blue);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    cursor: pointer;
}

.friend-tag-item.selected {
    background: var(--accent-yellow);
    color: var(--bg-black);
}
```

---

### 2. Top Friend Invitation

**What it does:**
- Identifies user's #1 best friend
- Shows dedicated invitation card
- Sends personalized invite message
- Direct mention in cast

**User Flow:**
1. Share modal displays top friend card
2. Shows friend's pfp, username, "Your top friend on Farcaster"
3. User clicks "📨 Invite to Vote"
4. Personalized message sent to /zao channel

**Message Format:**
```
Hey @topfriend! 👋

I just voted 🎬 STUDIO on ZABAL Live Hub!

What's your vote? Join me! 🎨

https://zabal.art/live.html
```

**Technical Implementation:**
```javascript
async function inviteTopFriend() {
    const inviteText = `Hey @${topFriend.username}! 👋\n\nI just voted ${emoji} ${mode} on ZABAL Live Hub!\n\nWhat's your vote? Join me! 🎨\n\n${MINIAPP_URL}`;
    
    await farcasterSDK.actions.composeCast({
        text: inviteText,
        embeds: [MINIAPP_URL],
        channelKey: 'zao'
    });
}
```

---

### 3. Challenge Friends

**What it does:**
- Competitive sharing format
- Tags selected friends or top 3
- Challenge-focused messaging
- Red accent button for emphasis

**User Flow:**
1. User clicks "⚔️ Challenge Friends"
2. Uses selected friends or defaults to top 3
3. Sends competitive challenge message

**Message Format:**
```
⚔️ Challenge time!

@friend1 @friend2 @friend3 I just voted 🎬 STUDIO on ZABAL!

What's YOUR vote? 🎨

https://zabal.art/live.html
```

**Technical Implementation:**
```javascript
async function challengeFriends() {
    const friendsToTag = selectedFriends.length > 0 
        ? selectedFriends 
        : bestFriends.slice(0, 3).map(f => f.username);
    
    const friendMentions = friendsToTag.map(u => `@${u}`).join(' ');
    
    const challengeText = `⚔️ Challenge time!\n\n${friendMentions} I just voted ${emoji} ${mode} on ZABAL!\n\nWhat's YOUR vote? 🎨\n\n${MINIAPP_URL}`;
    
    await farcasterSDK.actions.composeCast({
        text: challengeText,
        embeds: [MINIAPP_URL],
        channelKey: 'zao'
    });
}
```

---

### 4. Live Streaming Share System

**What it does:**
- Shows "Now Live" banner when streaming
- Pulsing red indicator animation
- Modal with both streaming platforms
- Friend tagging in live shares

**Components:**

#### A. Live Banner
```html
<div id="nowLiveBanner" class="now-live-banner">
    <div class="live-pulse"></div>
    <span class="live-text">🔴 ZABAL IS LIVE NOW!</span>
    <button onclick="openLiveShareModal()">📺 Share Stream</button>
</div>
```

```css
.now-live-banner {
    position: fixed;
    top: 60px;
    background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
    padding: 12px 20px;
    z-index: 99;
}

.live-pulse {
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
}
```

#### B. Live Share Modal
```html
<div id="liveShareModal" class="live-share-modal">
    <div class="live-share-content">
        <div class="live-share-header">
            <div class="live-share-title">🔴 ZABAL IS LIVE!</div>
        </div>
        
        <div class="platform-links">
            <div class="platform-link-card">
                <div class="platform-icon">📺</div>
                <div class="platform-info">
                    <div class="platform-name">Twitch</div>
                    <div class="platform-url">twitch.tv/bettercallzaal</div>
                </div>
                <a href="https://twitch.tv/bettercallzaal" target="_blank">Watch</a>
            </div>
            
            <div class="platform-link-card">
                <div class="platform-icon">🎬</div>
                <div class="platform-info">
                    <div class="platform-name">Retake.tv</div>
                    <div class="platform-url">retake.tv/zaal</div>
                </div>
                <a href="https://retake.tv/zaal" target="_blank">Watch</a>
            </div>
        </div>
        
        <button onclick="shareLiveStream()">🟣 Share to Farcaster</button>
    </div>
</div>
```

#### C. Live Share Function
```javascript
async function shareLiveStream() {
    const shareText = `🔴 ZABAL IS LIVE NOW! 🎨\n\nJoin the stream and watch us create in real-time!\n\n📺 Twitch: twitch.tv/bettercallzaal\n🎬 Retake: retake.tv/zaal\n\nCome hang! 👇`;
    
    // Add friend tags
    let friendTags = '';
    if (bestFriends.length > 0) {
        const friendsToTag = bestFriends.slice(0, 3).map(f => f.username);
        friendTags = '\n\n' + friendsToTag.map(u => `@${u}`).join(' ') + ' join me!';
    }
    
    await farcasterSDK.actions.composeCast({
        text: shareText + friendTags,
        embeds: ['https://twitch.tv/bettercallzaal'],
        channelKey: 'zao'
    });
}
```

#### D. Live Status Management
```javascript
// Check live status
function checkLiveStatus() {
    const liveStatus = localStorage.getItem('zabalLiveStatus');
    if (liveStatus === 'live') {
        showLiveBanner();
    }
}

// Manual controls
window.setLiveStatus = function(status) {
    localStorage.setItem('zabalLiveStatus', status);
    if (status === 'live') {
        showLiveBanner();
    } else {
        hideLiveBanner();
    }
}

// Auto-check every 2 minutes
setInterval(checkLiveStatus, 120000);
```

---

## 📊 Viral Mechanics Analysis

### Why These Features Work

**1. Social Proof**
- Seeing friends' pfps creates trust
- "Your top friend" label adds credibility
- Friend activity drives FOMO

**2. Low Friction**
- One-click friend selection
- Pre-filled messages
- Auto-tag top friends

**3. Multiple Entry Points**
- After voting (share modal)
- Top friend invitation
- Challenge friends
- Live streaming shares

**4. Personalization**
- Uses actual friend data
- Identifies #1 friend
- Customizes messages per mode

**5. Network Effects**
- Each share reaches 3-5 friends
- Friends see friends voting
- Creates viral loops

---

## 🎯 Usage Patterns

### Pattern 1: Vote Share Flow
```
User votes → Share modal opens → Tag 3 friends → Share
→ Friends see cast → Friends click link → Friends vote
→ Friends tag their friends → Viral loop continues
```

### Pattern 2: Top Friend Invitation
```
User votes → See top friend card → Invite friend
→ Friend receives personal invite → Friend votes
→ Friend invites their top friend → Exponential growth
```

### Pattern 3: Challenge Flow
```
User votes → Challenge friends → Friends see challenge
→ Competitive response → Friends challenge back
→ Creates engagement spiral
```

### Pattern 4: Live Stream Flow
```
Stream starts → Banner appears → Users share
→ Friends see live notification → Friends join stream
→ Friends share → Viewership compounds
```

---

## 🔧 Configuration

### Neynar API Setup
```javascript
const NEYNAR_API_KEY = '15CC284E-9C7E-44C8-9D32-BC82D3C05320';

// Endpoints used:
// - GET /v2/farcaster/user/best_friends?fid={fid}&limit=10
```

### Friend Limits
```javascript
const FRIEND_TAG_LIMIT = 5;  // Max friends shown in tag list
const CHALLENGE_FRIEND_LIMIT = 3;  // Default friends in challenge
const LIVE_SHARE_FRIEND_LIMIT = 3;  // Friends tagged in live shares
```

### Share Channels
```javascript
const SHARE_CHANNEL = 'zao';  // All shares go to /zao channel
```

---

## 📈 Success Metrics

### Key Metrics to Track

**Engagement:**
- Friend tag usage rate
- Top friend invitation rate
- Challenge button clicks
- Live share participation

**Viral Coefficient:**
- Shares per vote
- Friends tagged per share
- Click-through rate on friend mentions
- New users from friend shares

**Retention:**
- Return rate after friend invite
- Friend group voting patterns
- Multi-day engagement

---

## 🚀 Future Enhancements

### Planned Features

**1. Friend Activity Feed**
```javascript
// Show what friends are doing
"🎬 @alice voted STUDIO 2 hours ago"
"🛒 @bob voted MARKET (now leading!)"
"⚔️ @charlie started a 5-day streak"
```

**2. Friend Leaderboards**
```javascript
// Rankings among friends only
Your Friends Leaderboard:
1. @alice - 45 votes 🥇
2. You - 38 votes
3. @bob - 32 votes 🥉
```

**3. Group Voting Parties**
```javascript
// Create voting rooms
"Create a voting party with your friends!"
"5/10 friends have voted - invite more!"
```

**4. Collaborative Rewards**
```javascript
// Unlock rewards together
"Get 5 friends to vote → Unlock exclusive badge"
"Your friend group hit 100 total votes! 🎊"
```

---

## 🛠️ Troubleshooting

### Common Issues

**Friends not loading:**
- Check Neynar API key
- Verify FID is valid
- Check network requests in console
- Ensure user is authenticated

**Friend tags not appearing in cast:**
- Verify `selectedFriends` array
- Check cast text formatting
- Ensure `@` prefix on usernames
- Test with single friend first

**Live banner not showing:**
- Check `localStorage.getItem('zabalLiveStatus')`
- Verify banner element exists
- Check CSS display property
- Test with `setLiveStatus('live')`

---

## 📚 API Reference

### Neynar Best Friends API

**Endpoint:**
```
GET https://api.neynar.com/v2/farcaster/user/best_friends
```

**Parameters:**
- `fid` (required) - Farcaster ID of user
- `limit` (optional) - Number of friends to return (default: 10)

**Response:**
```json
{
  "result": {
    "users": [
      {
        "fid": 12345,
        "username": "alice",
        "display_name": "Alice",
        "pfp_url": "https://...",
        "verified": true
      }
    ]
  }
}
```

---

## 🎨 Design Guidelines

### Friend Tag Pills
- 20px pfp with yellow border
- 0.85rem username
- 6px vertical padding
- 12px horizontal padding
- 16px border radius
- Yellow background when selected

### Top Friend Card
- 40px pfp with 2px yellow border
- Gradient background
- 2px yellow border on card
- "Your top friend on Farcaster" label

### Challenge Button
- Red gradient background
- White text
- Prominent placement
- Hover lift effect

### Live Banner
- Fixed position at top
- Red gradient background
- Pulsing white dot
- White text on red
- Z-index: 99

---

**Built with ❤️ for viral ZABAL culture spreading**

*Last updated: December 21, 2024*
