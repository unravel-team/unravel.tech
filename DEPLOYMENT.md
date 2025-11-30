# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Unravel site to Cloudflare Pages using the provided Makefile.

## Prerequisites

1. **Cloudflare Account** - Sign up at https://dash.cloudflare.com/sign-up
   - Free tier includes unlimited bandwidth and builds
   - Automatic SSL/TLS certificates
   - Global CDN with 200+ locations

2. **Node.js and npm** - Required to build the Astro site
   ```bash
   node --version  # Should be v18 or higher
   npm --version
   ```

3. **Wrangler CLI** (optional) - Cloudflare's deployment tool
   ```bash
   # Install globally
   npm install -g wrangler
   
   # Or use npx (no installation needed)
   # The Makefile will automatically use npx if wrangler isn't installed
   ```

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and fill in your Cloudflare project details:

```bash
cp unravel-site/.env.example unravel-site/.env
```

Edit `unravel-site/.env` and set:

```bash
# Required for deployment
CLOUDFLARE_PROJECT_NAME=unravel-tech

# Optional (only needed for cache purging via API)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

Alternatively, you can set these as system environment variables:

```bash
export CLOUDFLARE_PROJECT_NAME=unravel-tech
```

### 2. Deploy the Site

Run the full deployment process:

```bash
make deploy
```

This single command will:
1. Build the Astro site (`npm run build`)
2. Deploy to Cloudflare Pages using Wrangler
3. Display the deployment URL
4. Automatically purge the cache

## Makefile Commands

View all available commands:

```bash
make help
```

### Available Targets

- **`make install`** - Install npm dependencies
  ```bash
  make install
  ```

- **`make build`** - Build the Astro site (output: `unravel-site/dist/`)
  ```bash
  make build
  ```

- **`make preview`** - Build and preview the site locally
  ```bash
  make preview
  ```

- **`make clean`** - Remove build artifacts
  ```bash
  make clean
  ```

- **`make deploy`** - Build and deploy to Cloudflare Pages
  ```bash
  make deploy
  ```

- **`make purge-cache`** - Purge Cloudflare cache (requires API token)
  ```bash
  make purge-cache
  ```

- **`make check-config`** - Verify Cloudflare configuration
  ```bash
  make check-config
  ```

## Deployment Workflows

### Standard Deployment

For most deployments, use the `deploy` target:

```bash
make deploy
```

### Deploy to Staging Branch

Deploy to a different branch (e.g., for preview):

```bash
BRANCH=staging make deploy
```

Each branch gets its own URL:
- Production: `https://unravel-tech.pages.dev`
- Staging: `https://staging.unravel-tech.pages.dev`

### Override Project Name

Deploy to a different project:

```bash
make deploy PROJECT_NAME=my-other-project
```

### First-Time Deployment

If this is your first deployment, Wrangler will:
1. Prompt you to log in to Cloudflare (browser-based auth)
2. Ask you to create a new project or select an existing one
3. Deploy your site and give you a `.pages.dev` URL

## Cloudflare Pages Setup Guide

### Creating a Project (Via Dashboard)

1. **Go to Cloudflare Pages**
   - Log in to https://dash.cloudflare.com
   - Navigate to "Workers & Pages" → "Pages"
   - Click "Create application" → "Pages"

2. **Connect to Git (Optional)**
   - Connect to GitHub, GitLab, or Bitbucket
   - Select your repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Root directory:** `unravel-site`

3. **Deploy via Wrangler (Recommended)**
   - No need to connect Git repository
   - Deploy directly from local machine using `make deploy`
   - Faster iteration and more control

### Creating a Project (Via Wrangler)

```bash
# First deployment will create the project
make deploy

# Wrangler will prompt:
# 1. Login to Cloudflare (opens browser)
# 2. Create new project or select existing
# 3. Deploy the site
```

### Setting Up Custom Domain

1. **Add Custom Domain** (Cloudflare Dashboard)
   - Go to your Pages project
   - Click "Custom domains" → "Set up a custom domain"
   - Enter your domain (e.g., `unravel.tech`)
   - Cloudflare will automatically configure DNS and SSL

2. **DNS Configuration**
   - If your domain is already on Cloudflare, DNS is automatic
   - If not, add a CNAME record pointing to `<project>.pages.dev`

### Environment Variables

Set environment variables in Cloudflare Dashboard:

