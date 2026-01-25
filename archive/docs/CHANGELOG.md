# Changelog

All notable changes to ZABAL Live Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-26

### 🎉 Initial Production Release

First stable production release of ZABAL Live Hub - a Farcaster miniapp for community-driven voting on stream direction.

### ✨ Features

#### Core Voting
- Multi-mode voting system (Studio, Market, Social, Battle)
- Real-time vote counts with 30-second refresh
- Vote power calculation based on engagement (1-6x multiplier)
- Daily voting with automatic reset at midnight UTC
- Vote history tracking and streak counting
- Leader highlighting with visual indicators

#### Social Features
- Friend tagging (up to 10 friends per vote)
- Best friends loading via Neynar API
- Reconnect feature for inactive contacts
- Dynamic cast text generation
- Share to Farcaster integration

#### User Experience
- Farcaster authentication via SDK
- Responsive mobile-first design
- Loading states and progress indicators
- Toast notifications for feedback
- Keyboard shortcuts (V, S, Esc, ?)
- Accessibility support (ARIA labels, screen readers)
- Offline detection and graceful degradation

#### Technical Infrastructure
- Supabase PostgreSQL database with RLS
- Row-level security policies
- Database triggers for vote aggregation
- Vote power caching (24-hour expiration)
- API rate limiting and throttling
- Comprehensive error handling
- Memory leak prevention
- State management system
- Analytics tracking

### 🔧 Technical Details

#### Database Schema
- `votes` table - Main voting records
- `vote_power_cache` table - Performance optimization
- `mode_votes_daily` table - Pre-calculated totals
- RPC functions: `get_todays_votes()`, `has_voted_today()`
- Automatic aggregation via triggers

#### Architecture
- Vanilla JavaScript (ES6+)
- Modular design with singleton patterns
- Retry logic with exponential backoff
- Observer pattern for state management
- Lifecycle management for resource cleanup

#### Security
- Input validation on all user inputs
- XSS prevention through sanitization
- Rate limiting to prevent abuse
- Environment variables for secrets
- CORS configuration
- No sensitive data in client code

### 🐛 Bug Fixes
- Fixed vote power decimal rounding (now returns integers)
- Fixed RLS policies for database inserts
- Fixed authentication message (changed from Warpcast to Farcaster)
- Fixed Supabase client initialization race condition
- Fixed vote submission error handling

### 📚 Documentation
- Comprehensive README with setup instructions
- Architecture documentation (ARCHITECTURE.md)
- Deployment guide (DEPLOYMENT.md)
- API documentation (API.md)
- Database tutorial (DATABASE_TUTORIAL.md)
- Supabase setup guide (SUPABASE_SETUP_GUIDE.md)
- Vote power setup guide (VOTE_POWER_SETUP.md)
- Contributing guidelines (CONTRIBUTING.md)

### 🚀 Deployment
- Vercel hosting with automatic deployments
- GitHub integration for CI/CD
- Environment variable management
- Production-ready configuration

---

## [Unreleased]

### Planned Features
- Vote power visualization
- Historical vote analytics
- User leaderboards
- Advanced friend filtering
- Cast templates
- Notification system improvements

---

**Live Site**: https://zabal.art
**Repository**: https://github.com/bettercallzaal/zabalartsubmission
