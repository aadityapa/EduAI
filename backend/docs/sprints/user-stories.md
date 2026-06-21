# EduAI — User Stories Backlog

**Document ID:** EDUAI-US-001  
**Version:** 1.0.0  
**Status:** Approved for Sprint Planning  
**Date:** June 2025  
**Owner:** Product Management

---

## 1. Overview

This document is the authoritative product backlog for EduAI Phase 1 (Sprints 1–16). Stories follow the format:

> **As a** [role], **I want** [goal], **so that** [benefit]

Each story includes a unique ID, acceptance criteria, priority (P0 = must-have for GA, P1 = should-have), and story points (Fibonacci: 1, 2, 3, 5, 8, 13).

**Related:** [PRD](../prd/product-requirements-document.md) · [Sprint Planning](./sprint-planning.md) · [User Flows](./user-flows.md)

---

## 2. Epic: Foundation & DevOps

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-001 | As a **developer**, I want a Turborepo monorepo with shared packages, so that web, mobile, and services share types and utilities consistently. | P0 | 8 |
| US-002 | As a **DevOps engineer**, I want Docker images for all services, so that environments are reproducible locally and in CI. | P0 | 5 |
| US-003 | As a **DevOps engineer**, I want GitHub Actions CI pipelines (lint, test, build), so that every PR is validated before merge. | P0 | 5 |
| US-004 | As a **platform engineer**, I want EKS cluster provisioning via Terraform, so that staging and production are infrastructure-as-code. | P0 | 8 |
| US-005 | As a **developer**, I want OpenAPI 3.1 auto-generation from NestJS controllers, so that API contracts stay synchronized. | P0 | 3 |
| US-006 | As a **SRE**, I want structured JSON logging with correlation IDs, so that distributed traces are debuggable across services. | P0 | 5 |
| US-007 | As a **developer**, I want local dev environment via Docker Compose, so that I can run the full stack without AWS access. | P0 | 5 |
| US-008 | As a **SRE**, I want Prometheus metrics and Grafana dashboards per service, so that we detect regressions before users do. | P0 | 5 |
| US-009 | As a **developer**, I want shared ESLint/Prettier/TypeScript configs, so that code style is enforced uniformly. | P0 | 2 |
| US-010 | As a **platform engineer**, I want AWS Secrets Manager integration, so that credentials are never committed to source control. | P0 | 3 |

### US-001 Acceptance Criteria

- [ ] Monorepo contains `apps/web`, `apps/mobile`, `apps/*-service`, `frontend/shared-ui/ui`, `packages/types`, `packages/config`
- [ ] `turbo run build` succeeds across all workspaces
- [ ] Shared TypeScript types imported from `@eduai/types` in web and services

---

## 3. Epic: Authentication & RBAC

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-011 | As a **new user**, I want to register with email and password, so that I can create an EduAI account. | P0 | 5 |
| US-012 | As a **user**, I want email verification after registration, so that my account is confirmed and secure. | P0 | 3 |
| US-013 | As a **user**, I want to sign in with Google OAuth, so that I can access EduAI without a separate password. | P0 | 5 |
| US-014 | As a **user**, I want JWT access and refresh tokens, so that my session persists securely across page reloads. | P0 | 5 |
| US-015 | As a **user**, I want to view and revoke active device sessions, so that I can log out remotely if my device is lost. | P0 | 5 |
| US-016 | As a **parent**, I want to link my account to my child's student account, so that I can monitor their progress. | P0 | 5 |
| US-017 | As a **minor student**, I want parental consent captured during registration, so that EduAI complies with DPDP child data rules. | P0 | 8 |
| US-018 | As a **user**, I want account lockout after 5 failed login attempts, so that brute-force attacks are mitigated. | P0 | 3 |
| US-019 | As a **user**, I want password reset via secure email link, so that I can recover my account if I forget my password. | P0 | 3 |
| US-020 | As a **system**, I want every API request validated against RBAC permissions, so that users only access authorized resources. | P0 | 8 |
| US-021 | As a **school admin**, I want users assigned roles (student, teacher, parent, admin), so that portal access matches their function. | P0 | 5 |
| US-022 | As a **platform admin**, I want JWT claims to include `tenant_id` and `school_id`, so that multi-tenant isolation is enforced. | P0 | 5 |
| US-023 | As a **user**, I want role-based UI navigation, so that I only see features relevant to my role. | P0 | 5 |
| US-024 | As a **user**, I want OTP login on mobile (Phase 2 placeholder), so that I can sign in without password on phone. | P1 | 8 |
| US-025 | As a **school IT admin**, I want SAML/OIDC SSO (Phase 2), so that staff use existing school credentials. | P1 | 13 |

