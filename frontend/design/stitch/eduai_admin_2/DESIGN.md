---
name: EduAI Admin
colors:
  surface: '#f7f9ff'
  surface-dim: '#d7dae0'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4fa'
  surface-container: '#ebeef4'
  surface-container-high: '#e5e8ee'
  surface-container-highest: '#dfe3e8'
  on-surface: '#181c20'
  on-surface-variant: '#414754'
  inverse-surface: '#2d3135'
  inverse-on-surface: '#eef1f7'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#005ac1'
  on-secondary: '#ffffff'
  secondary-container: '#4d8efe'
  on-secondary-container: '#00285c'
  tertiary: '#006d2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#008939'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004494'
  tertiary-fixed: '#89fa9b'
  tertiary-fixed-dim: '#6ddd81'
  on-tertiary-fixed: '#002108'
  on-tertiary-fixed-variant: '#005320'
  background: '#f7f9ff'
  on-background: '#181c20'
  surface-variant: '#dfe3e8'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  sidebar-width: 280px
---

## Brand & Style
The design system for this product is rooted in the **Corporate/Modern** movement, specifically optimized for high-density information environments. It targets institutional administrators and educators who require a high-trust, low-friction interface to manage complex data.

The visual language balances the reliability of Material 3 with the refined clarity of modern enterprise software. It evokes a sense of **intelligence, authority, and systematic order**. The UI is characterized by a "Dual-Mode" architecture: a dark, focused sidebar for high-level navigation paired with a bright, spacious light-mode canvas for intensive data analysis and content management.

## Colors
The palette is dominated by **#1A73E8 (Primary Blue)**, chosen for its association with professional stability and digital-first education. 

- **Primary:** Used for key actions, active states, and focus indicators.
- **Surface & Background:** The main workspace uses a neutral white (#FFFFFF) with cool grey (#F8F9FA) backgrounds to define sections.
- **Sidebar:** Utilizes a dark theme (#121212) to create a clear mental model shift between "Where I am" (Navigation) and "What I am doing" (Content).
- **Semantic Colors:** Success (Green), Warning (Amber), and Error (Red) are used strictly for status indicators and trend logic in KPI chips.

## Typography
The typography system uses a tiered approach to separate information types:
- **Headlines:** Plus Jakarta Sans provides a professional yet contemporary feel for page titles and section headers. 
- **Body:** Inter (substituted for Roboto for better legibility on high-res displays) is used for all descriptive text, inputs, and general interface labels.
- **Data:** JetBrains Mono is utilized sparingly for tabular data, IDs, and metrics to ensure perfect vertical alignment and character distinction.

**Note:** For mobile views, `display-lg` should scale down to `headline-lg` (32px) to maintain readability without excessive scrolling.

## Layout & Spacing
The design system employs a **12-column fluid grid** for the main content area. 
- **Desktop:** 32px margins with 24px gutters. The sidebar is fixed at 280px.
- **Tablet:** 24px margins. The sidebar collapses into a rail or becomes a temporary drawer.
- **Mobile:** 16px margins. Grid transitions to a single-column stack.

Spacing follows a strict 4px baseline grid. Elements should prioritize `md` (16px) for internal padding and `lg` (24px) for component-to-component margins to prevent data density from feeling cluttered.

## Elevation & Depth
In alignment with Material 3 principles, the design system uses **Tonal Layers** rather than heavy shadows to denote hierarchy.
- **Level 0 (Background):** #F8F9FA.
- **Level 1 (Cards/Base):** White (#FFFFFF) with a 1px border (#E0E0E0).
- **Level 2 (Hover/Active):** A subtle ambient shadow (0px 4px 12px rgba(0,0,0,0.05)).
- **Level 3 (Modals/Popovers):** Elevated with a more pronounced shadow (0px 8px 24px rgba(0,0,0,0.12)) and a scrim overlay (#202124 at 40% opacity).

Avoid pure black shadows; use tinted shadows that incorporate the primary brand color in low-opacity for a more integrated feel.

## Shapes
The shape language is defined by **Rounded-lg** geometry. 
- **Standard Cards:** 12px (0.75rem) corner radius.
- **Buttons & Inputs:** 8px (0.5rem) corner radius to differentiate them slightly from structural cards.
- **KPI Chips:** Fully rounded (pill-shaped) to distinguish them as interactive or status-based metadata.

## Components
- **Buttons:** Primary buttons use a solid #1A73E8 fill. Secondary buttons use a tonal grey or outline style. 
- **KPI Chips:** Must include a leading icon for "Trend" (Arrow Up/Down). Background colors for chips should be high-transparency semantic colors (e.g., 10% opacity Green fill with 100% opacity Green text).
- **Data Tables:** Use a "Zebra" striping approach only on hover. Header rows should be pinned with a subtle bottom border. Use `data-mono` for numerical columns.
- **Input Fields:** Outlined style with a 1px #DADCE0 border that thickens to 2px #1A73E8 on focus.
- **Sidebar Nav:** High-contrast dark theme. Active states should use a vertical "pill" indicator on the left or a background tint shift.
- **Search:** A persistent global search bar in the header with a `/` keyboard shortcut hint.