# ZABAL.art

> The live coordination hub and creative submission portal for the ZABAL ecosystem

[![Live Site](https://img.shields.io/badge/Live-ZABAL.art-e0ddaa?style=for-the-badge)](https://zabal.art)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-141e27?style=for-the-badge&logo=github)](https://github.com/bettercallzaal/zabalartsubmission)

---

## 📖 Table of Contents

- [About](#about)
- [Quick Start](#quick-start)
- [Pages Overview](#pages-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Farcaster Mini App Setup](#farcaster-mini-app-setup)
- [Database Setup](#database-setup)
- [Manifest Configuration](#manifest-configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)

---

## 🎯 About

ZABAL.art is the central hub for the ZABAL ecosystem — a living coordination network where streams are decided by the community, creators submit work, and collective discovery happens in real-time.

**Now available as a Farcaster Mini App!** Vote on stream direction directly from Warpcast with seamless authentication and social sharing.

### The ZABAL Ecosystem

**Three Core Pillars:**

1. **ZABAL** - The Coordination Layer
   - Fast-moving distribution layer
   - Stream wheel voting system
   - Submission hub → Stream review → Weekly recap
   - Leaderboards, community activity, daily presence

2. **The ZAO** - The Foundation
   - Contribution-based governance
   - Weekly fractals for recognition
   - Slow, steady, intentional culture
   - Built on real work, not noise

3. **WaveWarZ** - The Creative Engine
   - Weekly music battles
   - Live discovery platform
   - Community-driven stage for artists

### Vision

Building toward **ZAO Stock 2026** - a physical Maine-based event that brings the entire ecosystem together. ZABAL.art scales the distribution and visibility needed to make this vision real.

---

## 🚀 Quick Start

### For Users
1. **Submit** creative work at [zabal.art](https://zabal.art)
2. **Vote** at [zabal.art/live.html](https://zabal.art/live.html) for today's stream mode
3. **Vote in Warpcast** - Open live.html in Farcaster for native Mini App experience
4. **Read** updates at [zabal.art/gallery.html](https://zabal.art/gallery.html)
5. **Join** [Discord](https://discord.bettercallzaal.com) for community

### For Developers
```bash
# Clone repository
git clone https://github.com/bettercallzaal/zabalartsubmission.git
cd zabalartsubmission

# Open in browser
open index.html

# Or use a local server
python -m http.server 8000
# Visit http://localhost:8000
```

---

## � File Structure

```
ZABAL ART WEBSITE/
├── index.html              # Main submission portal
├── live.html               # Farcaster Mini App voting hub
├── gallery.html            # Research & updates archive
├── .well-known/
│   └── farcaster.json      # Farcaster Mini App manifest
├── logo.png                # App icon (512x512)
├── preview.png             # Social preview image (1200x630)
├── splash.png              # Splash screen (1024x1024)
├── vercel.json             # Vercel deployment config
├── supabase-schema-fid.sql # Database schema for voting
├── .env.example            # Environment variables template
├── README.md               # This file
├── FARCASTER_ECOSYSTEM.md  # Deep-dive Farcaster documentation
└── public/                 # Legacy folder (empty)
```

### Core Files Explained

**HTML Pages:**
- `index.html` - Submission portal with type selection and form
- `live.html` - Main Mini App with voting, authentication, and sharing
- `gallery.html` - Archive of Paragraph articles, Spaces, and streams

**Farcaster Integration:**
- `.well-known/farcaster.json` - Manifest with account association
- `logo.png`, `preview.png`, `splash.png` - Required Mini App images
- Embed meta tags in `live.html` for rich social sharing

**Backend:**
- `supabase-schema-fid.sql` - PostgreSQL schema with RLS policies
- `.env.example` - Template for Supabase and Neynar API keys

**Voting Streaks**
- Track consecutive days
- Display streak counter in header
- Unlock vote power at milestones
- Badges: First Vote, Week Warrior, Trendsetter

**Enhanced Leaderboard**
- Multiple categories (votes, streak, accuracy)
- Real-time updates
- User highlighting
- Weekly/monthly views

**Vote History**
- Personal voting calendar
- Win/loss record
- Favorite mode statistics

### Phase 2: Social Proof (Week 3-4)

**Friends Who Voted (Neynar API)**
- "12 of your friends voted today"
- Show mutual followers
- Increases voting by 5x

**Vote Power System**
- Following @thezao: +1
- Active in /zabal: +1
- 5+ day streak: +1
- Display multiplier prominently

**Activity Feed**
- Recent votes ticker
- "@alice just voted for Studio!"
- Creates FOMO and urgency

### Phase 3: Notifications & Growth (Month 2)

**Farcaster Notifications**
- "Voting closes in 2 hours!"
- "Your mode won! 🎉"
- "Don't break your streak!"
- Requires webhook setup

**Channel Integration**
- Auto-post daily results to /zabal
- Weekly recap casts
- Highlight top voters

**Discovery**
- Submit to Farcaster directory
- Get featured in Art & Creativity
- Cross-promote with other Mini Apps

### Phase 4: Analytics (Month 2-3)

**User Dashboard**
- Personal voting stats
- Prediction accuracy
- Influence score
- Contribution metrics

**Community Insights**
- Vote trends over time
- Mode popularity charts
- Peak voting hours
- Geographic distribution

### Long-term Vision

**ZAO Stock 2026 Integration**
- Voting history as proof of participation
- Early voter NFTs/POAPs
- VIP access for top contributors
- Physical leaderboard at event

**Ecosystem Expansion**
- WaveWarZ voting integration
- Cross-app reputation system
- Unified ZABAL identity
- Token-gated features

---

## � Pages Overview

### 🎡 Live Hub (`/live.html`) - Farcaster Mini App
**The stream isn't scheduled. It's decided.**

- **Farcaster Integration** - Native Mini App with automatic authentication
- **User Profile Display** - Shows @username when signed in with Farcaster
- **Dynamic Hero** - Changes based on stream state (deciding/locked/live)
- **Stream Wheel** - Vote for today's mode (Studio/Market/Social/Battle)
- **Real-time Voting** - Supabase-powered voting with FID authentication
- **Vote Confirmation** - Visual banner showing which mode you voted for
- **Share Modal** - Copy miniapp link or share to Farcaster with friend tagging
- **Social Sharing** - Posts to /zabal channel with vote results, friend mentions, and miniapp link
- **Friend Tagging** - Tag up to 5 friends in shares with profile pictures
- **Top Friend Invitation** - Dedicated card to invite your #1 friend
- **Challenge Friends** - Competitive sharing with friend mentions
- **Live Stream Sharing** - Share when ZABAL goes live on Twitch/Retake
- **Today/Yesterday Display** - Shows current leader and previous winner
- **Built on Stream Artifacts** - Proof of coordination, not just content
- **Proof Section** - ∞ streams decided by you, 4 modes, 0 scheduled
- **Fully Mobile Responsive** - Optimized for all screen sizes

### 🎨 Submission Portal (`/index.html`)
**A Creative Submission Portal**

- **Live Stream Status** - Pulsing indicator when streaming
- **Animated Stats Counter** - 250+ submissions, 85+ creators, 42+ hours
- **ZABAL Ecosystem Links** - Songjam Leaderboard, Incented Campaign
- **Tally Form Integration** - Submit art, music, videos, and more
- **FAQ Section** - Common questions answered
- **Submission Types** - Art, Music, Remix, Video, Photography, Memes, Writing, Code, Farcaster

### 📰 Research Archive (`/gallery.html`)
**ZABAL Research & Updates**

- **Featured Article** - Latest ZABAL update highlighted
- **Newsletter Archive** - ZABAL Updates #1-5
- **Weekly Recaps** - Week-by-week highlights
- **Day 276 Origin Story** - The beginning of collective discovery

---

## ✨ Features

### Current Features (v2.0)

#### Live Coordination Hub
- **Stream Wheel Voting System**
  - 4 modes: Studio, Market, Social, Battle
  - Real-time vote counting via Supabase
  - Visual leader indicator
  - FID-based persistent voting
  - Countdown to lock time
  - Vote changing functionality

- **Viral Social Features**
  - Friend tagging in vote shares
  - Top friend invitation system
  - Challenge friends functionality
  - Auto-suggest top 3-5 friends
  - Friend profile pictures and usernames
  - Click-to-select friend interface
  - Personalized share messages

- **Live Streaming Integration**
  - "Now Live" banner with pulse animation
  - Live share modal with platform cards
  - Twitch: twitch.tv/bettercallzaal
  - Retake.tv: retake.tv/zaal
  - Friend tagging in live shares
  - Manual live status control

- **Dynamic Hero States**
  - DECIDING: "Today's Stream Is Being Decided"
  - LOCKED: "Today's Stream: [Mode Name]"
  - LIVE: "🔴 [Mode Name] — Live"

- **Today/Yesterday Cards**
  - Current leader with vote count
  - Previous day's winner
  - Links to change vote or watch replay

- **Built on Stream Artifacts**
  - Songs created live
  - Decisions made by community
  - Clips and highlights
  - Experiments and coordination

#### Submission Portal
- **Fixed Header Navigation**
  - Live stream status indicator
  - Links to Live Hub, Submit, Research, Discord
  - Twitch integration

- **Animated Stats Counter**
  - Scroll-triggered counting animation
  - Gradient text styling
  - Real-time feel

- **Tally Form Integration**
  - Embedded submission form
  - Discord webhook notifications
  - File upload support
  - Multiple submission types

- **FAQ & Guidelines**
  - 6 common questions
  - Submission process explained
  - Rights and timeline covered

#### Research Archive
- **Featured Article Preview**
  - Extended excerpt and metadata
  - Prominent CTA to full article

- **Newsletter Archive**
  - ZABAL Updates #1-5
  - Card-based layout with read times
  - Links to Paragraph.com posts

- **Weekly Recaps**
  - Week-by-week highlights
  - Bullet-point summaries

### Design Features
- **Dark theme** with blue (#141e27) and yellow (#e0ddaa) accents
- **Responsive design** - Mobile-first approach
- **Smooth animations** - Hover effects, transitions, scroll triggers
- **Gradient text** - White to yellow gradients on headings
- **Card-based UI** - Consistent card patterns throughout
- **Accessibility** - Semantic HTML, proper contrast ratios

---

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - No frameworks, lightweight
- **System Fonts** - Apple/SF Pro, Segoe UI, Roboto

### Integrations
- **Farcaster** - Decentralized social protocol for Mini App
- **Supabase** - PostgreSQL database for vote storage and real-time updates
- **Neynar API** - Farcaster data access for best friends and social graph
- **Tally.so** - Form builder and submission management
- **Paragraph.com** - Newsletter hosting (The ZAO Newsletter)
- **Discord** - Community and submission notifications
- **Twitch** - Live streaming platform (twitch.tv/bettercallzaal)
- **Retake.tv** - Alternative streaming platform (retake.tv/zaal)
- **SongJam** - Leaderboard tracking
- **Incented** - Campaign management

### Hosting & Deployment
- **GitHub** - Version control
- **Vercel** - Automatic deployment from main branch
- **Custom Domain** - ZABAL.art

---

## 🎨 Design System

### Color Palette

```css
--primary-blue: #141e27;    /* Backgrounds, cards */
--accent-yellow: #e0ddaa;   /* CTAs, highlights, borders */
--bg-black: #000000;        /* Main background */
--text-white: #ffffff;      /* Primary text */
--text-gray: #a0a0a0;       /* Secondary text */
--border-color: #2a3a47;    /* Card borders */
--hover-glow: rgba(224, 221, 170, 0.2); /* Hover shadows */
```

### Typography

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Helvetica', 'Arial', sans-serif;
```

**Heading Sizes:**
- H1: `clamp(2.5rem, 8vw, 5rem)` - Hero titles
- H2: `clamp(2rem, 5vw, 3rem)` - Section headings
- H3: `1.2rem - 2rem` - Card titles
- Body: `1rem - 1.2rem` - Paragraph text

### Component Patterns

#### Card Pattern
```css
.card {
    background: var(--primary-blue);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    transition: all 0.3s ease;
}

.card:hover {
    border-color: var(--accent-yellow);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px var(--hover-glow);
}
```

#### Button Pattern
```css
.button {
    padding: 12px 28px;
    background: var(--accent-yellow);
    color: var(--bg-black);
    border-radius: 8px;
    font-weight: 700;
    transition: all 0.3s ease;
}

.button:hover {
    background: var(--text-white);
    transform: translateX(5px);
}
```

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (COMPLETED)
- Live stream status indicator with pulsing animation
- Animated stats counter (submissions, creators, hours, members)
- Weekly recaps section on gallery page
- Mobile-responsive design
- Comprehensive documentation

### ✅ Phase 2: Live Coordination (COMPLETED)
- Stream wheel voting system
- Dynamic hero with state management
- Today/yesterday mode display
- Built on stream artifacts section
- Proof section with live metrics

### ✅ Phase 2.5: Farcaster Mini App (COMPLETED)
- Farcaster SDK integration with proper splash screen handling
- FID-based authentication and voting
- Supabase database for vote persistence
- Vote changing functionality with RLS policies
- Social sharing with composeCast integration
- Manifest file for app discovery
- Comprehensive ecosystem research documentation

### ✅ Phase 2.6: Viral Social Features (COMPLETED)
- **Neynar Best Friends Integration**
  - Automatic fetching of user's top 10 best friends
  - Top friend identification and display
  - Friend data caching for performance
- **Friend Tagging in Shares**
  - Tag up to 5 friends in vote shares
  - Click-to-select friend interface
  - Auto-mention selected friends in casts
  - Visual selection with yellow highlights
- **Top Friend Invitation System**
  - Dedicated invitation card for #1 friend
  - Personalized "Invite to Vote" messages
  - Direct friend mentions in casts
- **Challenge Friends Feature**
  - Competitive "Challenge Friends" button
  - Auto-tag selected or top 3 friends
  - Challenge-focused messaging
- **Live Streaming Share System**
  - "Now Live" banner when streaming
  - Pulsing red indicator animation
  - Live share modal with platform links
  - Twitch and Retake.tv integration
  - Friend tagging in live stream shares

### 🚀 Phase 3: Enhanced Mini App Features (NEXT)

**Priority: Mini App Optimization**
- Create app icon, preview, and splash images
- Add account association to manifest
- Implement vote power calculation with Neynar
- Add friend activity feed (who voted today)
- Implement notifications for engagement
- Create /zabal channel for community
- Add voting streaks and leaderboards
- Friend-based leaderboards

**Additional Backend Features:**
- Tally webhook → Supabase connection for submissions
- API endpoints for creator profiles
- Submission status tracking

**Features In Progress:**

1. **Recent Submissions Feed**
   - Display last 10-20 submissions
   - Show: thumbnail, creator, type, timestamp
   - "Watch Review" link when streamed
   - Auto-refresh

2. **Real Voting Persistence** ✅ COMPLETED
   - Store votes in Supabase database
   - Real-time vote counting across users
   - FID-based authentication
   - Vote changing functionality
   - Daily vote aggregation

3. **Submission Status Tracker**
   - Unique submission ID
   - Status: Queued → Reviewed → Featured
   - Email/Discord notifications
   - Public status page

4. **Creator Profiles**
   - Profile cards with avatar, bio
   - Submitted works gallery
   - Social links (Farcaster, Twitter)
   - Leaderboard rank

### 🏗️ Phase 4: Ecosystem Integration (FUTURE)

- **Vote Power System** - Follower-based vote weighting with Neynar
- **Leaderboards** - Top voters, voting streaks, achievements
- **SongJam Leaderboard** - Real-time embed on homepage
- **WaveWarZ Integration** - Music battles calendar and voting
- **ZAO Fractal Explainer** - Governance education page
- **Token & Rewards Dashboard** - ZABAL token info and multipliers
- **Enhanced Farcaster Features** - Notifications, channel integration, gamification

---

## 🔧 Farcaster Mini App Setup

### Prerequisites

**Required Services:**
1. **Supabase Account** - PostgreSQL database
2. **Neynar API Key** - Get from [dev.neynar.com](https://dev.neynar.com)
3. **Farcaster Account** - For manifest signing
4. **Vercel Account** - For deployment

### Environment Variables

Create `.env` file with:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Neynar API
VITE_NEYNAR_API_KEY=your-neynar-api-key

# Farcaster
VITE_ZAO_FID=19640  # @thezao FID
```

### Vote Power System

Votes are weighted based on Farcaster activity:
- **Base**: 1 vote (any Farcaster user)
- **Follower**: 2 votes (following @thezao)
- **Active**: 3 votes (following + 5+ casts in /zao channel)
- **Holder**: 4 votes (active + holds ZAO/LOANZ tokens - future)

---

## 🗄️ Database Setup

### Step 1: Run SQL Schema

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase-schema-fid.sql`
3. This creates:
   - `votes` table - FID-based vote storage
   - `vote_power_cache` table - Neynar data cache
   - `mode_votes_daily` table - Daily aggregations
   - Helper functions and RLS policies

### Step 2: Configure Vercel

1. Go to Vercel Project Settings → Environment Variables
2. Add all variables from `.env`
3. Redeploy project

---

## 📱 Manifest Configuration

### Current Status

**What we have:**
- ✅ Basic manifest structure
- ✅ SDK integration with `ready()` call
- ✅ Share functionality
- ❌ Missing: Working images
- ❌ Missing: Account association

### Option A: Farcaster Hosted Manifests (RECOMMENDED)

**Benefits:**
- No manifest file in codebase
- Update without redeploying
- Automatic account association
- Built-in validation

**Setup:**

1. **Create Hosted Manifest**
   - Visit: https://farcaster.xyz/~/developers/mini-apps/manifest
   - Domain: `zabal.art`
   - Fill in app details
   - Sign with Farcaster account
   - Get manifest ID

2. **Configure Redirect in vercel.json**
   ```json
   {
     "redirects": [
       {
         "source": "/.well-known/farcaster.json",
         "destination": "https://api.farcaster.xyz/miniapps/hosted-manifest/YOUR_ID",
         "permanent": false
       }
     ]
   }
   ```

3. **Remove Static Manifest**
   ```bash
   rm -rf .well-known/
   rm -rf public/.well-known/
   ```

### Required Images for Discovery

**Critical:** App won't appear in search without these!

1. **logo.png** (512x512px)
   - ZABAL branding on dark background
   - Colors: #141e27, #e0ddaa
   - Place in root directory

2. **preview.png** (1200x630px)
   - "Vote on ZABAL's Direction" + mode icons 🎬🛒🌐⚔️
   - Used for social sharing

3. **splash.png** (1024x1024px)
   - ZABAL logo centered
   - Background: #141e27
   - Loading screen

---

## 🚀 Deployment

### Vercel Configuration

**vercel.json:**
```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    {
      "source": "/.well-known/farcaster.json",
      "destination": "https://api.farcaster.xyz/miniapps/hosted-manifest/YOUR_ID",
      "permanent": false
    }
  ]
}
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add -A
   git commit -m "feat: update configuration"
   git push origin main
   ```

2. **Vercel Auto-Deploys** (~2 minutes)
   - Check: https://vercel.com/dashboard

3. **Verify Deployment**
   - Test pages load: https://zabal.art/live.html
   - Check manifest redirect: https://zabal.art/.well-known/farcaster.json
   - Verify images: https://zabal.art/logo.png

---

## 🧪 Testing

### In Warpcast

1. **Enable Developer Mode**
   - Settings → Advanced → Developer Mode

2. **Test App**
   - Open: https://zabal.art/live.html
   - Check splash screen disappears
   - Verify FID authentication
   - Test voting
   - Test share button

### Validation Tools

1. **Manifest Validator**
   - https://farcaster.xyz/~/developers/mini-apps/manifest
   - Enter domain: `zabal.art`
   - Check for green checkmarks

2. **Preview Tool**
   - https://farcaster.xyz/~/developers/mini-apps/preview
   - Test: https://zabal.art/live.html

### Test Scenarios

- **Base User**: 1 vote power
- **Follower**: 2 vote power (following @thezao)
- **Active**: 3 vote power (5+ casts in /zao)
- **Daily Limit**: Can only vote once per day
- **Vote Changing**: Can change vote same day
- **Share Flow**: Share button after voting

---

## 📁 File Structure

### Complete File Tree

```
ZABAL ART WEBSITE/
├── index.html                      # Main submission portal page
├── live.html                       # Live coordination hub (Farcaster Mini App)
├── gallery.html                    # Research & updates archive
├── README.md                       # This comprehensive documentation
├── FARCASTER_ECOSYSTEM.md          # Complete Farcaster research & strategy
├── NEXT_STEPS.md                   # Implementation roadmap & testing guide
├── SETUP.md                        # Technical setup guide for voting system
├── ARCHITECTURE.md                 # System architecture documentation
├── .env.example                    # Environment variables template
├── supabase-schema-fid.sql         # FID-based database schema
├── public/.well-known/
│   └── farcaster.json              # Farcaster Mini App manifest
└── .git/                           # Git version control
```

### File Explanations

#### **`index.html`** (34KB)
**Purpose:** Main landing page and creative submission portal

**What it does:**
- Displays live stream status with pulsing indicator
- Shows animated stats counter (submissions, creators, hours)
- Provides links to ZABAL ecosystem (SongJam, Incented)
- Embeds Tally form for submissions
- Explains submission types and guidelines
- Answers frequently asked questions

**Key sections:**
1. **Header** - Navigation with live stream status
2. **Hero** - Main title and call-to-action
3. **Stats** - Animated counter showing ecosystem metrics
4. **ZABAL Links** - External integrations
5. **About** - Ecosystem explanation
6. **Submission Types** - 9 categories (Art, Music, Video, etc.)
7. **Form** - Tally.so embedded submission form
8. **Guidelines** - Submission rules and expectations
9. **Process** - What happens after submission
10. **FAQ** - Common questions answered
11. **Footer** - Social links and copyright

**JavaScript features:**
- Tally form loader
- Intersection Observer for scroll animations
- Stats counter animation
- Stream status checker (polls every 60s)

**When to edit:**
- Update stats numbers
- Add new submission types
- Modify FAQ answers
- Change ecosystem links

---

#### **`live.html`** (35KB) - Farcaster Mini App
**Purpose:** Live coordination hub where community votes for stream mode via Farcaster

**What it does:**
- Integrates with Farcaster SDK for seamless authentication
- Shows dynamic hero based on stream state (deciding/locked/live)
- Displays stream wheel with 4 voting options
- Stores votes in Supabase with FID-based authentication
- Enables one-click social sharing to Farcaster feed
- Shows real-time vote counts across all users
- Displays today's leader and yesterday's winner
- Shows artifacts built on stream
- Provides proof metrics (streams, modes, schedule)

**Key sections:**
1. **Header** - Navigation matching other pages
2. **Dynamic Hero** - Changes based on time/state
3. **Stream Wheel** - 4 mode cards (Studio, Market, Social, Battle)
4. **Share Button** - Appears after voting to cast results
5. **Today/Yesterday** - Current and previous winners
6. **Built on Stream** - Artifacts and creations
7. **Proof** - Metrics showing community coordination
8. **Footer** - Consistent across site

**JavaScript features:**
- Farcaster SDK integration with `sdk.actions.ready()`
- FID-based user authentication
- Supabase database for vote persistence
- Vote changing functionality (DELETE + INSERT)
- Social sharing with `composeCast`
- State management (deciding/locked/live)
- Countdown timer to lock time
- Real-time vote counting across users
- Leader calculation and display
- Neynar Best Friends API integration
- Friend tagging and selection system
- Top friend identification and display
- Live streaming status management
- Friend mention formatting in casts

**States:**
- **DECIDING** (before 5 PM EST) - "Today's Stream Is Being Decided"
- **LOCKED** (5 PM - 7 PM EST) - "Today's Stream: [Winner]"
- **LIVE** (7 PM - 10 PM EST) - "🔴 [Mode] — Live"

**When to edit:**
- Change lock/stream times
- Add new voting modes
- Update artifact examples
- Modify proof metrics
- Update Neynar API key
- Modify friend tagging limits
- Change live streaming platforms
- Update share message templates

---

#### **`gallery.html`** (25KB)
**Purpose:** Archive of ZABAL research, updates, and weekly recaps

**What it does:**
- Features latest ZABAL update prominently
- Archives all newsletter posts (#1-5)
- Shows weekly recap summaries
- Provides links to full articles on Paragraph
- Displays Day 276 origin story

**Key sections:**
1. **Header** - Navigation
2. **Hero** - Page title and description
3. **Featured Article** - Latest update with extended preview
4. **Updates Grid** - Newsletter archive cards
5. **Weekly Recaps** - Week-by-week highlights
6. **CTA** - Call to action for Discord/Newsletter
7. **Footer** - Consistent footer

**Content:**
- ZABAL Update #1: "Day 276: The Beginning"
- ZABAL Update #2: "The First Week"
- ZABAL Update #3: "Building Momentum"
- ZABAL Update #4: "Community Growth"
- ZABAL Update #5: "Looking Forward"

**When to edit:**
- Add new newsletter posts
- Update weekly recaps
- Change featured article
- Add new content sections

---

#### **`FARCASTER_ECOSYSTEM.md`** (50KB)
**Purpose:** Comprehensive research on Farcaster ecosystem and Mini Apps

**What it contains:**
- Farcaster ecosystem overview and statistics
- Analysis of 20+ successful Mini Apps
- 8 principles for viral Mini Apps
- Discovery and ranking algorithm details
- Technical implementation guide
- Neynar API integration patterns
- Voting app case studies
- ZABAL-specific optimization strategies
- Complete implementation roadmap

**Who uses this:**
- Developers building Farcaster features
- Product managers planning features
- Designers creating Mini App assets

---

#### **`NEXT_STEPS.md`** (15KB)
**Purpose:** Action plan and testing guide for Mini App launch

**What it contains:**
- Completed features checklist
- Immediate action items
- Testing instructions for Warpcast
- Troubleshooting common issues
- Launch strategy and timeline
- Success metrics and targets
- Asset creation requirements

---

#### **`SETUP.md`** (4.4KB)
**Purpose:** Technical setup guide for FID-based voting system

**What it contains:**
- Supabase configuration
- Farcaster SDK setup
- Neynar API credentials
- Environment variables
- Database setup instructions
- RLS policy configuration
- Testing scenarios
- Deployment checklist

**Who uses this:**
- Developers implementing voting
- DevOps setting up infrastructure
- QA testing the system

**When to reference:**
- Setting up Supabase database
- Configuring Farcaster SDK
- Integrating Neynar API
- Testing Mini App in Warpcast
- Deploying to production

---

#### **`public/.well-known/farcaster.json`** (0.3KB)
**Purpose:** Farcaster Mini App manifest for discovery

**What it contains:**
- App metadata (name, description, category)
- Icon and preview image URLs
- Home URL and button text
- Splash screen configuration
- Required for app store listing

**When to update:**
- Changing app name or description
- Updating images
- Modifying category
- Adding account association

---

#### **`supabase-schema-fid.sql`** (4.5KB)
**Purpose:** PostgreSQL database schema for FID-based voting system

**What it creates:**
1. **`votes` table** - Stores all votes with FID and vote power
2. **`vote_power_cache` table** - Caches Neynar follower data
3. **`mode_votes_daily` table** - Aggregated daily vote totals
4. **Functions:**
   - `update_daily_totals()` - Auto-updates aggregates on vote changes
   - `get_todays_votes()` - Returns current vote counts
   - `has_voted_today()` - Checks if FID voted today
   - `get_vote_power()` - Calculates vote weight from cache
5. **Triggers** - Auto-update daily totals on INSERT/UPDATE/DELETE
6. **RLS Policies** - Public read/write for all tables
7. **Indexes** - Optimized queries on FID, date, mode
8. **Constraints** - Unique vote per FID per day

**How to use:**
1. Open Supabase SQL Editor
2. Copy entire file contents
3. Paste and run
4. Verify tables created

**When to modify:**
- Adding new vote types
- Changing vote power rules
- Adding analytics tables
- Optimizing queries

---

#### **`.env.example`** (468 bytes)
**Purpose:** Template for environment variables

**Variables defined:**
- `VITE_PRIVY_APP_ID` - Privy authentication app ID
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase public API key
- `VITE_ZAO_TOKEN_ADDRESS` - ZAO token on Optimism
- `VITE_LOANZ_TOKEN_ADDRESS` - LOANZ token on Base
- `VITE_OPTIMISM_RPC` - Optimism RPC endpoint
- `VITE_BASE_RPC` - Base RPC endpoint

**How to use:**
1. Copy to `.env` (never commit .env!)
2. Fill in actual values
3. Add to Vercel environment variables
4. Reference in code via `import.meta.env.VITE_*`

---

#### **`live-backup.html`** (30KB)
**Purpose:** Backup copy of live.html for rollback

**Why it exists:**
- Safety net during development
- Quick rollback if changes break
- Reference for previous working version

**When to update:**
- Before major changes to live.html
- After successful deployment
- When creating new features

---

#### **`index-new.html`** (0 bytes - empty)
**Purpose:** Staging/development version of index.html

**Intended use:**
- Test new features before production
- Experiment with design changes
- A/B testing different layouts

**Current status:** Empty placeholder

---

#### **`README.md`** (This file)
**Purpose:** Comprehensive project documentation

**What it covers:**
- Project overview and vision
- Complete file explanations
- User flows and journeys
- User manual for all features
- Development guide
- Design system
- Roadmap and future plans

**Who reads this:**
- New developers joining project
- Contributors understanding codebase
- Users learning how to use site
- Stakeholders understanding vision

---

## 🗺️ User Flows

### Flow 1: Creator Submission Journey

```
1. Creator discovers ZABAL.art
   ↓
2. Lands on index.html (submission portal)
   ↓
3. Reads about ZABAL ecosystem
   ↓
4. Checks submission types (finds their category)
   ↓
5. Scrolls to embedded Tally form
   ↓
6. Fills out form:
   - Name
   - Email
   - Submission type
   - File upload
   - Description
   - Social links
   ↓
7. Submits form
   ↓
8. Receives confirmation message
   ↓
9. Discord webhook notifies team
   ↓
10. Creator receives email confirmation
    ↓
11. Submission queued for review
    ↓
12. Creator can check status (future feature)
    ↓
13. Work reviewed on stream
    ↓
14. Creator notified when featured
    ↓
15. Creator shares stream clip
```

**Key touchpoints:**
- Homepage (index.html)
- Tally form
- Email confirmation
- Discord notification
- Stream review
- Social sharing

**Pain points addressed:**
- Clear submission types
- Simple form (no account needed)
- Transparent process
- Status updates

---

### Flow 2: Community Voting Journey

```
1. Community member visits zabal.art/live.html
   ↓
2. Sees dynamic hero ("Today's Stream Is Being Decided")
   ↓
3. Reads about 4 modes:
   - Studio (music creation)
   - Market (ecosystem updates)
   - Social (community hangout)
   - Battle (WaveWarZ competition)
   ↓
4. Checks current vote counts
   ↓
5. Decides which mode they want
   ↓
6. Clicks "Vote" button on chosen mode
   ↓
7. Vote stored in localStorage
   ↓
8. UI updates showing new totals
   ↓
9. "Vote" button changes to "Voted!"
   ↓
10. User can change vote before lock time
    ↓
11. At 5 PM EST, votes lock
    ↓
12. Hero updates: "Today's Stream: [Winner]"
    ↓
13. At 7 PM EST, stream goes live
    ↓
14. Hero updates: "🔴 [Mode] — Live"
    ↓
15. User watches stream on Twitch
    ↓
16. Next day, yesterday's winner shown
    ↓
17. Process repeats
```

**Key touchpoints:**
- Live hub (live.html)
- Vote buttons
- Real-time UI updates
- Twitch stream

**Future enhancements:**
- Wallet connection (Farcaster)
- Vote power based on tokens/activity
- Persistent voting across devices
- Notifications when stream locks/goes live

---

### Flow 3: Research Reader Journey

```
1. User discovers ZABAL through social media
   ↓
2. Clicks link to gallery.html
   ↓
3. Lands on research archive
   ↓
4. Sees featured article (latest update)
   ↓
5. Reads extended preview
   ↓
6. Clicks "Read Full Article"
   ↓
7. Opens Paragraph.com in new tab
   ↓
8. Reads full newsletter post
   ↓
9. Returns to gallery.html
   ↓
10. Browses newsletter archive
    ↓
11. Clicks on older update
    ↓
12. Reads historical context
    ↓
13. Scrolls to weekly recaps
    ↓
14. Sees week-by-week progress
    ↓
15. Clicks "Join Discord" CTA
    ↓
16. Joins community
    ↓
17. Subscribes to newsletter
```

**Key touchpoints:**
- Gallery page (gallery.html)
- Paragraph.com articles
- Discord community
- Newsletter signup

---

### Flow 4: First-Time Visitor Journey

```
1. User hears about ZABAL
   ↓
2. Visits zabal.art
   ↓
3. Sees submission portal (index.html)
   ↓
4. Reads hero: "A Creative Submission Portal"
   ↓
5. Notices live stream indicator (if streaming)
   ↓
6. Scrolls to stats counter
   ↓
7. Sees 250+ submissions, 85+ creators
   ↓
8. Clicks "Live Hub" in navigation
   ↓
9. Discovers voting system
   ↓
10. Votes for stream mode
    ↓
11. Clicks "Research" in navigation
    ↓
12. Reads about ZABAL ecosystem
    ↓
13. Clicks "Discord" link
    ↓
14. Joins community
    ↓
15. Returns to submit work
    ↓
16. Becomes active member
```

**Conversion funnel:**
- Awareness (social media)
- Interest (visit site)
- Consideration (explore pages)
- Action (submit/vote/join)
- Retention (return visits)
- Advocacy (share with others)

---

## 📖 User Manual

### For Creators: How to Submit Work

#### Step 1: Choose Your Submission Type
ZABAL accepts 9 types of creative work:

1. **Art** - Digital art, illustrations, generative art, 3D renders
2. **Music** - Original tracks, beats, remixes, sound design
3. **Remix** - Remixes of ZABAL/ZAO content
4. **Video** - Short films, animations, music videos, vlogs
5. **Photography** - Photos, photo series, visual storytelling
6. **Memes** - Original memes, meme templates, viral content
7. **Writing** - Essays, poetry, fiction, analysis
8. **Code** - Tools, bots, visualizations, smart contracts
9. **Farcaster** - Casts, frames, mini apps, social experiments

#### Step 2: Prepare Your Submission

**Required information:**
- Your name or pseudonym
- Email address (for updates)
- Submission type (from list above)
- File upload (or link if too large)
- Description (what it is, why you made it)
- Social links (optional: Twitter, Farcaster, website)

**File requirements:**
- **Images:** JPG, PNG, GIF (max 10MB)
- **Audio:** MP3, WAV, FLAC (max 50MB)
- **Video:** MP4, MOV (max 100MB or use YouTube/Vimeo link)
- **Documents:** PDF, TXT, MD (max 10MB)
- **Code:** GitHub link or ZIP file

**Tips for better submissions:**
- Write clear descriptions
- Explain your creative process
- Include context (why this matters)
- Add social links (helps us credit you)
- Use high-quality files

#### Step 3: Submit via Tally Form

1. Visit [zabal.art](https://zabal.art)
2. Scroll to "Submit Your Work" section
3. Fill out embedded Tally form
4. Upload file or paste link
5. Click "Submit"
6. Wait for confirmation message

#### Step 4: What Happens Next

**Immediate:**
- You receive email confirmation
- Discord webhook notifies ZABAL team
- Submission added to queue

**Within 1-7 days:**
- Team reviews submission
- Work scheduled for stream review
- You receive notification (future feature)

**During stream:**
- Your work shown on stream
- Community reacts and discusses
- Clip created for social sharing

**After stream:**
- Featured in weekly recap
- Added to archive/gallery
- You receive clip link
- Work may be featured in newsletter

#### Step 5: Track Your Submission

**Current process:**
- Check Discord for updates
- Watch streams to see if featured
- Follow ZABAL on social media

**Future features:**
- Unique submission ID
- Status tracker page
- Email/Discord notifications
- Creator dashboard

---

### For Community: How to Vote for Streams

#### Understanding the Stream Wheel

The ZABAL stream isn't scheduled — it's decided by community vote each day.

**NEW: Social Voting Features**
- Tag friends in your vote shares
- Invite your top friend to vote
- Challenge friends competitively
- Share when ZABAL goes live

**4 Modes:**

1. **Studio Mode** 🎵
   - Music creation and production
   - Live beat making
   - Song collaborations
   - Sound design experiments

2. **Market Mode** 📊
   - Ecosystem updates
   - Project reviews
   - Market analysis
   - Community discussions

3. **Social Mode** 💬
   - Community hangout
   - Q&A sessions
   - Casual conversations
   - Meme reviews

4. **Battle Mode** ⚔️
   - WaveWarZ music battles
   - Live competitions
   - Voting and judging
   - Winner announcements

#### How to Vote

**Step 1: Visit Live Hub**
- Go to [zabal.art/live.html](https://zabal.art/live.html)

**Step 2: Check Current Status**
- **Before 5 PM EST:** "Today's Stream Is Being Decided"
- **5 PM - 7 PM EST:** "Today's Stream: [Winner]" (locked)
- **7 PM - 10 PM EST:** "🔴 [Mode] — Live" (streaming)

**Step 3: Read Mode Descriptions**
- Review all 4 modes
- Check current vote counts
- See which mode is leading

**Step 4: Cast Your Vote**
- Click "Vote" button on your chosen mode
- Vote stored in Supabase with your FID
- UI updates with new totals
- Share modal opens automatically

**Step 4.5: Share Your Vote (NEW)**
- **Tag Friends**: Click up to 5 friends to tag in your share
- **Invite Top Friend**: Use dedicated card to invite your #1 friend
- **Challenge Friends**: Send competitive challenge to friends
- **Share to Farcaster**: Post to /zao channel with friend mentions

**Step 5: Change Vote (Optional)**
- Click "Change Vote" on different mode
- Your vote moves to new choice
- Only one vote per person

**Step 6: Wait for Lock**
- Votes lock at 5 PM EST
- Winner announced
- Stream scheduled for 7 PM EST

#### Voting Rules (Current)

- **One vote per browser** (localStorage)
- **Vote anytime before 5 PM EST**
- **Can change vote** until lock time
- **Votes reset daily** at midnight

#### Farcaster Voting System (ACTIVE)

**Current Features:**
- **FID-based authentication** - Vote with your Farcaster account
- **Friend tagging** - Mention friends in vote shares
- **Top friend invitation** - Dedicated invite for your #1 friend
- **Challenge system** - Competitive friend challenges
- **Persistent voting** - Votes saved to database
- **Vote changing** - Change your vote anytime before lock

**Future Vote Power:**
- **1 vote:** Any Farcaster user
- **2 votes:** Following @thezao
- **3 votes:** Following + active in /zao channel
- **4 votes:** All above + holding ZAO/LOANZ tokens

**Benefits:**
- Persistent across devices
- Rewards community engagement
- Prevents manipulation
- Enables notifications
- Spreads ZABAL culture virally

---

### For Streamers: How to Share Live Status

#### When ZABAL Goes Live

**Step 1: Set Live Status**
```javascript
// In browser console or via admin panel
setLiveStatus('live')
```

**Step 2: Banner Appears**
- Red "Now Live" banner shows at top
- Pulsing white dot animation
- "Share Stream" button visible to all users

**Step 3: Users Share**
- Click "Share Stream" button
- Modal shows both platforms:
  - 📺 Twitch: twitch.tv/bettercallzaal
  - 🎬 Retake.tv: retake.tv/zaal
- "Share to Farcaster" button
- Auto-tags top 3 friends

**Step 4: Share Message Format**
```
🔴 ZABAL IS LIVE NOW! 🎨

Join the stream and watch us create in real-time!

📺 Twitch: twitch.tv/bettercallzaal
🎬 Retake: retake.tv/zaal

Come hang! 👇

@friend1 @friend2 @friend3 join me!
```

**Step 5: End Stream**
```javascript
setLiveStatus('offline')
```

#### Platform Links
- **Twitch**: [twitch.tv/bettercallzaal](https://twitch.tv/bettercallzaal)
- **Retake.tv**: [retake.tv/zaal](https://retake.tv/zaal)

#### Live Status Management
- Manual control via `setLiveStatus()`
- Stored in localStorage
- Auto-check every 2 minutes
- Future: Twitch API integration

---

### For Readers: How to Navigate Research

#### Gallery Page Structure

**Featured Article**
- Latest ZABAL update
- Extended preview (first 2-3 paragraphs)
- "Read Full Article" button
- Opens Paragraph.com in new tab

**Newsletter Archive**
- All ZABAL Updates (#1-5)
- Card-based layout
- Title, date, read time, excerpt
- Click to read full post

**Weekly Recaps**
- Week-by-week highlights
- Bullet-point summaries
- Key events and milestones
- Links to relevant content

#### How to Read Updates

1. Visit [zabal.art/gallery.html](https://zabal.art/gallery.html)
2. Start with featured article (most recent)
3. Click "Read Full Article" for complete post
4. Browse archive for older updates
5. Check weekly recaps for quick summaries

#### Newsletter Topics

**ZABAL Update #1: Day 276**
- Origin story
- First stream
- Community formation

**ZABAL Update #2: The First Week**
- Early momentum
- Submission growth
- Stream highlights

**ZABAL Update #3: Building Momentum**
- Ecosystem expansion
- New features
- Community milestones

**ZABAL Update #4: Community Growth**
- Member stories
- Creator spotlights
- Future vision

**ZABAL Update #5: Looking Forward**
- ZAO Stock 2026
- Roadmap updates
- Call to action

---

### For Developers: How to Contribute

#### Getting Started

**Prerequisites:**
- Git installed
- Text editor (VS Code recommended)
- Basic HTML/CSS/JS knowledge
- GitHub account

**Setup:**
```bash
# Fork repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/zabalartsubmission.git
cd zabalartsubmission

# Create feature branch
git checkout -b feature/your-feature-name

# Open in editor
code .
```

#### Development Workflow

1. **Make changes**
   - Edit HTML/CSS/JS files
   - Test in browser
   - Check mobile responsiveness

2. **Test locally**
   ```bash
   # Option 1: Direct file open
   open index.html
   
   # Option 2: Local server
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push to fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Describe changes
   - Wait for review

#### Code Style Guidelines

**HTML:**
- Use semantic tags (`<section>`, `<article>`, `<nav>`)
- Indent with 4 spaces
- Add comments for sections
- Use kebab-case for IDs/classes

**CSS:**
- Use CSS variables for colors
- Mobile-first media queries
- Group related styles
- Comment complex selectors

**JavaScript:**
- Use camelCase for variables
- Add JSDoc comments for functions
- Avoid global variables
- Use modern ES6+ syntax

#### Testing Checklist

- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile responsive (test on phone)
- [ ] No console errors
- [ ] Links work correctly
- [ ] Forms submit properly
- [ ] Animations smooth
- [ ] Accessible (keyboard navigation)
- [ ] Fast loading (< 3s)

---

## 💻 Development Guide

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/bettercallzaal/zabalartsubmission.git
   cd zabalartsubmission
   ```

2. **Open in browser**
   ```bash
   open index.html
   # or
   open live.html
   # or
   open gallery.html
   ```

3. **Use local server (recommended)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with http-server)
   npx http-server -p 8000
   
   # Visit http://localhost:8000
   ```

4. **Make changes**
   - Edit HTML/CSS/JS directly
   - Refresh browser to see changes
   - Test on mobile (Chrome DevTools)

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin main
   ```

---

## 🚀 Deployment

### Vercel Deployment (Current)

**Automatic Deployment:**
- Connected to GitHub repository
- Auto-deploys on push to `main` branch
- Live at [zabal.art](https://zabal.art)
- Build time: ~2 minutes

**Manual Deployment:**
1. Push changes to GitHub
   ```bash
   git push origin main
   ```
2. Vercel detects changes
3. Builds and deploys automatically
4. Check deployment status at vercel.com

**Environment Variables:**
- Set in Vercel dashboard
- Go to Project Settings → Environment Variables
- Add variables from `.env.example`
- Redeploy after adding variables

**Custom Domain:**
- Domain: `zabal.art`
- DNS configured in domain registrar
- SSL certificate auto-managed by Vercel

### Deployment Checklist

**Before deploying:**
- [ ] Test all pages locally
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test forms (Tally embed)
- [ ] Check voting functionality
- [ ] Review console for errors
- [ ] Optimize images (if added)
- [ ] Update README if needed

**After deploying:**
- [ ] Visit zabal.art and verify
- [ ] Test on mobile device
- [ ] Check all navigation links
- [ ] Verify live stream status
- [ ] Test voting on live.html
- [ ] Check gallery.html articles
- [ ] Monitor for errors (Vercel logs)

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Tally form not loading
**Symptoms:** Empty space where form should be

**Solutions:**
1. Check internet connection
2. Verify Tally script is loading:
   ```javascript
   <script src="https://tally.so/widgets/embed.js"></script>
   ```
3. Check browser console for errors
4. Try different browser
5. Clear cache and reload

---

#### Issue: Voting not persisting
**Symptoms:** Vote resets on page refresh

**Solutions:**
1. Check localStorage is enabled:
   ```javascript
   console.log(localStorage.getItem('votes'))
   ```
2. Verify not in private/incognito mode
3. Check browser localStorage quota
4. Clear localStorage and try again:
   ```javascript
   localStorage.clear()
   ```

---

#### Issue: Live stream status not updating
**Symptoms:** Status stuck on "Offline" or wrong state

**Solutions:**
1. Check Twitch API endpoint
2. Verify stream is actually live
3. Check browser console for API errors
4. Wait 60 seconds (polling interval)
5. Hard refresh page (Cmd+Shift+R)

---

#### Issue: Stats counter not animating
**Symptoms:** Numbers appear instantly without animation

**Solutions:**
1. Check Intersection Observer support:
   ```javascript
   console.log('IntersectionObserver' in window)
   ```
2. Scroll to stats section slowly
3. Check browser console for JS errors
4. Try different browser
5. Disable browser extensions

---

#### Issue: Mobile layout broken
**Symptoms:** Elements overlapping or cut off on mobile

**Solutions:**
1. Check viewport meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. Test in Chrome DevTools mobile view
3. Check media queries in CSS
4. Verify no fixed widths on elements
5. Test on actual mobile device

---

#### Issue: Vercel deployment failing
**Symptoms:** Build errors in Vercel dashboard

**Solutions:**
1. Check Vercel build logs
2. Verify all files committed to Git
3. Check for syntax errors in HTML/JS
4. Ensure no missing dependencies
5. Try manual redeploy
6. Contact Vercel support if persists

---

### Debug Mode

**Enable console logging:**
```javascript
// Add to any page
window.DEBUG = true;

// Then in your code:
if (window.DEBUG) {
  console.log('Debug info:', data);
}
```

**Check localStorage:**
```javascript
// View all stored data
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

**Monitor network requests:**
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check for failed requests (red)
5. Click request to see details

---

## 📊 Analytics & Monitoring

### Current Metrics

**Tracked manually:**
- Submissions count (via Tally)
- Discord members
- Stream viewers (Twitch)
- Newsletter subscribers (Paragraph)

**Future tracking:**
- Page views (Vercel Analytics)
- Vote participation rate
- Submission conversion rate
- User retention
- Geographic distribution

### Performance Monitoring

**Vercel Analytics:**
- Enabled in project settings
- View at vercel.com/analytics
- Tracks page load times
- Shows visitor counts
- Geographic data

**Lighthouse Scores:**
```bash
# Run Lighthouse audit
npx lighthouse https://zabal.art --view
```

**Target scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

---

## 🔐 Security

### Best Practices

**Environment Variables:**
- Never commit `.env` file
- Use `.env.example` as template
- Store secrets in Vercel dashboard
- Rotate keys regularly

**API Keys:**
- Use `VITE_` prefix for client-side vars
- Keep server-side keys separate
- Implement rate limiting
- Monitor for unusual usage

**User Data:**
- Minimal data collection
- No passwords stored
- GDPR compliant
- Clear privacy policy

**Row Level Security (Supabase):**
- RLS policies enabled on all tables
- Public read, authenticated write
- Prevent SQL injection
- Audit logs enabled

---

## 📚 Additional Resources

### Documentation
- [Tally.so Docs](https://tally.so/help)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Farcaster Docs](https://docs.farcaster.xyz)

### Community
- [Discord](https://discord.bettercallzaal.com)
- [Farcaster /zao](https://warpcast.com/~/channel/zao)
- [Twitter](https://twitter.com/bettercallzaal)
- [GitHub Issues](https://github.com/bettercallzaal/zabalartsubmission/issues)

### Tools
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [VS Code](https://code.visualstudio.com/)
- [GitHub Desktop](https://desktop.github.com/)
- [Postman](https://www.postman.com/) (API testing)

---

## 🎯 Roadmap Summary

### ✅ Completed (v2.0)
- Live coordination hub with voting
- Submission portal with Tally integration
- Research archive with newsletters
- Mobile-responsive design
- Live stream status indicator
- Animated stats counter

### 🚧 In Progress (v2.1)
- Farcaster mini app integration
- Vote power based on social graph
- Persistent voting across devices
- Push notifications

### 📋 Planned (v3.0)
- Backend with Supabase
- Real-time vote persistence
- Submissions feed
- Creator profiles
- Status tracker
- Analytics dashboard

### 🔮 Future (v4.0+)
- Token-gated features
- NFT rewards
- DAO governance
- Mobile app
- ZAO Stock 2026 integration

---

## 🤝 Contributing

### Ways to Contribute

1. **Submit Creative Work**
   - Use the Tally form on index.html
   - Share your art, music, code, writing
   - Get featured on stream

2. **Vote on Streams**
   - Visit live.html daily
   - Help decide stream content
   - Engage with community

3. **Report Bugs**
   - Open GitHub issues
   - Describe problem clearly
   - Include screenshots/logs

4. **Suggest Features**
   - Share ideas in Discord
   - Explain use case
   - Discuss with community

5. **Contribute Code**
   - Fork repository
   - Create feature branch
   - Submit pull request
   - Follow code style

6. **Improve Documentation**
   - Fix typos
   - Add examples
   - Clarify instructions
   - Update outdated info

### Contribution Guidelines

**Code Contributions:**
- Keep changes focused
- Write clear commit messages
- Test thoroughly
- Update documentation
- Follow existing patterns

**Commit Message Format:**
```
feat: add new voting mode
fix: resolve mobile layout issue
docs: update README with new section
style: improve button hover effects
refactor: simplify vote counting logic
test: add voting system tests
```

**Pull Request Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] No console errors
- [ ] All links work

## Screenshots
(if applicable)
```

---

## 📞 Support

### Get Help

**For Users:**
- Check this README first
- Visit [Discord](https://discord.bettercallzaal.com)
- Ask in /zao channel on Farcaster
- Email: support@zabal.art (future)

**For Developers:**
- Read documentation thoroughly
- Check GitHub Issues
- Ask in Discord #dev channel
- Review existing code

**For Press/Media:**
- Contact via Discord
- DM @bettercallzaal on Twitter
- Email: press@zabal.art (future)

---

## 📄 License

Built for the ZABAL network of creators.

All creative submissions remain property of their creators.

Code is open source - feel free to learn from and adapt.

---

## 🙏 Acknowledgments

**Built by:** The ZABAL community

**Special thanks to:**
- All creators who submitted work
- Community members who voted
- Discord moderators and helpers
- Early supporters and believers

**Powered by:**
- Vercel (hosting)
- Tally.so (forms)
- Supabase (database)
- Paragraph (newsletter)
- Twitch (streaming)
- Farcaster (social)

---

## 📊 Project Stats

**Current Status:**
- **Version:** 2.0
- **Status:** Live & Active 🎡
- **Last Updated:** December 17, 2024
- **Pages:** 3 (index, live, gallery)
- **Lines of Code:** ~2,500
- **File Size:** ~90KB total
- **Load Time:** <2 seconds
- **Mobile Score:** 95/100

**Community:**
- **Submissions:** 250+
- **Creators:** 85+
- **Stream Hours:** 42+
- **Discord Members:** Growing daily
- **Newsletter Subscribers:** Active

---

## 🔗 Quick Links

### Live Site
- **Homepage:** [zabal.art](https://zabal.art)
- **Live Hub:** [zabal.art/live.html](https://zabal.art/live.html)
- **Research:** [zabal.art/gallery.html](https://zabal.art/gallery.html)

### Development
- **GitHub:** [github.com/bettercallzaal/zabalartsubmission](https://github.com/bettercallzaal/zabalartsubmission)
- **Issues:** [github.com/bettercallzaal/zabalartsubmission/issues](https://github.com/bettercallzaal/zabalartsubmission/issues)
- **Vercel:** [vercel.com/zabal](https://vercel.com)

### Community
- **Discord:** [discord.bettercallzaal.com](https://discord.bettercallzaal.com)
- **Twitch:** [twitch.tv/bettercallzaal](https://twitch.tv/bettercallzaal)
- **Farcaster:** [@thezao](https://warpcast.com/thezao) | [/zao channel](https://warpcast.com/~/channel/zao)
- **Newsletter:** [paragraph.com/@thezao](https://paragraph.com/@thezao)

### Ecosystem
- **SongJam:** [songjam.space/zabal](https://www.songjam.space/zabal)
- **Incented:** [incented.zabal.art](https://incented.zabal.art)
- **WaveWarZ:** Coming soon

---

## 💡 FAQ for Developers

**Q: Can I use this code for my own project?**
A: Yes! The code is open source. Learn from it, adapt it, make it your own.

**Q: How do I add a new page?**
A: Create new HTML file, copy header/footer from existing pages, add to navigation.

**Q: How do I change the color scheme?**
A: Edit CSS variables at the top of each HTML file (`:root` section).

**Q: How do I add a new voting mode?**
A: Edit `live.html`, add new mode card, update vote counting logic.

**Q: How do I integrate with Supabase?**
A: Follow `SETUP.md`, run `supabase-schema.sql`, add environment variables.

**Q: How do I test locally?**
A: Use `python -m http.server 8000` and visit `localhost:8000`.

**Q: How do I deploy changes?**
A: Push to GitHub main branch, Vercel auto-deploys in ~2 minutes.

**Q: Where are the images stored?**
A: Currently inline as data URIs or external links. Future: CDN.

**Q: How do I add analytics?**
A: Enable Vercel Analytics in project settings, or add Google Analytics script.

**Q: How do I optimize performance?**
A: Minimize JS, optimize images, use lazy loading, enable caching.

---

**Built with ❤️ by the ZABAL community**

**The stream isn't scheduled. It's decided.**

---

*Last updated: December 17, 2024*  
*Version: 2.0*  
*Status: Live Coordination Hub Active 🎡*
