# EduAI — Product Requirements Document (PRD)

**Document ID:** EDUAI-PRD-001  
**Version:** 1.0.0  
**Status:** Approved for Pre-Development  
**Date:** June 2025  
**Owner:** Product Management

---

## 1. Product Vision

**Vision:** Every Indian student from Class 1 to 10 receives a personalized AI learning companion that adapts to their board, language, and pace — while teachers and parents stay connected through one unified ecosystem.

**Mission:** Reduce learning gaps through intelligent tutoring, engaging gamification, and institutional-grade tools — accessible on web and mobile, affordable for families, and scalable for schools.

---

## 2. Product Goals

| # | Goal | Success Indicator |
|---|------|-------------------|
| G1 | Deliver board-aligned adaptive learning | 65%+ lesson completion rate |
| G2 | Reduce teacher administrative burden | 5+ hrs/week saved (survey) |
| G3 | Increase parent engagement | 40%+ weekly parent portal login |
| G4 | Scale as multi-tenant white-label SaaS | 10+ white-label tenants Year 1 |
| G5 | Maintain AI quality at sustainable cost | AI COGS < 25% ARPU |
| G6 | Achieve mobile-first engagement for teens | 50%+ Class 8–10 sessions on mobile |

---

## 3. User Personas

### 3.1 Persona: Arjun — The Curious Student (Class 5, CBSE)

| Attribute | Detail |
|-----------|--------|
| **Age** | 10 years |
| **Location** | Pune, Maharashtra |
| **Device** | Parent's tablet + shared family laptop |
| **Language** | Hindi UI preferred, English for Science |
| **Goals** | Understand Math concepts, finish homework faster, earn badges |
| **Frustrations** | Boring video lectures, no help when stuck at night |
| **EduAI Value** | AI tutor in Hindi, gamified Math, streak rewards |

**Jobs to be Done:**
- Learn today's Math chapter with interactive exercises
- Ask AI tutor "why" questions without judgment
- See progress and compete on class leaderboard

---

### 3.2 Persona: Priya — The Pre-Primary Explorer (Age 4)

| Attribute | Detail |
|-----------|--------|
| **Age** | 4 years |
| **Location** | Bangalore |
| **Device** | iPad (supervised) |
| **Language** | English |
| **Goals** | Letter recognition, shapes, colors via play |
| **Frustrations** | Too much text, loses interest quickly |
| **EduAI Value** | Brain Development games, voice-guided activities, parent co-play mode |

---

### 3.3 Persona: Meera — The Concerned Parent

| Attribute | Detail |
|-----------|--------|
| **Age** | 38 |
| **Children** | Two — Class 3 and Class 8 |
| **Location** | Delhi NCR |
| **Goals** | Track both children's progress, control screen time, pay one subscription |
| **Frustrations** | Multiple apps, no visibility, expensive subscriptions |
| **EduAI Value** | Family plan, unified dashboard, weekly AI-generated progress reports |

---

### 3.4 Persona: Rajesh — The Overworked Teacher

| Attribute | Detail |
|-----------|--------|
| **Age** | 42 |
| **Role** | Math teacher, Classes 6–8, ICSE school |
| **Location** | Mumbai |
| **Goals** | Create question papers quickly, track class performance, communicate with parents |
| **Frustrations** | Manual grading, WhatsApp chaos, no analytics |
| **EduAI Value** | AI Question Paper Generator, auto-graded assignments, parent messaging |

---

### 3.5 Persona: Dr. Sharma — School Principal / Admin

| Attribute | Detail |
|-----------|--------|
| **Role** | Principal, 1,200-student private school |
| **Goals** | Digitize operations, improve board results, branded parent app |
| **Frustrations** | 5 different vendors, no unified data |
| **EduAI Value** | School ERP + white-label app + consolidated analytics |

---

### 3.6 Persona: Platform Admin (EduAI Internal)

| Attribute | Detail |
|-----------|--------|
| **Role** | SaaS operations, tenant onboarding |
| **Goals** | Provision tenants, monitor AI costs, manage content pipeline |
| **EduAI Value** | Admin CRM, tenant dashboards, audit logs |