1. Go to your Pages project
2. Click "Settings" → "Environment variables"
3. Add variables like `PUBLIC_POSTHOG_KEY`
4. Set for "Production" and/or "Preview" environments

## Wrangler Authentication

### First-Time Setup

```bash
# Login to Cloudflare
npx wrangler login

# This will:
# 1. Open your browser
# 2. Ask you to authorize Wrangler
# 3. Save credentials locally
```

### Using API Tokens

For CI/CD, use API tokens instead of interactive login:

```bash
# Create API token in Cloudflare Dashboard:
# My Profile > API Tokens > Create Token
# Use the "Edit Cloudflare Workers" template

export CLOUDFLARE_API_TOKEN=your-api-token
make deploy
```

## Cache Management

### Automatic Cache Purging

Cloudflare Pages automatically purges cache on each deployment. No manual action needed!

### Manual Cache Purge

To manually purge the cache (requires API token and account ID):

```bash
export CLOUDFLARE_API_TOKEN=your-api-token
export CLOUDFLARE_ACCOUNT_ID=your-account-id
export CLOUDFLARE_PROJECT_NAME=unravel-tech

make purge-cache
```

### Finding Your Account ID

1. Log in to Cloudflare Dashboard
2. Click on your account name (top right)
3. Copy the "Account ID" from the right sidebar

## Troubleshooting

### "wrangler: command not found"

**Problem:** Wrangler CLI not installed

**Solution:** The Makefile automatically uses `npx wrangler`, so no installation needed. However, if you want to install it globally:

```bash
npm install -g wrangler
```

### "You need to be logged in"

**Problem:** Not authenticated with Cloudflare

**Solution:**
```bash
npx wrangler login
# Follow the browser-based authentication flow
```

### "Project not found"

**Problem:** Project name doesn't exist

**Solution:**
```bash
# Let Wrangler create the project on first deploy
make deploy

# Or create it manually in Cloudflare Dashboard first
```

### Build Failures

**Problem:** Site fails to build

**Solution:**
```bash
# Test the build locally first
make build

# Check for errors in the output
# Fix any TypeScript/Astro errors
```

### Deployment Stuck or Slow

**Problem:** Deployment taking too long

**Solution:**
```bash
# Check your internet connection
# Large builds may take 1-3 minutes

# Clean and rebuild
make clean build deploy
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: unravel-site/package-lock.json
      
      - name: Install dependencies
        run: make install
      
      - name: Build site
        run: make build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: unravel-tech
          directory: unravel-site/dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

Add these secrets to your GitHub repository:
- `CLOUDFLARE_API_TOKEN` - Create in Cloudflare Dashboard
- `CLOUDFLARE_ACCOUNT_ID` - Find in Cloudflare Dashboard

### Alternative: Using Wrangler in CI/CD

```yaml
- name: Deploy to Cloudflare Pages
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
  run: |
    npx wrangler pages deploy unravel-site/dist \
      --project-name=unravel-tech \
      --branch=${{ github.ref_name }}
```

## Performance Optimization

### Build Optimization

Astro automatically optimizes:
- ✓ Minifies HTML, CSS, and JavaScript
- ✓ Optimizes images
- ✓ Generates static HTML pages
- ✓ Creates efficient bundles
- ✓ Tree-shakes unused code

### Cloudflare Optimizations

Cloudflare Pages provides:
- ✓ Global CDN with 200+ locations
- ✓ Automatic Brotli/Gzip compression
- ✓ HTTP/2 and HTTP/3 support
- ✓ Automatic image optimization
- ✓ Smart routing with Tiered Cache

### Monitoring Performance

Use Cloudflare Analytics:
1. Go to your Pages project
2. Click "Analytics" tab
3. Monitor:
   - Page views and unique visitors
   - Bandwidth usage
   - Requests by country
   - Performance metrics

### Web Vitals

Monitor Core Web Vitals:
- Use Cloudflare Web Analytics (free, privacy-first)
- Add to your site:
  ```html
  <script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
          data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
  ```

## Cost & Limits

### Cloudflare Pages Free Tier

- **Builds:** 500 builds/month
- **Bandwidth:** Unlimited
- **Requests:** Unlimited
- **Sites:** Unlimited projects
- **Build time:** 20 minutes max per build
- **Files:** 20,000 files per deployment
- **Size:** 25 MB per file

Perfect for most websites! The Unravel site easily fits within these limits.

### Paid Plans

If you need more:
- **Pages Pro:** $20/month
  - 5,000 builds/month
  - Concurrent builds
  - Priority support

## Security Best Practices

### Environment Variables

1. **Never commit `.env` file**
   ```bash
   # Already in .gitignore
   unravel-site/.env
   ```

2. **Use Cloudflare Environment Variables**
   - Set sensitive vars in Cloudflare Dashboard
   - Different values for Production vs Preview
   - Automatically encrypted

### HTTPS

- ✓ Automatic SSL/TLS certificates
- ✓ Free wildcard certificates
- ✓ Automatic certificate renewal
- ✓ TLS 1.3 support

### Access Control

Set up Cloudflare Access for preview deployments:
1. Go to "Zero Trust" in Cloudflare Dashboard
2. Protect preview URLs with authentication
3. Require login for staging environments

### Security Headers

Configure security headers in `_headers` file:

```bash
# Create unravel-site/public/_headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Advanced Features

