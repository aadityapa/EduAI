# EduAI — Information Architecture

**Document ID:** EDUAI-IA-001  
**Version:** 1.0.0  
**Date:** June 2025  
**Owner:** Product Design

---

## 1. Purpose

This document defines the navigation structure, route hierarchy, and information organization for all EduAI client surfaces: Student, Parent, Teacher, Admin (School + Platform), and Mobile. It ensures consistent mental models across web portals while respecting age-appropriate UX density and role-based access.

### 1.1 Design Principles

1. **Role-first routing** — Each portal is a distinct route group with its own layout shell and navigation chrome.
2. **Progressive disclosure** — Class band (Pre-primary 1–4, Middle 5–7, Senior 8–10) controls nav depth and feature visibility.
3. **Shared patterns, distinct emphasis** — All portals use the same component library but prioritize different primary actions.
4. **Mobile parity with focus** — Mobile emphasizes learn, AI tutor, and parent monitoring; admin ERP remains web-first.
5. **i18n-ready labels** — All nav labels externalized for English, Hindi, and Marathi.

---

## 2. Global Structure

```mermaid
graph TB
    ROOT[EduAI Platform]

    ROOT --> AUTH[Authentication Layer]
    ROOT --> STUDENT[Student Portal]
    ROOT --> PARENT[Parent Portal]
    ROOT --> TEACHER[Teacher Portal]
    ROOT --> ADMIN[Admin Portal]
    ROOT --> MOBILE[Mobile App]
    ROOT --> MARKETING[Marketing / Public]

    AUTH --> LOGIN[Login]
    AUTH --> REGISTER[Register]
    AUTH --> CONSENT[Parental Consent]
    AUTH --> FORGOT[Forgot Password]

    MARKETING --> LANDING[Landing Page]
    MARKETING --> PRICING[Pricing]
    MARKETING --> SCHOOLS[For Schools]
```

### 2.1 URL Convention (Web)

| Portal | Base Path | Layout Group |
|--------|-----------|--------------|
| Marketing | `/` | `(marketing)` |
| Auth | `/login`, `/register`, `/consent` | `(auth)` |
| Student | `/student/*` | `(student)` |
| Parent | `/parent/*` | `(parent)` |
| Teacher | `/teacher/*` | `(teacher)` |
| School Admin | `/admin/school/*` | `(admin-school)` |
| Platform Admin | `/admin/platform/*` | `(admin-platform)` |

Tenant white-label domains resolve branding but preserve path structure.

---

## 3. Student Portal

Primary persona: Classes 1–10 learners. Navigation adapts by class band.

### 3.1 Site Hierarchy

```mermaid
graph TB
    SD[Student Dashboard /student]

    SD --> LEARN[Learn /student/learn]
    SD --> AI[AI Tutor /student/ai-tutor]
    SD --> TESTS[Tests /student/tests]
    SD --> HOMEWORK[Homework /student/homework]
    SD --> PLANNER[Study Planner /student/planner]
    SD --> GAME[Gamification /student/rewards]
    SD --> PROFILE[Profile /student/profile]

    LEARN --> SUBJECTS[Subjects /student/learn/subjects]
    SUBJECTS --> CHAPTERS[Chapters /student/learn/subjects/:id]
    CHAPTERS --> LESSON[Lesson Player /student/learn/lessons/:id]
    CHAPTERS --> QUIZ[Inline Quiz /student/learn/quizzes/:id]

    TESTS --> MOCK[Mock Tests /student/tests/mock]
    TESTS --> PRACTICE[Practice Quizzes /student/tests/practice]
    MOCK --> ATTEMPT[Mock Attempt /student/tests/mock/:id/attempt]

    GAME --> BADGES[Badges /student/rewards/badges]
    GAME --> LEADER[Leaderboard /student/rewards/leaderboard]
    GAME --> STREAK[Streak /student/rewards/streak]
    GAME --> CHALLENGES[Challenges /student/rewards/challenges]

    PROFILE --> ACHIEVE[Achievements /student/profile/achievements]
    PROFILE --> SETTINGS[Settings /student/profile/settings]
    PROFILE --> HELP[Help /student/profile/help]

    SD --> BRAIN[Brain Hub /student/brain — Classes 1-4 only]
    SD --> SKILLS[Skills Hub /student/skills — Class 5+]
```

