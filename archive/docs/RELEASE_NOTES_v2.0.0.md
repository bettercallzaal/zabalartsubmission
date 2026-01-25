# v2.0.0 – Gated Voting & Farcaster Auth Stabilization

**Release Date:** January 17, 2026  
**Status:** Feature-Frozen

---

## 🎯 Overview

v2.0.0 stabilizes the core voting experience in the ZABAL Live Hub Farcaster Mini App. This release introduces gated weekly voting, fixes Farcaster authentication, and implements vote power calculations based on user activity.

**⚠️ v2.0.0 is feature-frozen. All subsequent work is testing and validation only.**

---

## ✨ Features

### Daily Voting (Overrideable)
- Users can vote daily for their preferred ZABAL mode (Studio, Market, Social, Battle)
- Votes can be changed at any time on the same day
- First vote triggers share modal; subsequent changes show confirmation toasts
- Vote power calculated based on `/zao` channel activity and Neynar score (1-6x multiplier)

### Weekly Social Voting (Gated)
- Weekly voting for preferred social platform (Farcaster, X/Twitter, TikTok, YouTube, Instagram)
- **Gated behind daily participation:** Users must vote daily before weekly voting unlocks
- Overrideable voting model: Users can change their weekly vote at any time
- Platform name normalization ensures database compatibility
- Vote power system matches daily voting (1-6x based on activity)

### Farcaster Authentication
- Fixed SDK initialization using CDN instead of ES module import
- Properly awaits SDK context Proxy resolution
- Splash screen dismissal via SDK with fallback timeout
- Reliable authentication in Farcaster Mini App environment

### Vote Power System
- **Base Power:** 1x (default)
- **Activity Bonus:**
  - 5+ `/zao` posts: +1 power
  - 20+ `/zao` posts: +2 power
  - 50+ `/zao` posts: +3 power
- **Quality Multiplier (Neynar Score):**
  - < 0.5: 0.5x
  - 0.7-0.89: 1.25x
  - 0.9+: 1.5x
- **Maximum Power:** 6x

### UI/UX Protections
- JavaScript gating prevents weekly voting bypass
- CSS blur overlay on locked weekly voting cards
- Visual feedback for voted states
- Toast notifications for vote confirmation and changes
- Share modal only on first vote (daily and weekly)

---

## 🔧 Technical Improvements

### Frontend
- Platform name normalization map (`'X (Twitter'` → `'twitter'`, etc.)
- Enhanced error logging for Supabase RPC calls
- FID validation before database operations
- Vote power calculation integration

### Backend
- Updated `submit_weekly_social_vote` RPC to accept `p_vote_power` parameter
- Overrideable voting model (DELETE + INSERT pattern)
- JSON response format matching daily voting
- Database constraint validation for platform names

### Authentication
- CDN-based SDK loading for better compatibility
- Async SDK context resolution
- Fallback splash screen dismissal
- Proper ready() call timing

---

## 📋 Validation Status

- ✅ Daily voting (first vote, override, confirmation)
- ✅ Weekly voting gating (locked/unlocked states)
- ✅ Farcaster authentication in Mini App
- ✅ Vote power calculation (activity + quality)
- ✅ Platform normalization (all 5 platforms)
- ✅ Share modal behavior (first vote only)
- ✅ Toast notifications (no duplicates)
- ⏳ Full user acceptance testing in progress

---

## 🚀 Deployment

- **Frontend:** Auto-deployed via Vercel on push to `main`
- **Backend:** Supabase RPC functions updated manually
- **Environment:** Production (`https://zabal.art`)

---

## 📝 Notes

This release represents a stable foundation for the ZABAL Live Hub voting system. All core features are implemented and working in the Farcaster Mini App environment.

**No further feature development will occur in v2.0.0.** All subsequent commits will be for testing, validation, and documentation only.

---

## 🔗 Links

- **Live App:** https://zabal.art
- **Repository:** https://github.com/bettercallzaal/zabalartsubmission
- **Farcaster Frame:** https://warpcast.com/~/developers/frames

---

**v2.0.0 is feature-frozen. All subsequent work is testing and validation only.**