### US-016 Acceptance Criteria

- [ ] Parent enters child's enrollment code or scans QR from school
- [ ] Link request sent to parent email for confirmation
- [ ] Upon approval, parent dashboard shows linked child
- [ ] Parent can link up to 5 children on Family plan
- [ ] Unlink requires re-verification

### US-020 Acceptance Criteria

- [ ] NestJS `@RequirePermission()` guard on all protected endpoints
- [ ] Permission codes follow `{resource}:{action}:{scope}` format
- [ ] 403 returned with clear error when permission denied
- [ ] JWT carries flattened permission list refreshed on role change
- [ ] Unit tests cover guard for each role matrix row

---

## 4. Epic: Admin CRM & Tenant Management

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-026 | As a **platform admin**, I want to create new white-label tenants, so that partners can launch branded EduAI instances. | P0 | 8 |
| US-027 | As a **platform admin**, I want to configure tenant branding (logo, colors, favicon), so that each partner has a distinct look. | P0 | 5 |
| US-028 | As a **platform admin**, I want to suspend or delete tenants, so that I can offboard non-paying or violating partners. | P0 | 5 |
| US-029 | As a **tenant admin**, I want a tenant dashboard with user counts and engagement metrics, so that I can monitor adoption. | P0 | 5 |
| US-030 | As a **platform admin**, I want cross-tenant analytics (MAU, revenue, AI spend), so that I can manage SaaS health. | P0 | 8 |
| US-031 | As a **platform admin**, I want AI token spend monitoring per tenant, so that I can enforce cost controls and billing. | P0 | 5 |
| US-032 | As a **content admin**, I want a CMS pipeline (draft → review → publish), so that curriculum content is quality-controlled. | P0 | 8 |
| US-033 | As a **platform admin**, I want an audit log viewer with filters, so that I can investigate security and compliance events. | P0 | 5 |
| US-034 | As a **tenant admin**, I want per-tenant feature flags, so that I can enable/disable modules per contract. | P0 | 5 |
| US-035 | As a **platform admin**, I want support ticket integration (Zendesk/Freshdesk), so that customer issues are tracked centrally. | P1 | 5 |
| US-036 | As a **tenant admin**, I want custom domain mapping for white-label, so that users access `learn.partner.com`. | P1 | 8 |
| US-037 | As a **platform admin**, I want bulk user import via CSV, so that school onboarding is efficient. | P0 | 5 |
| US-038 | As a **content admin**, I want content versioning and rollback, so that bad publishes can be reverted quickly. | P0 | 5 |
| US-039 | As a **platform admin**, I want tenant billing configuration (B2B contract terms), so that invoicing matches agreements. | P1 | 5 |
| US-040 | As a **support agent**, I want read-only access to user accounts within assigned tenants, so that I can resolve tickets without over-privilege. | P0 | 3 |

---

