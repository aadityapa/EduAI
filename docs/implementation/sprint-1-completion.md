# EduAI Sprint 1 — Completion Report

**Sprint theme:** Foundation + Authentication & User Management  
**Status:** Complete (local dev ready)

---

## What Was Built

### Monorepo (`Turborepo` + `pnpm`)

```
apps/web          Next.js 15 — student/teacher/parent portals + login
apps/admin        Next.js 15 — admin shell + user list UI
apps/mobile       Expo 52 — scaffold only
packages/ui       Design tokens, Tailwind, Shadcn-style components
packages/auth     RBAC permission matrix + helpers
packages/database Prisma schema + migrations + seed
packages/shared   Types, API envelope utils, role constants
packages/ai       Stub client
packages/analytics Stub tracker
services/identity-service  NestJS — auth + users (Sprint 1 focus)
services/*        6 other services — package.json scaffolds
infrastructure/docker      PostgreSQL 16 + Redis 7
.github/workflows/ci.yml   lint, typecheck, test, build
```

### Identity Service API (`http://localhost:3001`)

| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/auth/login` | Email/password login + JWT |
| `POST /api/v1/auth/register` | User registration |
| `POST /api/v1/auth/refresh` | Refresh access token |
| `POST /api/v1/auth/logout` | Invalidate session |
| `GET /api/v1/users/me` | Current profile |
| `PATCH /api/v1/users/me` | Update profile |
| `GET /api/v1/users` | List users (admin) |
| `POST /api/v1/users` | Create user (admin) |
| `DELETE /api/v1/users/:id` | Soft delete (admin) |
| `GET /api/docs` | Swagger OpenAPI |

### Database Tables (Sprint 1)

- `tenants`, `schools`, `users`
- `roles`, `permissions`, `role_permissions`, `user_roles`
- `user_sessions`, `audit_logs`

All tenant-scoped tables include `tenant_id`.

---

## How to Run

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker Desktop

### 1. Clone and install

```bash
cd EduAI
cp .env.example .env
pnpm install
```

**Note:** Postgres runs on host port **5433** (not 5432) to avoid conflicts with local PostgreSQL installations.

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

### 3. Database migrate + seed

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### 4. Start services (separate terminals)

```bash
# Identity API
pnpm --filter @eduai/identity-service dev

# Web app (port 3000)
pnpm --filter @eduai/web dev

# Admin portal (port 3002)
pnpm --filter @eduai/admin dev
```

### 5. Demo credentials

| Email | Password | Role |
|-------|----------|------|
| admin@demo.eduai.in | Demo1234! | Admin (tenant_admin) |
| teacher@demo.eduai.in | Demo1234! | Teacher |
| student@demo.eduai.in | Demo1234! | Student |
| parent@demo.eduai.in | Demo1234! | Parent |

### 6. Verify build & tests

```bash
pnpm build
pnpm test
```

---

## Working vs Stubbed

| Feature | Status |
|---------|--------|
| Email/password login | ✅ Working |
| JWT access + refresh tokens | ✅ Working |
| RBAC guards on user APIs | ✅ Working |
| Multi-tenant seed data | ✅ Working |
| Audit log on auth actions | ✅ Working |
| Auth.js web session | ✅ Working |
| Role-based dashboard routing | ✅ Working |
| Admin user list | ✅ Working (needs identity-service) |
| OTP login | 🔶 UI placeholder |
| Google/Apple OAuth | 🔶 Stub endpoints + UI buttons |
| Password reset | 🔶 Stub endpoint |
| Redis session store | 🔶 Env only |
| RLS PostgreSQL policies | 🔶 Schema-ready, not enforced |
| Mobile app | 🔶 Scaffold |
| Other microservices | 🔶 Scaffold |
| EKS / Terraform / Grafana | 🔶 Placeholder dirs |

---

## Sprint 2 Priorities

1. **Auth hardening** — email verification, lockout, password reset, OAuth production keys
2. **Redis integration** — session cache, rate limit store
3. **RLS enforcement** — `app.current_tenant_id` session variable in Prisma middleware
4. **Parent-child linking** — `parent_student_links` table + consent flows
5. **Admin CRM** — tenant CRUD, branding, audit log viewer (Sprint 3 prep)
6. **E2E test suite** — Playwright for login flows across roles

---

*See also: [audit-report.md](./audit-report.md) · [sprint-planning.md](../sprints/sprint-planning.md)*
