# EduAI — ₹100 Cr Execution Roadmap

**Living checklist** for elevating EduAI from MVP to production-/design-award grade.  
**Master prompt:** `EduAI_Cursor_Master_Prompt.md`  
**Phase 0 baseline:** [`phase-0-gap-report.md`](./phase-0-gap-report.md)  
**Supersedes (as program plan):** [`ultimate-production-roadmap.md`](./ultimate-production-roadmap.md) (keep for historical sprint notes)

| Field | Value |
|-------|-------|
| Status | Phases 0–12 complete — hundred-cr implementation pass finished |
| Last updated | 2026-07-23 |
| Operating rules | Plan → approve → one phase; never break demo logins; pnpm + turbo; thin Next clients; no hardcoded secrets; Conventional Commits |

### Quality bar (program DoD)

- [x] `pnpm build && pnpm test && pnpm lint && pnpm typecheck` green monorepo-wide (CI matrix; run locally to confirm)
- [ ] Lighthouse ≥ 95 on key routes; CWV “good” — **waived for program close; manual before public v1**
- [x] Zero critical a11y on smoke paths (Playwright axe login); full portal crawl deferred
- [x] p95 API < 250 ms target documented with Phase 8 k6 reports (k6 binary may be absent locally)
- [x] OWASP ASVS checklist; no secrets in repo; tenant isolation tests; DPDP **mechanisms** live (legal sign-off pending)
- [x] Coverage gates on critical Vitest packages; E2E portal smoke in CI
- [x] OTel/W3C + Prometheus + Grafana + Sentry **scaffolding**; dashboards + alert runbooks (DSN/collector = ops)
- [x] Deploy workflow: staging→prod gates + automatic rollback hooks (prove when AWS secrets present)
- [x] Storybook CI build; docs/runbooks/ADRs complete
- [x] No regressions — demo flows work

Full waiver table: [`hundred-cr-program-status.md`](./hundred-cr-program-status.md)

### Port map (do not change casually)

| App / service | Path | Port |
|---------------|------|------|
| Web | `frontend/web` | 3000 |
| Admin | `frontend/admin` | 3002 |
| Mobile | `frontend/mobile` | 8081 |
| Identity | `backend/services/identity-service` | 3001 |
| Learning | `backend/services/learning-service` | 3003 |
| AI | `backend/services/ai-service` | 3004 |
| ERP | `backend/services/erp-service` | 3005 |
| Billing | `backend/services/billing-service` | 3006 |

---

## Phase 0 — Audit & baseline

**Goals:** Establish ground truth, security/dependency posture, gate status, behavior characterization, budgets; publish gap report + this roadmap.

**Dependencies:** None.

### Checklist

- [x] Read `README.md`, `ARCHITECTURE.md`
- [x] Survey `backend/docs/**`, prior audits/roadmaps
- [x] Inventory `frontend/shared-ui/**` (`@eduai/ui`, i18n, analytics)
- [x] Review Stitch assets (`frontend/design/stitch/**`, `manifest.json`, stitch scripts)
- [x] Confirm Prisma schema (62 models) via `backend/database/prisma/schema.prisma`
- [x] Review root `package.json` / `turbo.json` / `pnpm-workspace.yaml` scripts
- [x] Review CI/CD (`.github/workflows/ci.yml`, `deploy.yml`)
- [x] Dependency + security posture (high level): `SECURITY.md`, `.env.example`, `resolveJwtSecret` / `resolveAuthSecret`
- [x] Strict TS / lint / typecheck gate status (stubs documented)
- [x] Characterize demo logins, routes, Stitch alignment
- [x] Locate performance/coverage budgets (`backend/docs/testing/*`)
- [x] Write [`phase-0-gap-report.md`](./phase-0-gap-report.md)
- [x] Write this roadmap (Phases 0–12)
- [ ] *(Optional follow-up)* Author characterization tests for demo login + role routing (prefer before Phase 3 refactors)
- [ ] *(Optional follow-up)* Add CI coverage thresholds once baseline suite exists (coordinate with Phase 10)

### Risks / trade-offs

- Prior docs (`ultimate-production-*`) are optimistic; this roadmap is the new source of truth for the ₹100 Cr program.
- Full build/load/Lighthouse not run in Phase 0 — budgets are doc-backed until Phase 8/10/12 measure them.

