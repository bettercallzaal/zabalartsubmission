# Farcaster Miniapp Splash Screen Guide

## 📋 Requirements (from Farcaster Spec)

### Splash Screen Behavior
- Shows immediately when app launches
- Icon and background must be specified in manifest
- App calls `sdk.actions.ready()` to hide splash screen
- Should display while app loads

### Asset Specifications

#### 1. **Splash Image (`splashImageUrl`)**
- **Current:** 1536 x 1024 px (3:2 ratio)
- **Recommended:** Square or portrait orientation works best
- **Format:** PNG, JPG, or WebP
- **Size:** Keep under 500KB for fast loading
- **Content:** Should include your logo/branding

#### 2. **Icon (`iconUrl`)**
- **Size:** 200 x 200 px minimum (square)
- **Format:** PNG with transparency recommended
- **Usage:** Shows in app catalogs and header
- **Content:** Your app logo

#### 3. **Preview Image (`imageUrl`)**
- **Size:** 3:2 ratio (e.g., 1200 x 800 px)
- **Format:** PNG or JPG
- **Usage:** Shows in casts when sharing
- **Content:** Preview of your app interface

#### 4. **OG Image (`ogImageUrl`)**
- **Size:** 1200 x 630 px (standard OG size)
- **Format:** PNG or JPG
- **Usage:** Social media previews
- **Content:** Branded preview image

### Background Color
- Use hex color code (e.g., `#141e27`)
- Should complement your splash image
- Provides fallback while image loads

## 🎨 Current Assets Status

### ✅ What You Have:
- `splash.png` - 1536 x 1024 px (good size)
- `logo.png` - Icon file exists
- `preview.png` - Preview image exists

### 🔧 Recommendations:

1. **Splash Image Design:**
   - Center your logo prominently
   - Add tagline: "Vote on stream direction"
   - Use your brand colors (#141e27 background)
   - Keep it simple and recognizable

2. **Icon Optimization:**
   - Should be square (200x200 minimum)
   - Clear logo without text
   - Works at small sizes

3. **Preview Image:**
   - Show actual app interface
   - Include vote buttons/modes
   - Make it clickable/engaging

## 📱 Best Practices (from Base Documentation)

### Discovery & Indexing:
- ✅ `primaryCategory` is required for searchability
- ✅ `accountAssociation` is required for verification
- ⏱️ Indexing takes up to 10 minutes after posting

### Image Requirements:
- ✅ All images must use HTTPS URLs
- ✅ Test in incognito to verify accessibility
- ✅ Supported formats: PNG, JPG, WebP
- ✅ Keep file sizes reasonable (<500KB each)

### Testing:
1. Share your Mini App URL in a cast
2. Wait up to 10 minutes for indexing
3. Verify appearance in app catalogs
4. Test on mobile (Base App, Warpcast)

## 🚀 Implementation Checklist

- [x] Splash image exists and is correct size
- [x] Background color specified in manifest
- [x] Icon URL configured
- [x] Preview image configured
- [x] OG image configured
- [x] All URLs use HTTPS
- [x] `sdk.actions.ready()` called in code
- [ ] Test splash screen dismissal timing
- [ ] Verify images load on mobile
- [ ] Check appearance in app catalog

## 🎯 Your Current Configuration

```json
{
  "splashImageUrl": "https://zabal.art/assets/splash.png",
  "splashBackgroundColor": "#141e27",
  "iconUrl": "https://zabal.art/assets/logo.png",
  "imageUrl": "https://zabal.art/assets/preview.png",
  "ogImageUrl": "https://zabal.art/assets/preview.png"
}
```

## 🔍 Troubleshooting

### Splash Screen Not Showing Correctly:
1. Verify image is accessible: `curl -I https://zabal.art/assets/splash.png`
2. Check image dimensions: Should be 1536x1024 or similar 3:2 ratio
3. Ensure `sdk.actions.ready()` is called after app loads
4. Test in incognito mode to rule out caching

### Images Not Loading:
1. Verify HTTPS (not HTTP)
2. Check CORS headers on your server
3. Test image URLs in browser
4. Clear Farcaster client cache

### App Not Appearing in Catalog:
1. Ensure `primaryCategory` is set
2. Verify `accountAssociation` is configured
3. Share app URL in a cast
4. Wait 10 minutes for indexing

## 📚 Resources

- [Farcaster Miniapp Specification](https://miniapps.farcaster.xyz/docs/specification)
- [Base Miniapp Troubleshooting](https://docs.base.org/mini-apps/troubleshooting/common-issues)
- [Farcaster SDK Documentation](https://miniapps.farcaster.xyz/docs/sdk)
