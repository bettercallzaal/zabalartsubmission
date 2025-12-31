# SEO & Geo-Targeting Guide for ZABAL Live Hub

## Overview
This guide documents the SEO and geo-targeting optimizations implemented for the ZABAL Live Hub voting miniapp.

## Implemented Features

### 1. Favicon Implementation ✅
- **favicon.ico** - Standard browser favicon
- **favicon-16x16.png** - 16x16 pixel PNG favicon
- **favicon-32x32.png** - 32x32 pixel PNG favicon
- **apple-touch-icon.png** - 180x180 pixel iOS home screen icon
- **android-chrome-192x192.png** - 192x192 pixel Android icon
- **android-chrome-512x512.png** - 512x512 pixel Android icon

All favicons use the ZABAL "Z" logo with the brand colors (navy blue background, red/white Z).

### 2. Meta Tags for SEO

#### Basic SEO Meta Tags
```html
<meta name="description" content="Vote daily on ZABAL's creative stream direction!...">
<meta name="keywords" content="ZABAL, Farcaster, miniapp, voting, stream, NFT, art...">
<meta name="author" content="ZABAL">
<meta name="theme-color" content="#141e27">
```

#### Open Graph (OG) Tags
- `og:title` - Page title for social sharing
- `og:description` - Description for social sharing
- `og:image` - Preview image for social platforms
- `og:url` - Canonical URL
- `og:type` - Content type (website)
- `og:site_name` - Site name
- `og:locale` - Language locale (en_US)

#### Twitter Card Tags
- `twitter:card` - Card type (summary_large_image)
- `twitter:title` - Title for Twitter
- `twitter:description` - Description for Twitter
- `twitter:image` - Image for Twitter cards
- `twitter:site` - Twitter handle (@zabal)
- `twitter:creator` - Creator handle (@zabal)

### 3. Structured Data (JSON-LD)

Implemented Schema.org structured data for better search engine understanding:

```json
{
  "@type": "WebApplication",
  "name": "ZABAL Live Hub",
  "applicationCategory": "SocialNetworkingApplication",
  "potentialAction": {
    "@type": "VoteAction"
  }
}
```

This helps search engines understand:
- The app is a voting platform
- It's free to use
- It works on mobile and desktop
- The creator and social profiles

### 4. Geo-Targeting & Language

```html
<meta name="geo.region" content="US">
<meta name="geo.placename" content="United States">
<meta name="language" content="en">
<meta name="distribution" content="global">
```

**Note:** While initially targeting US, distribution is set to "global" to reach the worldwide Farcaster community.

### 5. Search Engine Directives

```html
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="googlebot" content="index, follow">
<meta name="bingbot" content="index, follow">
```

This instructs search engines to:
- Index all pages
- Follow all links
- Show large image previews
- Show full snippets and video previews

### 6. Sitemap & Robots.txt

#### sitemap.xml
Lists all pages with:
- Priority levels
- Change frequency
- Last modification dates
- Image references

#### robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /.well-known/