### 3.2 Primary Navigation (Web Sidebar / Mobile Tab Bar)

| Nav Item | Route | Class Band | Priority |
|----------|-------|------------|----------|
| Home | `/student` | All | P0 |
| Learn | `/student/learn` | All | P0 |
| AI Tutor | `/student/ai-tutor` | 5–10 (limited 1–4) | P0 |
| Tests | `/student/tests` | 5–10 | P0 |
| Rewards | `/student/rewards` | All | P0 |
| Homework | `/student/homework` | 5–10 | P1 |
| Planner | `/student/planner` | 8–10 | P1 |
| Brain Games | `/student/brain` | 1–4 | P0 |
| Profile | `/student/profile` | All | P1 |

### 3.3 Class Band UX Variations

| Band | Nav Style | Max Depth | Special Routes |
|------|-----------|-----------|----------------|
| Pre-primary / 1–4 | Icon-only bottom nav (mobile), large tiles (web) | 2 levels | `/student/brain`, voice-guided lessons |
| 5–7 | Icon + label nav, story-driven cards | 3 levels | Group challenges, subject mascots |
| 8–10 | Compact sidebar, exam-focused CTAs | 4 levels | Mock tests, study planner, peer leaderboard |

---

## 4. Parent Portal

Primary persona: Guardians monitoring one or more children.

### 4.1 Site Hierarchy

```mermaid
graph TB
    PD[Parent Dashboard /parent]

    PD --> CHILDREN[Children /parent/children]
    PD --> REPORTS[Reports /parent/reports]
    PD --> MESSAGES[Messages /parent/messages]
    PD --> CONTROLS[Controls /parent/controls]
    PD --> BILLING[Billing /parent/billing]
    PD --> CONSENT[Consent /parent/consent]
    PD --> PROFILE[Profile /parent/profile]

    CHILDREN --> CHILD[Child Detail /parent/children/:id]
    CHILD --> PROGRESS[Progress /parent/children/:id/progress]
    CHILD --> ACTIVITY[Activity Log /parent/children/:id/activity]
    CHILD --> SUBJECTS[Subject Breakdown /parent/children/:id/subjects]

    REPORTS --> WEEKLY[Weekly AI Report /parent/reports/weekly]
    REPORTS --> ARCHIVE[Report Archive /parent/reports/archive]

    MESSAGES --> INBOX[Inbox /parent/messages]
    MESSAGES --> THREAD[Thread /parent/messages/:id]

    CONTROLS --> SCREENTIME[Screen Time /parent/controls/screen-time]
    CONTROLS --> NOTIFPREFS[Notification Prefs /parent/controls/notifications]

    BILLING --> SUB[Subscription /parent/billing/subscription]
    BILLING --> INVOICES[Invoices /parent/billing/invoices]
    BILLING --> PAYMETHODS[Payment Methods /parent/billing/payment-methods]
```

### 4.2 Primary Navigation

| Nav Item | Route | Description |
|----------|-------|-------------|
| Dashboard | `/parent` | Multi-child overview, alerts |
| My Children | `/parent/children` | Per-child drill-down |
| Reports | `/parent/reports` | AI-generated weekly narratives |
| Messages | `/parent/messages` | Teacher communication |
| Controls | `/parent/controls` | Screen time, notification limits |
| Billing | `/parent/billing` | Subscription, invoices, UPI |
| Consent | `/parent/consent` | DPDP consent management |

---

## 5. Teacher Portal

