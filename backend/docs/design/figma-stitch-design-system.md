# EduAI Figma And Stitch Design System

## Design Intent

EduAI should feel premium, intelligent, playful, and trustworthy. The design language combines:

- Apple-level clarity and restraint.
- Duolingo-style motivation and rewards.
- Netflix-style content discovery.
- ChatGPT-style AI companionship.
- Coursera/Khan Academy learning trust.
- Stripe/Linear enterprise admin precision.
- Material Design 3 accessibility and state discipline.

## Brand Attributes

Premium, warm, intelligent, optimistic, cinematic, trustworthy, fast, and human.

EduAI is not an ERP. EduAI is a learning operating system.

## Color Tokens

### Core Palette

- Primary: `#6D28D9`
- Primary Hover: `#5B21B6`
- Primary Soft: `#EDE9FE`
- Accent: `#8B5CF6`
- Accent Soft: `#F3E8FF`
- Success: `#22C55E`
- Success Soft: `#DCFCE7`
- Warning: `#F59E0B`
- Warning Soft: `#FEF3C7`
- Error: `#EF4444`
- Error Soft: `#FEE2E2`
- Dark Background: `#0B1020`
- Light Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Surface Elevated: `#FBFCFF`
- Border: `#E2E8F0`
- Text Primary: `#0F172A`
- Text Secondary: `#475569`
- Text Muted: `#94A3B8`

### Premium Neutral Palette

- Neutral 950: `#020617`
- Neutral 900: `#0F172A`
- Neutral 800: `#1E293B`
- Neutral 700: `#334155`
- Neutral 600: `#475569`
- Neutral 500: `#64748B`
- Neutral 400: `#94A3B8`
- Neutral 300: `#CBD5E1`
- Neutral 200: `#E2E8F0`
- Neutral 100: `#F1F5F9`
- Neutral 50: `#F8FAFC`

### Experience Colors

- XP Gold: `#FACC15`
- Streak Flame: `#F97316`
- Rank Blue: `#38BDF8`
- AI Violet: `#A855F7`
- Mastery Green: `#10B981`
- Challenge Pink: `#EC4899`
- Parent Trust Teal: `#14B8A6`
- Teacher Productivity Indigo: `#6366F1`
- Admin Intelligence Slate: `#111827`

## Gradients

- Hero Learning: `linear-gradient(135deg, #6D28D9 0%, #8B5CF6 48%, #38BDF8 100%)`
- AI Tutor: `radial-gradient(circle at 20% 20%, #A855F7 0%, transparent 35%), linear-gradient(135deg, #0B1020 0%, #312E81 100%)`
- Student Joy: `linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)`
- Parent Trust: `linear-gradient(135deg, #14B8A6 0%, #22C55E 100%)`
- Teacher Copilot: `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)`
- Admin Command: `linear-gradient(135deg, #0B1020 0%, #1E293B 60%, #312E81 100%)`

## Typography

### Font Stack

- Display: Google Sans Flex, SF Pro Display, Inter, system-ui.
- Body: Inter, Roboto, SF Pro Text, system-ui.
- Numeric: Inter, Roboto Mono for metrics and tabular numbers.

### Type Scale

- Display XL: 64px / 72px / 700
- Display LG: 48px / 56px / 700
- Display MD: 40px / 48px / 700
- Headline LG: 32px / 40px / 700
- Headline MD: 28px / 36px / 650
- Headline SM: 24px / 32px / 650
- Title LG: 20px / 28px / 650
- Title MD: 18px / 26px / 600
- Body LG: 16px / 24px / 400
- Body MD: 14px / 22px / 400
- Body SM: 13px / 20px / 400
- Label MD: 12px / 16px / 600
- Label SM: 11px / 14px / 650

## Spacing

Use an 8px base grid:

- 2: 2px
- 4: 4px
- 8: 8px
- 12: 12px
- 16: 16px
- 20: 20px
- 24: 24px
- 32: 32px
- 40: 40px
- 48: 48px
- 64: 64px
- 80: 80px
- 96: 96px

## Radius

- XS: 6px
- SM: 10px
- MD: 14px
- LG: 20px
- XL: 28px
- 2XL: 36px
- Full: 9999px

Student and reward surfaces may use larger radii. Admin tables and dense data surfaces should use restrained radii.

