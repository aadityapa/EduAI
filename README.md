# EduAI Platform

Multi-tenant AI education SaaS for schools, teachers, students, and parents — combining **personalized AI tutoring**, **board-aligned learning**, **school ERP**, and **multi-portal access** in one product.

Frontend apps and backend APIs are **separate processes on distinct ports**. Frontends call NestJS services over HTTP via `NEXT_PUBLIC_*_SERVICE_URL` — business logic lives in the services, not in Next.js route handlers.

| | |
|---|---|
| **Monorepo** | pnpm workspaces + Turborepo |
| **Node** | >= 20 |
| **Package manager** | pnpm 9.15+ |
| **Default branch** | `main` |

---

## Why EduAI — advantages of this project

Most ed-tech tools do **one** thing well (content, engagement, or school ERP). EduAI is built as a **unified platform** so schools and families do not need a patchwork of apps.

### One platform for every stakeholder

| Stakeholder | Advantage |
|-------------|-----------|
| **Students** | Adaptive learning path, AI tutor, quizzes, gamification, and progress in one place — not a one-size-fits-all PDF dump |
| **Parents** | Clear visibility into progress, homework, fees, and school activity without chasing multiple portals |
| **Teachers** | Less manual work — attendance, quizzes, question generation, class tools, and analytics in a single workspace |
| **Schools** | Learning + ERP + communication-style workflows under one tenant, with admin CRM and branding |
| **Operators** | Multi-tenant SaaS with billing hooks, usage-aware AI, and ops-ready health/runbook docs |

### Product advantages

- **AI that helps learning, not just chat** — tutor chat, homework assistance, study planner, and content generators (question papers / mock tests) behind a dedicated AI service
- **Full learning loop** — courses → lessons → quizzes → progress → gamification → hub, not a disconnected content library
- **School operations included** — classes, attendance, timetable, fees, exams, and teacher dashboards (ERP service), so institutions are not forced into a second vendor
- **True multi-portal UX** — Student / Teacher / Parent on web, Admin CRM, plus Expo mobile — same product family, role-appropriate experiences
- **India-ready positioning** — aimed at K–10 / board-aligned use cases, multilingual i18n foundation (e.g. English, Hindi, Marathi), and billing paths that support regional payment providers (Stripe + Razorpay hooks)
- **White-label / multi-tenant SaaS** — tenants, RBAC, branding APIs, and admin CRM for B2B school sales and platform operations
- **Cost-aware AI** — optional live providers (OpenAI / Gemini) with local mock fallback; metering and rate controls so AI spend can be governed as you scale

### Technical & delivery advantages

- **Clean separation of concerns** — UI apps stay thin; NestJS microservices own auth, learning, AI, ERP, and billing — easier to scale, test, and deploy independently
- **Monorepo velocity** — pnpm + Turborepo shared packages (`@eduai/ui`, auth, database, nest-common) so web, admin, and mobile stay consistent
- **Production-minded foundation** — Prisma + PostgreSQL, Redis, Docker Compose for local, Kubernetes / Terraform / monitoring assets under `backend/infrastructure/`
- **Security & privacy built in early** — JWT/RBAC, fail-closed secrets in production, throttling, optional field encryption, consent/DSR scaffolding, audit-oriented design aligned with DPDP-style expectations
- **Observable & operable** — health endpoints, OpenAPI docs, contract/e2e smoke tests, DR checklists, and ops runbooks — not a demo-only prototype
- **Design system continuity** — shared UI primitives + Stitch-aligned screens so product and engineering share one visual language

### Business advantages

- **Lower tool fragmentation** for schools (LMS + ERP + parent app + AI tutor in one stack)
- **Multiple revenue paths** — B2C subscriptions, B2B school licensing, and white-label style tenancy with plans/invoices in billing-service
- **Faster go-to-market for teams** — seeded local demo tenant, clear port map, LAN scripts, and documented MVP → launch path
- **Defensible architecture** — multi-tenant isolation + RBAC + service boundaries support enterprise school deals better than a single-app MVP

### Who benefits most