Primary persona: Classroom teachers (Classes 1–10).

### 5.1 Site Hierarchy

```mermaid
graph TB
    TD[Teacher Dashboard /teacher]

    TD --> CLASSES[My Classes /teacher/classes]
    TD --> ASSIGN[Assignments /teacher/assignments]
    TD --> QPG[Question Papers /teacher/question-papers]
    TD --> ANALYTICS[Analytics /teacher/analytics]
    TD --> CONTENT[Content Library /teacher/content]
    TD --> COMMS[Communication /teacher/communication]
    TD --> PROFILE[Profile /teacher/profile]

    CLASSES --> CLASS[Class View /teacher/classes/:id]
    CLASS --> ROSTER[Roster /teacher/classes/:id/roster]
    CLASS --> ATTEND[Attendance /teacher/classes/:id/attendance]
    CLASS --> CLASSAN[Class Analytics /teacher/classes/:id/analytics]

    ASSIGN --> CREATE[Create Assignment /teacher/assignments/new]
    ASSIGN --> GRADE[Grade Submissions /teacher/assignments/:id/grade]

    QPG --> GENERATE[Generate Paper /teacher/question-papers/new]
    QPG --> EDIT[Edit Paper /teacher/question-papers/:id]
    QPG --> PUBLISH[Publish to Class /teacher/question-papers/:id/publish]

    ANALYTICS --> CLASSPERF[Class Performance /teacher/analytics/classes]
    ANALYTICS --> GAPS[Skill Gaps /teacher/analytics/gaps]
    ANALYTICS --> INDIV[Individual Reports /teacher/analytics/students/:id]

    COMMS --> ANNOUNCE[Announcements /teacher/communication/announcements]
    COMMS --> PARENTMSG[Parent Messages /teacher/communication/messages]
```

### 5.2 Primary Navigation

| Nav Item | Route | Description |
|----------|-------|-------------|
| Dashboard | `/teacher` | Today's classes, pending grading |
| Classes | `/teacher/classes` | Roster, attendance, class analytics |
| Assignments | `/teacher/assignments` | Create, assign, grade homework |
| Question Papers | `/teacher/question-papers` | AI QPG workflow |
| Analytics | `/teacher/analytics` | Performance dashboards |
| Content | `/teacher/content` | Assign from library |
| Messages | `/teacher/communication` | Parent announcements |

---

## 6. Admin Portal

Two sub-portals share `/admin` prefix with role-gated visibility.

### 6.1 School Admin Hierarchy

```mermaid
graph TB
    SA[School Admin Dashboard /admin/school]

    SA --> USERS[Users /admin/school/users]
    SA --> ENROLL[Enrollment /admin/school/enrollment]
    SA --> CLASSES[Classes /admin/school/classes]
    SA --> ERP[ERP /admin/school/erp]
    SA --> CONTENT[Content /admin/school/content]
    SA --> REPORTS[Reports /admin/school/reports]
    SA --> SETTINGS[Settings /admin/school/settings]

    ERP --> ATTEND[Attendance Reports /admin/school/erp/attendance]
    ERP --> FEES[Fees /admin/school/erp/fees]
    ERP --> TIMETABLE[Timetable /admin/school/erp/timetable]
    ERP --> ANNOUNCE[Announcements /admin/school/erp/announcements]
    ERP --> REPORTCARDS[Report Cards /admin/school/erp/report-cards]

    SETTINGS --> BRANDING[Branding /admin/school/settings/branding]
    SETTINGS --> FEATURES[Feature Flags /admin/school/settings/features]
    SETTINGS --> GAMIFICATION[Gamification Policy /admin/school/settings/gamification]
```

### 6.2 Platform Admin Hierarchy

