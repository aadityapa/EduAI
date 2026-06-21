# EduAI Next-Generation Product Experience

## Product North Star

EduAI must feel like the future of education: emotionally engaging, AI-native, achievement-driven, and trusted by families and schools. The product should feel closer to Netflix, Duolingo, ChatGPT, Coursera, and Apple than a school ERP or traditional LMS.

The core product promise:

> Every learner knows exactly what to do next, why it matters, and how EduAI will help them succeed.

## Current UX Audit

### What Exists Today

Student routes currently include dashboards, courses, course detail, lessons, quizzes, gamification, hub, AI tutor, homework assistant, and study planner.

Teacher routes currently include dashboard, classes, class detail, attendance, assignments, quiz builder, AI generator, AI tutor, and reports.

Parent routes currently include dashboard, child reports, child dashboard, fees, notifications, and AI tutor.

Admin routes currently include dashboard, users, schools, tenants, branding, AI analytics, analytics, billing, subscriptions, content, leads, tickets, audit logs, and security.

The shared UI package already has useful primitives: cards, buttons, badges, avatars, charts, data tables, command palette, dialogs, sheets, file upload, progress bars, XP/streak badges, course cards, and leaderboard rows.

### What Must Change

- Replace dashboard-first thinking with journey-first thinking.
- Replace ERP nouns with learning experience nouns.
- Replace passive charts and tables with next-best-action surfaces.
- Replace static AI chat with multimodal learning assistance.
- Replace course lists with Netflix-style continuation and Duolingo-style pathways.
- Replace admin CRUD navigation with growth, intelligence, health, and command-center navigation.
- Preserve backend business capabilities, but present them through emotional product outcomes.

## Experience Principles

1. Every screen has one obvious primary action.
2. Every screen shows progress, not just data.
3. Every screen includes AI assistance in context.
4. Every role receives personalization from the first viewport.
5. Every learning moment can become a reward moment.
6. Every complex workflow becomes a guided, one-click action.
7. Every page should answer: "What should this user do next?"

## New Information Architecture

### Student

- Home
- Continue Learning
- AI Tutor
- My Journey
- Challenges
- Achievements
- Leaderboard
- Library
- Study Planner
- Homework
- Profile

### Teacher

- Home
- Classes
- Students
- Assignments
- Attendance
- AI Lesson Planner
- Question Generator
- Performance Analytics
- Resources
- Profile

### Parent

- Home
- Child Growth
- Attendance
- Performance
- Homework
- AI Parent Assistant
- Reports
- Profile

### School

- Dashboard
- Students
- Teachers
- Academics
- Fees
- Exams
- Analytics
- Reports
- Settings

### Admin

- Overview
- Schools
- Students
- Teachers
- Revenue
- Subscriptions
- AI Analytics
- Growth
- CRM
- Support
- Security
- Settings

## Product Mode Shift

### From ERP To Learning Experience

Attendance becomes "Consistency".

Fees become "Trust and Access".

Reports become "Growth Stories".

Classes become "Learning Communities".

Assignments become "Missions".

Quizzes become "Challenges".

Analytics become "Insights".

Admin dashboard becomes "Command Center".

## Learning Psychology Model

EduAI should use a loop that creates emotional momentum:

1. Cue: personalized prompt, daily mission, streak reminder, AI recommendation.
2. Action: continue lesson, ask tutor, complete challenge, upload homework.
3. Reward: XP, progress animation, badge, streak, rank movement, parent-visible growth.
4. Investment: saved notes, journey progress, personalized planner, stronger recommendations.

### Motivation Levers

- Competence: show mastery, skill trees, progress, feedback.
- Autonomy: learner chooses next lesson, tutor mode, challenge type.
- Relatedness: leaderboard, class challenges, parent celebrations.
- Curiosity: teaser cards, "unlock next", AI-generated questions.
- Safety: step-by-step help, no shame, encouraging empty states.

## Role Journey Maps

### Student Daily Journey

Open app -> See streak/XP/rank -> Continue recommended lesson -> Ask AI when stuck -> Complete challenge -> Earn XP/badge -> See next mission -> Share progress with parent.

Primary emotion: excitement.

Design requirement: mobile-first, visual, playful, fast.

### Parent Weekly Journey

Open app -> See child growth summary -> Understand consistency and weak areas -> Review homework and AI usage -> Receive recommendations -> Send encouragement.

Primary emotion: trust.

Design requirement: simple explanations, no raw academic clutter.

### Teacher Daily Journey

Open app -> See today's classes and automation opportunities -> Generate lesson plan or assignment -> Review student insights -> Take attendance quickly -> Send reports.

Primary emotion: superhuman productivity.

Design requirement: one-click AI workflows, minimal form work.

### Admin Weekly Journey

Open app -> See growth, revenue, risk, school health -> Investigate alerts -> Use command center -> Review AI cost and learning impact -> Take business action.

Primary emotion: intelligence and control.

Design requirement: Stripe/Linear-level command, clarity, and analytics density.

## Experience Requirements Per Screen

Every screen must define:

- Primary action
- Secondary action
- Progress indicator
- Personalization layer
- Gamification layer
- AI assistance layer
- Empty state
- Loading state
- Mobile layout
- Accessibility requirements

## Interaction Model

### Primary Actions

Primary actions should use vivid, intent-led language:

- Continue Lesson
- Ask AI Tutor
- Start Challenge
- Generate Lesson Plan
- Review Growth
- Investigate Alert
- Create Mission

Avoid generic labels:

- Submit
- Open
- View
- Manage
- Dashboard

### AI Assistance Pattern

Each role gets a contextual AI companion:

- Student: AI Tutor
- Teacher: AI Copilot
- Parent: AI Parent Assistant
- Admin: AI Intelligence Analyst

The AI companion should appear as:

- Floating contextual action
- Inline suggestion cards
- Guided workflow panels
- Multimodal response blocks
- Command palette action

## Motion System Intent

Motion should communicate life, progress, and confidence:

- Page enter: 300ms, subtle vertical fade.
- Card hover: 150ms, 2-4px lift.
- Button press: 100ms scale to 0.98.
- Learning progress: path node pulse and fill.
- Reward: confetti, badge burst, XP count-up.
- AI workflow: staged progress timeline with animated states.
- Reduced motion: fade-only fallback.

## Pre-Code Approval Gate

No frontend implementation should begin until these artifacts are approved:

1. `backend/docs/product/next-generation-product-experience.md`
2. `backend/docs/product/high-fidelity-screen-specifications.md`
3. `backend/docs/design/figma-stitch-design-system.md`
4. Updated Stitch source design brief in `backend/docs/design/DESIGN.md`

Approval criteria:

- At least 60 high-fidelity screen specifications exist.
- The new IA covers student, teacher, parent, school, and admin.
- Each screen defines action, progress, personalization, gamification, and AI assistance.
- Figma-ready tokens, components, and variants are specified.
- Stitch-ready design language and prompt constraints are specified.
- No screen is described as a generic dashboard or CRUD page.