## 5. Epic: Student Portal Core

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-041 | As a **student**, I want a personalized dashboard with continue-learning widget, so that I can resume where I left off. | P0 | 5 |
| US-042 | As a **student**, I want to browse curriculum by board, class, subject, and chapter, so that I find relevant content quickly. | P0 | 5 |
| US-043 | As a **student**, I want to watch video lessons via Mux with progress tracking, so that my completion is recorded. | P0 | 8 |
| US-044 | As a **student**, I want interactive text lessons with embedded quizzes, so that I learn actively not passively. | P0 | 5 |
| US-045 | As a **student**, I want flashcard review sessions, so that I can reinforce key concepts. | P1 | 5 |
| US-046 | As a **student**, I want immediate quiz feedback after each question, so that I learn from mistakes instantly. | P0 | 3 |
| US-047 | As a **student**, I want a profile page with achievements and settings, so that I can personalize my experience. | P0 | 3 |
| US-048 | As a **student**, I want notification center for assignments and announcements, so that I don't miss important updates. | P0 | 5 |
| US-049 | As a **student**, I want UI language selection (English/Hindi/Marathi), so that I learn in my preferred language. | P0 | 5 |
| US-050 | As a **student**, I want dyslexia-friendly font option, so that reading is accessible for me. | P1 | 3 |
| US-051 | As a **student**, I want search across lessons and topics, so that I can find specific content fast. | P0 | 5 |
| US-052 | As a **student**, I want bookmark/favorite lessons, so that I can return to important material. | P1 | 3 |
| US-053 | As a **student**, I want lesson notes I can save, so that I can review my own summaries. | P1 | 3 |
| US-054 | As a **student**, I want responsive layout on tablet and mobile web, so that I can learn on any device. | P0 | 5 |
| US-055 | As a **student**, I want onboarding wizard after first login, so that I understand how to use EduAI. | P0 | 5 |

### US-041 Acceptance Criteria

- [ ] Dashboard shows last incomplete lesson with progress bar
- [ ] Streak counter and XP summary visible above fold
- [ ] Upcoming homework and mock tests listed in "Tasks" widget
- [ ] Dashboard loads in < 2s LCP on 4G connection
- [ ] Content personalized to student's board, class, and language preference

---

## 6. Epic: Smart Learning Hub

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-056 | As a **student**, I want a diagnostic assessment on first use, so that EduAI identifies my skill gaps. | P0 | 8 |
| US-057 | As a **student**, I want an adaptive learning path based on my diagnostic results, so that I focus on weak areas. | P0 | 8 |
| US-058 | As a **student**, I want content recommendations based on my progress, so that I discover relevant next lessons. | P0 | 5 |
| US-059 | As a **student**, I want spaced repetition reminders for topics I struggled with, so that I retain knowledge long-term. | P1 | 8 |
| US-060 | As a **student**, I want cross-module progress sync (lessons, quizzes, AI sessions), so that my profile reflects all activity. | P0 | 5 |
| US-061 | As a **teacher**, I want to see adaptive path assignments for my class, so that I can align classroom instruction. | P1 | 5 |
| US-062 | As a **student**, I want skill mastery visualization (topic heatmap), so that I understand my strengths and gaps. | P0 | 5 |
| US-063 | As a **system**, I want recommendation engine to respect subscription tier limits, so that freemium users see appropriate content. | P0 | 3 |
| US-064 | As a **student**, I want "Review due" queue from spaced repetition, so that I know what to revise today. | P1 | 5 |
| US-065 | As a **parent**, I want to see adaptive path progress on child dashboard, so that I understand learning focus areas. | P1 | 3 |

---

## 7. Epic: Classes 1–4 System (Pre-primary / Early Primary)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-066 | As a **Class 1–4 student**, I want large touch targets and playful UI, so that navigation is easy for young learners. | P0 | 8 |
| US-067 | As a **Class 1–4 student**, I want voice-guided activities, so that I can learn without reading everything. | P0 | 8 |
| US-068 | As a **Class 1–4 student**, I want phonics and letter recognition games, so that I build reading foundations. | P0 | 5 |
| US-069 | As a **Class 1–4 student**, I want basic numeracy interactive exercises, so that I learn counting and arithmetic playfully. | P0 | 5 |
| US-070 | As a **parent**, I want co-play mode for pre-primary activities, so that I can guide my young child. | P1 | 5 |
| US-071 | As a **Class 1–4 student**, I want animated rewards after completing activities, so that learning feels fun. | P0 | 3 |
| US-072 | As a **Class 1–4 student**, I want simplified navigation (max 3 levels deep), so that I don't get lost in the app. | P0 | 5 |
| US-073 | As a **teacher**, I want age-appropriate content filters for Class 1–4, so that I assign suitable material. | P0 | 3 |
| US-074 | As a **Class 1–4 student**, I want shape and color recognition activities, so that I develop early cognitive skills. | P0 | 3 |
| US-075 | As a **parent**, I want screen time auto-pause for young learners, so that sessions don't exceed safe limits. | P1 | 5 |