## Elevation

- Level 0: none.
- Level 1: `0 1px 2px rgba(15, 23, 42, 0.06)`.
- Level 2: `0 8px 24px rgba(15, 23, 42, 0.08)`.
- Level 3: `0 16px 48px rgba(15, 23, 42, 0.12)`.
- Glow AI: `0 0 40px rgba(139, 92, 246, 0.32)`.
- Glow Reward: `0 0 36px rgba(250, 204, 21, 0.35)`.

## Motion Tokens

- Page Enter: 300ms, cubic-bezier(0.22, 1, 0.36, 1)
- Card Hover: 150ms, ease-out, translateY(-2px)
- Button Press: 100ms, scale(0.98)
- Drawer Enter: 240ms, ease-out
- Dialog Enter: 220ms, scale(0.98 -> 1), opacity
- Reward Burst: 700ms with spring easing
- XP Count: 900ms count-up
- AI Workflow Step: 450ms per step
- Reduced Motion: remove transforms, keep opacity fades under 150ms

## Layout System

### Mobile

- 4-column grid
- 16px page margins
- Bottom navigation for student and parent
- Bottom sheet for contextual AI
- Horizontal snap carousels for learning content

### Tablet

- 8-column grid
- 24px page margins
- Hybrid side rail and content split

### Desktop

- 12-column grid
- 32px page margins
- Sidebar or command rail depending on role
- Max content width: 1440px for student/parent, fluid for admin analytics

### Ultrawide

- Use right-side intelligence panel.
- Never stretch reading content beyond comfortable measure.

## Component System

### Core Components

- Button: primary, secondary, tertiary, ghost, danger, success, AI, reward.
- Card: learning, AI, reward, insight, admin metric, glass, dark command.
- Input: text, search, prompt composer, OTP, file drop, voice input.
- Badge: XP, streak, level, status, rarity, risk, health.
- Avatar: student, teacher, AI tutor, school, admin.
- Navigation: mobile bottom nav, sidebar, command rail, segmented tabs.
- Dialog: confirmation, reward, AI explanation, report preview.
- Drawer: AI assistant, filters, details, activity.
- Sheet: mobile AI, mobile filters, mission details.
- Toast: success, warning, AI complete, reward unlocked.
- Skeleton: page, card, chart, AI workflow.

### Learning Components

- Learning Hero
- Continue Learning Carousel
- Learning Card
- Journey Map
- Journey Node
- Lesson Timeline
- Concept Card
- Interactive Whiteboard
- Quiz Challenge Card
- Quiz Result Celebration
- Daily Mission Card
- Weekly Challenge Card
- XP Meter
- Streak Flame
- Rank Podium
- Achievement Badge
- Reward Modal

### AI Components

- AI Tutor Avatar
- AI Voice Orb
- AI Prompt Chips
- AI Response Stack
- AI Workflow Timeline
- AI Whiteboard Canvas
- AI Diagram Card
- AI Quiz Generator
- AI Practice Set
- AI Confidence Meter
- AI Citation Chip
- AI Safety Note
- AI Copilot Drawer
- AI Command Suggestion

### Parent Components

- Growth Summary Hero
- Child Switcher
- Consistency Score
- Focus Score
- Subject Strength Map
- Weak Area Card
- Weekly Growth Chart
- Recommendation Card
- Parent Report Card
- Encouragement CTA

### Teacher Components

- Teacher Today Hero
- Class Health Card
- Student Insight Card
- AI Lesson Planner Wizard
- AI Question Generator Panel
- Assignment Mission Builder
- Attendance Tap Grid
- Performance Insight Card
- Report Generator Preview
- Productivity Saved-Time Card

### Admin Components

- Executive Metric Card
- School Health Card
- Revenue Trend Card
- Growth Funnel
- AI Cost Monitor
- Alert Center Item
- Activity Feed Item
- CRM Pipeline Card
- Support Ticket Card
- Command Palette
- Enterprise Data Table
- Segment Filter Bar
- Risk Badge
- Audit Event Timeline

## Component Variant Rules

### Learning Card

Variants:

- Continue
- Recommended
- Recently Viewed
- Locked
- Completed
- AI Recommended

Required fields:

- Title
- Subject
- Progress
- Time remaining
- Reward
- Primary action
- Recommendation reason