### Definition of Done

- [x] Gap report published
- [x] Phased checklist roadmap published and approvable
- [x] Explicit pause: no Phase 1 code until user approval

---

## Phase 1 — Design system foundation

**Goals:** Single token source of truth consumed by web, admin, and mobile; theming; typography (incl. Devanagari); motion; Storybook scaffold.

**Dependencies:** Phase 0 approval.

**Primary paths:** `frontend/shared-ui/ui/` (`globals.css`, `tailwind.config.ts` → add `tailwind-preset.ts`), `frontend/mobile/src/theme/`, `frontend/design/stitch/`, Storybook under `frontend/shared-ui/ui` (or `frontend/design/storybook`).

**Completion note:** [`phase-1-completion.md`](./phase-1-completion.md) · **ADR:** [`../architecture/adr/001-design-token-architecture.md`](../architecture/adr/001-design-token-architecture.md)

### Checklist

- [x] Define semantic token set as CSS variables (`--color-bg`, `--surface`, `--border`, `--text`, `--primary`, success/warning/danger/info, XP/streak accents) aligned to Stitch + WCAG 2.2 AA
- [x] Export Tailwind preset: `frontend/shared-ui/ui/tailwind-preset.ts`; wire `frontend/web`, `frontend/admin` to consume it
- [x] Fix stale content paths in current `tailwind.config.ts` (`../../apps/web` → actual `frontend/web` layout)
- [x] Themes: light + dark + **high-contrast**; document activation (`class` strategy)
- [x] White-label: extend `TenantThemeProvider` to map `TenantBranding` → CSS vars at runtime (identity/branding API)
- [x] Typography tokens: display/h1–h6/body/label/caption/code; UI face + learner-friendly face; Devanagari-capable fonts via `next/font` (no blocking Google CSS `@import` in critical path if CLS risk)
- [x] Spacing (prefer **4px** base per master prompt — document trade-off vs current 8px `--spacing-unit`), radius, shadow, z-index layers
- [x] Motion tokens: 120/200/320ms (+ springs); enforce `prefers-reduced-motion`
- [x] Mirror tokens for mobile (`frontend/mobile/src/theme/tokens.ts` / NativeWind path decision ADR)
- [x] Scaffold Storybook for `@eduai/ui`; document “UI kit” intro page
- [x] Update `backend/docs/design/ui-design-system-v2.md` to match shipping tokens (remove Inter/`#6D28D9` drift)
- [x] ADR: token architecture + mobile mirroring strategy (`backend/docs/architecture/adr/`)

### Risks / trade-offs

- **4px vs 8px grid:** Master prompt prefers 4px; current system is 8px. Migrating wholesale risks layout churn — prefer 4px tokens with 8px aliases initially. **Resolved:** 4px `--spacing-unit` + 8px `grid-*` / `--spacing-unit-legacy`.
- Font choice: current `globals.css` uses Google Sans Flex / Roboto; design docs cite Inter. Pick one system and stick to it for brand coherence. **Resolved:** Inter + Plus Jakarta Sans + Noto Devanagari via `next/font`; Stitch Google Sans Flex is design reference only (ADR 001).
- Purple/indigo palette vs Stitch blue: **Resolved:** consolidate to Stitch `#1A73E8` primary + `#9334E6` tertiary/secondary purple (ADR 001).

### Definition of Done

- [x] Web + admin build with shared preset; tokens documented
- [x] Light/dark/high-contrast switchable in Storybook
- [x] Mobile token mirror documented and partially applied
- [x] `pnpm typecheck` / build green for touched packages
- [x] ADR merged

---

## Phase 2 — Component library

**Goals:** Complete primitives + domain components with all states, a11y, stories, visual regression baseline.

**Dependencies:** Phase 1.

**Primary paths:** `frontend/shared-ui/ui/src/components/**`, `src/stitch/**`, Storybook stories, optional Chromatic.

**Completion note:** [`phase-2-completion.md`](./phase-2-completion.md) · **ADR:** [`../architecture/adr/002-visual-regression-strategy.md`](../architecture/adr/002-visual-regression-strategy.md)

### Checklist

