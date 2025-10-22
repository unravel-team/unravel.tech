# Unravel UI Development Rules - 2025 Design Excellence Guide

## 🎯 Core Philosophy
**"Unraveling Complexity into Delightful Simplicity"** - Create interfaces that transform complex interactions into clean, approachable experiences. Every UI should feel intuitive, modern, and friendly while maintaining exceptional performance and accessibility. Follow the Unravel principle: make the complex simple, the technical human, and the functional beautiful.

## 🚀 Mobile-First Imperative

### Foundation Rules
1. **Always start with mobile viewport (320px-375px)** and scale up progressively
2. **Touch-first interactions**: All interactive elements must be minimum 44x44px (Apple) or 48x48dp (Material)
3. **Thumb-friendly zones**: Place critical actions within the natural thumb reach area (bottom 60% of screen)
4. **Mobile performance target**: LCP < 2.5s, INP < 200ms, CLS < 0.1

### Responsive Implementation
```css
/* Always use this viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Use fluid units over fixed pixels */
- Prefer: %, rem, em, vw/vh, clamp()
- Avoid: fixed px values except for borders/shadows

/* Content-driven breakpoints */
- Let content determine breakpoints, not devices
- Start narrow, expand until layout breaks, add breakpoint
- Use em units for media queries (more accessible)
```

## 🎨 Visual Design System

### Unravel Color System
1. **Primary Brand Palette**
   ```css
   /* Unravel signature colors */
   --unravel-green: #6BC443;      /* Primary green from "un" */
   --unravel-blue: #00A3CC;       /* Primary blue from "ravel" */
   --unravel-teal: #00B4CC;       /* Secondary teal variant */
   
   /* Extended palette */
   --green-light: #8FD668;
   --green-dark: #4FA52C;
   --blue-light: #33B8DB;
   --blue-dark: #0085A8;
   
   /* Neutral foundation */
   --white: #FFFFFF;
   --gray-50: #F8FAFB;
   --gray-100: #F1F5F7;
   --gray-200: #E5EBEF;
   --gray-800: #2C3E50;
   --gray-900: #1A252F;
   ```

2. **Color Application Philosophy**
   - **Green**: Innovation, growth, positive actions (CTAs, success states)
   - **Blue**: Trust, stability, information (navigation, links, data)
   - **Split-color concept**: Use color transitions to show transformation/progress
   - **Gradients**: Subtle green-to-blue transitions for dynamic elements
   ```css
   /* Signature Unravel gradient */
   background: linear-gradient(135deg, var(--unravel-green) 0%, var(--unravel-blue) 100%);
   ```

3. **Accessibility Standards**
   - Always test green/blue combinations against white and dark backgrounds
   - Maintain WCAG AA minimum (4.5:1 for normal text)
   - Use darker variants for text on light backgrounds
   - Never use pure brand colors for body text

### Typography - Clean & Approachable
1. **Font Stack (Unravel Style)**
   ```css
   /* Primary font family - rounded, friendly sans-serif */
   --font-primary: 'Circular', 'Nunito Sans', 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
   --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
   
   /* Font weights */
   --font-light: 300;
   --font-regular: 400;
   --font-medium: 500;
   --font-semibold: 600;
   --font-bold: 700;
   ```

2. **Typography Characteristics**
   - **Rounded letterforms**: Friendly and approachable
   - **Clean lines**: No unnecessary decorations
   - **Generous spacing**: Letter-spacing: 0.01em for body text
   - **Lowercase preference**: Use sentence case over ALL CAPS
   - **Readable sizes**: Never go below 14px for body text

3. **Type Scale (Mobile-First)**
   ```css
   /* Clean, proportional scale */
   --text-xs: 0.875rem;    /* 14px */
   --text-sm: 1rem;        /* 16px */
   --text-base: 1.125rem;  /* 18px */
   --text-lg: 1.25rem;     /* 20px */
   --text-xl: 1.5rem;      /* 24px */
   --text-2xl: 2rem;       /* 32px */
   --text-3xl: 2.5rem;     /* 40px */
   --text-hero: 3.5rem;    /* 56px */
   
   /* Line heights for readability */
   --leading-tight: 1.25;
   --leading-normal: 1.5;
   --leading-relaxed: 1.75;
   ```

### Copywriting & Content Philosophy
**"Words that Unravel Complexity"** - Copy should mirror the UI: simple, human, transformative. Use concise, approachable language that explains technical concepts (e.g., AI implementation) like a trusted guide.

