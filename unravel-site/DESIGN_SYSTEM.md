# Unravel Homepage Design System (Enhanced)

## Overview
A refined Bento-style aesthetic built on the Unravel Brand Guidelines 2025. Combines the clean, modular structure of Bento grids with the warm, professional color palette of the brand guide.

## 🎨 Color System

### Primary Brand Colors
- **Unravel Green**: `#6FBF3F` (Primary Action, "un", Emphasis)
- **Unravel Blue**: `#0E9FBC` (Secondary Action, "ravel", Tech)

### Color Scales (from Brand Guide)
- **Green Scale**: `#F0F8EB`, `#D4E9C3`, `#8FD464`, `#6FBF3F`, `#5A9934`, `#487F29`
- **Blue Scale**: `#E6F7FA`, `#B8E9F3`, `#5CCDE5`, `#0E9FBC`, `#0C85A0`, `#096B84`

### Background Architecture
- **Main Background (Cream)**: `#F5F2ED` (Hero, Primary Sections)
- **Warm White**: `#FAF8F5` (Secondary Sections)
- **Pure White**: `#FFFFFF` (Cards, Surfaces)
- **Overlay**: `linear-gradient(135deg, rgba(111, 191, 63, 0.1), rgba(14, 159, 188, 0.1))` (Brand Overlay)

### Text Colors
- **Primary**: `#212529` (Headings)
- **Secondary**: `#495057` (Body)
- **Tertiary**: `#6C757D` (Meta/Labels)

## 📐 Layout & Grid

### Page Structure
- **Sections**: Alternating between Cream (`#F5F2ED`) and Warm White (`#FAF8F5`)
- **Containers**: Max-width `1200px` (or `1400px` for wide grids), centered
- **Spacing**: Generous padding (`64px` / `80px` sections)

### Bento Grid
- **Desktop**: 12-column grid system (flexible 2, 3, 4 col layouts)
- **Gap**: `24px` (Desktop), `16px` (Mobile)
- **Cards**: Pure White (`#FFFFFF`) on Cream/Warm backgrounds for depth

## 🔤 Typography

### Font Family
**Inter** (`sans-serif`) for headers and body.
- **Headings**: Bold (`700`) or Semibold (`600`)
- **Body**: Regular (`400`)
- **Labels**: Medium (`500`)

### Stylistic Elements
- **Green Underline**: `border-bottom: 3px solid #6FBF3F` for emphasis
- **Tagline**: All Caps, "YOUR <span class="underline-green">ELITE</span> ENGINEERING SQUAD"

## 🎴 Component Design

### Bento Cards
- **Background**: `#FFFFFF`
- **Border**: `1px solid rgba(0,0,0,0.05)` (Subtle) or `2px solid #E2E8F0` depending on emphasis
- **Shadow**: `0 4px 12px rgba(0,0,0,0.05)` (Soft)
- **Hover**: Lift (`-2px`), Shadow Increase (`0 12px 24px rgba(0,0,0,0.1)`)
- **Radius**: `16px` or `20px`

### Buttons
- **Primary**: Green (`#6FBF3F`), White Text, Shadow
- **Secondary**: Blue (`#0E9FBC`), White Text
- **Ghost/Outline**: Transparent/White with Brand Color text

### Icons
- Circular badges with brand colors
- Can use Purple (`#9B6BC4`) and Pink (`#E084B5`) accents for variety

## 🚫 Constraints (What NOT to do)
1.  **NO Gradients** for main backgrounds (use solid Cream/Warm White).
2.  **NO** blending Green and Blue directly.
3.  **NO** Pure White (`#FFFFFF`) page backgrounds (must be Cream or Warm White).
4.  **NO** sharp corners (use rounded `12px`+).

## 🎯 Reusable Patterns

### Hero Section
- Background: Cream (`#F5F2ED`)
- Headline: Large, Inter Bold
- Tagline: "YOUR <span class="underline-green">ELITE</span> ENGINEERING SQUAD"
- 2 Buttons (Green Primary, Blue Secondary)

### Service Card
- Background: White
- Icon: Circle Badge
- Hover: Blue Border Accent