1. **Schools & chains** that want AI learning without abandoning attendance, fees, and teacher ops  
2. **Ed-tech product teams** that need a real multi-service reference architecture, not a tutorial monolith  
3. **Parents & students** who want guided practice and visibility, not another content dump  
4. **Teachers** who need time back on grading, papers, and classroom admin  

---

## Features

- **Identity** — auth, tenants, users, RBAC / JWT
- **Learning** — courses, lessons, quizzes, progress, gamification
- **AI** — tutor chat, homework help, planner, content generators (OpenAI / Gemini optional; mock in local dev)
- **ERP** — classes, attendance, timetable, fees, exams, teacher tools
- **Billing** — plans, subscriptions, invoices, Stripe / Razorpay hooks
- **Admin CRM** — leads, support, branding, analytics
- **Mobile** — Expo / React Native app for student, teacher, and parent flows

---

## Port map

| Layer | App / service | Port | Local URL |
|-------|---------------|------|-----------|
| Frontend | Web (Student / Teacher / Parent) | **3000** | http://localhost:3000 |
| Frontend | Admin CRM | **3002** | http://localhost:3002 |
| Frontend | Mobile (Expo Metro) | **8081** | Expo Go / simulator |
| Backend | Identity API | **3001** | http://localhost:3001 |
| Backend | Learning API | **3003** | http://localhost:3003 |
| Backend | AI API | **3004** | http://localhost:3004 |
| Backend | ERP API | **3005** | http://localhost:3005 |
| Backend | Billing API | **3006** | http://localhost:3006 |
| Infra | PostgreSQL | **5433** | Docker (host) |
| Infra | Redis | **6379** | Docker |

API health: `GET /api/v1/health` on each service. OpenAPI (where enabled): `/api/docs`.

Full allocation: [`backend/docs/architecture/port-allocation.md`](backend/docs/architecture/port-allocation.md)

---

## Prerequisites

- Node.js 20+
- pnpm 9.15+
- Docker Desktop (PostgreSQL + Redis via Compose)
- Optional: Expo Go for mobile, OpenAI / Gemini keys for live AI (otherwise mock)

---

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm mvp:setup          # Docker Postgres/Redis + Prisma generate/migrate/seed
```

### Option A — start separately (recommended)

```bash
pnpm dev:backend        # APIs :3001, :3003–3006
pnpm dev:frontend       # Web :3000 + Admin :3002
pnpm dev:mobile         # Metro :8081
```

### Option B — backend + web/admin together

```bash
pnpm mvp:dev
```

### LAN / network host (same Wi‑Fi)

```bash
pnpm dev:lan            # writes .env.local with your LAN IP; binds UIs to 0.0.0.0
pnpm dev:mobile:lan     # Expo LAN + API host
```

**Never commit** `.env`, `.env.local`, API keys, or database dumps. Use `.env.example` as the template only.

---

## Local demo access

After `pnpm db:seed`, a local **demo** tenant is created for development only.

- Prefer the **role tabs** on the web login page (Student / Teacher / Parent).
- Admin portal: http://localhost:3002
- Demo passwords and emails are defined only in the seed script for local use — **do not publish them, reuse them in production, or commit real user credentials**.

Rotate any secrets before deploying. Production must set strong unique `JWT_SECRET`, `AUTH_SECRET`, `INTERNAL_API_KEY`, and provider keys.

---

## Repository layout

```
frontend/
  web/           Student, Teacher, Parent (Next.js)
  admin/         Platform admin & CRM (Next.js)
  mobile/        Expo / React Native
  shared-ui/     @eduai/ui, i18n, analytics
  design/stitch  Design exports & sync tooling
  assets/        Shared frontend assets

backend/
  services/
    identity-service/    :3001
    learning-service/    :3003
    ai-service/          :3004
    erp-service/         :3005
    billing-service/     :3006
  database/              Prisma schema, migrations, seed
  shared/                auth, shared, nest-common, ai
  infrastructure/        Docker, Kubernetes, Terraform, monitoring
  testing/               load, e2e, operational scripts
  docs/                  architecture, security, release, ops

