# Sprint 2 — Student Learning Platform Technical Design

**Sprint theme:** Courses, Learning Hub, Quizzes, Gamification, i18n, Parent Portal  
**Service:** `learning-service` (NestJS, port 3003)  
**Status:** Implemented

---

## 1. Architecture Overview

```
apps/web (Next.js 15)
    │ Bearer JWT (from Auth.js session)
    ▼
services/learning-service (NestJS)
    │ Prisma + tenant filters
    ▼
packages/database (PostgreSQL)
```

Sprint 2 consolidates quiz, content, and progress into **learning-service** rather than separate quiz/content microservices (deferred split to Sprint 4+).

---

## 2. Database Schema (Sprint 2 Migration)

| Domain | Tables |
|--------|--------|
| Curriculum | `boards`, `subjects`, `chapters`, `courses`, `lessons`, `lesson_contents`, `content_resources` |
| Enrollment & Progress | `course_enrollments`, `lesson_progress` |
| Assessment | `quizzes`, `questions`, `question_options`, `quiz_attempts` |
| Gamification | `user_xp`, `user_coins`, `badges`, `user_badges`, `user_streaks` |
| Parent | `parent_student_links` |
| i18n | `translations` |

All tenant-scoped tables include `tenant_id`. Boards/subjects are shared curriculum catalog.

---

## 3. API Design (`/api/v1`)

### Courses
- `GET /courses?boardId&classLevel&subjectId` — catalog
- `GET /courses/:id` — course detail
- `GET /courses/:id/lessons` — chapters + lessons

### Enrollments
- `POST /courses/:id/enroll` — enroll current user
- `GET /enrollments/me` — user's enrollments

### Progress
- `GET /progress/me` — all lesson progress
- `PATCH /progress/lessons/:lessonId` — update status/time

### Hub
- `GET /hub?boardId&classLevel&subjectId&chapterId` — filtered content tree

### Quizzes
- `GET /quizzes/:id` — quiz with questions (options without isCorrect for students)
- `POST /quizzes/:id/attempts` — start attempt
- `POST /quizzes/attempts/:attemptId/submit` — submit + auto-grade

### Gamification
- `GET /gamification/me` — XP, coins, badges, streak
- `GET /gamification/leaderboard?limit=20` — tenant leaderboard
- Auto-award on lesson complete (+25 XP, +5 coins) and quiz pass (+50 XP, +10 coins)

### Parent
- `GET /parent/children` — linked students
- `POST /parent/link` — link by student email
- `GET /parent/children/:studentId/report` — progress summary

---

## 4. Quiz Evaluation Engine

`quiz-evaluation.service.ts` supports:

| Type | Evaluation |
|------|------------|
| `mcq` | Single option ID match |
| `multi_select` | Set equality of correct option IDs |
| `true_false` | Single option match |
| `fill_blank` | Case-insensitive match against `metadata.correctAnswers[]` |

Score = (earned marks / total marks) × 100. Passing threshold from quiz `passingScore` (default 70%).

---

## 5. RBAC Permissions

| Endpoint | Permission |
|----------|------------|
| Course catalog | `lessons:read:class` |
| Enroll | `lessons:complete:own` |
| Progress | `progress:read:own`, `lessons:complete:own` |
| Quiz take | `assessments:take:own` |
| Gamification | `gamification:read:own`, `leaderboard:read:class` |
| Parent | `users:link_parent:own`, `progress:read:linked` |

---

## 6. i18n Architecture

**Package:** `@eduai/i18n`

- Static UI strings in `messages/en.ts`, `hi.ts`, `mr.ts`
- `createTranslator(locale)` for client components
- `LanguageSwitcher` in `@eduai/ui`
- DB `translations` table for tenant-specific content overrides (course titles)

Locale stored in `localStorage` + user profile `locale` field (future sync).

---

## 7. Web App Routes

| Route | Purpose |
|-------|---------|
| `/student/dashboard` | Overview, stats, recommendations |
| `/student/courses` | Catalog + filters |
| `/student/courses/[id]` | Detail + enrollment |
| `/student/lessons/[id]` | Lesson viewer |
| `/student/hub` | Multi-filter learning hub |
| `/student/quizzes/[id]` | Quiz taking |
| `/student/gamification` | XP, badges, leaderboard |
| `/parent/dashboard` | Child linking |
| `/parent/children/[id]/report` | Learning report |

---

## 8. Seed Data

Demo tenant includes:
- CBSE board, Class 8 Math & Science courses
- 4 lessons with video/notes/worksheet resources
- Rational Numbers quiz (4 question types)
- Student pre-enrolled in Math, 150 XP, 3-day streak
- Verified parent-child link (Rajesh ↔ Arjun)
- Hindi/Marathi course title translations

---

## 9. Testing Strategy

| Layer | Coverage |
|-------|----------|
| `quiz-evaluation.service.spec.ts` | All question types, partial credit |
| `gamification.service.spec.ts` | XP level calc, streak logic, badge award |
| `progress.service.spec.ts` | Status transitions, completion triggers |
| `@eduai/i18n` | Translator lookup, fallbacks |

Target: >90% on Sprint 2 service logic (critical paths).

---

## 10. Deferred to Sprint 3+

- Redis leaderboard sorted sets
- RLS policy enforcement
- Content CDN / Mux video integration
- Offline lesson caching (mobile)
- Teacher quiz builder UI

---

*See `sprint-2-completion.md` for delivery status and run instructions.*
