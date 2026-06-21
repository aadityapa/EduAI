---
name: EduAI Platform
colors:
  primary: '#1A73E8'
  on-primary: '#FFFFFF'
  primary-container: '#D3E3FD'
  on-primary-container: '#041E49'
  secondary: '#34A853'
  on-secondary: '#FFFFFF'
  tertiary: '#9334E6'
  surface: '#F8FAFD'
  surface-container: '#FFFFFF'
  surface-container-high: '#EEF2F7'
  on-surface: '#1F1F1F'
  on-surface-variant: '#5F6368'
  outline: '#DADCE0'
  error: '#D93025'
  background: '#F8FAFD'
  on-background: '#1F1F1F'
typography:
  display-lg:
    fontFamily: Google Sans Flex
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Google Sans Flex
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: Google Sans Flex
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.04em
rounded:
  sm: 8px
  DEFAULT: 12px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
---

# EduAI Platform — Stitch Design System

> AI-powered education SaaS for CBSE/ICSE schools (Classes 1–10)

## Brand

- **Name:** EduAI
- **Voice:** Clear, encouraging, professional, accessible
- **Audience:** Students, teachers, parents, school admins

## Color palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#1A73E8` | CTAs, links, active nav |
| Secondary | `#34A853` | Success, progress, growth |
| Tertiary | `#9334E6` | AI features, highlights |
| Surface | `#F8FAFD` | Page background |
| Surface container | `#FFFFFF` | Cards, panels |
| On surface | `#1F1F1F` | Primary text |
| Outline | `#DADCE0` | Borders, dividers |

## Typography

- **Display / Headlines:** Google Sans Flex — friendly, modern
- **Body / Labels:** Roboto — readable at all sizes

## Layout

- Max content width: 1280px
- Sidebar width: 260px (admin), 240px (web)
- Card padding: 24px
- Section gap: 32px

## Components

- **Buttons:** Pill shape for primary CTAs; 12px radius for secondary
- **Cards:** White surface, subtle shadow `0 1px 3px rgba(0,0,0,0.08)`, 16px radius
- **Inputs:** 12px radius, outline border, focus ring primary
- **KPI cards:** Icon + metric + trend chip
- **Sidebar:** Light surface, active item with primary tint background

## Screens to generate

1. Web login — student/teacher/parent portal tabs
2. Student dashboard — courses, XP, AI tutor CTA
3. Admin CRM dashboard — KPIs, charts, sidebar nav
4. Admin login — split hero + form
