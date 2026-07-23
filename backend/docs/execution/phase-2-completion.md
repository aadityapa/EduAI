# Phase 2 completion note — Component library

**Date:** 2026-07-23  
**Status:** Complete — awaiting approval for Phase 3  
**ADR:** [`../architecture/adr/002-visual-regression-strategy.md`](../architecture/adr/002-visual-regression-strategy.md)

## Delivered

### Primitives (upgraded / added)

- **Button** — loading, active scale, focus-visible, reduced-motion
- **IconButton**, **Input** / **Textarea** (error + `aria-invalid`), **Select**, **Combobox**, **Checkbox**, **Radio**/`RadioGroup`, **Switch**, **Slider**
- **DatePicker** (single date via `react-day-picker` + Popover)
- **FileUploader** / **FileUpload** — loading, error, empty states
- **Form** helpers — `react-hook-form` + `zod` (`FormField`, `FormControl`, `FormMessage`, …)
- **Progress** (Radix) alongside existing **ProgressBar**
- **Chip** / **Tag**, **Spinner**, **Skeleton** (reduced-motion aware)

### Overlays / navigation

- Existing Dialog, Sheet, Tooltip, Toast (`sonner`), Tabs, Breadcrumb, Command retained and exported
- Added **Popover**, **Accordion**, **Pagination**, **Stepper**
- Dialog close control uses logical `end-*` for RTL

### Data / feedback

- **Table** + **DataTable** (sort / filter / paginate / CSV) — production foundation
- **Charts** (themed recharts) — existing `ChartContainer`
- **EmptyState**, **ErrorState**, Avatar, Badge

### Domain

- **LessonCard**, **BadgeShowcase**, **CoinCounter**, **AttendanceGrid**, **TimetableGrid**, **GradeBook**, **FeeInvoiceCard**
- **AiTutorChatBubble** + **AiTutorComposer** (pairs with existing `StitchTutorShell`)
- Aliases: **ProgressRing** (`MasteryRing`), **StreakFlame** (`StreakBadge`), **XpCounter** (`XpBadge`)
- Existing: CourseCard, QuizQuestion, LeaderboardRow, XP/Streak badges, Stitch widgets

### Tooling & docs

- Storybook stories: Button, Input, Controls, Form, OverlaysNav, DataFeedback, Domain (+ Foundations from Phase 1)
- Real **ESLint** flat config + **Vitest** smoke tests (replaced echo stubs)
- Export surface refreshed in `src/index.ts` (backward-compatible names kept)
- ADR 002: Playwright screenshots long-term; Storybook static build as Phase 2 baseline

## Deferred (intentional)

| Item | Follow-up |
|------|-----------|
| Virtualized **DataGrid** | Phase 4 admin dense tables |
| DatePicker range / multi-month polish | When ERP calendars need it |
| Chromatic / CI pixel diffs | Phase 10–11 per ADR 002 |
| App-level migration of one-off UI → kit | Phase 3–4 portal work (not breaking imports now) |
| NativeWind domain components | Phase 5 |

## Verify

```bash
pnpm --filter @eduai/ui typecheck
pnpm --filter @eduai/ui build
pnpm --filter @eduai/ui lint
pnpm --filter @eduai/ui test
pnpm --filter @eduai/ui build-storybook
pnpm --filter @eduai/web typecheck
pnpm --filter @eduai/admin typecheck
```

## Results (2026-07-23)

| Command | Result |
|---------|--------|
| `@eduai/ui` typecheck / build | Pass |
| `@eduai/ui` lint | Pass (1 TanStack Table compiler warning) |
| `@eduai/ui` test | Pass (3 smoke tests) |
| `@eduai/ui` build-storybook | Pass |
| `@eduai/web` / `@eduai/admin` typecheck | Pass |

**No commit / push** (not requested).