1. **Core Principles**
   - **Sentence case & friendly tone**: Avoid jargon; explain terms (e.g., "NLP" as "natural language processing that helps machines understand human speech").
   - **Benefit-focused**: Highlight user outcomes (e.g., "Save 30% on AI costs" over "Optimize infrastructure").
   - **Length guidelines**: Hero: 1-2 sentences; Sections: 50-100 words; Blog: 800-1500 words with subheadings.
   - **Inclusivity**: Gender-neutral, global audience-friendly.

2. **Backlog Integration**
   - When generating BD backlogs for site improvements, always include [copy] labeled items for each major section (hero, services, blog, testimonials, etc.) to ensure content aligns with UI updates.
   - Use split-color emphasis in headlines (e.g., "Unraveling AI for Business" with "Unraveling" in green, "AI for Business" in blue).
   - SEO keywords: Incorporate naturally (e.g., "AI consulting services", "NLP applications").

3. **Content Structure Examples**
   - **Services Pages**: Start with problem-solution-benefit; include case study teasers.
   - **Blog Posts**: Intro hook, step-by-step guide, conclusion with CTA; add social previews.
   - **Global Updates**: Consistent mission voice across all pages.

## ✨ Subtle Animations & Micro-interactions

### Unravel Motion Principles
**"Movement with Purpose"** - Every animation should help users understand the interface, not distract from it.

1. **Signature Animations**
   ```css
   /* The Unravel Reveal - content unraveling into view */
   @keyframes unravel-in {
     from {
       opacity: 0;
       transform: translateY(10px);
     }
     to {
       opacity: 1;
       transform: translateY(0);
     }
   }
   
   /* Smooth color transitions between green and blue */
   @keyframes color-shift {
     0% { color: var(--unravel-green); }
     100% { color: var(--unravel-blue); }
   }
   
   /* Standard timing function */
   --ease-unravel: cubic-bezier(0.4, 0, 0.2, 1);
   ```

2. **Interaction States**
   - **Hover**: Subtle color shifts, 0.2s transitions
   - **Active**: Scale(0.98), no dramatic movements
   - **Focus**: 2px solid outline in brand colors
   - **Loading**: Linear progress bars over spinners
   - **Success**: Gentle check animation with color transition

3. **Animation Guidelines**
   ```css
   /* Keep it subtle and smooth */
   - Duration: 0.2s - 0.4s for micro-interactions
   - Easing: ease-out or custom bezier curves
   - Transform over position changes
   - Opacity changes: 0.3s for smooth fades
   - Never animate more than 3 properties simultaneously
   ```

4. **Scroll Behavior**
   - Smooth scroll with reduced motion support
   - Subtle parallax (max 1.1x speed difference)
   - Fade-in on scroll with intersection observer
   - No jarring or bouncy effects

## 📐 Clean Layout Architecture

### Unravel Grid Philosophy
**"Structured Simplicity"** - Layouts should be clean and organized while allowing content to breathe.

1. **Minimalist Grid System**
   ```css
   /* Clean, flexible grids */
   .unravel-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
     gap: 2rem;
     padding: 2rem;
   }
   
   /* Container widths */
   --container-xs: 640px;
   --container-sm: 768px;
   --container-md: 1024px;
   --container-lg: 1280px;
   --container-xl: 1440px;
   ```

2. **Card-Based Layouts**
   - Rounded corners (8-12px radius)
   - Clean white/light backgrounds
   - Subtle shadows: `0 2px 8px rgba(0,0,0,0.08)`
   - Consistent padding: 1.5-2rem
   - Clear content hierarchy

3. **Whitespace Philosophy**
   - **Generous margins**: Let content breathe
   - **Section spacing**: min 4rem between sections
   - **Paragraph spacing**: 1.5rem between text blocks
   - **Component padding**: Consistent 1.5rem internal spacing
   - **Empty space is not wasted space** - it's clarity

## 🌟 Depth & Visual Interest

### Subtle Depth Techniques
1. **Layered Elements**
   ```css
   /* Clean elevation system */
   --shadow-xs: 0 1px 3px rgba(0,0,0,0.05);
   --shadow-sm: 0 2px 6px rgba(0,0,0,0.08);
   --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
   --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
   
   /* Subtle glassmorphism for special elements */
   .glass-card {
     background: rgba(255, 255, 255, 0.9);
     backdrop-filter: blur(8px);
     border: 1px solid rgba(255, 255, 255, 0.3);
   }
   ```

2. **Color Overlays**
   - Gradient overlays on images (20-40% opacity)
   - Duotone effects using brand colors
   - Subtle color washes for section backgrounds

