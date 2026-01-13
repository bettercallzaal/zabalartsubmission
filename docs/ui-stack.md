# ZABAL UI Stack Documentation

## Z-Index Hierarchy

This document tracks all z-index values used across the ZABAL web application to prevent stacking context conflicts.

### Current Z-Index Values

| Layer | Component | Z-Index | File | Notes |
|-------|-----------|---------|------|-------|
| **Navigation** | | | | |
| | Header (fixed) | 1000 | index.html, chat.html, submissions.html | Main navigation header |
| | Header (sticky) | 100 | gallery.html | Gallery page uses sticky positioning |
| | Hamburger button | 1001 | css/shared-navigation.css | Above header for mobile |
| | Mobile menu overlay | 1000 | css/shared-navigation.css | Full-screen mobile menu |
| **Modals & Overlays** | | | | |
| | Share modal overlay | 2000 | index.html | Vote sharing modal backdrop |
| | Friend selection modal | 1000 | index.html | Friend tagging modal |
| **Notifications** | | | | |
| | Toast container | 10000 | index.html | Top-right notification toasts |
| | Loading overlay | 10000 | css/production-styles.css | Full-screen loading state |
| | Skip-to-content link | 10001 | css/production-styles.css | Accessibility feature |
| | Share success message | 10001 | index.html | Temporary success notification |
| **UI Elements** | | | | |
| | Vote confirmation | 9999 | css/production-styles.css | Vote success animation |
| | Offline banner | 9998 | css/production-styles.css | Network status indicator |
| | Settings dropdown | 1000 | index.html | User profile dropdown |
| | Now Live banner | 99 | index.html | Stream status banner |
| | Streak badge | 100 | css/production-styles.css | Daily streak indicator |
| **Content** | | | | |
| | Hero content | 1 | index.html, submissions.html | Content above background |

### Z-Index Ranges

- **0-99**: Content layer elements
- **100-999**: UI components (badges, banners)
- **1000-1999**: Navigation and modals
- **2000-9997**: Major overlays
- **9998-10001**: System notifications and accessibility

### Reserved for Future Use

- **OnChat Widget**: TBD (to be determined during integration)
  - Recommendation: Use z-index 1500-1999 range to sit above navigation but below system notifications

### Guidelines

1. **Never use arbitrary z-index values** - Always reference this document
2. **Maintain hierarchy** - Higher priority elements should have higher z-index
3. **Group related components** - Keep related UI elements in the same z-index range
4. **Test stacking** - Verify no conflicts when multiple layers are active
5. **Update this doc** - Any new z-index values must be documented here

### Common Stacking Scenarios

**Scenario 1: Mobile Menu Open**
- Mobile menu overlay (1000) appears
- Hamburger button (1001) stays above menu
- Header (1000) is at same level as menu
- Toast notifications (10000) remain visible above all

**Scenario 2: Share Modal Active**
- Share modal overlay (2000) covers everything
- Mobile menu (1000) is hidden behind modal
- Toast notifications (10000) remain visible

**Scenario 3: Loading State**
- Loading overlay (10000) covers entire page
- All other elements hidden behind loading screen

### Before Adding OnChat Widget

1. Determine OnChat widget's default z-index
2. Test widget with mobile menu open
3. Test widget with modals active
4. Test widget with toast notifications
5. Assign appropriate z-index range (recommended: 1500-1999)
6. Update this document with final values

---

**Last Updated**: Phase 3 Cleanup (v1.1.0)  
**Maintainer**: ZABAL Development Team