---

## 8. Epic: Classes 5–7 System (Middle Primary)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-076 | As a **Class 5–7 student**, I want gamified story-driven lesson introductions, so that subjects feel engaging. | P0 | 5 |
| US-077 | As a **Class 5–7 student**, I want subject module navigation with progress rings, so that I see completion at a glance. | P0 | 5 |
| US-078 | As a **Class 5–7 student**, I want group challenges with classmates, so that I learn collaboratively. | P1 | 8 |
| US-079 | As a **Class 5–7 student**, I want skill development hub access (coding basics, communication), so that I build life skills. | P1 | 5 |
| US-080 | As a **Class 5–7 student**, I want micro-certificates on module completion, so that I feel accomplished. | P1 | 3 |
| US-081 | As a **Class 5–7 student**, I want moderate information density UI, so that content is readable but not overwhelming. | P0 | 5 |
| US-082 | As a **teacher**, I want to assign group challenge activities to my class, so that students collaborate on learning goals. | P1 | 5 |
| US-083 | As a **Class 5–7 student**, I want Hindi UI with English subject content toggle, so that I learn bilingually. | P0 | 5 |
| US-084 | As a **Class 5–7 student**, I want chapter summaries generated after lessons, so that I can review key points. | P1 | 5 |
| US-085 | As a **Class 5–7 student**, I want interactive science simulations, so that I visualize concepts like photosynthesis. | P1 | 8 |

---

## 9. Epic: Classes 8–10 System (Secondary / Board Prep)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-086 | As a **Class 8–10 student**, I want exam-focused dashboard with board prep countdown, so that I stay on track for exams. | P0 | 5 |
| US-087 | As a **Class 8–10 student**, I want mobile-first responsive layout, so that I can study on my phone. | P0 | 5 |
| US-088 | As a **Class 8–10 student**, I want peer leaderboard for my class, so that I stay motivated through friendly competition. | P0 | 5 |
| US-089 | As a **Class 8–10 student**, I want previous year board question practice, so that I prepare with real exam patterns. | P0 | 8 |
| US-090 | As a **Class 8–10 student**, I want topic-wise weak area drill mode, so that I improve before mock tests. | P0 | 5 |
| US-091 | As a **Class 8–10 student**, I want dense information layout with quick navigation, so that I access content efficiently. | P0 | 3 |
| US-092 | As a **Class 8–10 student**, I want formula sheets and reference cards per subject, so that I have quick revision aids. | P1 | 5 |
| US-093 | As a **Class 8–10 student**, I want exam calendar synced to my board's schedule, so that I know key dates. | P0 | 3 |
| US-094 | As a **Class 8–10 student**, I want night mode for late study sessions, so that screen glare is reduced. | P1 | 2 |
| US-095 | As a **teacher**, I want board-specific analytics for Class 8–10 performance, so that I identify at-risk students before exams. | P0 | 5 |

---