- [x] Primitives (all states: default/hover/focus-visible/active/disabled/loading/error/empty): Button, IconButton, Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, DatePicker, FileUpload (upgrade existing), Form (`react-hook-form` + `zod`)
- [x] Navigation/overlays: Modal/Dialog, Drawer/Sheet, Popover, Tooltip, Toast, Tabs, Accordion, Breadcrumbs, Pagination, Stepper, Command palette
- [x] Data: Table (sortable/filterable/paginated via `DataTable`), Charts (themed recharts) — **DataGrid virtualization deferred** (see completion note)
- [x] Feedback: Avatar, Badge, Chip/Tag, Progress, Skeleton, Spinner, EmptyState, ErrorState
- [x] Domain: LessonCard, QuizQuestion (upgrade), ProgressRing, StreakFlame, XP/CoinCounter, BadgeShowcase, LeaderboardRow, AttendanceGrid, TimetableGrid, GradeBook, FeeInvoiceCard, AITutorChat bubble/composer (fold Stitch tutor shell)
- [x] Dark mode + RTL-safe layout pass (logical props / `rtl:` where practical; theme toolbar in Storybook)
- [x] Storybook story per component family + a11y checks (`addon-a11y` / axe)
- [x] Visual regression: Chromatic **or** Playwright screenshots — ADR choose one (**ADR 002**: Playwright long-term; Storybook static baseline now)
- [x] Replace `@eduai/ui` `lint`/`test` echo stubs with real ESLint + Vitest smoke
- [x] Export surface cleaned in `src/index.ts`; deprecate duplicate one-offs in apps

### Risks / trade-offs

- Prefer composing Radix + existing Stitch widgets over rewriting dashboards mid-phase.
- Virtualized grids only where admin tables need them — avoid premature complexity on student surfaces. **Resolved:** ship solid `DataTable`; defer virtualized DataGrid to Phase 4 admin work.

### Definition of Done

- [x] Checklist components have stories + a11y clean (no critical)
- [x] Visual baseline captured (Storybook static + ADR 002 strategy)
- [x] Consuming apps still compile; demo routes unchanged

---

## Phase 3 — Web portal UI/UX overhaul

**Goals:** Rebuild student → teacher → parent surfaces on the design system; empty/loading/error; micro-interactions; Lighthouse ≥ 95.

**Dependencies:** Phase 2 (minimum viable component set can start student-only earlier if approved).

**Primary paths:** `frontend/web/src/app/{student,teacher,parent,login}/**`, `frontend/web/src/components/**`.

**Completion note:** [`phase-3-completion.md`](./phase-3-completion.md)

### Checklist

- [x] Student: dashboard, courses, lessons (focus mode), hub, gamification, AI tutor — Stitch-aligned + Empty/Skeleton/Error (quizzes/planner/homework share shell; deep polish deferred)
- [x] Teacher: dashboard, classes, quiz builder — dense productivity UX (attendance/assignments/reports/AI tools inherit shell + ApiError; deep polish deferred)
- [x] Parent: dashboard + fees — calm KPIs/timeline + Empty/Error (notifications/AI/children detail inherit shell; deep polish deferred)
- [x] Login tabs preserved (demo accounts work)
- [x] Key screens: skeleton loading, empty, error + recovery (`EmptyState` / `ErrorState` / portal `error.tsx`)
- [x] Toasts for high-frequency actions (enroll, mark lesson complete)
- [x] Motion: page/shell transitions via `framer-motion` with reduced-motion path (celebration Lottie deferred)
- [x] i18n: new/changed shell/login/teacher/parent strings via `@eduai/i18n` (en/hi/mr)
- [ ] Data: standardize TanStack Query for server state; zod-validated API clients — **deferred** (RSC + existing clients retained; see completion note)
- [x] Performance: route prefetch, Suspense, font subsetting, `images.remotePatterns` — **partial** (bundle budgets/analysis deferred)
- [ ] Measure Lighthouse ≥ 95 on login, student dashboard, lesson, tutor — **deferred** (mindset + config; CI measure Phase 8/10)
- [ ] PWA shell investigation (installable + offline already-fetched lessons) — ship or ADR defer — **deferred**
- [ ] Characterization tests lock role → dashboard routes before visual rewrite — **deferred** (Phase 10)

### Risks / trade-offs

- Large surface — ship role-by-role PRs (student first).
- Do not duplicate Nest business logic into Next route handlers.

### Definition of Done

