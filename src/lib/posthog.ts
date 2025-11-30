import posthog from 'posthog-js';

// PostHog Configuration
// Replace with your actual PostHog API key and host
const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY || 'phc_YOUR_API_KEY';
const POSTHOG_HOST = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

// Initialize PostHog
export function initPostHog() {
  if (typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only', // Only create profiles for identified users
      capture_pageview: false, // We'll manually track page views for better control
      capture_pageleave: true, // Track when users leave pages
      autocapture: true, // Automatically capture clicks, form submissions, etc.
      session_recording: {
        recordCrossOriginIframes: true,
      },
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          console.log('PostHog initialized in development mode');
        }
      },
    });
  }
}

// Page View Tracking
export function trackPageView(pageName?: string) {
  if (typeof window !== 'undefined') {
    const props = {
      page_title: document.title,
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: document.referrer,
      ...(pageName && { page_name: pageName }),
    };
    posthog.capture('$pageview', props);
  }
}

// Marketing Events - Top of Funnel
export function trackHeroInteraction(action: string, element?: string) {
  posthog.capture('hero_interaction', {
    action,
    element,
    location: 'homepage_hero',
  });
}

export function trackServiceViewed(serviceName: string, serviceUrl: string) {
  posthog.capture('service_viewed', {
    service_name: serviceName,
    service_url: serviceUrl,
    timestamp: new Date().toISOString(),
  });
}

export function trackServiceCTAClick(serviceName: string, ctaText: string, ctaLocation: string) {
  posthog.capture('service_cta_clicked', {
    service_name: serviceName,
    cta_text: ctaText,
    cta_location: ctaLocation,
    timestamp: new Date().toISOString(),
  });
}

// Blog Engagement
export function trackBlogPostViewed(postTitle: string, postSlug: string, readingTime?: number) {
  posthog.capture('blog_post_viewed', {
    post_title: postTitle,
    post_slug: postSlug,
    reading_time: readingTime,
    timestamp: new Date().toISOString(),
  });
}

export function trackBlogReadProgress(postTitle: string, percentRead: number) {
  posthog.capture('blog_read_progress', {
    post_title: postTitle,
    percent_read: percentRead,
    milestone: percentRead >= 75 ? 'deep_read' : percentRead >= 50 ? 'mid_read' : 'started',
  });
}

export function trackBlogCTAClick(postTitle: string, ctaText: string, ctaDestination: string) {
  posthog.capture('blog_cta_clicked', {
    post_title: postTitle,
    cta_text: ctaText,
    cta_destination: ctaDestination,
  });
}

// Contact & Conversion Events
export function trackContactAttempt(method: 'email' | 'form' | 'calendar', source: string) {
  posthog.capture('contact_attempt', {
    contact_method: method,
    source_page: source,
    timestamp: new Date().toISOString(),
  });
}

export function trackEmailClick(emailAddress: string, location: string) {
  posthog.capture('email_clicked', {
    email_address: emailAddress,
    click_location: location,
    timestamp: new Date().toISOString(),
  });
}

export function trackFormStarted(formName: string, formLocation: string) {
  posthog.capture('form_started', {
    form_name: formName,
    form_location: formLocation,
  });
}

export function trackFormSubmitted(formName: string, formLocation: string, formData?: Record<string, any>) {
  posthog.capture('form_submitted', {
    form_name: formName,
    form_location: formLocation,
    ...formData,
  });
}

// Navigation & User Behavior
export function trackNavigationClick(linkText: string, linkUrl: string, location: 'header' | 'footer' | 'mobile' | 'dropdown') {
  posthog.capture('navigation_clicked', {
    link_text: linkText,
    link_url: linkUrl,
    navigation_location: location,
  });
}

export function trackDropdownOpened(dropdownName: string) {
  posthog.capture('dropdown_opened', {
    dropdown_name: dropdownName,
    location: 'navigation',
  });
}

export function trackSearchPerformed(searchQuery: string, resultsCount?: number) {
  posthog.capture('search_performed', {
    search_query: searchQuery,
    results_count: resultsCount,
  });
}

// Talks & Events
export function trackTalkViewed(talkTitle: string, talkType: string) {
  posthog.capture('talk_viewed', {
    talk_title: talkTitle,
    talk_type: talkType,
  });
}

export function trackTalkLinkClicked(talkTitle: string, linkType: 'video' | 'slides' | 'article') {
  posthog.capture('talk_link_clicked', {
    talk_title: talkTitle,
    link_type: linkType,
  });
}

// Scroll & Engagement
export function trackScrollDepth(depth: 25 | 50 | 75 | 100) {
  posthog.capture('scroll_depth', {
    depth_percent: depth,
    page_path: window.location.pathname,
  });
}

export function trackTimeOnPage(seconds: number) {
  posthog.capture('time_on_page', {
    seconds_spent: seconds,
    minutes_spent: Math.round(seconds / 60),
    page_path: window.location.pathname,
  });
}

// Feature Usage
export function trackFeatureInteraction(featureName: string, interactionType: string, additionalData?: Record<string, any>) {
  posthog.capture('feature_interaction', {
    feature_name: featureName,
    interaction_type: interactionType,
    ...additionalData,
  });
}

// External Links
export function trackExternalLinkClick(linkUrl: string, linkText: string, location: string) {
  posthog.capture('external_link_clicked', {
    external_url: linkUrl,
    link_text: linkText,
    click_location: location,
  });
}

// Downloads
export function trackDownload(fileName: string, fileType: string, downloadSource: string) {
  posthog.capture('file_downloaded', {
    file_name: fileName,
    file_type: fileType,
    download_source: downloadSource,
  });
}

// Social Media
export function trackSocialClick(platform: string, action: 'share' | 'follow' | 'visit', contentTitle?: string) {
  posthog.capture('social_interaction', {
    social_platform: platform,
    social_action: action,
    content_title: contentTitle,
  });
}

// Error Tracking
export function trackError(errorMessage: string, errorType: string, errorLocation: string) {
  posthog.capture('error_occurred', {
    error_message: errorMessage,
    error_type: errorType,
    error_location: errorLocation,
    timestamp: new Date().toISOString(),
  });
}

// User Identification (for when users submit forms or log in)
export function identifyUser(userId: string, userProperties?: Record<string, any>) {
  posthog.identify(userId, userProperties);
}

// Feature Flags (for A/B testing)
export function getFeatureFlag(flagKey: string): boolean | string | undefined {
  return posthog.getFeatureFlag(flagKey);
}

export function isFeatureEnabled(flagKey: string): boolean {
  return posthog.isFeatureEnabled(flagKey) || false;
}

// Export posthog instance for advanced usage
export { posthog };
