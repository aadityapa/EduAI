# EduAI Phase 0 — Gap Report

**Date:** 2026-07-23  
**Role:** Principal Engineer + Head of Design  
**Scope:** Audit & baseline vs ₹100 Cr quality bar (`EduAI_Cursor_Master_Prompt.md`)  
**Status:** Complete — awaiting approval before Phase 1  
**Companion:** [`hundred-cr-roadmap.md`](./hundred-cr-roadmap.md)

---

## 1. Executive verdict

EduAI is a **credible multi-tenant MVP**: five NestJS services, three frontends, Prisma (62 models), Stitch-aligned UI scaffolding, auth secret helpers, Helmet, Stripe/Razorpay webhook stubs, and CI that runs lint → typecheck → test → build.

It is **not yet ₹100 Cr–grade**. The largest gaps are: no Storybook / incomplete design-system foundation, stubbed lint and missing coverage gates, thin E2E, no DPDP data model/flows, incomplete AI metering & billing lifecycle, observability configs without wired runtime instrumentation, and design-token drift (docs vs CSS vs mobile).

**Overall readiness (subjective):** ~45–55% of the target bar.

| Domain | Score (0–10) | Notes |
|--------|--------------|-------|
| Monorepo / architecture | 8 | pnpm + turbo, clear port map, thin Next clients |
| Design system | 4 | Tokens + Radix components exist; no Storybook; incomplete tokens/themes |
| Web portal UX | 6 | Real routes + `@eduai/ui` usage; not yet premium/Lighthouse-proven |
| Admin / CRM | 5 | Broad route surface; some mock remnants |
| Mobile | 4 | Expo screens + Stitch specs; parity incomplete |
| Backend APIs | 7 | 5 live services; scaffolds for notification/content/quiz/analytics |
| AI + Billing | 5 | Quotas/cost partial; mock AI; webhooks present, lifecycle incomplete |
| Security / DPDP | 4 | `SECURITY.md` + JWT guards; no consent models; RLS partial per prior audits |
| Testing | 3 | ~13 Jest specs in services; web/admin tests stubbed; Playwright smoke only |
| CI/CD / observability | 5 | CI gates exist; deploy scaffold; OTel/Prometheus configs not end-to-end proven |

---

## 2. Current-state inventory

### 2.1 Stack (confirmed)

| Layer | Location | Port | Status |
|-------|----------|------|--------|
| Web (student/teacher/parent) | `frontend/web` | 3000 | Live Next.js 15 + next-auth v5 |
| Admin CRM | `frontend/admin` | 3002 | Live Next.js 15 + next-auth v5 |
| Mobile | `frontend/mobile` | 8081 | Expo ~52 / RN 0.76 |
| Identity | `backend/services/identity-service` | 3001 | Live |
| Learning | `backend/services/learning-service` | 3003 | Live |
| AI | `backend/services/ai-service` | 3004 | Live (mock without API keys) |
| ERP | `backend/services/erp-service` | 3005 | Live |
| Billing | `backend/services/billing-service` | 3006 | Live |
| Scaffolds | `notification-service`, `content-service`, `quiz-service`, `analytics-service` | — | Echo scripts only |
| Shared UI | `frontend/shared-ui/{ui,i18n,analytics}` | — | `@eduai/ui`, `@eduai/i18n`, `@eduai/analytics` |
| Data | `backend/database` | Prisma | **62 models** |
| Infra | `backend/infrastructure/{docker,kubernetes,terraform,monitoring}` | — | Present |
| CI/CD | `.github/workflows/{ci,deploy}.yml` | — | Present |

### 2.2 Demo logins (must not regress)

| Portal | URL | Email | Password |
|--------|-----|-------|----------|
| Student / Teacher / Parent | http://localhost:3000 | `*@demo.eduai.in` | `Demo1234!` |
| Admin | http://localhost:3002 | `admin@demo.eduai.in` | `Demo1234!` |

Web login uses Student / Teacher / Parent tabs.

### 2.3 Route inventory (filesystem)

| App | Pages / screens | Notes |
|-----|-----------------|-------|
| `frontend/web` | 29 `page.tsx` | student / teacher / parent + login + dashboard redirect; catch-all `admin/[[...slug]]` |
| `frontend/admin` | 18 `page.tsx` | dashboard, users, tenants, schools, billing, leads, tickets, audit, branding, campaigns, content, coupons, subscriptions, security, analytics, AI analytics |
| `frontend/mobile` | ~16 route files under `app/` | student / teacher / parent groups + login |

### 2.4 Design / Stitch alignment

