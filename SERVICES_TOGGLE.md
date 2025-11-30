# Services Toggle Configuration

This document explains how to hide/show the services pages and navigation on the Unravel website.

## Quick Start

To hide all services pages and navigation:

1. Edit the `.env` file in the `unravel-site` directory
2. Set `ENABLE_SERVICES=false`
3. Restart your development server or rebuild the site

To show services again:

1. Edit the `.env` file
2. Set `ENABLE_SERVICES=true`
3. Restart your development server or rebuild the site

## What Gets Hidden

When `ENABLE_SERVICES=false`, the following are automatically hidden:

### Navigation
- ✅ Desktop navigation: Services dropdown menu is removed
- ✅ Mobile navigation: Services button and bottom sheet are removed
- ✅ Footer: Services link is removed from quick links

### SEO Protection
- ✅ Meta tags: All service pages get `<meta name="robots" content="noindex, nofollow">` added
- ✅ Robots.txt: Services pages are blocked via `/services/` disallow rules

### Service Pages
The actual service page files remain in place but are:
- Hidden from navigation (users can't discover them)
- Blocked from search engine indexing (crawlers are told not to index them)
- Still accessible if someone has a direct URL (but they won't be indexed or linked)

## Files Modified

1. **Environment Configuration**
   - `.env` - Your local environment variables (not committed to git)
   - `.env.example` - Template with the ENABLE_SERVICES flag documented

2. **Layout Components**
   - `src/layouts/BaseLayout.astro` - Desktop navigation, footer, and noindex meta tags
   - `src/components/MobileNavigation.astro` - Mobile navigation and bottom sheet

3. **Crawler Control**
   - `public/robots.txt` - Blocks search engine crawlers from indexing services

## Important Notes

⚠️ **Robots.txt Consideration**
The `robots.txt` file currently has services blocked by default. When you set `ENABLE_SERVICES=true`, you should also:
1. Edit `unravel-site/public/robots.txt`
2. Comment out or remove these lines:
   ```
   Disallow: /services/
   Disallow: /services
   ```

⚠️ **Environment Variables in Production**
Make sure your production environment (e.g., Vercel, Netlify) has the correct `ENABLE_SERVICES` variable set:
- Go to your hosting platform's environment variables settings
- Add `ENABLE_SERVICES=true` (or `false` to keep them hidden)
- Redeploy your site

## Testing

To test that services are properly hidden:

1. **Set services to disabled:**
   ```bash
   # In unravel-site/.env
   ENABLE_SERVICES=false
   ```

2. **Start dev server:**
   ```bash
   cd unravel-site
   npm run dev
   ```

3. **Verify:**
   - ✅ No "Services" menu in navigation
   - ✅ No "Services" in footer
   - ✅ Visit `/services` and check page source for `<meta name="robots" content="noindex, nofollow">`
   - ✅ Check `/robots.txt` shows services are disallowed

4. **Re-enable services:**
   ```bash
   # In unravel-site/.env
   ENABLE_SERVICES=true
   ```

5. **Restart server and verify services appear**

## Re-enabling Services Later

To re-enable services in the future:

1. **Update environment variable:**
   ```bash
   # In unravel-site/.env
   ENABLE_SERVICES=true
   ```

2. **Update robots.txt:**
   Edit `unravel-site/public/robots.txt` and remove/comment:
   ```diff
   - Disallow: /services/
   - Disallow: /services
   ```

3. **Restart/rebuild:**
   - Development: Restart the dev server
   - Production: Redeploy the site

4. **Verify:**
   - Services navigation appears in header, footer, mobile nav
   - Service pages no longer have noindex meta tags
   - Robots.txt allows crawling of /services/

That's it! Services will be fully visible and indexable again.