---

## 4. Product KPIs

### 4.1 Engagement KPIs

| Metric | Target | Frequency |
|--------|--------|-----------|
| DAU/MAU ratio | > 25% | Weekly |
| Avg session duration (student) | > 18 min | Daily |
| Lessons completed per user/week | > 5 | Weekly |
| AI tutor queries per active user/week | > 3 | Weekly |
| Streak retention (7-day) | > 40% | Weekly |
| Gamification participation | > 60% earn ≥1 badge/month | Monthly |

### 4.2 Learning Outcome KPIs

| Metric | Target | Frequency |
|--------|--------|-----------|
| Pre/post assessment improvement | > 15% avg | Per unit |
| Mock test completion rate | > 70% | Per exam cycle |
| Homework submission on-time rate | > 80% | Weekly |
| Skill gap closure (adaptive) | > 50% weak topics improved | Monthly |

### 4.3 Business KPIs

| Metric | Target | Frequency |
|--------|--------|-----------|
| Freemium → Paid conversion | 8% | Monthly |
| B2B school pipeline | 20 active demos/quarter | Quarterly |
| NPS (parents) | ≥ 45 | Quarterly |
| Support ticket resolution | < 24 hrs | Daily |
| App store rating | ≥ 4.3 | Ongoing |

### 4.4 Technical KPIs

| Metric | Target |
|--------|--------|
| Web LCP | < 2.5s |
| API p95 latency | < 300ms |
| Uptime | 99.9% |
| AI response time p95 | < 4s |

---

## 5. Feature Requirements by Module

### 5.1 Authentication & RBAC

- Multi-role accounts: Student, Parent, Teacher, School Admin, Tenant Admin, Platform Admin
- JWT access + refresh tokens; multi-device session management
- SSO for schools (SAML/OIDC — Phase 2)
- Parent-child account linking
- OTP + email/password + social login (Google)

### 5.2 Student Portal

- Personalized dashboard (continue learning, streaks, upcoming tasks)
- Subject/chapter navigation aligned to board + class
- Interactive lessons (video via Mux, quizzes, flashcards)
- AI Tutor chat with context awareness (current chapter)
- Homework submission (text, image upload)
- Mock tests with timed mode and instant results
- Study planner calendar
- Gamification hub (XP, badges, leaderboard)
- Profile, achievements, settings

### 5.3 Smart Learning Hub

- Adaptive learning paths based on diagnostic assessment
- Content recommendation engine
- Spaced repetition for retention
- Cross-module progress sync

### 5.4 Class-Specific Systems

| Band | Age | UX Focus | Key Features |
|------|-----|----------|--------------|
| Pre-primary / 1–4 | 3–9 | Playful, large touch targets, voice | Brain games, phonics, basic numeracy |
| 5–7 | 10–12 | Gamified, story-driven | Subject modules, group challenges |
| 8–10 | 13–16 | Exam-focused, mobile-first | Board prep, mock tests, peer leaderboard |

### 5.5 AI Ecosystem

| Feature | Description | Priority |
|---------|-------------|----------|
| AI Tutor | Conversational help with RAG on curriculum | P0 |
| Homework Assistant | Step-by-step guidance (not answers) | P0 |
| Question Paper Generator | Teacher tool: board pattern, difficulty mix | P0 |
| Mock Tests | Auto-generated + curated banks | P0 |
| Study Planner | AI schedule based on exam dates + weak areas | P1 |

### 5.6 Brain Development Hub

- Cognitive games (memory, logic, pattern recognition)
- Age-appropriate difficulty scaling
- Progress reports for parents

### 5.7 Skill Development Hub

- Life skills, coding basics (Class 5+), communication
- Micro-certificates on completion

### 5.8 Parent Portal

- Multi-child dashboard
- Weekly progress reports (AI-generated narrative)
- Screen time / usage controls
- Teacher messaging
- Subscription management
- Consent management (DPDP)

### 5.9 Teacher Portal

- Class roster management
- Assignment creation and grading
- AI Question Paper Generator
- Analytics (class avg, individual gaps)
- Parent communication
- Content assignment from library

