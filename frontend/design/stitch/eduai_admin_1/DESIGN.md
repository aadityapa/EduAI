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
  title-md:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '500'
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
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  headline-md-mobile:
    fontFamily: Roboto Flex
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  sidebar_width: 280px
  grid_columns: '12'
  grid_gutter: 24px
  container_padding: 32px
---

## Brand & Style
The design system focuses on institutional reliability and operational efficiency. It follows a **Corporate / Modern** aesthetic, specifically evolving the Material 3 specification to support the high data density required for educational administration.

The brand personality is authoritative yet accessible, using a systematic approach to hierarchy that minimizes cognitive load during complex task management. The interface utilizes a dual-theme strategy: a high-contrast dark sidebar for navigational stability and a light, spacious main content area for focused data analysis and management.

## Colors
This design system utilizes a structured palette based on the primary #1A73E8 blue to signify trust and action. 

- **Primary**: Used for key actions, active states, and focus indicators.
- **Secondary/Tertiary**: Reserved for data visualization (KPI trends, progress bars) and status indicators.
- **Surface & Containers**: The main content area uses a light gray background (`#F8F9FA`) with white containers to create a clear "card-on-canvas" distinction.
- **Inverse Surface**: The sidebar uses a deep charcoal (`#1F1F1F`) to provide a permanent anchor for navigation, ensuring it remains distinct from dynamic content.

## Typography
The system uses **Roboto Flex** (as the closest accessible alternative to Google Sans Flex) to provide a highly legible, systematic typographic scale. 

- **Headlines**: Used for page titles and section headers to establish clear entry points.
- **Body**: Optimized for long-form data reading; `body-md` is the workhorse for table data.
- **Labels**: Used for button text, table headers, and small annotations.
- **Numerical Data**: All KPI values and data table metrics should use tabular lining figures to ensure vertical alignment in columns.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid** model. The sidebar is fixed at 280px, while the main content area utilizes a 12-column fluid grid.

- **Data Density**: To achieve a data-dense look, vertical spacing within tables and lists is tightened to 8px or 12px, while external container margins remain at 24px-32px to provide "breathing room" between major modules.
- **Breakpoints**: 
  - *Desktop (1240px+)*: 12 columns, 32px margins.
  - *Tablet (905px - 1239px)*: 8 columns, 24px margins, sidebar collapses to icons.
  - *Mobile (0px - 600px)*: 4 columns, 16px margins, sidebar becomes a hidden drawer.

## Elevation & Depth
In alignment with Material 3, elevation is primarily communicated through **Tonal Layers** rather than heavy shadows.

- **Level 0 (Surface)**: Background (`#F8F9FA`).
- **Level 1 (Card/Container)**: White (`#FFFFFF`) with a 1px subtle border (`#E0E0E0`).
- **Level 2 (Hover/Active)**: Subtle 4px blur shadow with 5% opacity to indicate interactivity.
- **Sidebar**: Uses high-contrast dark tones to sit "underneath" the main content visually, acting as a permanent foundation.
- **Modals/Menus**: Use Level 3 elevation with a more pronounced shadow (12px blur) to pull them forward from the data-heavy background.

## Shapes
A **Soft** shape language is used to maintain a professional, systematic appearance. 

- **Standard Elements**: Buttons, input fields, and small chips use a 4px (0.25rem) radius.
- **Containers**: KPI cards and data table containers use an 8px (0.5rem) radius to define major content blocks.
- **Full Round**: Used only for status dots or specific circular profile avatars. 
Avoid using pill shapes for buttons to maintain the enterprise/utility feel.

## Components
- **KPI Cards**: Feature a `title-md` label, a `headline-lg` value, and a small `label-md` trend indicator (green for up, red for down). 
- **Data Tables**: Headers are `label-md` uppercase with `neutral` coloring. Row cells are `body-md`. The final column is reserved for ghost-style icon buttons for "row actions."
- **Kanban Preview**: Small, vertical stacks using Level 1 cards. Each card contains a progress bar (tertiary color) and a condensed `label-md` for the student/task name.
- **Buttons**: Primary buttons use the `#1A73E8` fill with white text. Secondary buttons use a 1px outline of the primary color.
- **Input Fields**: Outlined style with a 1px border. On focus, the border thickens to 2px in the primary blue with a floating label.
- **Sidebar Nav**: Items use an "active state" indicator—a vertical 4px bar on the left edge and a subtle white-opacity hover overlay.