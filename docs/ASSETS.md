# Asset Specifications

This document outlines the specifications for all visual assets used in the ZABAL Live Hub miniapp.

## 📐 Image Specifications

### Farcaster Miniapp Assets

| Asset | Size | Format | Purpose | Location |
|-------|------|--------|---------|----------|
| **Icon** | 1024×1024px | PNG | App icon in stores & header | `/assets/icon.png` |
| **Splash Screen** | 200×200px | PNG | Center logo on splash screen | `/assets/splash.png` |
| **Hero Image** | 1200×630px | PNG/JPG | Social sharing preview | `/assets/preview.png` |
| **Logo** | 1024×1024px | PNG | General branding | `/assets/logo.png` |

### Favicon Assets

| Asset | Size | Format | Purpose | Location |
|-------|------|--------|---------|----------|
| **favicon.ico** | 1024×1024px | ICO/PNG | Browser tab icon | `/favicon.ico` |
| **favicon-16x16** | 16×16px | PNG | Small browser icon | `/favicon-16x16.png` |
| **favicon-32x32** | 32×32px | PNG | Standard browser icon | `/favicon-32x32.png` |
| **apple-touch-icon** | 180×180px | PNG | iOS home screen icon | `/apple-touch-icon.png` |
| **android-chrome-192** | 192×192px | PNG | Android home screen | `/android-chrome-192x192.png` |
| **android-chrome-512** | 512×512px | PNG | Android splash screen | `/android-chrome-512x512.png` |

## 🎨 Design Guidelines

### Color Palette

```css
:root {
    --bg-dark: #0a0a0a;
    --bg-secondary: #141e27;
    --text-white: #ffffff;
    --text-gray: #a0a0a0;
    --accent-yellow: #e0ddaa;
    --border-color: rgba(224, 221, 170, 0.2);
}
```

### Splash Screen Specifications

- **Background Color:** `#141e27` (dark blue-gray)
- **Logo Size:** 200×200px centered
- **Logo Format:** PNG with transparency
- **Animation:** Fade in on load, fade out when ready

### Icon Guidelines

- **Style:** Clean, minimal, recognizable at small sizes
- **Background:** Transparent or solid color
- **Safe Area:** Keep important elements within 80% of canvas
- **Export:** PNG-24 with alpha channel

## 🛠️ Creating Assets

### Using Existing Favicon

The project uses `favicon.ico` (1024×1024px) as the source for all assets:

```bash
# Create splash screen (200×200px)
sips -z 200 200 favicon.ico --out assets/splash.png

# Create icon (1024×1024px)
cp favicon.ico assets/icon.png
```

### Using Design Tools

**Recommended Tools:**
- [Figma](https://figma.com) - Free design tool
- [Canva](https://canva.com) - Quick asset creation
- [Mini App Asset Generator](https://www.miniappassets.com/) - Auto-generate all sizes

**Export Settings:**
- Format: PNG-24
- Color Space: sRGB
- Compression: Optimized
- Transparency: Enabled (where applicable)

## 📦 Asset Optimization

### Image Optimization

Use these tools to optimize assets:

```bash
# Install ImageOptim (Mac)
brew install imageoptim-cli

# Optimize all assets
imageoptim assets/*.png

# Or use online tools:
# - TinyPNG (https://tinypng.com)
# - Squoosh (https://squoosh.app)
```

### File Size Guidelines

| Asset Type | Max Size | Recommended |
|------------|----------|-------------|
| Icon | 500KB | < 100KB |
| Splash | 100KB | < 50KB |
| Hero | 500KB | < 200KB |
| Favicon | 100KB | < 50KB |

## 🔄 Updating Assets

### Process

1. **Create new asset** following specifications above
2. **Optimize** using tools mentioned
3. **Test locally** in browser and Farcaster
4. **Update manifest** if URLs changed
5. **Deploy** and verify in production
6. **Clear cache** in Farcaster (may take 15-60 min)

### Manifest Configuration

Update `.well-known/farcaster.json` or Farcaster hosted manifest:

```json
{
  "miniapp": {
    "iconUrl": "https://zabal.art/assets/icon.png",
    "splashImageUrl": "https://zabal.art/assets/splash.png",
    "splashBackgroundColor": "#141e27",
    "heroImageUrl": "https://zabal.art/assets/preview.png"
  }
}
```

## ✅ Asset Checklist

Before deploying new assets:

- [ ] All assets meet size specifications
- [ ] Files are optimized (< recommended size)
- [ ] PNG files have transparency where needed
- [ ] Assets look good on light and dark backgrounds
- [ ] Tested on mobile and desktop
- [ ] Tested in Farcaster miniapp
- [ ] Manifest URLs updated
- [ ] Assets uploaded to correct paths
- [ ] Cache cleared/waited for propagation

## 🐛 Troubleshooting

### Asset Not Showing

1. **Check file path** - Ensure URL is correct
2. **Verify file exists** - Check file is uploaded
3. **Clear cache** - Wait 15-60 minutes for Farcaster
4. **Check console** - Look for 404 errors
5. **Validate manifest** - Use Farcaster debug tool

### Asset Quality Issues

1. **Check dimensions** - Verify exact pixel sizes
2. **Check compression** - May be over-compressed
3. **Check color space** - Should be sRGB
4. **Check transparency** - PNG-24 with alpha
5. **Re-export** - Try exporting again with correct settings

## 📚 Resources

- [Farcaster Miniapp Specification](https://miniapps.farcaster.xyz/docs/specification)
- [Mini App Asset Generator](https://www.miniappassets.com/)
- [Figma Community Assets](https://www.figma.com/community)
- [TinyPNG Optimizer](https://tinypng.com)
- [Squoosh Image Compressor](https://squoosh.app)

---

**Last Updated:** 2026-02-12