## 10. Epic: AI Tutor & Homework

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-096 | As a **student**, I want to chat with an AI tutor about my current chapter, so that I get help when stuck on concepts. | P0 | 8 |
| US-097 | As a **student**, I want AI tutor responses in my selected UI language, so that I understand explanations clearly. | P0 | 5 |
| US-098 | As a **student**, I want AI tutor to use curriculum RAG (not generic answers), so that responses align with my board syllabus. | P0 | 8 |
| US-099 | As a **student**, I want streaming AI responses, so that I see answers appear in real time. | P0 | 5 |
| US-100 | As a **student**, I want homework assistant with step-by-step hints (not direct answers), so that I learn to solve problems myself. | P0 | 8 |
| US-101 | As a **student**, I want to submit homework as text or photo upload, so that I can hand in work digitally. | P0 | 5 |
| US-102 | As a **student**, I want homework submission status tracking, so that I know if my teacher has graded it. | P0 | 3 |
| US-103 | As a **system**, I want AI content safety filter on all outputs, so that inappropriate content never reaches students. | P0 | 5 |
| US-104 | As a **system**, I want daily AI query quota per subscription tier, so that costs are controlled. | P0 | 5 |
| US-105 | As a **student**, I want AI conversation history for 90 days, so that I can revisit past explanations. | P0 | 3 |
| US-106 | As a **system**, I want model tier routing (mini vs full) based on query complexity, so that AI COGS stay under 25% ARPU. | P0 | 8 |
| US-107 | As a **parent**, I want to disable AI tutor for my child, so that I control AI interaction. | P1 | 3 |
| US-108 | As a **student**, I want to ask "why" follow-up questions in AI chat, so that I deepen my understanding. | P0 | 3 |
| US-109 | As a **teacher**, I want to see AI tutor usage analytics for my class, so that I know who needs extra help. | P1 | 5 |
| US-110 | As a **student**, I want photo OCR for homework questions, so that I can ask AI about handwritten problems. | P1 | 8 |

### US-096 Acceptance Criteria

- [ ] Chat panel accessible from lesson view with chapter context pre-loaded
- [ ] RAG retrieval queries board-aligned content index before LLM call
- [ ] First token appears within 2s (p95)
- [ ] Conversation stored with tenant_id, student_id, chapter_id
- [ ] Content safety filter blocks harmful/inappropriate responses
- [ ] Freemium tier limited to 10 queries/day; Pro unlimited

---

## 11. Epic: AI Assessments (Mock Tests & QPG)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-111 | As a **student**, I want timed mock tests matching board exam pattern, so that I practice under exam conditions. | P0 | 8 |
| US-112 | As a **student**, I want instant auto-grading for MCQ and objective questions, so that I see results immediately. | P0 | 5 |
| US-113 | As a **student**, I want detailed mock test report with topic-wise breakdown, so that I know where to improve. | P0 | 5 |
| US-114 | As a **teacher**, I want AI Question Paper Generator with board pattern and difficulty mix, so that I create papers in minutes. | P0 | 8 |
| US-115 | As a **teacher**, I want to review and edit AI-generated papers before publishing, so that I maintain quality control. | P0 | 5 |
| US-116 | As a **teacher**, I want QPG filters for topic, difficulty, and question type, so that papers match my teaching plan. | P0 | 5 |
| US-117 | As a **student**, I want mock tests from curated question banks, so that I access verified high-quality questions. | P0 | 5 |
| US-118 | As a **student**, I want pause/resume for long mock tests, so that I can take breaks without losing progress. | P1 | 5 |
| US-119 | As a **teacher**, I want to assign mock tests to class with deadline, so that students prepare systematically. | P0 | 5 |
| US-120 | As a **system**, I want anti-cheating timer and tab-switch detection on mock tests, so that results are reliable. | P1 | 8 |

---

## 12. Epic: Study Planner & Brain Development

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-121 | As a **student**, I want AI-generated weekly study schedule, so that I plan revision before exams. | P1 | 8 |
| US-122 | As a **student**, I want study planner synced to exam dates and weak topics, so that my schedule is personalized. | P1 | 5 |
| US-123 | As a **student**, I want calendar view of planned study sessions, so that I see my week at a glance. | P1 | 5 |
| US-124 | As a **student**, I want to mark study tasks complete, so that my planner reflects actual progress. | P1 | 3 |
| US-125 | As a **student**, I want brain development cognitive games (memory, logic, patterns), so that I build thinking skills. | P0 | 8 |
| US-126 | As a **student**, I want age-appropriate difficulty scaling in brain games, so that challenges match my level. | P0 | 5 |
| US-127 | As a **parent**, I want brain development progress reports, so that I track cognitive growth. | P1 | 5 |
| US-128 | As a **student**, I want study planner push reminders, so that I don't miss planned sessions. | P1 | 3 |
| US-129 | As a **student**, I want study planner to adjust when I miss sessions, so that my plan stays realistic. | P1 | 5 |
| US-130 | As a **teacher**, I want to recommend brain games to struggling students, so that I support holistic development. | P1 | 3 |