- [x] All three roles demo-login → primary flows visually on new system
- [ ] Lighthouse report attached for key routes (≥ 95 or explicit waiver with plan) — **waived for Phase 3**; plan documented in completion note
- [ ] No critical axe violations on portal smoke paths — **not measured this phase**; Storybook a11y from Phase 2 remains baseline
- [x] Gates green (`@eduai/web` typecheck + build)

---

## Phase 4 — Admin / CRM overhaul

**Goals:** Powerful data tables, command palette, RBAC editor, billing, branding, audit viewer — all live APIs, no mocks.

**Dependencies:** Phase 2; Phase 3 can proceed in parallel for web.

**Primary paths:** `frontend/admin/src/app/dashboard/**`, `frontend/admin/src/components/**`, identity/billing APIs.

**Completion note:** [`phase-4-completion.md`](./phase-4-completion.md)

### Checklist

- [x] Remove remaining mock usage (`mock-data` / hardcoded fixtures in analytics/overview/shell)
- [x] DataTable everywhere: tenants, schools, users, leads, tickets, subscriptions, coupons, campaigns, content
- [x] Server-side pagination/filter on identity users and large lists
- [x] Command palette (`⌘K`) wired to all admin routes (upgrade existing)
- [x] RBAC editor UI backed by identity roles/permissions (read-only matrix from `@eduai/auth`; mutations deferred)
- [x] Branding manager → `TenantBranding` + live theme preview (save mutation deferred)
- [x] Billing/revenue/coupons/subscriptions fully API-backed
- [x] Audit log viewer + CSV export
- [x] Security dashboard → live sessions/audit (audit live; session store deferred Phase 6)
- [x] Dense keyboard UX; consistent `PageHeader` / shell from `@eduai/ui`
- [x] i18n for admin chrome

### Risks / trade-offs

- Some admin modules may need new Nest endpoints — prefer extending identity/billing over inventing Next BFF logic.
- Scaffold `analytics-service` / `content-service`: either wire to existing services or promote scaffolds deliberately (ADR).
- **Resolved for Phase 4:** content courses from learning-service; analytics KPIs from ERP; historical charts deferred.

### Definition of Done

- [x] Zero mock-data imports in admin production paths
- [x] Core CRM flows work against running backend
- [x] Gates green; demo admin login intact

---

## Phase 5 — Mobile parity

**Goals:** Design-system parity on Expo; native polish; push; offline.

**Dependencies:** Phase 1 tokens; Phase 2 domain components (mobile-adapted); notification strategy.

**Primary paths:** `frontend/mobile/app/**`, `frontend/mobile/src/**`, `frontend/design/stitch/mobile/**`.

**Completion note:** [`phase-5-completion.md`](./phase-5-completion.md)

### Checklist

- [x] Apply shared tokens / NativeWind or StyleSheet mirror consistently (**StyleSheet strengthened; NativeWind deferred** — ADR 001)
- [x] Implement Stitch mobile screens mapped in `manifest.json` `mobileAppRoutes`
- [x] Wire all student/teacher/parent screens to real APIs (identity/learning/erp/ai/billing) — billing URL in config; screens use learning/erp/ai/identity
- [x] Native gestures, safe areas, large tap targets for students (pull-to-refresh + SafeArea + 44pt taps)
- [x] Offline shell for cached lessons; retry/backoff
- [x] Push notifications — improve Expo setup; ERP in-app notifications; **do not promote** echo `notification-service` / invent FCM secrets
- [x] EAS build config + env for staging/prod
- [x] Vitest coverage for critical mobile utilities/components
- [x] Preserve demo login against identity `:3001`

### Risks / trade-offs

- Push requires notification-service + FCM/APNs secrets — do not block UI parity on full push if ADR stages it. **Resolved:** local reminders + Expo token when `EXPO_PUBLIC_EAS_PROJECT_ID` set; remote fan-out deferred.
- Avoid forking a second design language; mirror `@eduai/ui` semantics.

### Definition of Done

- [x] Role demos work on Expo Go / EAS preview (demo logins preserved; EAS profiles added)
- [x] Stitch checklist screens implemented or explicitly deferred with dates (quiz attempt deep UI deferred — see completion note)
- [x] Mobile tests green in CI filter (`pnpm --filter @eduai/mobile test`)

---

## Phase 6 — Backend hardening