3. **Interactive Depth**
   - Hover lifts: translateY(-2px) with shadow increase
   - Active states: translateY(1px) with shadow decrease
   - Focus rings in brand colors
   - No excessive 3D transforms or rotations

## ⚡ Performance & SEO Optimization

### Core Web Vitals Targets
1. **Largest Contentful Paint (LCP)**: < 2.5s
   - Optimize images (WebP/AVIF format)
   - Preload critical resources
   - Use CDN for assets
   - Implement lazy loading

2. **Interaction to Next Paint (INP)**: < 200ms
   - Minimize JavaScript execution
   - Use CSS animations over JS
   - Debounce/throttle event handlers
   - Code splitting for large bundles

3. **Cumulative Layout Shift (CLS)**: < 0.1
   - Set explicit dimensions for media
   - Reserve space for dynamic content
   - Avoid inserting content above existing content
   - Use CSS transforms for animations

### SEO Technical Requirements
```html
<!-- Essential meta tags -->
<meta charset="UTF-8">
<meta name="description" content="[150-160 characters]">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">

<!-- Structured data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  ...
}
</script>
```

## ♿ Accessibility Standards

### WCAG 2.2 AAA Compliance
1. **Color & Contrast**
   - Normal text: 7:1 contrast ratio
   - Large text: 4.5:1 contrast ratio
   - Interactive elements: 3:1 minimum
   - Don't rely solely on color for information

2. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Visible focus indicators (2px minimum)
   - Skip links for navigation
   - Logical tab order

3. **Screen Reader Support**
   ```html
   <!-- Semantic HTML structure -->
   <header> <nav> <main> <section> <article> <aside> <footer>
   
   <!-- ARIA labels where needed -->
   aria-label, aria-describedby, role attributes
   
   <!-- Alt text for all images -->
   <img src="..." alt="Descriptive text">
   ```

## 🌈 Light & Dark Modes

### Unravel Theming System
```css
/* Light mode (default) */
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFB;
  --bg-tertiary: #F1F5F7;
  --text-primary: #1A252F;
  --text-secondary: #4A5568;
  --text-tertiary: #718096;
  --border: #E5EBEF;
  --accent-green: #6BC443;
  --accent-blue: #00A3CC;
}

/* Dark mode */
[data-theme="dark"] {
  --bg-primary: #1A252F;
  --bg-secondary: #2C3E50;
  --bg-tertiary: #34495E;
  --text-primary: #F8FAFB;
  --text-secondary: #CBD5E0;
  --text-tertiary: #A0AEC0;
  --border: #4A5568;
  --accent-green: #8FD668;  /* Lighter for dark backgrounds */
  --accent-blue: #33B8DB;   /* Lighter for dark backgrounds */
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Respect system preferences */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Apply dark mode styles */
  }
}
```

## 🎯 Unravel Component Library

### Navigation
- **Desktop**: Clean horizontal bar with subtle hover effects
- **Mobile**: Bottom tab navigation or hamburger menu
- **Logo placement**: Left-aligned with green-blue split preserved
- **Active states**: Underline in brand color or background highlight
- **Typography**: Medium weight, sentence case

### Hero Sections
```css
.hero-unravel {
  min-height: 60vh;  /* Not overly tall */
  background: linear-gradient(135deg, rgba(107,196,67,0.05) 0%, rgba(0,163,204,0.05) 100%);
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
}

/* Split-color headline effect */
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 600;
}
.hero-title .un { color: var(--unravel-green); }
.hero-title .ravel { color: var(--unravel-blue); }
```

### Buttons & CTAs
```css
/* Primary button - Green */
.btn-primary {
  background: var(--unravel-green);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background: var(--green-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107,196,67,0.3);
}

/* Secondary button - Blue */
.btn-secondary {
  background: transparent;
  color: var(--unravel-blue);
  border: 2px solid var(--unravel-blue);
  padding: 0.75rem 2rem;
  border-radius: 8px;
}

.btn-secondary:hover {
  background: var(--unravel-blue);
  color: white;
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
}
```