- Assets: `frontend/design/stitch/` (HTML exports, mobile DESIGN.md, `manifest.json`, Stitch project `17256885408366407754`, ~35 synced screens).
- Scripts: `pnpm stitch:sync|fetch|import|generate|consolidate|backfill`.
- Runtime consumption:
  - `@eduai/ui` exports Stitch widgets (`stitch-layout`, `stitch/widgets`, `tutor-shell`, `quiz-builder`, `mobile-nav`).
  - Mobile: `src/theme/tokens.ts`, `src/components/stitch.tsx` (per Stitch README).
- **Gap:** HTML/DESIGN specs ≠ fully implemented React parity; token values differ across `globals.css`, design-system docs (`ui-design-system-v2.md` still cites Inter/`#6D28D9`), and mobile Stitch tokens (`#005bbf` / `#8621d9`).

### 2.5 `@eduai/ui` component inventory (present)

Primitives / patterns: Button, Input, Label, Card, Avatar, Badge, Dialog, Sheet, DropdownMenu, Tabs, Table, DataTable, Command, Breadcrumb, Tooltip, Skeleton, Separator, ScrollArea, FileUploader, Chart (recharts), Toaster/sonner, KanbanBoard, ActivityFeed, LanguageSwitcher, TenantThemeProvider, EmptyState, ErrorState.

Domain-ish: CourseCard, QuizQuestion, ProgressBar/Card, MasteryRing, StatCard, KpiCard, StreakBadge, XpBadge, LeaderboardRow, Stitch* widgets.

**Missing vs master prompt (non-exhaustive):** Select, Combobox, Checkbox, Radio, Switch, Slider, DatePicker, Form (RHF+zod), Accordion, Pagination, Stepper, Spinner (as DS primitive), IconButton, Chip/Tag, virtualized DataGrid, AttendanceGrid, TimetableGrid, GradeBook, FeeInvoiceCard, ProgressRing/StreakFlame/BadgeShowcase as first-class DS, Storybook stories, a11y addon, visual regression.

### 2.6 Auth & secrets

- Shared: `resolveJwtSecret` / `resolveAuthSecret` in `backend/shared/shared/src/index.ts`.
- All five live services use `resolveJwtSecret` in JWT strategy + auth module.
- Web/admin Auth.js use `resolveAuthSecret`.
- Production: missing `JWT_SECRET` throws; `AUTH_SECRET` warns if short (does **not** hard-fail — trade-off to tighten in Phase 9).
- `.env.example` documents secrets; no hardcoded production secrets found in the audit pass.
- `SECURITY.md` exists with private disclosure to `security@karnex.in`.

### 2.7 TypeScript / lint / typecheck gates

| Gate | Root script | Reality |
|------|-------------|---------|
| `pnpm typecheck` | `turbo run typecheck` | Root `tsconfig` has `strict` + `noUncheckedIndexedAccess`; **no** `exactOptionalPropertyTypes`. Apps/services generally `strict: true`. |
| `pnpm lint` | `turbo run lint` | **Most backend packages** and shared-ui use `echo 'lint ok'` / `echo ok`. Web/admin use `next lint`. **No root `eslint.config.*` found.** |
| `pnpm test` | `turbo run test` | Services: Jest with sparse specs. Web/admin: `echo 'no tests yet'`. Mobile/i18n/shared: Vitest. Scaffolds: echo. |
| CI | `.github/workflows/ci.yml` | install → prisma generate/migrate → lint → typecheck → test → build. **No** coverage gate, secret scan, e2e, a11y, Storybook, or load test. |

### 2.8 Testing & performance budgets

- **Docs exist:** `backend/docs/testing/performance-targets.md` (p95 API, CWV, Lighthouse), `testing-strategy.md` (≥80% backend / ≥70% frontend coverage — **documented, not enforced**).
- **Jest:** `collectCoverageFrom` present; **no `coverageThreshold`** in service jest configs.
- **E2E:** `backend/testing/e2e/` — Playwright smoke (`ai-flows.spec.ts`: login heading + auth redirects). Not in CI.
- **Load:** `backend/testing/load/k6-*.js` + root `pnpm load:test`. Not a CI gate.
- **Characterization tests:** Not systematically present for demo login / RBAC / cross-tenant isolation.

### 2.9 Backend / data / AI / billing (high level)

- Prisma: 62 models including `TenantBranding`, `AiQuotaUsage`, `AuditLog`, billing/CRM entities. **No Consent / DPDP subject-request models.**
- Authz permission string `consent:manage:linked` exists in `@eduai/auth` permissions — ahead of schema/UI.
- Nest common bootstrap uses **Helmet**.
- AI: tutor/generators + cost/quota services with unit tests; mock when keys unset; **no** full intent→routing→semantic cache→upsell pipeline.
- Billing: Stripe signature verification; Razorpay webhook accepts in dev without secret (warn path).
- Observability: Prometheus scrape annotations, Grafana dashboard JSON, OTel collector config under `backend/infrastructure/monitoring/` — runtime SDK wiring / traceId in error envelopes not verified as complete.
- Queues (BullMQ): documented as target; not confirmed as production path for QPG/email/AI batches.

