# Phase 3 completion note — Web portal UI/UX overhaul

**Date:** 2026-07-23  
**Status:** Complete — awaiting approval for Phase 4  
**Scope:** Student → teacher → parent web surfaces on the design system (login + shell + primary journeys)

## Delivered

### Shared shell & feedback

- **DashboardShell** — role density (`portal-joyful` / `portal-dense` / `portal-calm`), RTL-safe logical props, `prefers-reduced-motion`, i18n nav for all three portals, prefetch on primary links
- **ApiError** → `@eduai/ui` **ErrorState** + **RetryRefreshButton** (route refresh recovery)
- **PortalError** boundaries under `student/`, `teacher/`, `parent/`
- **Portal skeletons** — student / teacher / parent dashboard + catalog loading UI
- Route `loading.tsx` for student dashboard/courses/hub/gamification, teacher dashboard, parent dashboard
- **ErrorState.action** prop added in `@eduai/ui` for RSC recovery controls
- Toasts on enroll + mark-lesson-complete (`toast` from `@eduai/ui`)

### Login

- Demo role tabs preserved (student / teacher / parent emails)
- Tabs from `@eduai/ui`, reduced-motion, i18n via `@eduai/i18n` (`login.*`)
- `next.config` `images.remotePatterns` for Stitch CDN hosts (Lighthouse / `next/image` readiness)

### Student (joyful)

- Dashboard — ErrorState + retry, EmptyState, Stitch widgets (existing)
- Courses — EmptyState + CourseCard grid
- Hub — LessonCard grid + EmptyState
- Gamification — BadgeShowcase, CoinCounter, EmptyState leaderboard
- AI Tutor — AiTutorChatBubble / Composer + EmptyState; reduced-motion scroll
- Lessons — focus mode toggle (`LessonFocusToggle`)

### Teacher (dense)

- Dashboard — tighter spacing, EmptyStates, Quiz Builder CTA, ApiError recovery
- Classes — EmptyState + denser roster cards
- Quiz Builder — PageMotion + Stitch wizard entry (unchanged builder logic)

### Parent (calm)

- Dashboard — EmptyState for unlinked children, softer cards/spacing, timeline retained
- Fees — FeeInvoiceCard + EmptyState

### i18n

- New keys: `shell.*`, `login.*`, `teacher.*`, `parent.nav` / fees / notifications (en / hi / mr)

## Deferred (intentional)

| Item | Follow-up |
|------|-----------|
| Full Lighthouse CI ≥ 95 on login / dashboard / lesson / tutor | Phase 8/10 — measure in CI; config + fonts/images primed; no CI report attached this phase |
| PWA shell (installable + offline lessons) | ADR defer → Phase 5/11 |
| Characterization tests (role → dashboard) | Phase 0 optional / Phase 10 |
| Every teacher/parent sub-route polish (attendance, assignments, reports, notifications, AI homework/planner deep polish) | Incremental; core journeys done |
| Full TanStack Query standardization across all fetches | Prefer later data-layer phase; RSC + existing APIs retained |
| Admin portal | **Phase 4** |
| Mobile | **Phase 5** |

## Verify

```bash
pnpm --filter @eduai/i18n build
pnpm --filter @eduai/ui build
pnpm --filter @eduai/web typecheck
pnpm --filter @eduai/web build
pnpm --filter @eduai/i18n test
```

## Results (2026-07-23)

| Command | Result |
|---------|--------|
| `@eduai/i18n` typecheck / build / test | Pass (5 tests) |
| `@eduai/ui` typecheck / build | Pass |
| `@eduai/web` typecheck | Pass |
| `@eduai/web` build | Pass (pre-existing jose/Edge Runtime warnings from next-auth) |

**No commit / push** (not requested).

**Phase 3 complete — awaiting approval for Phase 4.**
