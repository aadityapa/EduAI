# EduAI Platform — MVP

Multi-tenant AI education SaaS. **Frontend and backend are separate apps** on distinct ports.

---

## Port Map

| Layer | App / Service | Port | URL |
|-------|---------------|------|-----|
| **Frontend** | Web (Student / Teacher / Parent) | **3000** | http://localhost:3000 |
| **Frontend** | Admin CRM | **3002** | http://localhost:3002 |
| **Frontend** | Mobile (Expo Metro) | **8081** | Expo Go |
| **Backend** | Identity API | **3001** | http://localhost:3001 |
| **Backend** | Learning API | **3003** | http://localhost:3003 |
| **Backend** | AI API | **3004** | http://localhost:3004 |
| **Backend** | ERP API | **3005** | http://localhost:3005 |
| **Backend** | Billing API | **3006** | http://localhost:3006 |
| Infra | PostgreSQL | 5433 | Docker |
| Infra | Redis | 6379 | Docker |

Full details: [`docs/architecture/port-allocation.md`](docs/architecture/port-allocation.md)

---

## Quick Start (MVP)

```bash
cp .env.example .env
pnpm install
pnpm mvp:setup
```

### Option A — Start separately (recommended)

```bash
pnpm dev:backend   # APIs :3001, :3003–3006
pnpm dev:frontend  # Web :3000 + Admin :3002
pnpm dev:mobile    # Metro :8081
```

### Option B — All at once

```bash
pnpm mvp:dev
```

---

## Demo Logins

| Portal | URL | Email | Password |
|--------|-----|-------|----------|
| Student | http://localhost:3000 | student@demo.eduai.in | Demo1234! |
| Teacher | http://localhost:3000 | teacher@demo.eduai.in | Demo1234! |
| Parent | http://localhost:3000 | parent@demo.eduai.in | Demo1234! |
| Admin | http://localhost:3002 | admin@demo.eduai.in | Demo1234! |

On the web login page, use **Student / Teacher / Parent** tabs to switch demo accounts.

---

## Repository Layout

```
frontend/
  web/         :3000  Student, Teacher, Parent
  admin/       :3002  Platform admin & CRM
  mobile/      :8081  React Native / Expo
  shared-ui/   ui, i18n, analytics
  assets/      shared frontend assets
  public/      shared public assets

backend/
  services/    REST APIs only
    identity-service/   :3001
    learning-service/   :3003
    ai-service/         :3004
    erp-service/        :3005
    billing-service/    :3006
  database/    Prisma schema, migrations, seed data
  shared/      auth, shared, nest-common, ai
  infrastructure/ Docker, Kubernetes, Terraform, monitoring
  testing/     load tests, e2e tests, operational scripts
  docs/        architecture, release, audit, and design docs
```

Frontend apps call backend via `NEXT_PUBLIC_*_SERVICE_URL` — no business logic duplicated in Next.js routes.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:backend` | Start all 5 API services |
| `pnpm dev:frontend` | Web + Admin |
| `pnpm dev:mobile` | Expo on port 8081 |
| `pnpm mvp:dev` | Backend + frontend together |
| `pnpm build` | Build all packages |
| `pnpm test` | Run tests |
| `pnpm test:e2e` | Playwright portal smoke |
| `pnpm test:contract` | OpenAPI contract fixtures |
| `pnpm build-storybook` | Static Storybook (`@eduai/ui`) |
| `pnpm validate:dr` | DR checklist + health pings |

---

## Documentation

| Doc | Path |
|-----|------|
| ₹100 Cr roadmap | [`backend/docs/execution/hundred-cr-roadmap.md`](backend/docs/execution/hundred-cr-roadmap.md) |
| Program status / DoD | [`backend/docs/execution/hundred-cr-program-status.md`](backend/docs/execution/hundred-cr-program-status.md) |
| On-call runbooks | [`backend/docs/operations/runbooks/`](backend/docs/operations/runbooks/) |
| Deploy / rollback | [`backend/docs/operations/runbooks/deploy-rollback.md`](backend/docs/operations/runbooks/deploy-rollback.md) |
| Launch readiness | [`backend/docs/release/v1-launch-readiness.md`](backend/docs/release/v1-launch-readiness.md) |
| MVP quickstart | [`backend/docs/release/mvp-quickstart.md`](backend/docs/release/mvp-quickstart.md) |
| Port allocation | [`backend/docs/architecture/port-allocation.md`](backend/docs/architecture/port-allocation.md) |
| Beta launch | [`backend/docs/release/beta-launch-guide.md`](backend/docs/release/beta-launch-guide.md) |

---

## License

Proprietary — EduAI Platform Engineering