---

## 13. Epic: Teacher Portal

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-131 | As a **teacher**, I want to view and manage my class roster, so that I know who is in each class. | P0 | 5 |
| US-132 | As a **teacher**, I want to create and assign homework to classes, so that students receive digital assignments. | P0 | 5 |
| US-133 | As a **teacher**, I want to grade submissions with rubric support, so that grading is consistent and efficient. | P0 | 8 |
| US-134 | As a **teacher**, I want class analytics (avg scores, completion rates), so that I identify struggling students. | P0 | 5 |
| US-135 | As a **teacher**, I want to assign content from the library to my class, so that students follow my curriculum plan. | P0 | 5 |
| US-136 | As a **teacher**, I want to send announcements to parents, so that I communicate important updates. | P1 | 5 |
| US-137 | As a **teacher**, I want individual student gap analysis, so that I can provide targeted intervention. | P0 | 5 |
| US-138 | As a **teacher**, I want to message parents directly, so that I discuss student progress privately. | P1 | 5 |
| US-139 | As a **teacher**, I want bulk grade export to CSV, so that I can integrate with school records. | P1 | 3 |
| US-140 | As a **teacher**, I want dashboard showing pending grading queue, so that I prioritize my workload. | P0 | 3 |
| US-141 | As a **teacher**, I want to schedule assignments with future publish dates, so that I plan ahead. | P1 | 3 |
| US-142 | As a **teacher**, I want to duplicate assignments across sections, so that I save time on repetitive work. | P1 | 3 |
| US-143 | As a **teacher**, I want attendance summary alongside academic analytics, so that I correlate presence with performance. | P1 | 5 |
| US-144 | As a **teacher**, I want Hindi UI for teacher portal, so that I work in my preferred language. | P0 | 5 |
| US-145 | As a **teacher**, I want onboarding guide for QPG and analytics, so that I adopt features quickly. | P1 | 3 |

---

## 14. Epic: Parent Portal

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-146 | As a **parent**, I want a multi-child dashboard showing all linked children, so that I monitor everyone in one place. | P0 | 5 |
| US-147 | As a **parent**, I want weekly AI-generated progress reports (email + in-app), so that I understand my child's learning without daily checking. | P1 | 8 |
| US-148 | As a **parent**, I want to manage subscription and payment methods, so that I control my family's EduAI plan. | P0 | 5 |
| US-149 | As a **parent**, I want to configure screen time limits per child, so that I manage healthy device usage. | P1 | 5 |
| US-150 | As a **parent**, I want DPDP consent management for each child, so that I control data processing preferences. | P0 | 5 |
| US-151 | As a **parent**, I want to message my child's teachers, so that I communicate about academic concerns. | P1 | 5 |
| US-152 | As a **parent**, I want to view homework completion status, so that I ensure my child stays on track. | P0 | 3 |
| US-153 | As a **parent**, I want to view mock test scores and trends, so that I gauge exam readiness. | P0 | 5 |
| US-154 | As a **parent**, I want family plan with single billing for multiple children, so that I pay one subscription. | P0 | 5 |
| US-155 | As a **parent**, I want notification preferences (email, push, SMS), so that I control how EduAI contacts me. | P0 | 3 |
| US-156 | As a **parent**, I want to download progress report PDF, so that I share with tutors or counselors. | P1 | 3 |
| US-157 | As a **parent**, I want to approve/reject child account features (AI tutor, leaderboard), so that I set boundaries. | P1 | 5 |
| US-158 | As a **parent**, I want Razorpay UPI autopay for subscription, so that payments are seamless. | P0 | 5 |
| US-159 | As a **parent**, I want 7-day free trial before billing, so that I evaluate EduAI risk-free. | P0 | 3 |
| US-160 | As a **parent**, I want in-app help and FAQ, so that I resolve common questions without support tickets. | P1 | 3 |

