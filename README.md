# ZABAL Live Hub 🎨

> Community-driven voting platform for ZABAL's stream direction

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/bettercallzaal/zabalartsubmission/releases)
[![Production Ready](https://img.shields.io/badge/status-production%20ready-success)](https://zabal.art)
[![Farcaster](https://img.shields.io/badge/platform-Farcaster-purple)](https://warpcast.com)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 📖 Overview

ZABAL Live Hub is a Farcaster miniapp that allows the community to vote on the direction of ZABAL's creative streams. Users can vote for one of four modes daily:

- 🎬 **Studio Mode** - Focus on art creation and production
- 🛒 **Market Mode** - Engage with the NFT marketplace
- 🌐 **Social Mode** - Community interaction and engagement
- ⚔️ **Battle Mode** - Competitive creative challenges

## ✨ Features

### Core Functionality
- ✅ **Multi-mode voting** - Vote for multiple modes simultaneously (up to 4)
- ✅ **Friend tagging** - Tag up to 10 friends when sharing votes
- ✅ **Vote sharing** - Share votes to Farcaster with dynamic cast text
- ✅ **Real-time updates** - Live vote counts and leaderboard with 30s refresh
- ✅ **Vote history** - Track your voting patterns and streaks
- ✅ **Leader highlighting** - Visual indicator for the leading mode
- ✅ **Reconnect feature** - Reconnect with friends you haven't interacted with

### Production Features
- ✅ **Error handling** - Comprehensive error recovery with retry logic
- ✅ **Loading states** - Smooth UX with loading indicators and spinners
- ✅ **Analytics tracking** - User action and error tracking with event logging
- ✅ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- ✅ **Mobile optimized** - Responsive design with touch-friendly targets
- ✅ **Data persistence** - LocalStorage for vote history and preferences
- ✅ **Keyboard shortcuts** - Quick actions (V, S, Esc, ?)
- ✅ **Rate limiting** - Prevents API abuse and spam
- ✅ **Memory leak prevention** - Proper resource cleanup
- ✅ **State management** - Centralized state with validation
- ✅ **Offline detection** - Graceful degradation when offline

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Database**: Supabase (PostgreSQL)
- **APIs**: Neynar (Farcaster), Farcaster SDK
- **Hosting**: Vercel
- **Analytics**: Custom implementation with localStorage

### Module Structure
```
/assets                    # Images, icons, splash screens
├── icon.png              # App icon (1024x1024)
├── splash.png            # Splash screen (200x200)
├── logo.png              # Logo (1024x1024)
└── preview.png           # Social preview (1200x630)

/js
├── config.js              # Configuration management
├── validation.js          # Input validation & rate limiting
├── error-handler.js       # Global error handling
├── lifecycle.js           # Memory leak prevention
├── state-manager.js       # Centralized state management
├── database.js            # Database connection management
├── api-throttle.js        # API rate limiting & throttling
├── share-modal.js         # Friend tagging & sharing
└── production-enhancements.js  # Loading, analytics, persistence

/css
├── production-styles.css  # Production UI styles
└── shared-navigation.css  # Navigation styles

/api
└── send-notification-neynar.js  # Serverless notification handler

/.well-known
└── farcaster.json         # Farcaster miniapp manifest

/docs                      # Documentation
├── ARCHITECTURE.md        # System architecture
├── DEPLOYMENT.md          # Deployment guide
├── API.md                 # API documentation
├── ASSETS.md              # Asset specifications
└── setup/                 # Setup guides
```

### Key Design Patterns
- **Singleton Pattern** - All managers are singletons (config, state, database, etc.)
- **Observer Pattern** - State management with subscribe/notify
- **Retry Pattern** - Automatic retry with exponential backoff
- **Throttle Pattern** - Rate limiting on API calls
- **Lifecycle Management** - Automatic cleanup of resources

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for development)
- Farcaster account
- Supabase account
- Neynar API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/bettercallzaal/zabalartsubmission.git
cd zabalartsubmission
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
VITE_NEYNAR_API_KEY=your_neynar_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**

Run the SQL migrations in `/database/schema.sql` (see DEPLOYMENT.md)

5. **Run locally**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Testing in Warpcast

1. Deploy to Vercel (see DEPLOYMENT.md)
2. Update `.well-known/farcaster.json` with your domain
3. Open in Warpcast mobile app
4. Search for "ZABAL" in Mini Apps

## 📚 Documentation

### Core Documentation
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System architecture and design decisions
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide and configuration
- [API.md](./docs/API.md) - API documentation and endpoints
- [ASSETS.md](./docs/ASSETS.md) - Asset specifications and guidelines
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contributing guidelines

### Setup Guides
- [Supabase Setup](./docs/setup/SUPABASE_SETUP_GUIDE.md) - Complete Supabase database setup
- [Database Tutorial](./docs/setup/DATABASE_TUTORIAL.md) - Database schema and SQL guide
- [Vote Power Setup](./docs/setup/VOTE_POWER_SETUP.md) - Vote power calculation configuration

### Additional Guides
- [Splash Screen Guide](./docs/guides/SPLASH_SCREEN_GUIDE.md) - Splash screen implementation

## 🎮 Usage

### Keyboard Shortcuts
- `V` - Focus on voting section
- `S` - Open share modal
- `Esc` - Close modals
- `?` - Show keyboard shortcuts help

### Voting Flow
1. Open miniapp in Warpcast
2. Select one or more modes
3. Click "Submit Votes"
4. Tag friends (optional)
5. Share to Farcaster

### Friend Tagging
- Select up to 10 friends to tag
- Use "Reconnect" to find friends you haven't interacted with
- Tagged friends receive notifications

## 🔒 Security

### Implemented Security Measures
- ✅ Input validation on all user inputs
- ✅ XSS prevention through text sanitization
- ✅ Rate limiting to prevent abuse
- ✅ Environment variables for secrets
- ✅ Row-level security (RLS) in Supabase
- ✅ CORS configuration
- ✅ No sensitive data in client code

### Best Practices
- API keys stored in environment variables
- Supabase anon key used (RLS enforced)
- All user inputs validated and sanitized
- Rate limiting on votes and API calls
- Error messages don't expose sensitive data

## 📊 Analytics

### Tracked Events
- Vote submissions
- Share actions
- Friend tags
- Errors and failures
- User actions (clicks, navigation)
- Session data

### Data Storage
- Analytics stored in localStorage
- Can be integrated with external services (Sentry, LogRocket, etc.)
- See `js/production-enhancements.js` for implementation

## 🐛 Troubleshooting

### Common Issues

**Votes not submitting**
- Check you're authenticated in Warpcast
- Verify database connection
- Check browser console for errors

**Friends not loading**
- Verify Neynar API key is valid
- Check network connection
- Clear localStorage and refresh

**Miniapp not appearing in search**
- Verify `appId` in `.well-known/farcaster.json`
- Wait 15-60 minutes for indexing
- Check domain verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ES6+ features
- Follow existing patterns
- Add comments for complex logic
- Validate all inputs
- Handle all errors
- Write descriptive commit messages

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Farcaster team for the SDK and platform
- Neynar for the API
- Supabase for the database
- ZABAL community for feedback and support

## 📞 Support

- Twitter: [@zabal](https://twitter.com/zabal)
- Farcaster: [@zaal](https://warpcast.com/zaal)
- Email: support@zabal.art

## 🔄 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

### v1.0.0 (Current - Production Release)
- ✅ Multi-mode voting system
- ✅ Real-time vote counts and leaderboard
- ✅ Friend tagging and reconnect feature
- ✅ Vote power calculation (1-6x multiplier)
- ✅ Supabase database with RLS
- ✅ Production-ready architecture
- ✅ Comprehensive error handling
- ✅ Memory leak prevention
- ✅ API rate limiting
- ✅ Accessibility support

---

**Built with ❤️ for the ZABAL community**
