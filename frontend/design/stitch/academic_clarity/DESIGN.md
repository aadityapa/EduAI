---
name: Academic Clarity
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
    fontFamily: Roboto Flex
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Roboto Flex
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  headline-md:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  title-lg:
    fontFamily: Roboto Flex
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
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
---

## Brand & Style

This design system is built upon a **Corporate Modern** aesthetic, heavily influenced by Google’s Material 3 principles. The brand personality is professional, encouraging, and highly accessible, designed to foster a sense of focus and growth for K-12 students and educators. 

The visual language emphasizes clarity through generous whitespace, a structured grid, and a purposeful use of the primary blue to guide user intent. The emotional response should be one of confidence and reliability—removing cognitive load so that the focus remains entirely on learning outcomes.

## Colors

The palette is anchored by a flagship Primary Blue (`#1A73E8`), used for key actions, active states, and brand presence. 

- **Primary:** Used for high-emphasis buttons, active navigation states, and primary icons.
- **Secondary:** A lighter blue variation for subtle accents and tonal surfaces.
- **Tertiary:** A success green, used sparingly for progress indicators and achievement states to provide encouragement.
- **Surface & Background:** The design utilizes a "Surface-Container" model. The main background is a neutral off-white (`#F8F9FA`), with cards and containers using pure white (`#FFFFFF`) to create distinct separation.

## Typography

The system utilizes **Roboto Flex** (as a high-fidelity alternative to Google Sans/Roboto) to provide a unified, legible experience across all touchpoints. 

- **Headlines:** Use wider widths and slightly heavier weights to establish a clear information hierarchy.
- **Body Text:** Optimized for long-form reading in educational modules, utilizing a standard 16px base for accessibility.
- **Labels:** Used for navigation items, button text, and small metadata. These are set in a medium weight to maintain legibility at smaller scales.

## Layout & Spacing

The design system employs a **Fluid Grid** approach with specific constraints for readability.

- **Grid:** A 12-column grid for desktop and a 4-column grid for mobile.
- **Split-Screen Layout:** Specifically for the login and onboarding portal, the screen is split 50/50 on desktop. The left side features brand imagery or encouraging messaging, while the right side contains the functional form on a clean white surface.
- **Rhythm:** An 8px linear scale is used for all spatial relationships. Padding within cards and containers should default to 24px (`lg`) to ensure content "breathes," reflecting the accessible nature of the brand.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

Following Material 3 standards, elevation is primarily signaled by surface color shifts (tints of the primary blue) and subtle, soft-diffusion shadows. Shadows should never be harsh; they use a low-opacity neutral tint (`rgba(0, 0, 0, 0.08)`) with a high blur radius to suggest the element is floating slightly above the canvas without creating visual noise.

- **Level 0:** Flat background.
- **Level 1:** Standard cards, subtle shadow.
- **Level 2:** Hover states on interactive cards or dropdown menus.
- **Level 3:** Modals and high-priority dialogs.

## Shapes

The shape language is defined by a mix of geometric precision and approachable softness.

- **Cards:** Utilize a consistent 12px corner radius to feel modern and friendly.
- **Interactive Elements:** Buttons and input chips utilize a full "Pill" shape (24px+ radius) to distinguish them from structural containers.
- **Form Fields:** Use a 4px or 8px radius to maintain a professional, structured feel for data entry.

## Components

### Buttons
Buttons are strictly pill-shaped (24px radius). 
- **Primary:** Solid `#1A73E8` with white text.
- **Secondary:** Tonal surface (light blue tint) with primary blue text.
- **Outlined:** 1px stroke in neutral-variant with primary blue text.

### Cards
Cards use a 12px radius with a white background and Level 1 elevation. They include a subtle 1px border (`#E0E0E0`) in their resting state to maintain definition against the off-white background.

### Input Fields
Filled text fields with a 4px top-radius and a bottom-indicator line are preferred for high-density forms, while outlined fields with an 8px radius are used for standard SaaS workflows.

### Chips & Tags
Small pill-shaped elements used for categories (e.g., "Math," "Grade 4"). These should use the Tertiary Green or Secondary Blue for background tints to signify status or classification.

### Lists
Lists use generous vertical padding (16px) with thin horizontal dividers (`#F1F3F4`). Icons within lists should be encased in a 40px circular tonal container.