```mermaid
graph TB
    PA[Platform Dashboard /admin/platform]

    PA --> TENANTS[Tenants /admin/platform/tenants]
    PA --> ANALYTICS[Analytics /admin/platform/analytics]
    PA --> CMS[Content CMS /admin/platform/cms]
    PA --> AI[AI Operations /admin/platform/ai]
    PA --> BILLING[Billing /admin/platform/billing]
    PA --> SUPPORT[Support /admin/platform/support]
    PA --> AUDIT[Audit Logs /admin/platform/audit]
    PA --> SYSTEM[System /admin/platform/system]

    TENANTS --> TENANT[Tenant Detail /admin/platform/tenants/:id]
    TENANT --> WL[White-Label Config /admin/platform/tenants/:id/branding]
    TENANT --> USERS[Cross-Tenant Users /admin/platform/tenants/:id/users]

    CMS --> PIPELINE[Review Pipeline /admin/platform/cms/pipeline]
    CMS --> BOARDS[Boards & Curriculum /admin/platform/cms/boards]

    AI --> COSTS[Cost Monitor /admin/platform/ai/costs]
    AI --> QUOTAS[Quota Management /admin/platform/ai/quotas]
    AI --> SAFETY[Safety Logs /admin/platform/ai/safety]
```

### 6.3 Admin Navigation Matrix

| Section | School Admin | Tenant Admin | Platform Admin |
|---------|:------------:|:------------:|:--------------:|
| Dashboard | ✅ | ✅ | ✅ |
| Users / Enrollment | ✅ | ✅ | ✅ |
| ERP (Fees, Timetable) | ✅ | View | View |
| Tenant Management | ❌ | ✅ (own) | ✅ (all) |
| Content CMS Pipeline | ❌ | ✅ | ✅ |
| AI Cost Monitor | ❌ | ✅ | ✅ |
| Cross-Tenant Analytics | ❌ | ✅ | ✅ |
| Audit Logs | ❌ | ✅ | ✅ |
| System Health | ❌ | ❌ | ✅ |

---

## 7. Mobile App (React Native / Expo)

Mobile uses Expo Router with tab-based navigation for Student and Parent roles. Teacher and Admin functions are web-only in Phase 1.

### 7.1 Mobile Hierarchy

```mermaid
graph TB
    MOB[EduAI Mobile App]

    MOB --> AUTHM[Auth Stack]
    MOB --> STUDENTM[Student Tabs]
    MOB --> PARENTM[Parent Tabs]
    MOB --> SHARED[Shared Modals]

    AUTHM --> LOGINM[Login]
    AUTHM --> BIOMETRIC[Biometric Setup]
    AUTHM --> ROLE[Role Selection]

    STUDENTM --> HOME[Home Tab]
    STUDENTM --> LEARNM[Learn Tab]
    STUDENTM --> AIM[AI Tutor Tab]
    STUDENTM --> TESTM[Tests Tab]
    STUDENTM --> REWARDM[Rewards Tab]

    HOME --> DASHM[Dashboard]
    HOME --> OFFLINE[Offline Downloads]

    LEARNM --> SUBJM[Subject List]
    SUBJM --> LESSONM[Lesson Player]
    LESSONM --> OFFLINEDL[Download for Offline]

    AIM --> CHATM[Chat Interface]
    AIM --> HISTORYM[Conversation History]

    TESTM --> MOCKM[Mock Tests]
    TESTM --> QUIZM[Quick Quiz]

    REWARDM --> BADGEM[Badges]
    REWARDM --> LEADERM[Leaderboard]
    REWARDM --> STREAKM[Streak]

    PARENTM --> PDASH[Dashboard Tab]
    PARENTM --> PKIDS[Children Tab]
    PARENTM --> PREPORT[Reports Tab]
    PARENTM --> PSETTINGS[Settings Tab]

    SHARED --> NOTIF[Notification Center]
    SHARED --> PROFILEM[Profile Sheet]
    SHARED --> PAYWALL[Subscription Paywall]
```

### 7.2 Mobile Tab Configuration