---

## 15. Epic: School ERP

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-161 | As a **school admin**, I want student enrollment record management, so that student data is centralized. | P0 | 8 |
| US-162 | As a **teacher**, I want to mark daily attendance for my class, so that records are digital and accurate. | P0 | 5 |
| US-163 | As a **school admin**, I want attendance reports by class and date range, so that I monitor absenteeism. | P0 | 5 |
| US-164 | As a **school admin**, I want fee structure configuration, so that billing rules match school policies. | P1 | 5 |
| US-165 | As a **parent**, I want to pay school fees via Razorpay through EduAI, so that I don't visit school for payments. | P1 | 8 |
| US-166 | As a **school admin**, I want timetable management, so that schedules are published digitally. | P1 | 8 |
| US-167 | As a **school admin**, I want school-wide announcements, so that all stakeholders receive important news. | P0 | 5 |
| US-168 | As a **school admin**, I want basic report card generation, so that term results are distributed digitally. | P1 | 8 |
| US-169 | As a **school admin**, I want bulk student import from existing SIS, so that migration is efficient. | P0 | 5 |
| US-170 | As a **teacher**, I want to view today's timetable on dashboard, so that I know my schedule. | P1 | 3 |

---

## 16. Epic: Gamification

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-171 | As a **student**, I want to earn XP for lessons, quizzes, and streaks, so that learning feels rewarding. | P0 | 5 |
| US-172 | As a **student**, I want badges for achievements and milestones, so that I collect recognition for progress. | P0 | 5 |
| US-173 | As a **student**, I want daily streak tracking with freeze token (1/month free), so that I stay motivated without harsh penalty. | P0 | 5 |
| US-174 | As a **student**, I want leaderboards scoped to my class/school, so that I compete with relevant peers. | P0 | 5 |
| US-175 | As a **school admin**, I want to opt out of public leaderboards, so that our school policy on competition is respected. | P0 | 3 |
| US-176 | As a **student**, I want seasonal/event badges, so that limited-time challenges add excitement. | P1 | 5 |
| US-177 | As a **student**, I want XP level progression with titles, so that long-term engagement is rewarded. | P0 | 3 |
| US-178 | As a **student**, I want streak reminder notifications, so that I don't accidentally break my streak. | P0 | 3 |
| US-179 | As a **tenant admin**, I want configurable XP values per action, so that gamification matches partner branding. | P1 | 5 |
| US-180 | As a **student**, I want gamification hub showing all badges and progress, so that I see my full achievement history. | P0 | 5 |

---

## 17. Epic: Mobile App

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-181 | As a **student**, I want React Native app with core learning flows, so that I study on my phone natively. | P0 | 13 |
| US-182 | As a **student**, I want AI tutor chat on mobile, so that I get help anywhere. | P0 | 8 |
| US-183 | As a **student**, I want mock tests on mobile with timed mode, so that I practice on the go. | P0 | 8 |
| US-184 | As a **student**, I want push notifications for assignments and streaks, so that I stay engaged. | P0 | 5 |
| US-185 | As a **student**, I want offline lesson download (Pro tier), so that I learn without internet. | P1 | 13 |
| US-186 | As a **user**, I want biometric login (Face ID / fingerprint), so that I access the app quickly and securely. | P1 | 5 |
| US-187 | As a **parent**, I want parent dashboard on mobile, so that I monitor children from my phone. | P0 | 8 |
| US-188 | As a **student**, I want deep links from notifications to specific lessons, so that I act on alerts immediately. | P0 | 3 |
| US-189 | As a **student**, I want camera upload for homework on mobile, so that I submit handwritten work easily. | P0 | 5 |
| US-190 | As a **user**, I want app available on iOS 15+ and Android 10+, so that my device is supported. | P0 | 3 |
| US-191 | As a **student**, I want background audio for lesson videos, so that I listen while multitasking. | P1 | 5 |
| US-192 | As a **student**, I want app size under 50MB initial download, so that it fits on low-storage devices. | P0 | 5 |
| US-193 | As a **parent**, I want push notifications for weekly reports and payment reminders, so that I stay informed. | P0 | 3 |
| US-194 | As a **student**, I want pull-to-refresh on dashboards, so that I see latest progress. | P0 | 2 |
| US-195 | As a **user**, I want app passcode lock option, so that siblings can't access my account. | P1 | 3 |