### 5.10 School ERP

- Student enrollment records
- Attendance (manual + future biometric)
- Timetable management
- Fee management (Razorpay integration)
- Announcements
- Basic report cards

### 5.11 Admin CRM

- Tenant provisioning and white-label config
- User management across tenants
- Content CMS pipeline
- AI cost monitoring
- Support ticket integration
- Audit log viewer

### 5.12 Gamification

- XP for lessons, quizzes, streaks
- Badges (achievement, milestone, seasonal)
- Leaderboards (class, school, tenant — configurable privacy)
- Streak system with freeze tokens (Duolingo-inspired)

### 5.13 Mobile (React Native)

- Core student flows: learn, AI tutor, mock tests
- Parent dashboard
- Push notifications (assignments, streaks)
- Offline lesson download (Pro tier)
- Biometric login

### 5.14 Multi-Language

- UI i18n framework (English, Hindi, Marathi)
- Content language tagging
- RTL-ready architecture (future Urdu/Arabic)
- AI tutor responds in user's selected language

---

## 6. User Experience Principles

1. **Age-appropriate UX** — UI density and navigation depth vary by class band
2. **Delight without distraction** — Gamification supports learning, not replaces it
3. **Glass morphism + MD3** — Modern, accessible, consistent across portals
4. **Progressive disclosure** — Advanced features revealed as users mature
5. **Offline resilience** — Mobile downloads for low-connectivity India
6. **Inclusive design** — WCAG 2.1 AA; dyslexia-friendly font option

---

## 7. Competitive Feature Matrix

| Feature | EduAI | Byju's | Duolingo | LEAD | Unacademy |
|---------|-------|--------|----------|------|-----------|
| AI Tutor (RAG) | ✅ | Partial | ❌ | ❌ | Partial |
| Board-aligned K-10 | ✅ | ✅ | ❌ | ✅ | Partial |
| Parent Portal | ✅ | Partial | ❌ | ✅ | ❌ |
| School ERP | ✅ | ❌ | ❌ | ✅ | ❌ |
| White-label SaaS | ✅ | ❌ | ❌ | ✅ | ❌ |
| Gamification | ✅ | Partial | ✅ | Partial | Partial |
| QPG for Teachers | ✅ | ❌ | ❌ | Partial | ❌ |
| Hindi/Marathi UI | ✅ | Partial | ❌ | Partial | Partial |
| Mobile Offline | ✅ | ✅ | ✅ | Partial | ✅ |

---

## 8. Release Strategy

### Phase 1 (Sprints 1–16) — MVP + GA

- Web portals (all roles)
- Mobile app (student + parent core)
- AI Tutor, Homework, QPG, Mock Tests
- CBSE primary content; ICSE/State framework
- English + Hindi UI

### Phase 2 (Post-GA)

- Marathi content expansion
- SAML SSO for schools
- Live doubt sessions
- Additional languages (Gujarati, Tamil, Telugu, Kannada)
- Government board partnerships
- Advanced ERP (transport, inventory)

---

## 9. Dependencies & Assumptions

**Assumptions:**
- OpenAI/Gemini API availability in India region
- Razorpay UPI autopay adoption continues to grow
- Schools willing to pilot at ₹1,500/student/year price point

**Dependencies:**
- Curriculum content authoring (parallel track to engineering)
- Mux video hosting contract
- AWS ap-south-1 infrastructure
- Clerk/Auth.js production tier

---

## 10. Open Questions

| # | Question | Owner | Target Resolution |
|---|----------|-------|-------------------|
| 1 | Clerk vs Auth.js final decision | Tech Lead | Sprint 1 |
| 2 | Gemini vs OpenAI primary provider | AI Lead | Sprint 8 |
| 3 | State board priority order | Content | Sprint 6 |
| 4 | Leaderboard opt-out default for schools | Product | Sprint 13 |

---

*Related: [SRS](../srs/software-requirements-specification.md) · [User Stories](../sprints/user-stories.md) · [Sprint Planning](../sprints/sprint-planning.md)*
