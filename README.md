# ZABAL.art

> The live coordination hub and creative submission portal for the ZABAL ecosystem

[![Live Site](https://img.shields.io/badge/Live-ZABAL.art-e0ddaa?style=for-the-badge)](https://zabal.art)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-141e27?style=for-the-badge&logo=github)](https://github.com/bettercallzaal/zabalartsubmission)

---

## 📖 Table of Contents

- [About](#about)
- [Pages](#pages)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Roadmap](#roadmap)
- [Development](#development)
- [Contributing](#contributing)

---

## 🎯 About

ZABAL.art is the central hub for the ZABAL ecosystem — a living coordination network where streams are decided by the community, creators submit work, and collective discovery happens in real-time.

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

## 📄 Pages

### 🎡 Live Hub (`/live.html`)
**The stream isn't scheduled. It's decided.**

- **Dynamic Hero** - Changes based on stream state (deciding/locked/live)
- **Stream Wheel** - Vote for today's mode (Studio/Market/Social/Battle)
- **Real-time Voting** - Community decides what happens each stream
- **Today/Yesterday Display** - Shows current leader and previous winner
- **Built on Stream Artifacts** - Proof of coordination, not just content
- **Proof Section** - ∞ streams decided by you, 4 modes, 0 scheduled

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
  - Real-time vote counting
  - Visual leader indicator
  - Persistent voting (localStorage)
  - Countdown to lock time

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
- **Tally.so** - Form builder and submission management
- **Paragraph.com** - Newsletter hosting (The ZAO Newsletter)
- **Discord** - Community and submission notifications
- **Twitch** - Live streaming platform (twitch.tv/bettercallzaal)
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

### 🚀 Phase 3: Backend & Dynamic Features (NEXT)

**Priority: Backend Setup**
- Supabase integration via Vercel marketplace
- Database tables: Submissions, Creators, Stats
- Tally webhook → Supabase connection
- API endpoints for data fetching

**Features Enabled by Backend:**

1. **Recent Submissions Feed**
   - Display last 10-20 submissions
   - Show: thumbnail, creator, type, timestamp
   - "Watch Review" link when streamed
   - Auto-refresh

2. **Real Voting Persistence**
   - Store votes in database
   - Real-time vote counting across users
   - Voting history and analytics
   - Lock mechanism at stream time

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

- **SongJam Leaderboard** - Real-time embed on homepage
- **WaveWarZ Integration** - Music battles calendar and voting
- **ZAO Fractal Explainer** - Governance education page
- **Token & Rewards Dashboard** - ZABAL token info and multipliers
- **Farcaster Integration** - Native Web3 social presence

---

## 💻 Development

### Project Structure

```
ZABAL ART WEBSITE/
├── index.html          # Submission portal
├── live.html           # Live coordination hub
├── gallery.html        # Research & updates archive
├── README.md          # This file
└── .git/              # Git repository
```

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

3. **Make changes**
   - Edit HTML/CSS/JS directly
   - Test in browser
   - Commit changes

4. **Deploy**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
   - Vercel auto-deploys from main branch
   - Live at zabal.art in ~2 minutes

### Key Files

#### `index.html` (34KB)
**Sections:**
1. Header with live stream status
2. Hero section
3. Animated stats counter
4. ZABAL Ecosystem links
5. About section
6. Submission types grid
7. Tally form embed
8. Guidelines
9. What Happens Next
10. FAQ
11. Footer

**JavaScript Features:**
- Tally form loader
- Animated counter with Intersection Observer
- Stream status checker (60s interval)

#### `live.html` (34KB)
**Sections:**
1. Header navigation
2. Dynamic hero (state-based)
3. Stream wheel with voting
4. Today/yesterday cards
5. Built on stream artifacts
6. Proof section
7. Footer

**JavaScript Features:**
- Stream state management (deciding/locked/live)
- Countdown timer
- Voting system with localStorage
- Leader calculation and display
- Real-time UI updates

#### `gallery.html` (25KB)
**Sections:**
1. Header navigation
2. Hero section
3. Featured article preview
4. Newsletter archive grid
5. Weekly recaps section
6. CTA section
7. Footer

---

## 🤝 Contributing

### How to Contribute

1. **Submit Work** - Use the Tally form on index.html
2. **Vote on Streams** - Visit live.html and spin the wheel
3. **Join Discord** - [discord.bettercallzaal.com](https://discord.bettercallzaal.com)
4. **Report Issues** - Open GitHub issues for bugs
5. **Suggest Features** - Share ideas in Discord

### Development Guidelines

- **Keep it simple** - Vanilla JS, no frameworks
- **Match the design system** - Use CSS variables
- **Mobile-first** - Test responsive design
- **Accessibility** - Semantic HTML, proper contrast
- **Performance** - Optimize images, minimize JS

### Code Style

- **Indentation**: 4 spaces
- **Naming**: kebab-case for CSS, camelCase for JS
- **Comments**: Explain complex logic
- **Commits**: Clear, descriptive messages

---

## 📊 Current Status

**Live Features:**
- ✅ Live coordination hub with stream wheel
- ✅ Submission portal with Tally integration
- ✅ Research archive with newsletter posts
- ✅ Mobile-responsive design
- ✅ Live stream status indicator
- ✅ Animated stats counter

**In Progress:**
- 🚧 Backend setup (Supabase)
- 🚧 Real voting persistence
- 🚧 Submissions feed

**Next Up:**
- 📋 Creator profiles
- 📋 SongJam leaderboard embed
- 📋 Submission status tracker

---

## 🔗 Links

- **Live Site**: [zabal.art](https://zabal.art)
- **Live Hub**: [zabal.art/live.html](https://zabal.art/live.html)
- **Research**: [zabal.art/gallery.html](https://zabal.art/gallery.html)
- **GitHub**: [github.com/bettercallzaal/zabalartsubmission](https://github.com/bettercallzaal/zabalartsubmission)
- **Twitch**: [twitch.tv/bettercallzaal](https://twitch.tv/bettercallzaal)
- **Discord**: [discord.bettercallzaal.com](https://discord.bettercallzaal.com)
- **Newsletter**: [paragraph.com/@thezao](https://paragraph.com/@thezao)
- **SongJam**: [songjam.space/zabal](https://www.songjam.space/zabal)
- **Incented**: [incented.zabal.art](https://incented.zabal.art)

---

## 📝 License

Built for the ZABAL network of creators.

---

**Last Updated:** December 14, 2024  
**Version:** 2.0  
**Status:** Live Coordination Hub Active 🎡