### Redirects

Create `unravel-site/public/_redirects`:

```bash
# Redirect old URLs
/old-page  /new-page  301

# Proxy external resources
/api/*  https://api.example.com/:splat  200
```

### Custom Headers

Create `unravel-site/public/_headers`:

```bash
# Cache static assets
/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

# Don't cache HTML
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### Functions (Edge Functions)

Deploy serverless functions alongside your site:

```javascript
// unravel-site/functions/api/hello.js
export async function onRequest(context) {
  return new Response('Hello from Cloudflare Pages!');
}
```

Access at: `https://your-site.pages.dev/api/hello`

## Branch Deployments

Cloudflare Pages creates preview URLs for every branch:

```bash
# Deploy to production branch
make deploy

# Deploy to staging
BRANCH=staging make deploy

# Deploy to feature branch
BRANCH=feature/new-design make deploy
```

URLs:
- `https://unravel-tech.pages.dev` (production)
- `https://staging.unravel-tech.pages.dev` (staging)
- `https://feature-new-design.unravel-tech.pages.dev` (feature)

## Rollbacks

### Via Dashboard

1. Go to your Pages project
2. Click "Deployments" tab
3. Find previous successful deployment
4. Click "Rollback to this deployment"

### Via Wrangler

```bash
# List deployments
npx wrangler pages deployment list --project-name=unravel-tech

# Rollback to specific deployment
# (Redeploy from local is usually easier)
make deploy
```

## Getting Help

### Resources

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Astro Docs:** https://docs.astro.build/
- **Community:** https://discord.gg/cloudflaredev

### Support

1. Check the Makefile help: `make help`
2. Verify configuration: `make check-config`
3. Review build logs in Cloudflare Dashboard
4. Check Cloudflare status: https://www.cloudflarestatus.com/

### Common Issues

- **Build fails:** Check `make build` locally first
- **404 errors:** Verify build output directory is `dist`
- **Slow deployment:** Normal for first deployment (downloading dependencies)
- **Authentication errors:** Run `npx wrangler login` again

## Comparison: Cloudflare Pages vs Others

### Why Cloudflare Pages?

✅ **Pros:**
- Unlimited bandwidth (vs AWS charges)
- Free SSL certificates
- Global CDN included
- Automatic cache management
- Built-in DDoS protection
- Easy preview deployments
- No configuration needed

❌ **Cons:**
- 20 minute build limit (rarely an issue)
- 25 MB file size limit (rarely an issue)
- Fewer integrations than AWS

### Migration from Other Platforms

**From AWS CloudFront/S3:**
- Remove S3 sync commands
- Remove CloudFront invalidation
- Use `wrangler pages deploy` instead
- Simpler, faster, cheaper!

**From Vercel/Netlify:**
- Similar workflow
- Better bandwidth pricing
- More generous free tier

## Next Steps

After deployment:
1. ✓ Set up custom domain
2. ✓ Configure environment variables
3. ✓ Enable Cloudflare Web Analytics
4. ✓ Set up GitHub Actions for auto-deploy
5. ✓ Configure security headers
6. ✓ Monitor performance metrics

Your site is now deployed on Cloudflare's global network with automatic scaling, DDoS protection, and edge caching. Enjoy lightning-fast performance worldwide! ⚡
