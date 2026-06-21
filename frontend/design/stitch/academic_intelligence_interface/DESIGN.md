---
name: Academic Intelligence Interface
colors:
  surface: '#fdf8fb'
  surface-dim: '#ddd9db'
  surface-bright: '#FEFBFF'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f2f5'
  surface-container: '#F8F1F6'
  surface-container-high: '#ebe7e9'
  surface-container-highest: '#e6e1e4'
  on-surface: '#1c1b1d'
  on-surface-variant: '#414754'
  inverse-surface: '#313032'
  inverse-on-surface: '#f4eff2'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#613ed3'
  on-secondary: '#ffffff'
  secondary-container: '#7a5aed'
  on-secondary-container: '#fffbff'
  tertiary: '#6349bf'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c63d9'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#e7deff'
  secondary-fixed-dim: '#cbbeff'
  on-secondary-fixed: '#1e0061'
  on-secondary-fixed-variant: '#4b21bd'
  tertiary-fixed: '#e7deff'
  tertiary-fixed-dim: '#ccbeff'
  on-tertiary-fixed: '#1e0060'
  on-tertiary-fixed-variant: '#4b2ea6'
  background: '#fdf8fb'
  on-background: '#1c1b1d'
  surface-variant: '#e6e1e4'
  sidebar-dark: '#1C1B1D'
  sidebar-text: '#FEFBFF'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.15px
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
  body-sm:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
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
  data-mono:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  unit-x-small: 4px
  unit-small: 8px
  unit-medium: 16px
  unit-large: 24px
  unit-x-large: 32px
  container-max-width: 1600px
  sidebar-width: 280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for high-stakes enterprise administration within the educational sector. It balances the rigorous, data-heavy requirements of a CRM with the approachable clarity of modern educational tools.

The aesthetic follows a **Corporate / Modern** style, heavily influenced by Material 3 (M3) principles. It prioritizes functional efficiency, utilizing a strict grid and tonal elevation to organize complex information hierarchies. The interface evokes a sense of "organized intelligence"—it is professional, stable, and optimized for long-session productivity. Key visual markers include subtle tonal layering, intentional use of white space to prevent cognitive overload, and a clear distinction between navigational and actionable surfaces.

## Colors

The palette is anchored by **Primary Blue (#1A73E8)**, used for primary actions, progress indicators, and key brand touchpoints. This blue is associated with trust and technical precision. 

To support high information density, the system utilizes a "Surface-Container" logic. Backgrounds are kept at a clean, high-brightness white (`#FEFBFF`), while nested cards and data sections use a subtle off-white (`#F8F1F6`) to create boundary definition without heavy lines. 

The sidebar uses the **Neutral Dark (#1C1B1D)** to create a strong vertical anchor, signaling a clear separation between global navigation and workspace content. Secondary and Tertiary purples are reserved for specialized data visualization or status badges, ensuring they do not compete with primary functional paths.

## Typography

This design system utilizes **Hanken Grotesk** (as a proxy for Google Sans Flex) for structural headlines to provide a modern, clean, and authoritative feel. **Roboto Flex** is the workhorse for body text and data entry, chosen for its extreme legibility at small sizes and high-density environments.

For tabular data and ID strings, the system introduces a specialized `data-mono` level using **JetBrains Mono** to ensure alignment and character distinction.

- **Headlines:** Reserved for page titles and section headers.
- **Titles:** Used for card headers and modal titles.
- **Body:** Standard for all user-generated content and descriptive text.
- **Labels:** Used for form fields, button text, and small metadata.

## Layout & Spacing

The design system employs a **12-column fluid grid** for the main content area, with a fixed-width sidebar for navigation. It adheres to an **8px base unit** to ensure mathematical consistency across all components.

**Layout Philosophy:**
- **Density:** High. Margins and gutters are kept tight (16px to 24px) to maximize the "above the fold" data visibility.
- **Sidebars:** The left-hand navigation is fixed at 280px. In condensed views, it may collapse to 80px icons.
- **Breakpoints:**
  - **Desktop (1200px+):** 12 columns, 24px margins.
  - **Tablet (600px - 1199px):** 8 columns, 16px margins.
  - **Mobile (Under 600px):** 4 columns, 16px margins.
- **Reflow:** Cards should stack vertically on mobile. Large data tables should utilize horizontal scrolling within their containers rather than breaking the page layout.

## Elevation & Depth

In alignment with Material 3, the design system uses **Tonal Layers** as the primary method of showing depth, rather than heavy shadows.

- **Level 0 (Surface):** The main background of the app. Flat.
- **Level 1 (Cards/Containers):** Subtle elevation. Uses a 1px border (#E0E0E0) or a slight tint change.
- **Level 2 (Dropdowns/Menus):** Uses an ambient shadow with 8% opacity and a 4px blur to indicate it is floating above the workspace.
- **Level 3 (Modals):** High contrast elevation with a 16% opacity shadow and a 20% dark backdrop overlay to focus user attention.

Interactive elements (like buttons) transition between levels on hover/press to provide tactile feedback.

## Shapes

The shape language is **Rounded (8px default)**. This provides a professional yet contemporary feel that softens the "industrial" nature of a CRM.

- **Small Components (Buttons, Chips, Inputs):** 8px radius.
- **Medium Components (Cards, Modals):** 16px radius.
- **Large Components (Sidebars, Main Content Areas):** 0px (edge-to-edge) or 24px if floating.

Pill-shapes (full rounding) are strictly reserved for Status Badges (e.g., "Active", "Pending") and Search Bars to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Solid Primary Blue background with white text. 8px roundedness.
- **Secondary:** Outlined with Primary Blue.
- **Tertiary:** Text-only for low-emphasis actions like "Cancel".

### Input Fields
- **Style:** Outlined Material 3 style.
- **State:** 1px border (#E0E0E0) that thickens to 2px Primary Blue on focus. Labels should use the `label-sm` typography level when floating.

### Cards
- **Structure:** 1px subtle border, no shadow by default. 
- **Header:** Contains `title-md` text and optional action icons.
- **Density:** Content inside cards should use `unit-medium` (16px) padding to maintain high information density.

### Data Tables
- **Header:** Sticky, using `label-lg` with a subtle gray background (#F1F3F4).
- **Rows:** 48px height for standard density; 40px for "compact mode".
- **Selection:** Use checkboxes in the first column; highlight selected rows with a 5% Primary Blue tint.

### Chips/Tags
- **Filter Chips:** 8px roundedness, light gray fill, trailing "X" icon.
- **Status Chips:** Pill-shaped with low-saturation background tints corresponding to the status (e.g., green for "Paid", red for "Overdue").

### Sidebar
- **Nav Items:** 48px height, 8px horizontal margin from the sidebar edge. Active states use a "pill" highlight behind the icon/text in a lighter blue or white.