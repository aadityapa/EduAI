---
name: EduAI Platform
colors:
  primary: '#6D28D9'
  on-primary: '#FFFFFF'
  primary-container: '#EDE9FE'
  on-primary-container: '#2E1065'
  secondary: '#8B5CF6'
  on-secondary: '#FFFFFF'
  tertiary: '#A855F7'
  surface: '#F8FAFC'
  surface-container: '#FFFFFF'
  surface-container-high: '#F1F5F9'
  on-surface: '#0F172A'
  on-surface-variant: '#475569'
  outline: '#E2E8F0'
  success: '#22C55E'
  warning: '#F59E0B'
  error: '#EF4444'
  background: '#F8FAFC'
  on-background: '#0F172A'
  dark-background: '#0B1020'
  ai-violet: '#A855F7'
  xp-gold: '#FACC15'
  streak-flame: '#F97316'
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

# EduAI Platform — Next-Generation Stitch Design System

> AI-powered learning experience platform for CBSE/ICSE schools (Classes 1–10)

## Product Direction

EduAI must feel like Netflix + Duolingo + ChatGPT + Coursera + Apple.

Do not generate generic dashboards, ERP screens, CRUD pages, or administrative software unless the screen is explicitly an admin enterprise command surface.

Every generated screen must include:

- One primary action
- One secondary action
- A visible progress indicator
- Personalization
- Gamification where appropriate
- Contextual AI assistance
- Mobile-first behavior
- Accessible focus and contrast

Prefer these product nouns:

- Home
- Continue Learning
- Journey
- Mission
- Challenge
- Growth
- Insights
- AI Tutor
- AI Copilot
- Command Center

Avoid these product nouns for learner and parent experiences:

- Dashboard
- ERP
- CRUD
- Widget
- Records
- Management

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
