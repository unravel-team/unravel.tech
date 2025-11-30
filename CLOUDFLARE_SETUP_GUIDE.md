# 🚨 CRITICAL: Cloudflare Pages Build Configuration Fix

## Current Issue

✅ **Build succeeds:** `✓ Build complete: unravel-site/dist`  
❌ **Deployment fails:** `✘ [ERROR] Must specify a project name`

The build is working perfectly! But Cloudflare is running the wrong command.

## Why This Happens

Cloudflare Pages is configured to run `make deploy` which:
1. Builds the site ✅
2. Tries to deploy via wrangler ❌ (conflicts with Cloudflare's own deployment)

Instead, it should run `make build` which:
1. Builds the site ✅
2. Stops and lets Cloudflare handle deployment ✅

## Fix Required - Update Cloudflare Dashboard

**This MUST be done in the Cloudflare dashboard. It cannot be fixed in code.**

### Step-by-Step Instructions:

1. **Go to Cloudflare Dashboard**
   - Open https://dash.cloudflare.com
   - Log in to your account

2. **Navigate to your Pages project**
   - Click "Workers & Pages" in the left sidebar
   - Find and click on your project (likely named "unravel-tech" or similar)

3. **Open Build Settings**
   - Click on "Settings" tab
   - Click on "Builds & deployments" in the left menu

4. **Update Build Configuration**
   
   Find the section that says "Build configuration" and click "Edit configuration" or "Configure Build Settings"
   
   **Change these settings:**
   
   ```
   Build command:           make build          (NOT make deploy!)
   Build output directory:  dist
   Root directory:          (leave blank or /)
   ```
   
   **Environment variables (if not already set):**
   ```
   NODE_VERSION = 18
   ```

5. **Save and Retry**
   - Click "Save" or "Save and deploy"
   - Click "Retry deployment" or trigger a new deployment

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