### Journey Node

Variants:

- Completed
- Current
- Locked
- Bonus
- Challenge
- Boss Quiz

Required states:

- Default
- Hover
- Pressed
- Focus
- Disabled
- Celebration

### AI Response Stack

Blocks:

- Summary
- Visual explanation
- Step-by-step reasoning
- Whiteboard
- Voice playback
- Practice questions
- Quiz CTA
- Related lesson links

### Admin Metric Card

Variants:

- Revenue
- Growth
- Retention
- AI cost
- School health
- Risk

Required fields:

- Metric
- Trend
- Time period
- Explanation
- Next action

## Accessibility

- WCAG AA minimum contrast.
- Visible focus ring on all interactive elements.
- Keyboard support for carousels, command palette, dialogs, drawers, and journey maps.
- Screen-reader labels for XP, streak, rank, charts, and progress.
- Reduced motion support for all motion tokens.
- Touch targets at least 44px.
- Do not encode progress only with color.
- Confetti must not block screen readers.

## Performance Rules

- LCP target below 2s.
- CLS below 0.05.
- Use skeletons with fixed dimensions.
- Avoid layout shifts in carousels and charts.
- Defer heavy animation and AI visualizations.
- Use optimized images and vector illustrations.
- Keep mobile home first payload lean.

## Figma Enterprise Library Structure

Create these Figma pages:

- 00 Cover
- 01 Foundations
- 02 Colors
- 03 Typography
- 04 Spacing And Grid
- 05 Motion
- 06 Icons And Illustrations
- 07 Core Components
- 08 Learning Components
- 09 AI Components
- 10 Parent Components
- 11 Teacher Components
- 12 Admin Components
- 13 Mobile Patterns
- 14 High-Fidelity Screens
- 15 Prototypes
- 16 Accessibility Notes

Create these variable collections:

- Color / Light
- Color / Dark
- Role / Student
- Role / Parent
- Role / Teacher
- Role / Admin
- Spacing
- Radius
- Elevation
- Motion
- Typography

## Stitch Design System Rules

Stitch prompts must:

- Avoid the words dashboard, ERP, CRUD, widget, and table unless explicitly generating admin enterprise surfaces.
- Use "Home", "Journey", "Mission", "Growth", "Command Center", "AI Tutor", and "Insights".
- Use premium purple `#6D28D9` as primary.
- Use `#0B1020` for cinematic dark AI/admin surfaces.
- Use playful reward colors only for learning moments.
- Include mobile-first instructions when generating student and parent screens.
- Include one primary CTA and one secondary CTA per screen.
- Include progress, personalization, gamification, and AI assistance in every screen prompt.
- Prefer horizontal learning carousels, roadmap journeys, and visual insight cards over grids of KPI cards.
- Use realistic Indian K-12 names, boards, classes, and examples.
- Include accessibility and reduced-motion considerations.

## Stitch Screen Prompt Template

Use this prompt shape:

```text
Create a high-fidelity EduAI [role] [screen name] for [device].
Product feeling: Netflix + Duolingo + ChatGPT + Coursera + Apple.
Do not create an ERP dashboard or CRUD interface.
Primary action: [action].
Secondary action: [action].
Include progress: [specific progress].
Include personalization: [specific personalization].
Include gamification: [specific reward/motivation].
Include AI assistance: [specific AI behavior].
Use EduAI premium design system: primary #6D28D9, accent #8B5CF6, success #22C55E, warning #F59E0B, error #EF4444, dark #0B1020, premium neutral palette.
Use Material Design 3 structure, Apple clarity, Stripe/Linear precision, and accessible WCAG AA contrast.
Use smooth motion cues in the layout notes: page enter 300ms, card hover 150ms, subtle lift, natural button press.
Mobile-first layout: [mobile behavior].
Desktop layout: [desktop behavior].
```

## Design QA Checklist

Before implementation, each high-fidelity screen must pass:

- Does the first viewport create emotion?
- Is the next action obvious in 3 seconds?
- Is there a visible progress indicator?
- Is personalization meaningful?
- Is AI assistance contextual?
- Is gamification appropriate to the role?
- Is the mobile version clear?
- Is accessibility covered?
- Is this clearly not an ERP screen?
- Would this look credible in a top-tier Figma community file?
