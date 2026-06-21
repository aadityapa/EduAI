# EduAI Sprint 2 — Completion Report

**Sprint theme:** Student Learning Platform  
**Status:** Complete (local dev ready)

---

## What Was Built

### Database (`backend/database`)

**Migration:** `20250620120000_sprint2_learning` + sync migration

| Domain | Tables |
|--------|--------|
| Curriculum | `boards`, `subjects`, `chapters`, `courses`, `lessons`, `lesson_contents`, `content_resources` |
| Enrollment | `course_enrollments` |
| Progress | `lesson_progress` |
| Quizzes | `quizzes`, `questions`, `question_options`, `quiz_attempts` |
| Gamification | `user_xp`, `user_coins`, `badges`, `user_badges`, `user_streaks` |
| Parent | `parent_student_links` |
| i18n | `translations` |

**Seed:** CBSE Class 8 Math & Science, 4 lessons, Rational Numbers quiz (4 question types), gamification baseline, verified parent link.

### learning-service (NestJS, port 3003)

| Module | Endpoints |
|--------|-----------|
| Courses | Catalog, detail, lessons |
| Enrollments | Enroll, list mine |
| Progress | Read/update lesson progress |
| Hub | Filtered content tree |
| Quizzes | Take, submit, auto-evaluate |
| Gamification | XP/coins/badges/streak, leaderboard |
| Parent | Link child, learning reports |

### frontend/shared-ui/i18n

- English, Hindi, Marathi UI strings
- `createTranslator()`, `getTranslation()`
- 5 vitest tests passing

### frontend/shared-ui/ui (Sprint 2 components)

`ProgressBar`, `StatCard`, `StreakBadge`, `XpBadge`, `LanguageSwitcher`, `QuizQuestion`, `CourseCard`, `LeaderboardRow`

### apps/web (Student + Parent)

| Route | Feature |
|-------|---------|
| `/student/dashboard` | Live XP, streak, coins, enrollments |
| `/student/courses` | Catalog + filters |
| `/student/courses/[id]` | Enroll + lesson list |
| `/student/lessons/[id]` | Viewer + mark complete |
| `/student/hub` | Board/class/subject/chapter filters |
| `/student/quizzes/[id]` | All question types |
| `/student/gamification` | Badges + leaderboard |
| `/parent/dashboard` | Link child + children list |
| `/parent/children/[id]/report` | Learning report |

---

## How to Run

```bash
cd EduAI
cp .env.example .env   # ensure DATABASE_URL, JWT_SECRET, AUTH_SECRET
docker compose -f backend/infrastructure/docker/docker-compose.yml up -d
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

**Start services (separate terminals):**

```bash
pnpm --filter @eduai/identity-service dev    # :3001
pnpm --filter @eduai/learning-service dev    # :3003
pnpm --filter @eduai/web dev                 # :3000
```

**Demo login:** `student@demo.eduai.in` / `Demo1234!`

**Demo quiz:** `/student/quizzes/00000000-0000-4000-8000-000000000040`

---

## Tests & Build

```bash
pnpm build   # ✅ 17 packages
pnpm test    # ✅ 26 tests (12 learning-service, 5 i18n, 4 auth, 4 shared, 1 identity)
```

**Sprint 2 test coverage (critical paths):**

| Service | Tests | Focus |
|---------|-------|-------|
| learning-service | 12 | Quiz eval, gamification, progress |
| @eduai/i18n | 5 | Translator, fallbacks |

---

## Working vs Stubbed

| Feature | Status |
|---------|--------|
| Course catalog & enrollment | ✅ Working |
| Lesson progress + gamification awards | ✅ Working |
| Quiz engine (4 question types) | ✅ Working |
| Learning hub filters | ✅ Working |
| Parent-child link + reports | ✅ Working |
| i18n UI switcher (en/hi/mr) | ✅ Working |
| DB content translations | ✅ Seeded |
| Video CDN / Mux integration | 🔶 URL placeholders |
| Redis leaderboard | 🔶 Computed from DB |
| RLS enforcement | 🔶 Schema-ready |
| Teacher quiz builder | 🔶 Sprint 4 |
| Dedicated GET /lessons/:id API | 🔶 Web uses hub/progress fallback |

---

## Documentation

- `docs/implementation/repository-audit-report.md`
- `docs/implementation/gap-analysis-report.md`
- `docs/implementation/sprint-2-technical-design.md`
- `docs/implementation/architecture-review-pre-sprint-3.md`

---

*Sprint 2 complete. Sprint 3 AI platform follows.*