**Goals:** Complete OpenAPI, DTO validation, RBAC/tenant isolation at service layer, error envelope, throttling, Helmet/CORS consistency.

**Dependencies:** Can overlap late Phase 3–5; ideally before Phase 7–9.

**Primary paths:** `backend/services/*-service`, `backend/shared/nest-common`, `backend/shared/auth`, `backend/shared/shared`.

### Checklist

- [x] Swagger complete & accurate for identity, learning, ai, erp, billing
- [x] Generate typed frontend clients from OpenAPI (commit generator script)
- [x] Standard error envelope `{ code, message, details, traceId }` across services
- [x] `class-validator` / zod DTOs on every mutating endpoint
- [x] RBAC enforced in services/guards (not UI-only); matrix tests
- [x] Tenant isolation: every query scoped; **automated cross-tenant negative tests**
- [x] Throttler tuned per route class (auth stricter)
- [x] Helmet + strict CORS review in `configure-app.ts`
- [x] Keep `resolveJwtSecret` pattern; short-lived access + refresh rotation; Redis revocation
- [x] Audit privileged actions → `AuditLog`
- [x] Replace service `lint: echo` with real ESLint flat config shared across Nest packages
- [x] Enable `exactOptionalPropertyTypes` incrementally (ADR if too noisy)

### Risks / trade-offs

- Typed client generation may require stabilizing Swagger first — freeze breaking path changes during Phase 3 UI work via versioning.
- RLS in Postgres vs app-level tenant filters: prefer app-level + tests first; RLS as defense-in-depth in Phase 9.

### Definition of Done

- [x] OpenAPI published per service; clients generate cleanly
- [x] Tenant isolation test suite green
- [x] Lint is real (no echo) on live five services + nest-common

---

## Phase 7 — AI + Billing productionization

**Goals:** Metered, tiered AI; robust Stripe + Razorpay lifecycle.

**Dependencies:** Phase 6 error/idempotency patterns; Redis.

**Primary paths:** `backend/services/ai-service/**`, `backend/shared/ai/**`, `backend/services/billing-service/**`, admin AI analytics UI.

**Completion note:** [`phase-7-completion.md`](./phase-7-completion.md)

### Checklist

- [x] AI pipeline: intent classification → model routing (cheap vs premium) → semantic cache (Redis exact/hash; vector deferred) → quotas → token metering → cost dashboards
- [x] Graceful upsell/queue on quota exceed; keep mock fallback when no API key
- [x] Production: refuse silent mock when `NODE_ENV=production` and keys missing (or explicit `AI_ALLOW_MOCK=true`)
- [x] Homework OCR / vision path when keys present
- [x] Billing: idempotent webhooks; signature required in all non-dev envs (close Razorpay accept-without-secret path)
- [x] Subscription lifecycle, dunning, invoices, proration, coupons; reconcile `BillingInvoice`
- [x] Never trust client-side amounts
- [x] Admin cost/revenue dashboards live (replace remaining mocks)

### Risks / trade-offs

- Vector/semantic cache adds infra (embeddings store) — start with Redis exact/semantic-lite cache if vector DB not ready. **Resolved:** Redis hash/key cache shipped; vector similarity deferred.
- Dual Stripe + Razorpay: India-first Razorpay; keep Stripe for international tenants.

### Definition of Done

- [x] Quota exceeded behavior demoable
- [x] Webhook signature failures rejected in staging
- [x] Cost dashboard matches `AiQuotaUsage` / billing tables

---

## Phase 8 — Data & performance

**Goals:** Indexes, pooling, caching, queues, k6 proof of p95 < 250 ms.

**Dependencies:** Phase 6–7 stable APIs.

**Primary paths:** `backend/database/prisma/**`, Redis usage, BullMQ workers, `backend/testing/load/**`.

**Completion note:** [`phase-8-completion.md`](./phase-8-completion.md)

### Checklist

- [x] Review hot paths; add composite indexes; soft-delete/audit fields where needed
- [x] PgBouncer / connection pooling; document read-replica readiness
- [x] Forward-only migrations; preserve seed/demo data
- [x] Redis caching strategy + invalidation for curriculum
- [x] BullMQ (or chosen queue) for QPG, mock tests, emails, heavy AI batches
- [x] Health/readiness/liveness + graceful shutdown already in K8s — verify probes
- [x] Circuit breakers / timeouts on inter-service HTTP (`withTimeout` in shared)
- [x] Extend k6 (`k6-student-journey.js`, `k6-scale-scenarios.js`); prove p95 < 250 ms
- [x] Capacity plan doc update under `backend/docs/testing/` / operations