### Cards & Content Blocks
```css
.card-unravel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.card-unravel:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  border-color: var(--unravel-blue);
  transform: translateY(-2px);
}

/* Feature cards with icon */
.feature-card {
  text-align: center;
  padding: 2.5rem;
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--unravel-green), var(--unravel-blue));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Forms & Inputs
```css
.input-unravel {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.input-unravel:focus {
  outline: none;
  border-color: var(--unravel-blue);
  box-shadow: 0 0 0 3px rgba(0,163,204,0.1);
}

/* Floating labels */
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-label {
  position: absolute;
  top: 0.75rem;
  left: 1rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  pointer-events: none;
}

.input-unravel:focus + .form-label,
.input-unravel:not(:placeholder-shown) + .form-label {
  top: -0.75rem;
  left: 0.5rem;
  font-size: 0.875rem;
  color: var(--unravel-blue);
  background: white;
  padding: 0 0.5rem;
}
```

### Progress Indicators
```css
/* Linear progress bar */
.progress-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--unravel-green), var(--unravel-blue));
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Step indicator */
.steps {
  display: flex;
  justify-content: space-between;
}

.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  position: relative;
}

.step.active {
  background: var(--unravel-green);
  color: white;
}

.step.completed {
  background: var(--unravel-blue);
  color: white;
}
```

## 🚨 Critical Implementation Checklist

### Before Launch
- [ ] Mobile-first responsive tested on real devices
- [ ] Core Web Vitals all in green zone
- [ ] WCAG AAA accessibility audit passed
- [ ] Dark mode fully implemented
- [ ] Animations respect prefers-reduced-motion
- [ ] Images optimized (WebP with fallbacks)
- [ ] SEO meta tags and structured data
- [ ] 404 page designed
- [ ] Loading states for all async operations
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)

### Performance Budget
- HTML: < 50KB
- CSS: < 100KB (minified)
- JavaScript: < 200KB (minified, before gzip)
- Images: < 200KB per image
- Total page weight: < 1.5MB
- Time to Interactive: < 3.5s on 3G

## 🎪 Unravel Design Patterns

### Embrace These Principles
1. **Color storytelling** - Use the green-to-blue transition to show progress/transformation
2. **Rounded geometry** - Soft corners and curves throughout (8-12px radius standard)
3. **Clean iconography** - Simple, outlined icons over complex illustrations
4. **Readable content** - Never sacrifice clarity for aesthetics
5. **Purposeful whitespace** - Empty space guides the eye
6. **Subtle animations** - Smooth, natural movements (0.2-0.4s)
7. **Consistent spacing** - Use an 8px grid system
8. **Mobile-first always** - Design for thumbs, not cursors
9. **Progressive disclosure** - Reveal complexity gradually
10. **Accessible by default** - WCAG AA minimum, AAA preferred

### Design Don'ts for Unravel
- ❌ Overly complex gradients or mesh backgrounds
- ❌ Heavy drop shadows or extreme elevations  
- ❌ All-caps typography (except small labels)
- ❌ Autoplay videos or aggressive animations
- ❌ Dense information without hierarchy
- ❌ Decorative elements without purpose
- ❌ Neon colors or harsh contrasts
- ❌ Cluttered layouts without breathing room
- ❌ Trendy effects that compromise usability

### Signature Unravel Elements
```css
/* The Split-Color Effect */
.unravel-split {
  background: linear-gradient(90deg, var(--unravel-green) 50%, var(--unravel-blue) 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* The Unravel Transition */
.unravel-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* The Clean Card */
.unravel-surface {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

/* The Soft Focus */
.unravel-focus:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--unravel-blue);
}
```

## 🎁 The Unravel Way

**Remember**: Great UI unravels complexity into clarity. Like our logo that transforms "un" and "ravel" into a unified whole, your interfaces should take complex problems and present simple, elegant solutions.

### Core Unravel Values

1. **Clarity over cleverness** - If users have to think, we've failed
2. **Simplicity over spectacle** - Clean design ages better than trendy
3. **Accessibility over exclusivity** - Design for everyone
4. **Performance over polish** - Fast beats pretty every time
5. **Consistency over creativity** - Patterns create comfort

### The Unravel Test
Before shipping any UI, ask yourself:
- ✓ Can my parent use this without help?
- ✓ Does it load in under 3 seconds on 3G?
- ✓ Is it accessible to users with disabilities?
- ✓ Does it work perfectly on mobile?
- ✓ Would I be proud to show this to the Unravel team?

### Design Philosophy
**"Unraveling complexity doesn't mean dumbing down—it means elevating understanding."**

Your interfaces should feel like a helpful friend who makes difficult things simple. Use the green of growth and innovation combined with the blue of trust and stability to create experiences that users don't just tolerate, but genuinely enjoy.

Every pixel should serve a purpose. Every animation should guide, not distract. Every color choice should communicate, not decorate. This is the Unravel way—transforming the tangled web of modern technology into clean, approachable experiences that delight users and drive results.

**Build interfaces that unravel problems, not create them.**