**Student (Class 8–10 — primary mobile persona)**

| Tab | Icon | Stack Routes |
|-----|------|--------------|
| Home | house | Dashboard, Continue Learning, Streak |
| Learn | book-open | Subjects → Chapters → Lesson Player |
| AI | sparkles | Chat, History |
| Tests | clipboard-check | Mock Tests, Practice |
| Rewards | trophy | Badges, Leaderboard, Streak |

**Parent**

| Tab | Icon | Stack Routes |
|-----|------|--------------|
| Home | layout-dashboard | Multi-child overview |
| Children | users | Per-child progress |
| Reports | file-text | Weekly AI reports |
| Settings | settings | Billing, Controls, Consent |

---

## 8. Cross-Portal Shared Patterns

### 8.1 Global Utilities (All Authenticated Portals)

| Utility | Location | Behavior |
|---------|----------|----------|
| Search | Header command palette (`⌘K`) | Content search, quick nav |
| Notifications | Header bell icon | Slide-over panel |
| Language Switcher | Header / Settings | en-IN, hi-IN, mr-IN |
| Theme Toggle | Settings | Light / Dark / System |
| Help & Support | Footer / Profile | FAQ, ticket creation |
| Logout | Profile menu | Session termination |

### 8.2 Breadcrumb Strategy

| Portal | Max Breadcrumb Depth | Example |
|--------|------------------------|---------|
| Student (1–4) | Hidden | — |
| Student (5–10) | 3 | Learn → Mathematics → Fractions |
| Parent | 3 | Children → Arjun → Mathematics |
| Teacher | 4 | Classes → 8-A → Assignments → Grade |
| Admin | 4 | Tenants → DPS Pune → Branding |

---

## 9. Content Taxonomy

Curriculum content follows a fixed hierarchy referenced across Learn, Content CMS, and AI context:

```mermaid
graph LR
    BOARD[Board — CBSE, ICSE, State]
    BOARD --> CLASS[Class Level — 1 to 10]
    CLASS --> SUBJECT[Subject — Math, Science, etc.]
    SUBJECT --> CHAPTER[Chapter]
    CHAPTER --> LESSON[Lesson]
    LESSON --> ASSET[Assets — Video, Quiz, Flashcard]
```

Search and filters expose Board → Class → Subject as primary facets. Chapter and Lesson are navigational, not filter top-level.

---

## 10. Access Control Mapping

Navigation items are gated by RBAC permissions. UI hides unavailable items rather than showing disabled states (except upgrade prompts for billing-gated features).

| Nav Item | Minimum Permission |
|----------|-------------------|
| AI Tutor | `ai:tutor:use:own` |
| QPG | `ai:qpg:use:class` |
| Attendance | `attendance:write:class` |
| Tenant Management | `tenants:manage:global` |
| CMS Pipeline | `content:publish:tenant` |
| Billing | `billing:manage:own` |

Refer to [RBAC Design](../architecture/rbac-design.md) for the complete permission matrix.

---

## 11. SEO & Public Routes

| Route | Indexable | Purpose |
|-------|:---------:|---------|
| `/` | Yes | Marketing landing |
| `/pricing` | Yes | Plan comparison |
| `/for-schools` | Yes | B2B landing |
| `/login`, `/register` | No | Auth flows |
| `/student/*`, `/parent/*`, etc. | No | Authenticated app |

---

## 12. Future IA Considerations (Phase 2)

- **Live Doubt Sessions** — New top-level nav under Student `/student/live`
- **SSO Entry** — School-specific login at `/login/{school-slug}`
- **Government Board Hub** — Dedicated `/boards/{state}` marketing + content entry
- **Teacher Mobile** — Reduced tab set mirroring web priorities

---

*Related: [Wireframes](./wireframes.md) · [Figma Structure](./figma-structure.md) · [Design System](./design-system.md) · [PRD](../prd/product-requirements-document.md)*