Sitemap: https://zabal.art/sitemap.xml
```

### 7. Web Manifest (PWA Support)

**site.webmanifest** enables Progressive Web App features:
- App name and short name
- Theme colors
- Icons for different devices
- Display mode (standalone)
- Start URL

### 8. Performance Optimizations

```html
<link rel="preconnect" href="https://unpkg.com">
<link rel="preconnect" href="https://esm.sh">
<link rel="dns-prefetch" href="https://zabal.art">
```

Preconnects to external resources for faster loading.

### 9. Canonical URLs

Each page has a canonical URL to prevent duplicate content issues:
```html
<link rel="canonical" href="https://zabal.art/">
```

## Pages Optimized

1. **index.html** - Main voting hub (priority: 1.0)
2. **gallery.html** - Research & updates (priority: 0.8)
3. **submissions.html** - Submit work page (priority: 0.8)

## SEO Best Practices Implemented

### ✅ Technical SEO
- Proper HTML5 semantic structure
- Mobile-responsive design
- Fast loading times
- HTTPS enabled (via Vercel)
- Clean URL structure

### ✅ On-Page SEO
- Descriptive page titles
- Unique meta descriptions for each page
- Keyword optimization
- Proper heading hierarchy
- Alt text for images (via existing implementation)

### ✅ Social SEO
- Open Graph tags for Facebook/LinkedIn
- Twitter Card tags
- Farcaster miniapp metadata
- Social sharing optimized

### ✅ Local/Geo SEO
- Geo-targeting meta tags
- Language specification
- Global distribution setting

## Monitoring & Analytics

The site already has:
- Custom analytics implementation (localStorage-based)
- Event tracking for user actions
- Error tracking

### Recommended Additions (Future)
- Google Search Console integration
- Google Analytics or Plausible
- Bing Webmaster Tools
- Social media analytics

## Testing Your SEO

### Tools to Use
1. **Google Search Console** - Submit sitemap, check indexing
2. **Google Rich Results Test** - Validate structured data
3. **Facebook Sharing Debugger** - Test OG tags
4. **Twitter Card Validator** - Test Twitter cards
5. **Lighthouse** - Performance and SEO audit
6. **Mobile-Friendly Test** - Google's mobile test

### Quick Checks
```bash
# Test robots.txt
curl https://zabal.art/robots.txt

# Test sitemap
curl https://zabal.art/sitemap.xml

# Test manifest
curl https://zabal.art/site.webmanifest
```

## Keywords Strategy

### Primary Keywords
- ZABAL Live Hub
- ZABAL voting
- Farcaster miniapp
- Stream voting platform

### Secondary Keywords
- NFT art community
- Web3 voting
- Crypto art platform
- Community-driven streaming
- Farcaster app

### Long-tail Keywords
- "Vote on ZABAL stream direction"
- "ZABAL community voting app"
- "Farcaster voting miniapp"
- "Daily stream mode voting"

## Content Strategy for SEO

### Current Strengths
- Clear value proposition
- Active community engagement
- Regular updates (daily voting)
- Social integration (Farcaster)

### Recommendations
1. **Blog/Updates Section** - Regular content about voting results, community highlights
2. **FAQ Page** - Answer common questions (good for long-tail keywords)
3. **About Page** - Tell the ZABAL story
4. **Community Highlights** - Showcase top voters, interesting votes

## Link Building Strategy

### Internal Links
- Cross-link between voting hub, gallery, and submissions
- Link to documentation
- Link to social profiles

### External Links
- Farcaster profile (https://warpcast.com/zaal)
- Twitter profile (https://twitter.com/zabal)
- GitHub repository

### Backlink Opportunities
- Farcaster app directory
- Web3 app directories
- NFT community sites
- Crypto art platforms

## Mobile Optimization

Already implemented:
- Responsive design
- Touch-friendly interface
- Mobile-first approach
- PWA capabilities

## Accessibility = SEO

Good accessibility helps SEO:
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Semantic HTML
- ✅ Alt text for images

## Next Steps

1. **Submit to Search Engines**
   - Google Search Console
   - Bing Webmaster Tools

2. **Submit Sitemap**
   ```
   https://zabal.art/sitemap.xml
   ```

3. **Monitor Performance**
   - Check Google Search Console weekly
   - Monitor keyword rankings
   - Track organic traffic

4. **Content Updates**
   - Keep sitemap updated
   - Update lastmod dates
   - Add new pages to sitemap

5. **Social Sharing**
   - Share on Farcaster regularly
   - Encourage community sharing
   - Use consistent hashtags

## Maintenance Checklist

### Weekly
- [ ] Check Search Console for errors
- [ ] Monitor keyword rankings
- [ ] Review analytics

### Monthly
- [ ] Update sitemap if new pages added
- [ ] Check for broken links
- [ ] Review and update meta descriptions
- [ ] Analyze top-performing content

### Quarterly
- [ ] Full SEO audit
- [ ] Update structured data if needed
- [ ] Review and refresh keywords
- [ ] Competitive analysis

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org)
- [Open Graph Protocol](https://ogp.me)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)

---

**Last Updated:** December 31, 2024
**Version:** 1.0.0
