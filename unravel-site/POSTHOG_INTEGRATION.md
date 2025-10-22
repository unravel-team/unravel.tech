# PostHog Analytics Integration Guide

## Overview

PostHog has been integrated into the Unravel website to track user engagement, conversion funnels, and marketing effectiveness. This document explains the implementation, tracked events, and how to use the analytics data.

## What is PostHog?

PostHog is an open-source product analytics platform that helps you understand user behavior, track conversions, and optimize your marketing funnel. Unlike traditional analytics tools, PostHog provides:

- Event-based tracking for detailed user interactions
- Session recording to see exactly how users interact with your site
- Feature flags for A/B testing
- Funnel analysis to identify conversion bottlenecks
- User cohorts and retention analysis

## Setup Instructions

### 1. Install Dependencies

Dependencies have already been installed. The package added was:

```bash
npm install posthog-js
```

### 2. Get Your PostHog API Key

1. Sign up for PostHog at [https://app.posthog.com](https://app.posthog.com)
2. Create a new project or use an existing one
3. Go to Project Settings → API Keys
4. Copy your API key (format: `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 3. Configure Environment Variables

Create a `.env` file in the `unravel-site` directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your PostHog API key:

```env
PUBLIC_POSTHOG_KEY=phc_your_actual_api_key_here
PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Important:** Never commit your `.env` file to version control. It's already in `.gitignore`.

### 4. Start the Development Server

```bash
npm run dev
```

PostHog will now track events in both development and production.

## Architecture

### File Structure

```
unravel-site/
├── src/
│   ├── lib/
│   │   └── posthog.ts          # PostHog configuration & tracking functions
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Global tracking initialization
│   │   └── BlogLayout.astro    # Blog-specific tracking
│   └── pages/
│       ├── index.astro         # Homepage conversion tracking
│       └── services/
│           └── ai-consulting.astro  # Service page tracking
└── .env.example                # Environment variables template
```

### Core Components

#### 1. PostHog Configuration (`src/lib/posthog.ts`)

This file contains:
- PostHog initialization
- All tracking functions
- Type-safe event definitions

#### 2. Base Layout Integration (`src/layouts/BaseLayout.astro`)

Tracks:
- Page views
- Navigation clicks (header, footer, dropdown, mobile)
- Email clicks
- External link clicks
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page
- Dropdown interactions

#### 3. Homepage Tracking (`src/pages/index.astro`)

Tracks:
- Hero CTA clicks
- Service card views and clicks
- Bottom CTA clicks
- Scroll to services section

#### 4. Service Page Tracking (`src/pages/services/*.astro`)

Tracks:
- Service page views
- Hero CTA clicks
- Service offering interactions
- Audience segment engagement
- Bottom CTA conversions

#### 5. Blog Post Tracking (`src/layouts/BlogLayout.astro`)

Tracks:
- Blog post views
- Read progress (25%, 50%, 75%, 100%)
- Time spent reading
- Internal/external link clicks from content
- Tag clicks
- Back to blog navigation

## Tracked Events

### Navigation Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `navigation_clicked` | User clicks on navigation link | `link_text`, `link_url`, `navigation_location` |
| `dropdown_opened` | User opens services dropdown | `dropdown_name`, `location` |
| `email_clicked` | User clicks email link | `email_address`, `click_location` |
| `external_link_clicked` | User clicks external link | `external_url`, `link_text`, `click_location` |

### Homepage Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `hero_interaction` | User interacts with hero section | `action`, `element`, `location` |
| `service_viewed` | Service card comes into view | `service_name`, `service_url` |
| `service_cta_clicked` | User clicks service CTA | `service_name`, `cta_text`, `cta_location` |

### Service Page Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `service_viewed` | User lands on service page | `service_name`, `service_url` |
| `service_cta_clicked` | User clicks service-specific CTA | `service_name`, `cta_text`, `cta_location` |
| `contact_attempt` | User attempts to contact | `contact_method`, `source_page` |

### Blog Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `blog_post_viewed` | User views blog post | `post_title`, `post_slug`, `reading_time` |
| `blog_read_progress` | User scrolls through content | `post_title`, `percent_read`, `milestone` |
| `blog_cta_clicked` | User clicks CTA in blog | `post_title`, `cta_text`, `cta_destination` |

### Engagement Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `scroll_depth` | User scrolls to milestone | `depth_percent`, `page_path` |
| `time_on_page` | Time spent on page | `seconds_spent`, `minutes_spent`, `page_path` |

## Marketing Funnel Analysis

### Conversion Funnel Stages

The tracking implementation is designed to monitor a complete marketing funnel:

```
Stage 1: Awareness
├── Homepage visit ($pageview)
├── Service exploration (scroll_depth, service_viewed)
└── Content consumption (blog_post_viewed)

Stage 2: Interest
├── Service detail pages (service_viewed)
├── Blog deep reads (blog_read_progress >= 50%)
└── Multiple page views (time_on_page > 30s)

Stage 3: Consideration
├── Dropdown exploration (dropdown_opened)
├── Service comparison (multiple service_viewed)
└── Blog CTA clicks (blog_cta_clicked)

Stage 4: Intent
├── Hero CTA clicks (hero_interaction)
├── Service page CTAs (service_cta_clicked)
└── Email link hovers/clicks (email_clicked)

Stage 5: Conversion
├── Contact form submission (contact_attempt)
├── Email sent (email_clicked)
└── Calendar booking (contact_attempt with method: 'calendar')
```

### Setting Up Funnels in PostHog

1. Go to PostHog → Insights → Create New Insight
2. Select "Funnel" visualization
3. Add the following steps:

**Basic Conversion Funnel:**
```
Step 1: $pageview (homepage)
Step 2: service_viewed
Step 3: service_cta_clicked
Step 4: contact_attempt
```

**Blog-to-Service Funnel:**
```
Step 1: blog_post_viewed
Step 2: blog_read_progress (where percent_read >= 75)
Step 3: blog_cta_clicked
Step 4: service_viewed
Step 5: contact_attempt
```

**Service Exploration Funnel:**
```
Step 1: $pageview (homepage)
Step 2: dropdown_opened
Step 3: navigation_clicked (where navigation_location = 'dropdown')
Step 4: service_viewed
Step 5: service_cta_clicked
```

## Key Metrics to Track

### Engagement Metrics

1. **Average Time on Page**: Track via `time_on_page` events
2. **Scroll Depth**: Percentage of users reaching 75%+ scroll
3. **Blog Completion Rate**: Users reaching 100% read progress
4. **Service Card CTR**: Click-through rate on service cards

### Conversion Metrics

1. **Homepage to Service**: Users clicking through to service pages
2. **Service to Contact**: Conversion rate from service page to contact attempt
3. **Blog to Service**: Users navigating from blog to service pages
4. **Email Click Rate**: Percentage of users clicking email links

### User Behavior Insights

1. **Most Viewed Services**: Which services get the most attention
2. **Popular Blog Posts**: Which content drives the most engagement
3. **Navigation Patterns**: Common user journeys through the site
4. **Exit Points**: Where users leave the funnel

## Using Tracking Functions in Code

### Adding New Tracked Events

If you need to add tracking to a new page or component:

```typescript
// Import the tracking functions you need
import { 
  trackServiceCTAClick, 
  trackContactAttempt,
  trackFeatureInteraction 
} from '../lib/posthog';

// Track a button click
button.addEventListener('click', () => {
  trackServiceCTAClick('AI Implementation', 'Get Started', 'hero_section');
});

// Track a form submission
form.addEventListener('submit', () => {
  trackContactAttempt('form', 'contact_page');
});

// Track a custom interaction
trackFeatureInteraction('chatbot', 'opened', {
  source: 'homepage',
  user_type: 'first_time'
});
```

### Available Tracking Functions

See `src/lib/posthog.ts` for all available functions. Key functions include:

- `trackPageView(pageName?)`
- `trackServiceViewed(serviceName, serviceUrl)`
- `trackServiceCTAClick(serviceName, ctaText, ctaLocation)`
- `trackBlogPostViewed(postTitle, postSlug, readingTime?)`
- `trackBlogReadProgress(postTitle, percentRead)`
- `trackContactAttempt(method, source)`
- `trackEmailClick(emailAddress, location)`
- `trackNavigationClick(linkText, linkUrl, location)`
- `trackScrollDepth(depth)`
- `trackTimeOnPage(seconds)`
- `trackExternalLinkClick(linkUrl, linkText, location)`

## Viewing Analytics Data

### PostHog Dashboard

1. **Insights**: View trends, funnels, and user paths
2. **Session Recordings**: Watch actual user sessions
3. **Feature Flags**: Run A/B tests on new features
4. **Persons**: See individual user journeys
5. **Cohorts**: Group users by behavior patterns

### Recommended Dashboards

Create these dashboards in PostHog:

#### 1. Marketing Overview
- Total page views (last 30 days)
- Unique visitors
- Top landing pages
- Conversion rate (homepage → contact)

#### 2. Content Performance
- Blog post views
- Average read completion rate
- Most popular posts
- Blog-to-service conversion rate

#### 3. Service Pages
- Service page views by type
- Service CTA click-through rate
- Time spent on service pages
- Service page bounce rate

#### 4. User Journey
- Common paths through site
- Drop-off points in funnel
- Average pages per session
- Return visitor rate

## Best Practices

### 1. Event Naming Conventions

- Use snake_case for event names: `service_cta_clicked`
- Be descriptive but concise
- Group related events with common prefixes: `blog_*`, `service_*`

### 2. Property Guidelines

- Always include relevant context in properties
- Use consistent property names across events
- Include timestamps for time-sensitive events

### 3. Performance Considerations

- Events are batched and sent asynchronously
- No impact on page load performance
- Tracking uses passive event listeners for scroll events

### 4. Privacy & GDPR

- PostHog respects Do Not Track settings
- Session recording can be disabled
- Personal data is not tracked by default
- Configure data retention in PostHog settings

## Troubleshooting

### Events Not Showing Up

1. **Check environment variables**: Ensure `PUBLIC_POSTHOG_KEY` is set correctly
2. **Open browser console**: PostHog logs initialization in development mode
3. **Check PostHog dashboard**: Events may take a few seconds to appear
4. **Verify network requests**: Look for requests to PostHog API in Network tab

### Development Mode

In development, PostHog will log events to the console. You can disable this by setting:

```javascript
// In src/lib/posthog.ts
loaded: (posthog) => {
  if (import.meta.env.DEV) {
    // Comment out this line to disable dev logging
    // console.log('PostHog initialized in development mode');
  }
}
```

### Common Issues

**Issue**: Events tracked twice
- **Solution**: Check for duplicate event listeners or multiple initializations

**Issue**: TypeScript errors
- **Solution**: Ensure you're using the correct function signatures from `posthog.ts`

**Issue**: Events not tracked on Astro page transitions
- **Solution**: Use `astro:page-load` event listener to reinitialize tracking

## Advanced Features

### Feature Flags

Use PostHog feature flags for A/B testing:

```typescript
import { isFeatureEnabled } from '../lib/posthog';

if (isFeatureEnabled('new-homepage-design')) {
  // Show new design
} else {
  // Show old design
}
```

### User Identification

When users submit a form or log in:

```typescript
import { identifyUser } from '../lib/posthog';

identifyUser('user-email@example.com', {
  name: 'John Doe',
  company: 'Acme Corp',
  plan: 'enterprise'
});
```

### Custom Event Properties

Add extra context to any event:

```typescript
trackServiceCTAClick('AI Consulting', 'Book Consultation', 'hero', {
  referrer: document.referrer,
  device_type: 'mobile',
  campaign: 'spring-2025'
});
```

## Support

For PostHog-specific issues:
- Documentation: [https://posthog.com/docs](https://posthog.com/docs)
- Community: [https://posthog.com/community](https://posthog.com/community)

For implementation questions about this integration:
- Review the code in `src/lib/posthog.ts`
- Check example usage in page components
- Refer to this documentation

## Next Steps

1. **Set up PostHog account** and get your API key
2. **Configure environment variables** with your actual API key
3. **Create dashboards** for key metrics
4. **Set up funnel visualizations** to track conversions
5. **Review analytics weekly** to identify optimization opportunities
6. **Iterate based on data** - use insights to improve user experience

## Changelog

### v1.0.0 - Initial Implementation
- ✅ PostHog integration in BaseLayout
- ✅ Homepage conversion tracking
- ✅ Service page tracking
- ✅ Blog post engagement tracking
- ✅ Navigation and interaction tracking
- ✅ Comprehensive event library
- ✅ Environment configuration
- ✅ Documentation

---

**Last Updated**: 2025-01-15
