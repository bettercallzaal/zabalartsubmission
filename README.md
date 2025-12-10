# ZABAL.art

> The official creative submission portal for the ZABAL ecosystem

[![Live Site](https://img.shields.io/badge/Live-ZABAL.art-e0ddaa?style=for-the-badge)](https://zabal.art)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-141e27?style=for-the-badge&logo=github)](https://github.com/bettercallzaal/zabalartsubmission)

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Pages](#pages)
- [Integrations](#integrations)
- [Development](#development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## 🎯 About

ZABAL.art is the central hub and intake layer for the ZABAL ecosystem. It serves as the front door where creators submit work to be reviewed live on stream, featured in weekly recaps, and showcased to the community.

### The ZABAL Ecosystem

**Three Core Pillars:**

1. **ZABAL** - The Coordination Layer
   - Fast-moving distribution layer
   - Submission hub → Stream review → Weekly recap
   - Leaderboards, community activity, daily presence

2. **The ZAO** - The Foundation
   - Contribution-based governance
   - Weekly fractals for recognition
   - Slow, steady, intentional culture

3. **WaveWarZ** - The Creative Engine
   - Weekly music battles
   - Live discovery platform
   - Community-driven stage for artists

### Vision

Building toward **ZAO Stock 2026** - a physical Maine-based event that brings the entire ecosystem together. ZABAL.art scales the distribution and visibility needed to make this vision real.

---

## ✨ Features

### Current Features (v1.0)

#### 🏠 Homepage (`index.html`)
- **Fixed Header Navigation**
  - Live stream status indicator with pulsing animation
  - Links to Submit, Research, Discord
  - Twitch integration (auto-checks every 60s)

- **Animated Stats Counter**
  - Total Submissions: 250+
  - Active Creators: 85+
  - Hours Streamed: 42+
  - Community Members: 500+
  - Scroll-triggered counting animation

- **ZABAL Ecosystem Links**
  - Songjam Leaderboard integration
  - Incented Campaign portal
  - Hover effects and prominent CTAs

- **Submission Types Grid**
  - Art, Music, Remix, Video, Photography
  - Memes, Writing, Creative Code, Farcaster content

- **Tally Form Integration**
  - Embedded submission form
  - Discord webhook notifications
  - File upload support

- **FAQ Section**
  - 6 common questions answered
  - Expandable format
  - Rights, timeline, formats covered

- **What Happens Next**
  - Submission flow explained
  - Discord community info
  - Review process transparency

#### 📰 Research/Gallery Page (`gallery.html`)
- **Featured Article Preview**
  - Latest ZABAL update highlighted
  - Extended excerpt and metadata
  - Prominent CTA to full article

- **Newsletter Archive Grid**
  - ZABAL Updates #1-5
  - Day 276 origin story
  - Card-based layout with read times

- **Weekly Recaps Section**
  - Week-by-week highlights
  - Bullet-point summaries
  - Links to full Paragraph posts

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
- **Twitch** - Live streaming platform
- **SongJam** - Leaderboard tracking
- **Incented** - Campaign management

### Hosting & Deployment
- **GitHub** - Version control
- **Vercel** - Automatic deployment from main branch
- **Custom Domain** - ZABAL.art

---

## 📁 Project Structure

```
ZABAL ART WEBSITE/
├── index.html          # Homepage - Submission portal
├── gallery.html        # Research & Updates page
├── README.md          # This file
├── IDEATION.md        # Future features and planning
└── .git/              # Git repository
```

### File Overview

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
9. What Happens Next (with Discord CTA)
10. FAQ
11. Footer

**JavaScript Features:**
- Tally form loader
- Animated counter with Intersection Observer
- Stream status checker (60s interval)

#### `gallery.html` (25KB)
**Sections:**
1. Header navigation
2. Hero section
3. Featured article preview (Update #5)
4. Newsletter archive grid (Updates #1-4)
5. Weekly recaps section
6. CTA section
7. Footer

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
- H1: `clamp(3rem, 10vw, 6rem)` - Hero titles
- H2: `clamp(2rem, 5vw, 2.5rem)` - Section headings
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

.card::before {
    /* Top accent line */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--accent-yellow);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.card:hover::before {
    transform: scaleX(1);
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

### Animations

**Pulse Dot (Live Indicator):**
```css
@keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.2); }
}
```

**Pulse Border:**
```css
@keyframes pulse-border {
    0%, 100% { box-shadow: 0 0 0 0 rgba(224, 221, 170, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(224, 221, 170, 0); }
}
```

**Fade In Up:**
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## 📄 Pages

### Homepage (`/` or `index.html`)

**Purpose:** Primary submission portal and ecosystem overview

**Key Sections:**
- Live stream status in header
- Stats showcase (submissions, creators, hours, members)
- Ecosystem links (Songjam, Incented)
- Submission form (Tally embed)
- FAQ and guidelines

**Target Audience:** Creators wanting to submit work

**CTA:** Submit your work via Tally form

---

### Research Page (`/gallery.html`)

**Purpose:** Newsletter archive and weekly recaps

**Key Sections:**
- Featured latest update
- Historical updates archive (#1-5)
- Weekly recap highlights
- Links to full Paragraph articles

**Target Audience:** Community members, researchers, newcomers learning about ZABAL

**CTA:** Read full articles, submit your work

---

## 🔗 Integrations

### Tally.so
**Purpose:** Submission form management

**Form URL:** `https://tally.so/r/5BXeqv`

**Features:**
- File uploads
- Custom fields (name, intro, wallet)
- Discord webhook integration
- Transparent background
- Dynamic height

**Implementation:**
```html
<iframe 
    data-tally-src="https://tally.so/embed/5BXeqv?hideTitle=1&transparentBackground=1&dynamicHeight=1"
    width="100%" 
    height="600" 
    frameborder="0" 
    marginheight="0" 
    marginwidth="0" 
    title="ZABAL Submission Form">
</iframe>
```

---

### Paragraph.com
**Purpose:** Newsletter hosting

**Publication:** [@thezao](https://paragraph.com/@thezao)

**Articles:**
- ZABAL Update #5: Latest developments
- ZABAL Update #4: ZABAL.art launch
- ZABAL Update #3: Day 1 recap
- ZABAL Update #2: Day 334 reflections
- ZABAL Update #1: Day 276 origin story

**Integration:** Manual links (future: RSS feed auto-pull)

---

### Discord
**Purpose:** Community hub and submission notifications

**Link:** [discord.bettercallzaal.com](https://discord.bettercallzaal.com)

**Integration:**
- Tally webhook sends submissions to Discord
- Community discussion and feedback
- Real-time engagement

---

### Twitch
**Purpose:** Live streaming platform

**Channel:** [twitch.tv/bettercallzaal](https://twitch.tv/bettercallzaal)

**Integration:**
- Live status checker (JavaScript)
- Auto-refresh every 60 seconds
- Pulsing indicator when live

**Status Check Code:**
```javascript
const checkStreamStatus = async () => {
    const streamStatus = document.getElementById('streamStatus');
    const streamText = streamStatus.querySelector('.stream-text');
    
    // Set isLive = true when streaming
    const isLive = false;
    
    if (isLive) {
        streamStatus.classList.add('live');
        streamText.textContent = '🔴 LIVE NOW';
    } else {
        streamStatus.classList.remove('live');
        streamText.textContent = 'Offline';
    }
};

setInterval(checkStreamStatus, 60000);
```

---

### SongJam
**Purpose:** Leaderboard tracking

**Link:** [songjam.space/zabal](https://www.songjam.space/zabal)

**Integration:** Link card on homepage (future: embed leaderboard)

---

### Incented
**Purpose:** Campaign management

**Link:** [incented.zabal.art](https://incented.zabal.art)

**Integration:** Link card on homepage

---

## 💻 Development

### Prerequisites
- Modern web browser
- Text editor (VS Code recommended)
- Git for version control
- GitHub account

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/bettercallzaal/zabalartsubmission.git
cd zabalartsubmission
```

2. **Open in browser:**
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

3. **Or use a local server:**
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

4. **View in browser:**
```
http://localhost:8000
```

### Making Changes

1. **Edit HTML/CSS directly** in `index.html` or `gallery.html`
2. **Test locally** in browser
3. **Commit changes:**
```bash
git add .
git commit -m "Description of changes"
git push origin main
```
4. **Auto-deploy** via Vercel (connected to GitHub)

### Updating Stats Counter

Edit the `data-target` attributes in `index.html`:

```html
<span class="stat-number" data-target="250">0</span> <!-- Submissions -->
<span class="stat-number" data-target="85">0</span>  <!-- Creators -->
<span class="stat-number" data-target="42">0</span>  <!-- Hours -->
<span class="stat-number" data-target="500">0</span> <!-- Members -->
```

### Updating Stream Status

Change `isLive` variable in JavaScript:

```javascript
const isLive = true; // Set to true when streaming
```

### Adding New Newsletter Posts

Add a new card to the updates grid in `gallery.html`:

```html
<div class="update-card">
    <div class="update-header">
        <span class="update-number">ZABAL Update #6</span>
        <h3 class="update-title">Your Title Here</h3>
        <p class="update-date">Recent • 5 min read</p>
    </div>
    <div class="update-content">
        <p class="update-excerpt">Your excerpt here...</p>
        <a href="https://paragraph.com/@thezao/your-post" target="_blank" class="read-more">
            Read Full Update →
        </a>
    </div>
</div>
```

---

## 🗺 Roadmap

### ✅ Phase 1: Foundation (Completed)
- [x] Homepage with submission form
- [x] Gallery/research page
- [x] Tally form integration
- [x] Discord notifications
- [x] FAQ section
- [x] Animated stats counter
- [x] Live stream status indicator
- [x] Weekly recaps section
- [x] Mobile responsive design

### 🚧 Phase 2: Community Features (In Progress)
- [ ] SongJam leaderboard embed
- [ ] Recent submissions feed
- [ ] Creator profiles/spotlight
- [ ] Event calendar
- [ ] Search and filter functionality

### 📋 Phase 3: Ecosystem Integration (Planned)
- [ ] WaveWarZ integration
- [ ] ZAO Fractal explainer page
- [ ] Token & rewards dashboard
- [ ] Farcaster integration
- [ ] Wallet connect

### 🚀 Phase 4: Advanced Features (Future)
- [ ] Interactive submission queue
- [ ] Creator dashboard with analytics
- [ ] Community challenges
- [ ] Voting/judging system
- [ ] Real-time updates via WebSocket
- [ ] Backend database (Airtable/Supabase)

### 📄 New Pages Planned
- `/about` - Full ZABAL story and mission
- `/ecosystem` - Visual map of pillars
- `/creators` - Community directory
- `/events` - Calendar and past events
- `/rewards` - Token and earning guide
- `/fractal` - ZAO governance explainer
- `/wavewarz` - Music battles hub
- `/stream` - Live stream embed

---

## 🎯 Success Metrics

### Current (December 2024)
- 250+ total submissions
- 85+ active creators
- 42+ hours streamed
- 500+ community members

### 6-Month Goals (June 2025)
- 500+ total submissions
- 100+ active creators
- 10,000+ site visitors/month
- 1,000+ newsletter subscribers
- Top 10 Farcaster leaderboard presence

### 12-Month Goals (December 2025)
- Successful ZABAL token launch
- ZAO Stock 2026 event announced
- 1,000+ submissions
- 200+ active creators
- 50,000+ site visitors/month

---

## 🤝 Contributing

### How to Contribute

1. **Submit Work** - Use the Tally form on the homepage
2. **Join Discord** - [discord.bettercallzaal.com](https://discord.bettercallzaal.com)
3. **Participate in Fractals** - Weekly ZAO governance meetings
4. **Engage on Farcaster** - Follow [@bettercallzaal](https://warpcast.com/bettercallzaal)
5. **Compete on Leaderboard** - [songjam.space/zabal](https://www.songjam.space/zabal)

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Reporting Issues

Open an issue on GitHub with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## 📚 Resources

### Official Links
- **Website:** [ZABAL.art](https://zabal.art)
- **Newsletter:** [The ZAO Newsletter](https://paragraph.com/@thezao)
- **Discord:** [discord.bettercallzaal.com](https://discord.bettercallzaal.com)
- **Twitch:** [twitch.tv/bettercallzaal](https://twitch.tv/bettercallzaal)
- **GitHub:** [github.com/bettercallzaal/zabalartsubmission](https://github.com/bettercallzaal/zabalartsubmission)

### Ecosystem Links
- **ZAO:** [zao.xyz](https://zao.xyz)
- **ZABAL:** [zabal.xyz](https://zabal.xyz)
- **WaveWarZ:** [wavewarz.xyz](https://wavewarz.xyz)
- **BetterCallZaal:** [bettercallzaal.com](https://bettercallzaal.com)
- **SongJam:** [songjam.space/zabal](https://www.songjam.space/zabal)
- **Incented:** [incented.zabal.art](https://incented.zabal.art)

### Documentation
- [IDEATION.md](./IDEATION.md) - Future features and planning
- [Tally Form](https://tally.so/r/5BXeqv) - Submission portal

---

## 📝 License

This project is part of the ZABAL ecosystem. All rights reserved.

Submissions retain creator ownership. See FAQ for details.

---

## 🙏 Acknowledgments

Built for the ZABAL network of creators.

**Core Team:**
- [@bettercallzaal](https://twitter.com/bettercallzaal) - Founder & Lead
- ZAO Community - Governance & Support
- WaveWarZ Artists - Creative Engine

**Special Thanks:**
- SongJam for leaderboard integration
- Paragraph for newsletter hosting
- Tally for form infrastructure
- Discord community for feedback

---

## 📞 Contact

- **Twitter:** [@bettercallzaal](https://twitter.com/bettercallzaal)
- **Farcaster:** [@bettercallzaal](https://warpcast.com/bettercallzaal)
- **Discord:** [discord.bettercallzaal.com](https://discord.bettercallzaal.com)
- **Email:** Via Discord or Farcaster

---

**Built with 💛 for the ZABAL ecosystem**

*Last Updated: December 10, 2024*
