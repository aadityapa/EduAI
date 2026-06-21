# EduAI Experience Transformation Roadmap

## Non-Negotiable Rule

No frontend code should be written for the next-generation experience until the product/design gate is approved.

Approval artifacts:

- `backend/docs/product/next-generation-product-experience.md`
- `backend/docs/product/high-fidelity-screen-specifications.md`
- `backend/docs/design/figma-stitch-design-system.md`
- `backend/docs/design/DESIGN.md`

## Phase 0: Product And Design Approval

Goal: align on the emotional product, IA, design system, and 80 screen specs.

Deliverables:

- Full UX audit
- Full design audit
- User journey maps
- Learning psychology review
- Complete IA
- 80 high-fidelity screen specifications
- Figma-ready design system
- Stitch-ready design system
- Motion and interaction system

Exit criteria:

- Stakeholders approve the new IA.
- Student Home, AI Tutor, Learning Journey, Parent Growth, Teacher Home, and Admin Command Center are approved as the flagship experiences.
- No route is described as a generic dashboard unless it is a school/admin command surface.

## Phase 1: Design System Foundation

Goal: build the visual and interaction foundation once, then use it everywhere.

Build order:

1. Tokens: color, typography, radius, spacing, elevation, motion.
2. Core components: buttons, cards, badges, inputs, dialogs, drawers, toasts.
3. Learning components: journey map, learning card, mission card, reward modal.
4. AI components: tutor avatar, voice orb, prompt chips, workflow timeline, response stack.
5. Insight components: growth card, score card, subject strength map, health score.
6. Admin components: command palette, executive metric card, alert item, activity feed, CRM card.

Exit criteria:

- Components support light, dark, student, parent, teacher, and admin themes.
- Components have keyboard and screen-reader states.
- Reduced-motion mode is implemented.
- Storybook or equivalent component inventory is recommended before broad rollout.

## Phase 2: Student Flagship Experience

Goal: make EduAI instantly feel like the future of learning.

Build order:

1. Student Home
2. Continue Learning
3. Learning Path Overview
4. Lesson Player
5. AI Tutor Home
6. AI Tutor Response
7. Homework AI Workflow
8. Daily Missions
9. Achievements
10. Leaderboard

Exit criteria:

- Student sees what to do next in under 3 seconds.
- AI recommendation reason is visible.
- Progress and gamification are visible above the fold.
- Mobile experience is excellent.

## Phase 3: Parent Trust Experience

Goal: replace ERP visibility with child growth clarity.

Build order:

1. Parent Home
2. Child Growth
3. Performance
4. Attendance as Consistency
5. Homework Visibility
6. AI Parent Assistant
7. Reports

Exit criteria:

- Parent can understand child improvement without interpreting raw school data.
- Weak areas and recommendations are plain-language.
- Weekly growth report feels shareable and premium.

## Phase 4: Teacher Superhuman Experience

Goal: make teachers feel 10x more productive.

Build order:

1. Teacher Home
2. AI Lesson Planner
3. Question Generator
4. Assignment Mission Builder
5. Attendance Tap Grid
6. Student Insights
7. Performance Analytics
8. Report Generator

Exit criteria:

- Teacher can generate a useful lesson plan in one workflow.
- Teacher can identify at-risk students quickly.
- Teacher workflows emphasize time saved.

## Phase 5: Admin Enterprise Experience

Goal: upgrade admin from management software to growth intelligence.

Build order:

1. Admin Overview / Command Center
2. Alerts Center
3. Revenue Analytics
4. AI Analytics
5. Growth
6. Schools Health
7. CRM
8. Support
9. Security
10. Activity Feed

Exit criteria:

- Admin has a clear daily business brief.
- Every metric has a next action.
- AI cost and AI learning impact are connected.

## Phase 6: Mobile Native Experience

Goal: make mobile feel intentionally designed, not compressed desktop.

Build order:

1. Student mobile home
2. Continue learning carousel
3. AI Tutor voice mode
4. Homework camera upload
5. Journey map
6. Parent growth mobile
7. Teacher daily workflow mobile

Exit criteria:

- Touch targets are 44px or larger.
- Bottom navigation is role-aware.
- AI actions are reachable by thumb.
- Horizontal carousels use snap behavior.

## Phase 7: Quality, Performance, Accessibility

Targets:

- Lighthouse Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- CLS: below 0.05
- LCP: below 2s
- WCAG AA

Validation:

- Keyboard navigation audit
- Screen-reader audit
- Reduced-motion audit
- Mobile performance audit
- Visual regression review
- Production QA checklist

## Priority MVP Transformation Set

The first implementation batch should include:

1. Student Home
2. Continue Learning
3. Learning Path Overview
4. AI Tutor Home
5. AI Tutor Response
6. Homework AI Workflow
7. Parent Home
8. Parent Child Growth
9. Teacher Home
10. AI Lesson Planner
11. Admin Overview
12. Admin AI Analytics

These screens create the strongest immediate "future of education" perception.