scripts/                 CI / security helpers
```

Shared packages: `@eduai/auth`, `@eduai/shared`, `@eduai/nest-common`, `@eduai/ai`, `@eduai/database`, `@eduai/ui`, `@eduai/i18n`, `@eduai/analytics`.

Architecture overview: [`ARCHITECTURE.md`](ARCHITECTURE.md)

---

## Common scripts

| Command | Description |
|---------|-------------|
| `pnpm mvp:setup` | Start Docker deps, generate Prisma client, migrate, seed |
| `pnpm mvp:dev` | Clean Next caches + run APIs + web + admin |
| `pnpm dev:backend` | All five NestJS APIs |
| `pnpm dev:frontend` | Web + Admin |
| `pnpm dev:mobile` | Expo on port 8081 |
| `pnpm dev:lan` | Full stack reachable on LAN |
| `pnpm db:generate` / `db:migrate` / `db:seed` / `db:studio` | Database workflows |
| `pnpm build` | Build all packages |
| `pnpm lint` / `pnpm typecheck` | Static checks |
| `pnpm test` | Unit / package tests |
| `pnpm test:e2e` | Playwright portal smoke |
| `pnpm test:contract` | OpenAPI contract fixtures |
| `pnpm security:scan` | Lightweight secret / pattern scan |
| `pnpm validate:dr` | DR checklist + health pings |
| `pnpm validate:billing` | Billing validation script |
| `pnpm load:test` | k6 student journey |
| `pnpm storybook` / `pnpm build-storybook` | UI Storybook (`@eduai/ui`) |
| `pnpm stitch:*` | Stitch design sync / generate helpers |

---

## Environment (high level)

Copy `.env.example` → `.env`. Important groups:

| Area | Examples (names only) |
|------|------------------------|
| Database / cache | `DATABASE_URL`, `REDIS_URL` |
| Auth | `JWT_SECRET`, `AUTH_SECRET` (required & strong in production) |
| Service URLs | `*_SERVICE_URL`, `NEXT_PUBLIC_*_SERVICE_URL` |
| Internal | `INTERNAL_API_KEY` |
| Optional AI | `OPENAI_API_KEY`, `GEMINI_API_KEY` |
| Optional billing | `STRIPE_*`, `RAZORPAY_*` |
| Optional OAuth | `GOOGLE_*`, `APPLE_*` |
| Privacy / security | `FIELD_ENCRYPTION_KEY`, `DATA_RESIDENCY_REGION` |

Leave provider secrets empty for local mock behaviour. Never put production secrets in the repo, screenshots, or chat logs.

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Web / Admin | Next.js 15, React 19, Auth.js (next-auth v5), Tailwind |
| Mobile | Expo ~52, React Native, expo-router |
| APIs | NestJS, Passport JWT, Swagger, Throttler |
| Data | PostgreSQL 16, Prisma, Redis |
| Tooling | pnpm, Turborepo, TypeScript, ESLint, Prettier |
| Infra | Docker Compose (local), Kubernetes / Terraform (deploy) |

---

## Security & privacy

- Do **not** open public issues for vulnerabilities.
- Report privately via [GitHub Security Advisories](https://github.com/aadityapa/EduAI/security/advisories/new) for this repository.
- Policy details: [`SECURITY.md`](SECURITY.md)
- Engineering controls (DPDP-aligned consent/DSR, encryption helpers, audit logs): see `backend/docs/security/`

CI may run secret scanning (`gitleaks` / `pnpm security:scan`) and dependency audit. Treat any leaked key as compromised — rotate immediately.

---

## Documentation

| Topic | Path |
|-------|------|
| Architecture | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Contributing | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Security policy | [`SECURITY.md`](SECURITY.md) |
| Port allocation | [`backend/docs/architecture/port-allocation.md`](backend/docs/architecture/port-allocation.md) |
| MVP quickstart | [`backend/docs/release/mvp-quickstart.md`](backend/docs/release/mvp-quickstart.md) |
| Launch readiness | [`backend/docs/release/v1-launch-readiness.md`](backend/docs/release/v1-launch-readiness.md) |
| Roadmap / program status | [`backend/docs/execution/`](backend/docs/execution/) |
| Ops runbooks | [`backend/docs/operations/runbooks/`](backend/docs/operations/runbooks/) |
| Security architecture | [`backend/docs/security/`](backend/docs/security/) |

---

## License

Proprietary — all rights reserved. See [`LICENSE`](LICENSE).