---

## 18. Epic: Billing & Subscription

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-196 | As a **parent**, I want Razorpay subscription with UPI/card/netbanking, so that I pay conveniently. | P0 | 8 |
| US-197 | As a **system**, I want feature access enforced by subscription tier, so that freemium limits are respected. | P0 | 5 |
| US-198 | As a **system**, I want Razorpay webhook handling (success, failure, cancel), so that billing state stays accurate. | P0 | 5 |
| US-199 | As a **school admin**, I want B2B invoicing for school contracts, so that enterprise billing is supported. | P1 | 5 |
| US-200 | As a **parent**, I want to upgrade/downgrade plan, so that I adjust as children grow. | P0 | 5 |

---

## 19. Epic: Polish & Launch

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| US-201 | As a **user**, I want WCAG 2.1 AA compliance across all portals, so that EduAI is accessible to all learners. | P0 | 8 |
| US-202 | As a **platform team**, I want penetration test remediation complete, so that GA launch is security-approved. | P0 | 8 |
| US-203 | As a **platform team**, I want 50K concurrent load test passed, so that infrastructure scales for launch traffic. | P0 | 8 |
| US-204 | As a **marketing team**, I want SEO-optimized marketing pages, so that organic discovery drives acquisition. | P0 | 5 |
| US-205 | As a **platform team**, I want App Store and Google Play submission approved, so that mobile users can download. | P0 | 5 |
| US-206 | As a **user**, I want in-app feedback widget, so that I can report bugs and suggest improvements. | P1 | 3 |
| US-207 | As a **support team**, I want status page for incident communication, so that users know about outages. | P0 | 3 |
| US-208 | As a **platform team**, I want runbooks for on-call engineers, so that incidents are resolved within SLA. | P0 | 5 |
| US-209 | As a **user**, I want performance meeting Core Web Vitals targets, so that the app feels fast. | P0 | 5 |
| US-210 | As a **legal team**, I want DPDP consent flows verified and documented, so that launch is compliance-approved. | P0 | 5 |

---

## 20. Backlog Summary

| Epic | Stories | Total Points | P0 Count |
|------|---------|--------------|----------|
| Foundation & DevOps | US-001 – US-010 | 49 | 10 |
| Auth & RBAC | US-011 – US-025 | 78 | 13 |
| Admin CRM & Tenant | US-026 – US-040 | 73 | 11 |
| Student Portal Core | US-041 – US-055 | 62 | 11 |
| Smart Learning Hub | US-056 – US-065 | 55 | 6 |
| Classes 1–4 | US-066 – US-075 | 50 | 7 |
| Classes 5–7 | US-076 – US-085 | 49 | 5 |
| Classes 8–10 | US-086 – US-095 | 41 | 7 |
| AI Tutor & Homework | US-096 – US-110 | 69 | 11 |
| AI Assessments | US-111 – US-120 | 59 | 8 |
| Study Planner & Brain Dev | US-121 – US-130 | 50 | 2 |
| Teacher Portal | US-131 – US-145 | 62 | 8 |
| Parent Portal | US-146 – US-160 | 62 | 8 |
| School ERP | US-161 – US-170 | 55 | 5 |
| Gamification | US-171 – US-180 | 42 | 7 |
| Mobile App | US-181 – US-195 | 81 | 11 |
| Billing & Subscription | US-196 – US-200 | 28 | 4 |
| Polish & Launch | US-201 – US-210 | 55 | 9 |
| **Total** | **210 stories** | **~970 points** | **143 P0** |

---

*Related: [Sprint Planning](./sprint-planning.md) · [User Flows](./user-flows.md) · [SRS](../srs/software-requirements-specification.md)*