### 2.10 i18n

- `@eduai/i18n` has `en` / `hi` / `mr` message modules + Vitest.
- Coverage is partial (common/dashboard-style keys); master prompt requires **all UI strings** through i18n — large residual hardcoded-string risk in apps.

---

## 3. Gap matrix vs ₹100 Cr bar

| Quality bar item | Target | Current | Gap severity |
|------------------|--------|---------|--------------|
| Premium first-5-seconds UX | Award-level polish, motion, zero CLS | Solid MVP + Stitch assets; token/font drift | **High** |
| Design tokens → Storybook | Tokens + themes + Storybook CI | CSS vars + Tailwind config; **no Storybook** | **Critical** |
| Component completeness + a11y | Full primitive/domain set, WCAG 2.2 AA | Partial Radix set; no axe gate | **High** |
| Lighthouse ≥ 95 | Measured on key routes | Targets documented only | **High** |
| p95 API < 250 ms | k6 under load | Scripts exist; not gated | **High** |
| Strict TS everywhere | strict + noUnchecked + exactOptional; no `any` | Mostly strict; exactOptional off; lint stubs | **Medium** |
| Test pyramid ≥ 80% critical | Unit + integration + E2E + a11y | Sparse unit; smoke E2E; no coverage gate | **Critical** |
| DPDP 2023 | Consent, export/delete, residency | Permissions hint only; no Prisma consent | **Critical** |
| Tenant isolation | Automated negative tests + RLS | Prior docs cite partial RLS | **High** |
| AI metering | Route/cache/quota/cost dashboards | Partial quota/cost | **High** |
| Billing production | Idempotent webhooks, dunning, reconcile | Basic webhooks | **High** |
| Observability | OTel + Prometheus + Grafana + Sentry live | Config scaffolds | **High** |
| Zero-downtime CD | Staging→prod + rollback | Deploy workflow gated on AWS secrets | **Medium** |
| Security disclosure | SECURITY.md + scans | SECURITY.md yes; no secret/deps scan in CI | **Medium** |

---

## 4. Phase 0 activities completed

- [x] Read `README.md`, `ARCHITECTURE.md`, root/`frontend`/`backend` package scripts
- [x] Survey `backend/docs/**` (prior audits, design system docs, performance/testing strategy, ultimate roadmap)
- [x] Inventory `frontend/shared-ui/**` and Stitch assets
- [x] Confirm Prisma model count (62) and absence of Consent models
- [x] Confirm `resolveJwtSecret` / `resolveAuthSecret` usage pattern
- [x] Review `SECURITY.md`, `.env.example`, CI/CD workflows
- [x] Characterize demo logins, routes, Stitch alignment
- [x] Assess TS/lint/typecheck gate strength (stubs vs real)
- [x] Locate performance/coverage budgets (docs vs enforcement)
- [x] Produce this gap report + living roadmap Phases 0–12

### Explicitly deferred (by design)

- Full monorepo `pnpm build` / `pnpm test` / Lighthouse / k6 runs (prefer config/doc evidence for Phase 0)
- Enabling strict lint/coverage gates (Phase 0 *recommends*; implementation starts Phase 1+/6/10 per plan — do not change gates without approval)
- Characterization test suite authoring (checklist item for early Phase 6/10; lock before large refactors)

---

## 5. Recommended immediate priorities (post-approval)

1. **Phase 1** — Unify tokens (CSS + Tailwind preset + mobile mirror), themes (light/dark/high-contrast/white-label), Storybook scaffold.
2. **Parallel hardening track** — Replace lint echo stubs; add coverage thresholds; land demo-flow characterization tests before UI rewrite.
3. **Do not** rip Nest ports, Prisma models, or demo credentials during design work.

---

## 6. Trade-offs noted

| Topic | Choice | Rationale |
|-------|--------|-----------|
| Separate gap report + roadmap | Two files | Roadmap stays living checklists; gap report is dated baseline |
| Reuse vs rewrite design system | Upgrade `@eduai/ui` in place | Master prompt: upgrade in place; Stitch widgets already consumed |
| AUTH_SECRET warn vs throw | Tighten later (Phase 9) | Avoid breaking local/staging until secrets manager ready |
| Scaffold services | Leave as scaffolds until needed | Avoid expanding surface before hardening live five |

---

**Awaiting approval before Phase 1.**
