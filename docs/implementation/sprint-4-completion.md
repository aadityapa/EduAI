# Sprint 4 — School ERP + CRM (Scaffold Status)

**Sprint theme:** School ERP, Teacher Portal, Admin CRM, Analytics  
**Status:** Scaffolded / Deferred

---

## Scope (Planned)

- School ERP: students, staff, attendance, timetable, exams, certificates, fees
- Teacher portal: course upload, quiz builder, assignments, student tracking
- Parent portal: reports, attendance, homework, notifications
- Admin CRM: tenant/school/subscription/content management
- Analytics dashboard
- RLS enforcement where feasible

---

## Current State

Sprint 4 features are **not implemented** in this delivery cycle. The following foundation from Sprint 1–3 supports future work:

| Asset | Readiness |
|-------|-----------|
| RBAC permissions (attendance, enrollment, billing) | ✅ Defined in `@eduai/auth` |
| Database schema docs (ERP tables) | ✅ In `docs/database/database-schema.md` |
| Teacher/parent dashboard shells | ✅ Placeholder pages in `apps/web` |
| Admin user management | ✅ Partial in `apps/admin` |
| Multi-tenant schema | ✅ Ready for RLS |

---

## Recommended Sprint 4 Entry Points

1. Prisma migration for `classes`, `class_enrollments`, `attendance_records`, `fee_invoices`
2. Extend `learning-service` or new `erp-service` for attendance/timetable
3. Teacher quiz builder UI reusing Sprint 2 quiz models
4. Admin CRM pages in `apps/admin`
5. PostgreSQL RLS policies + `withTenantContext()` middleware

---

## Deferred Items

- Full fee management + payment reconciliation
- Certificate PDF generation
- Push notifications (depends on Sprint 5 mobile)
- Real-time analytics dashboard

---

*Sprint 4 deferred to prioritize Sprint 2 completion and Sprint 3 AI foundation.*
