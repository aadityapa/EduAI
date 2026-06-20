# EduAI — AI-Powered Digital Learning Ecosystem

> **Status:** Sprint 1 Complete — Monorepo foundation + Auth  
> **Version:** 0.1.0  
> **Last Updated:** June 2025

EduAI is a multi-tenant SaaS platform for AI-powered education (Classes 1–10, CBSE/ICSE/State Boards). This repository contains the **Turborepo monorepo**, documentation suite, and Sprint 1 deliverables.

---

## Quick Start

```bash
# 1. Install
cp .env.example .env
pnpm install

# 2. Start Postgres + Redis
docker compose -f infrastructure/docker/docker-compose.yml up -d

# 3. Database
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 4. Run (3 terminals)
pnpm --filter @eduai/identity-service dev   # :3001
pnpm --filter @eduai/web dev                # :3000
pnpm --filter @eduai/admin dev              # :3002
```

**Demo login:** `admin@demo.eduai.in` / `Demo1234!`

Full details: [`docs/implementation/sprint-1-completion.md`](docs/implementation/sprint-1-completion.md)

---

## Repository Structure

```
apps/
  web/              Next.js 15 — learner portals + Auth.js
  admin/            Next.js 15 — admin user management
  mobile/           Expo scaffold (Sprint 15)
packages/
  ui/               Design system (tokens + Shadcn components)
  auth/             Auth.js helpers + RBAC matrix
  database/         Prisma schema + migrations
  shared/           Shared types and utilities
  ai/               AI client stub
  analytics/        Analytics stub
services/
  identity-service/ NestJS — auth + users (Sprint 1)
  *-service/        Scaffolds for learning, content, quiz, ai, analytics, notification
infrastructure/
  docker/           Docker Compose (PostgreSQL, Redis)
  kubernetes/       K8s manifests (placeholder)
  terraform/        IaC (placeholder)
docs/               BRD, PRD, SRS, architecture, sprints, design system
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | Turborepo, pnpm workspaces |
| Web | Next.js 15, TypeScript, Tailwind, Shadcn-style UI, Framer Motion |
| Mobile | React Native / Expo (scaffold) |
| API | NestJS, JWT, Swagger OpenAPI |
| Database | PostgreSQL 16, Prisma |
| Cache | Redis 7 (local dev) |
| Auth | Auth.js (Next.js) + identity-service JWT |
| CI | GitHub Actions |

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run unit tests |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | TypeScript check |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed demo tenant + users |

---

## Documentation

| Document | Path |
|----------|------|
| Sprint 1 completion | [`docs/implementation/sprint-1-completion.md`](docs/implementation/sprint-1-completion.md) |
| Implementation audit | [`docs/implementation/audit-report.md`](docs/implementation/audit-report.md) |
| Sprint planning | [`docs/sprints/sprint-planning.md`](docs/sprints/sprint-planning.md) |
| RBAC design | [`docs/architecture/rbac-design.md`](docs/architecture/rbac-design.md) |
| Database schema | [`docs/database/database-schema.md`](docs/database/database-schema.md) |
| API documentation | [`docs/api/api-documentation.md`](docs/api/api-documentation.md) |
| Design system | [`docs/design/design-system.md`](docs/design/design-system.md) |

---

## Roles (RBAC)

| Code | Display Name |
|------|--------------|
| `platform_admin` | Super Admin |
| `tenant_admin` | Admin |
| `school_admin` | School Admin |
| `teacher` | Teacher |
| `student` | Student |
| `parent` | Parent |

---

## License

Proprietary — EduAI Platform Engineering
