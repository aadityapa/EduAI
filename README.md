# EduAI Platform — v0.9 Beta

> **Status:** Sprint 5 Complete — Mobile + Production Infrastructure  
> **Version:** 0.9.0-beta  
> **Last Updated:** June 2025

EduAI is a multi-tenant SaaS platform for AI-powered education (Classes 1–10, CBSE/ICSE/State Boards). This monorepo contains web, admin, and mobile apps, five backend microservices, shared packages, and production infrastructure.

---

## Quick Start

```bash
cp .env.example .env
pnpm install
docker compose -f infrastructure/docker/docker-compose.yml up -d
pnpm db:generate && pnpm db:migrate && pnpm db:seed
```

### Run Services

| Terminal | Command | Port |
|----------|---------|------|
| 1 | `pnpm --filter @eduai/identity-service dev` | 3001 |
| 2 | `pnpm --filter @eduai/learning-service dev` | 3003 |
| 3 | `pnpm --filter @eduai/ai-service dev` | 3004 |
| 4 | `pnpm --filter @eduai/erp-service dev` | 3005 |
| 5 | `pnpm --filter @eduai/billing-service dev` | 3006 |
| 6 | `pnpm --filter @eduai/web dev` | 3000 |
| 7 | `pnpm --filter @eduai/admin dev` | 3002 |

**Demo login:** `*@demo.eduai.in` / `Demo1234!`

---

## Mobile App

```bash
pnpm --filter @eduai/mobile dev
# Scan QR with Expo Go, or press 'a' for Android / 'i' for iOS simulator
```

Role-based navigation:
- **Student:** courses, AI tutor, quizzes, planner, gamification, offline cache
- **Parent:** children, fees, notifications
- **Teacher:** classes, attendance, homework

Configure API URLs in `apps/mobile/app.json` → `extra`.

---

## Repository Structure

```
apps/
  web/              Next.js 15 — student/teacher/parent portals
  admin/            Next.js 15 — platform admin + CRM/billing/branding
  mobile/           Expo 52 — student/parent/teacher apps
packages/
  ui/               Design system + TenantThemeProvider
  auth/             RBAC matrix + permissions
  database/         Prisma schema + migrations
  shared/           Types, JWT helpers, API utilities
  ai/               AI client, prompt guard, content filter
  i18n/             en/hi/mr translations
services/
  identity-service/ Auth + users (:3001)
  learning-service/ Courses, quizzes, gamification (:3003)
  ai-service/       Tutor, homework, planner, generators (:3004)
  erp-service/      School ERP — attendance, fees, exams (:3005)
  billing-service/  Subscriptions, invoices, CRM, branding (:3006)
infrastructure/
  docker/           Dev + production Docker
  kubernetes/       K8s manifests for all services
  terraform/        AWS ap-south-1 (VPC, EKS, RDS, Redis, S3, CloudFront)
  monitoring/       Prometheus, Grafana, OpenTelemetry, Sentry stubs
docs/               Audits, operations guides, release reports
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps |
| `pnpm build` | Build all packages |
| `pnpm test` | Run unit tests (45+ Sprint 1–4, 50+ with Sprint 5) |
| `pnpm db:migrate` | Apply Prisma migrations |
| `pnpm db:seed` | Seed demo tenant |

---

## Production Deploy

See [`docs/operations/production-deployment-guide.md`](docs/operations/production-deployment-guide.md).

```bash
cd infrastructure/terraform && terraform init && terraform apply
kubectl apply -f infrastructure/kubernetes/
```

CI/CD: `.github/workflows/deploy.yml` — build, test, push to ECR, deploy on `master`.

---

## Documentation

| Document | Path |
|----------|------|
| Pre-production audit | [`docs/audit/pre-production-audit.md`](docs/audit/pre-production-audit.md) |
| Staging readiness | [`docs/release/staging-readiness-review.md`](docs/release/staging-readiness-review.md) |
| Sprint 5 release | [`docs/release/sprint5-release-report.md`](docs/release/sprint5-release-report.md) |
| Production deploy | [`docs/operations/production-deployment-guide.md`](docs/operations/production-deployment-guide.md) |
| Beta launch | [`docs/release/beta-launch-guide.md`](docs/release/beta-launch-guide.md) |
| App store readiness | [`docs/release/app-store-readiness.md`](docs/release/app-store-readiness.md) |

---

## Roadmap

| Version | Target | Focus |
|---------|--------|-------|
| **v0.9 Beta** | Now | Mobile apps, white-label, production infra |
| **v1.0 Launch** | Q3 2025 | App Store release, Redis rate limiting, e2e tests |
| **v2.0 Scale** | 2026 | OpenSearch, multi-region, franchise analytics |

---

## License

Proprietary — EduAI Platform Engineering
