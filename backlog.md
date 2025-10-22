## Implement Mobile-First Responsive Design

Ensure all pages and components are designed mobile-first, starting from 320px viewport. Use fluid units (rem, em, %), touch targets >=44px, and content-driven breakpoints. Test on real devices for LCP <2.5s, INP <200ms, CLS <0.1. Update global.css with appropriate media queries and grid systems.

## Update Visual Design System to Unravel Colors

Refactor CSS variables in global.css to include Unravel palette: --unravel-green: #6BC443, --unravel-blue: #00A3CC, etc. Apply to buttons, links, backgrounds. Ensure WCAG AA contrast ratios. Update existing components (e.g., MobileNavigation.astro, cards in services pages) to use these colors with subtle green-to-blue gradients.

## Add Subtle Animations and Micro-Interactions

Implement Unravel motion principles: Add @keyframes for unravel-in, color-shift. Apply smooth transitions (0.2-0.4s, ease-out) to hovers, focus states in buttons and cards. Respect prefers-reduced-motion. Update components like AnimatedSection.tsx, ParallaxSection.tsx, HorizontalScroll.tsx to include purposeful movements without distraction.

## Ensure Accessibility Standards (WCAG 2.2 AAA)

Audit all pages for keyboard navigation, ARIA labels, alt text on images (e.g., in blog posts), focus indicators (2px border in brand colors). Improve semantic HTML in layouts (BaseLayout.astro, BlogLayout.astro). Add skip links. Test contrast for text, ensure screen reader compatibility. Fix any issues in services and blog pages.

## Implement Light and Dark Mode Theming

Add CSS variables for light/dark modes in :root and [data-theme="dark"]. Include transitions for smooth switching. Respect system preferences with @media (prefers-color-scheme: dark). Update all components and pages (index.astro, services/*.astro, blog/*.md) to use theme vars. Add theme toggle in navigation if needed.

## Optimize Performance and SEO

Target Core Web Vitals: Convert images to WebP/AVIF (public/ folder), add lazy loading, preload critical resources. Add meta tags (charset, description, OG) to all pages. Implement JSON-LD structured data in head. Minify CSS/JS via Astro config. Check bundle sizes, ensure page weight <1.5MB. Update astro.config.mjs if needed.

## Refactor Layouts to Card-Based Architecture

Apply clean grid system (repeat(auto-fit, minmax(280px, 1fr))) to services and blog index pages. Use .unravel-grid class with 2rem gaps, rounded cards (12px radius, subtle shadows). Update services/*.astro and blog/index.astro. Ensure generous whitespace, consistent padding (1.5-2rem).

## Enhance Navigation and Hero Sections

Improve MobileNavigation.astro with bottom tab or hamburger, thumb-friendly zones. Add split-color hero titles (.un {color: green}, .ravel {color: blue}) in index.astro, services pages. Ensure logical tab order, active states with underlines in brand colors.

## Create/Update Blog and Services Content

Generate social previews for blog posts using tools/social-preview-generator. Add previews to blog/*.md frontmatter. Ensure consistent typography (Circular font, 1.125rem base, sentence case). Update talks.astro and services pages with feature cards including icons in gradient backgrounds.

## Final Audit and Testing

Run cross-browser tests (Chrome, Safari, Firefox). Verify mobile responsiveness, dark mode, animations on reduced motion. Audit SEO with lighthouse. Test accessibility with tools like WAVE. Update PostHog integration if needed for analytics. Close any remaining gaps in Unravel design patterns.
