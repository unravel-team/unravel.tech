# 🚨 CRITICAL: Cloudflare Pages Deployment Fix

## Your Error

```
✘ [ERROR] It looks like you've run a Workers-specific command in a Pages project.
For Pages, please run 'wrangler pages deploy' instead.
```

## What's Happening

The build command is trying to run `wrangler deploy` (for Workers) instead of just building your Astro site. Cloudflare Pages should build your site and then automatically deploy it - no manual deployment commands needed.

## The Fix (Simple!)

Go to your Cloudflare dashboard and update the build command:

### Step-by-Step:

1. **Open Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Click "Workers & Pages" in the sidebar
   - Find and click your project

2. **Edit Build Settings**
   - Click "Settings" tab
   - Click "Builds & deployments" 
   - Find "Build configuration" section
   - Click "Edit configuration"

3. **Set the Build Command:**

   **Build command:**
   ```
   npm run build
   ```
   
   **Note:** Cloudflare Pages auto-detects the build output directory (`dist`) for Astro projects. You don't need to set it manually.
   
   **Add Environment Variable** (if not already set):
   - Click "Add variable"
   - Name: `NODE_VERSION`
   - Value: `18`

4. **Save and Deploy**
   - Click "Save"
   - Go to "Deployments" tab
   - Click "Retry deployment"

## Important Notes

- ✅ **DO use:** `npm run build` or `make build`
- ❌ **DON'T use:** `make deploy`, `wrangler deploy`, or any deployment commands
- 💡 **Why:** Cloudflare Pages handles deployment automatically after building

## Alternative Build Commands

Any of these will work:
```bash
npm run build              # Simplest, recommended
make build                 # Also works (calls npm run build)
npm install && npm run build   # Explicit dependencies
```

## Verify It Worked

After saving and retrying, check the build logs. You should see:

```
✓ Installing dependencies (npm install)
✓ Building Astro site (npm run build)
✓ Build complete
✓ Deploying to Cloudflare Pages...
✓ Success! Site deployed
```

## Still Having Issues?

Check the deployment logs in Cloudflare:
1. Go to your project → Deployments
2. Click the failed deployment
3. Look for the line: `Executing user build command: ...`
4. It should say `npm run build`, NOT `make deploy`

If it still shows the wrong command, the settings didn't save. Try editing again.

## Quick Visual Reference

Your build configuration should look like:

```
┌─────────────────────────────────────────┐
│ Build configuration                      │
├─────────────────────────────────────────┤
│ Framework preset: Astro (auto-detected)  │
│                                          │
│ Build command:                           │
│ npm run build                            │
│                                          │
│ Environment variables:                   │
│ NODE_VERSION = 18                        │
└─────────────────────────────────────────┘
```

## If the Build Command Field Is Missing

If you don't see a build command field, it means Cloudflare is using Git integration:

1. **Check Project Type**:
   - Go to Workers & Pages
   - Your project should show "Pages" (not "Workers")
   - If it says "Workers", you need to recreate it as a Pages project

2. **For Git-Connected Projects**:
   - Cloudflare auto-detects Astro and sets build commands automatically
   - The error suggests it's trying to deploy as Workers instead of Pages
   - **Solution**: Delete the project and reconnect via **Pages** (not Workers)

3. **To Reconnect Properly**:
   - Workers & Pages → Create application → **Pages** tab
   - Connect to Git → Select your repository
   - Cloudflare will auto-detect Astro and configure correctly
   - Deploy

That's it! Your site should deploy successfully after these changes.