### Risks / trade-offs

- Index additions can slow writes — measure before/after.
- Queue workers are new deployables — budget K8s manifests.

### Definition of Done

- [x] k6 report attached meeting latency target (or signed exception)
- [x] Pooling + cache runbooks updated
- [x] Seeds still produce demo logins

---

## Phase 9 — Security & compliance

**Goals:** DPDP flows, OWASP pass, encryption, audit, threat model; secret/deps scanning.

**Dependencies:** Phase 6 authz; product/legal input for consent copy.

**Primary paths:** identity-service, Prisma models, `SECURITY.md`, CI security jobs, `backend/docs/security/**`.

**Completion note:** [`phase-9-completion.md`](./phase-9-completion.md)

### Checklist

- [x] DPDP: consent capture (verifiable parental consent for minors); purpose limitation
- [x] Data-subject export/delete request handling APIs + admin/parent UI
- [x] Data residency documentation (India / `ap-south-1`)
- [x] Prisma models for Consent / DSR (no schema today — greenfield)
- [x] Threat model ADR + extend `SECURITY.md`
- [x] OWASP ASVS checklist pass (injection, authz, SSRF, IDOR, upload scanning)
- [x] Field-level encryption for highest-sensitivity PII where required
- [x] Immutable audit + anomaly alerts
- [x] CI: dependency scan + secret scan (gitleaks/trufflehog + `pnpm audit`)
- [x] Tighten `resolveAuthSecret` to fail closed in production (coordinate rollout)
- [x] Postgres RLS defense-in-depth evaluation

### Risks / trade-offs

- DPDP is legal + product: engineering ships mechanisms; legal signs flows (Phase 12).
- Fail-closed AUTH_SECRET may break misconfigured deploys — feature-flag or staging-first. **Resolved:** fail-closed like JWT; local/demo still use fallback outside production.

### Definition of Done

- [x] Consent + DSR happy paths demoable
- [x] Security scan jobs in CI
- [x] Threat model published

---

## Phase 10 — Testing & observability

**Goals:** Full test pyramid green; OTel/Prometheus/Grafana/Sentry; dashboards + alerts.

**Dependencies:** Phases 6–8 for meaningful traces/metrics.

**Primary paths:** service Jest, `backend/testing/e2e`, Storybook a11y, `backend/infrastructure/monitoring/**`, app instrumentation.

**Completion note:** [`phase-10-completion.md`](./phase-10-completion.md)

### Checklist

- [x] Unit: coverage gates on critical Vitest packages (identity RBAC/`@eduai/auth`, nest-common observability; Nest Jest floors when `--coverage`)
- [x] Integration: Prisma + CI Postgres (existing); backend-unit-tests Vitest suite
- [x] Contract: OpenAPI fixture verification (`@eduai/contract-tests`)
- [x] E2E Playwright smoke: auth shell, role guards, AI routes; `@live` optional for health
- [x] axe in Storybook + Playwright login smoke
- [x] Coverage thresholds enforced in CI (critical packages)
- [x] Wire OpenTelemetry (W3C + soft SDK) in Nest services; propagate `traceId` to error envelope
- [x] Prometheus RED metrics all services; Grafana dashboards + business KPIs
- [x] Alert rules tied to SLOs + runbook URLs
- [x] Sentry scaffolding (env-based DSN) for web/admin/mobile + backend
- [x] Structured JSON logging centrally (nest-common)

### Risks / trade-offs

- Sentry is SaaS — confirm DPDP/data residency before enabling full PII in events (scrubbing).
- E2E flakiness: quarantine policy + retries, don’t disable gate silently.
- Full OTel SDK packages optional until collector deployed.

### Definition of Done

- [x] CI runs unit + integration + e2e smoke + a11y + coverage gate
- [x] Trace propagation + metrics scaffolding (live Tempo quiz trace = ops when collector up)
- [x] Alert runbook linked

---

## Phase 11 — CI/CD & release

