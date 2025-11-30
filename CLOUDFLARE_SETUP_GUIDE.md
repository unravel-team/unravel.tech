# 🚨 CRITICAL: Cloudflare Pages Configuration Fix

## Current Issue

❌ **Error:** `✘ [ERROR] It looks like you've run a Workers-specific command in a Pages project. For Pages, please run 'wrangler pages deploy' instead.`

⚠️ **Warning:** `Multiple environments are defined in the Wrangler configuration file`

## Root Cause

Cloudflare is trying to deploy as a **Workers** project instead of a **Pages** project. This happens when:

1. The project is configured as "Workers" in Cloudflare dashboard
2. OR there's a wrangler.toml file that Cloudflare interprets as a Workers config
3. OR the build command is trying to deploy (instead of just building)

## The Solution

You need to configure this as a **Cloudflare Pages** project, NOT Workers.

## Fix Required - Configure as Pages Project

### Option 1: Re-create as Pages Project (Recommended)

If the project was created as a Workers project, the easiest fix is to delete and recreate:

1. **Delete Current Project**
   - Go to https://dash.cloudflare.com
   - Click "Workers & Pages"
   - Find your project → Click on it
   - Go to "Settings" → Scroll to bottom → "Delete project"

2. **Create New Pages Project**
   - Click "Workers & Pages" → "Create application"
   - Select "Pages" tab (NOT Workers)
   - Choose "Connect to Git" OR "Direct Upload"

3. **Configure Build Settings**
   
   **Framework preset:** Astro
   
   **Build command:**
   ```
   npm run build
   ```
   
   **Build output directory:**
   ```
   dist
   ```
   
   **Root directory:** (leave empty)
   
   **Environment variables:**
   ```
   NODE_VERSION = 18
   ```

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete

### Option 2: Fix Existing Project

If you want to keep the existing project:

1. **Verify Project Type**
   - Go to https://dash.cloudflare.com
   - Click "Workers & Pages"
   - Your project should be under "Pages" tab, NOT "Workers" tab
   - If it's under Workers, you MUST recreate it as Pages (see Option 1)

2. **Update Build Configuration**
   - Click on your project
   - Go to "Settings" → "Builds & deployments"
   
   **Set these values:**
   ```
   Framework preset:     Astro
   Build command:        npm run build
   Build output dir:     dist
   Root directory:       (empty)
   ```
   
   **Environment variables:**
   ```
   NODE_VERSION = 18
   ```

3. **Remove Any Deploy Commands**
   - Make sure there's NO "deploy command" or "wrangler deploy" anywhere
   - Cloudflare Pages handles deployment automatically after build

4. **Save and Retry**
   - Click "Save"
   - Go to "Deployments" tab
   - Click "Retry deployment" on the failed deployment

## What Each Setting Means

| Setting | Current (Wrong) | Correct | Why |
|---------|----------------|---------|-----|
| Build command | `make deploy` | `make build` | Cloudflare handles deployment, we just need to build |
| Build output | `dist` | `dist` | Already correct ✅ |
| Root directory | `unravel-site` (maybe) | (blank) | Build happens from repo root |

## Visual Checklist

Before saving, your settings should look like:

```
┌─────────────────────────────────────────┐
│ Build configuration                      │
├─────────────────────────────────────────┤
│ Build command:                           │
│ make build                               │ ← Must be this!
│                                          │
│ Build output directory:                  │
│ dist                                     │
│                                          │
│ Root directory (advanced):               │
│ /                                        │
└─────────────────────────────────────────┘
```

## After Fixing

Once you update these settings in the Cloudflare dashboard:

1. **Retry the deployment** (button in Cloudflare dashboard)
2. You should see:
   ```
   ✓ Build complete: unravel-site/dist
   ✓ Deploying to Cloudflare Pages...
   ✓ Success! Your site is live
   ```

## Alternative: Screenshot Guide

If you're having trouble finding the settings:

1. Dashboard → Workers & Pages
2. Click your project name
3. Look for tabs at the top: Overview / Deployments / Analytics / **Settings**
4. Click **Settings**
5. Left sidebar → **Builds & deployments**
6. Scroll to "Build configuration" section
7. Click "Edit configuration" button
8. Change "Build command" field
9. Save

## Still Getting Errors?

If you're still seeing the wrangler error after updating:

1. Double-check you saved the settings
2. Make sure you clicked "Retry deployment" after saving
3. Verify the build command shows `make build` (not `make deploy`)
4. Clear any cached builds in Cloudflare

## Need More Help?

Check the build logs in Cloudflare:
- Go to your project
- Click "Deployments" tab
- Click on the failed deployment
- Look at the logs to verify what command is being run

The logs should show:
```
Executing user build command: make build    ← Should say "make build"
```

If it still shows `make deploy`, the settings weren't saved correctly.
