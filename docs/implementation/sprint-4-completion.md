# Sprint 4 — Enterprise ERP + CRM (Complete)

**Theme:** School ERP, Teacher Portal, Parent Portal, Admin CRM, Billing, RLS  
**Status:** ✅ Complete  
**Branch:** `feature/sprint-4-enterprise`

---

## What Shipped

### Backend Services
- **erp-service** (:3005) — classes, attendance, timetable, fees, exams, assignments, teacher/parent APIs, notifications, analytics, scaffold modules
- **billing-service** (:3006) — plans, subscriptions, invoices, Stripe/Razorpay webhooks, coupons, CRM, revenue analytics

### Database
- 30+ new Prisma models (ERP, billing, CRM)
- Migrations: `20250621100000_sprint4_erp`, `20250621110000_sprint4_rls`
- Seed: demo class, attendance, fees, exams, assignments, subscription plans

### Web App (Teacher Portal)
- `/teacher/dashboard` — live KPIs
- `/teacher/classes` — class management
- `/teacher/attendance` — mark attendance
- `/teacher/assignments` — assignment list
- `/teacher/quizzes/builder` — quiz builder entry
- `/teacher/reports` — reports placeholder

### Web App (Parent Portal)
- `/parent/children/:id/dashboard` — child ERP dashboard
- `/parent/fees` — fee status
- `/parent/notifications` — in-app notifications

### Admin CRM
- Schools, Tenants, Subscriptions, Revenue, Content, Analytics
- Leads, Support Tickets, Coupons, Campaigns, Audit Logs, Security

---

## How to Run Locally

```bash
# 1. Start infrastructure
docker compose -f infrastructure/docker/docker-compose.yml up -d

# 2. Migrate & seed
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 3. Start services (separate terminals)
pnpm --filter @eduai/identity-service dev   # :3001
pnpm --filter @eduai/learning-service dev  # :3003
pnpm --filter @eduai/ai-service dev        # :3004
pnpm --filter @eduai/erp-service dev       # :3005
pnpm --filter @eduai/billing-service dev   # :3006
pnpm --filter @eduai/web dev               # :3000
pnpm --filter @eduai/admin dev             # :3002
```

**Demo logins:** `teacher@demo.eduai.in`, `parent@demo.eduai.in`, `admin@demo.eduai.in` / `Demo1234!`

---

## Documentation

| Document | Path |
|----------|------|
| Gap analysis | `docs/audit/sprint4-gap-analysis.md` |
| ERP architecture | `docs/architecture/sprint-4-erp-architecture.md` |
| Security report | `docs/audit/sprint4-security-report.md` |
| Release report | `docs/release/sprint4-release-report.md` |

---

*Sprint 4 complete. Sprint 5 planning document created.*