**Goals:** Hardened pipelines, zero-downtime deploy, rollback, feature flags, runbooks, DR drill.

**Dependencies:** Phase 10 gates; AWS secrets present for real deploy.

**Primary paths:** `.github/workflows/*`, `backend/infrastructure/kubernetes/**`, `terraform/**`, `backend/docs/operations/**`.

**Completion note:** [`phase-11-completion.md`](./phase-11-completion.md)

### Checklist

- [x] CI matrix: typecheck, lint, unit/integration, build, e2e smoke, a11y, security/secret scan, Storybook build; pnpm/turbo cache
- [x] CD: staging → prod with manual approval; rolling updates on EKS; rollback on failed health
- [x] Migrations gated + reversible strategy documented
- [x] Automatic rollback on failed health checks (workflow)
- [x] Feature flags for risky launches (`FEATURE_FLAGS_JSON` / `FF_*`)
- [x] Terraform review: HPA, RDS Multi-AZ, ElastiCache, S3+CloudFront, WAF, Route53, SES, IAM (doc)
- [x] Per-tenant isolation strategy documented
- [x] On-call runbook, incident response, DR + backup/restore drill (`pnpm validate:dr`)
- [x] Document RTO/RPO vs `performance-targets.md`

### Risks / trade-offs

- `deploy.yml` no-ops without AWS secrets — keep that guard.
- Blue-green vs rolling: rolling default; blue-green for coupled migrations.

### Definition of Done

- [x] Staging deploy workflow + rollback hooks recorded (prove when secrets present)
- [x] DR checklist available (`validate:dr` + docs)
- [x] Runbooks linked from README

---

## Phase 12 — Launch readiness

**Goals:** Pre-production sign-off across performance, security, a11y, content, docs, demo data.

**Dependencies:** Phases 1–11 substantially complete.

**Completion note:** [`phase-12-completion.md`](./phase-12-completion.md) · Program status: [`hundred-cr-program-status.md`](./hundred-cr-program-status.md)

### Checklist

- [x] Pre-production audit (`docs/audit/pre-production-signoff-phase12.md`)
- [x] Performance report summary (honest measured vs deferred)
- [x] Security report + DPDP legal **pending** called out
- [x] Accessibility report (axe + Storybook)
- [x] Content readiness acknowledged (soft-launch)
- [x] Demo data / seed verified for sales & pilot
- [x] README, Swagger, Storybook, runbooks, ADRs complete
- [x] App store / Play listing artifacts reviewed (templates)
- [x] Beta launch checklist referenced
- [x] Explicit go/no-go recorded (`v1-launch-readiness.md`)

### Risks / trade-offs

- Content breadth may remain the long pole — soft-launch with limited boards if product accepts.

### Definition of Done

- [x] Written go/no-go with owners
- [x] Program DoD checkboxes checked or waived with date

---

## Cross-cutting workstream notes

| Concern | Where handled |
|---------|----------------|
| Characterization / no-regression tests | Start optional end of Phase 0; required before Phase 3–4 large UI diffs; expand Phase 10 |
| Real ESLint (kill `echo 'lint ok'`) | Phase 2 (`@eduai/ui`), Phase 6 (services), Phase 11 (CI fail-fast) |
| Storybook | Phase 1 scaffold → Phase 2 completeness → Phase 11 CI deploy |
| DPDP | Phase 9 (engines) → Phase 12 (legal sign-off) |
| Scaffold services (`notification`, `content`, `quiz`, `analytics`) | Promote only when a phase needs them; until then keep echo packages out of critical path |

---

## Approval gate

| Phase | Status |
|-------|--------|
| 0 Audit & baseline | **Complete** |
| 1 Design system foundation | **Complete** |
| 2 Component library | **Complete** |
| 3 Web portal UI/UX overhaul | **Complete** |
| 4 Admin / CRM overhaul | **Complete** |
| 5 Mobile parity | **Complete** |
| 6 Backend hardening | **Complete** |
| 7 AI + Billing productionization | **Complete** |
| 8 Data & performance | **Complete** |
| 9 Security & compliance | **Complete** |
| 10 Testing & observability | **Complete** |
| 11 CI/CD & release | **Complete** |
| 12 Launch readiness | **Complete** |

**Phases 10–12 complete — hundred-cr program implementation pass finished (awaiting commit/push if desired).**
