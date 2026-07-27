# EduAI Platform

Multi-tenant AI education SaaS for schools, teachers, students, and parents.

Frontend apps and backend APIs are **separate processes on distinct ports**. Frontends call NestJS services over HTTP via `NEXT_PUBLIC_*_SERVICE_URL` — business logic lives in the services, not in Next.js route handlers.

| | |
|---|---|
| **Monorepo** | pnpm workspaces + Turborepo |
| **Node** | >= 20 |
| **Package manager** | pnpm 9.15+ |
| **Default branch** | `main` |

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
