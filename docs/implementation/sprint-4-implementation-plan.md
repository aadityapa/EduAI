# Sprint 4 Implementation Plan (Plan Only)

**Status:** Planning document — **no Sprint 4 coding in Sprint 3 delivery**  
**Prerequisite:** Sprint 3 production review Go decision ✅  
**Theme:** School ERP + Teacher Portal + Admin CRM + RLS

---

## Overview

Sprint 4 extends the EduAI platform from AI-first learning (Sprint 3) into full school operations: attendance, timetables, fees scaffolding, teacher content tools, parent reports, and PostgreSQL row-level security.

---

## Phase 1: Database & RLS (Week 1)

### Migrations

| Table | Purpose |
|-------|---------|
| `classes` | Class sections per school |
| `class_enrollments` | Student ↔ class mapping |
| `attendance_records` | Daily attendance |
| `timetable_slots` | Weekly schedule |
| `fee_invoices` | Fee scaffolding |
| `ai_audit_logs` | Durable AI audit trail (Sprint 3 gap) |

### RLS

- Enable PostgreSQL RLS on tenant-scoped tables
- `withTenantContext()` middleware in all services
- Policy: `tenant_id = current_setting('app.tenant_id')`

---

## Phase 2: ERP Service (Week 2)

**Option A:** Extend `learning-service`  
**Option B:** New `erp-service` (:3005)

Recommended: **Extend learning-service** for MVP.

| Endpoint | Role |
|----------|------|
| `POST /attendance` | Teacher mark attendance |
| `GET /attendance/class/:id` | View class attendance |
| `GET /timetable/me` | Student/teacher schedule |
| `GET /fees/me` | Parent fee view (read-only) |

---

## Phase 3: Teacher Portal (Week 3)

Build on Sprint 2 quiz models + Sprint 3 AI generator:

| Feature | Route | Notes |
|---------|-------|-------|
| Quiz builder | `/teacher/quizzes/builder` | Reuse `Quiz` Prisma models |
| Assignment create | `/teacher/assignments` | Link to lessons |
| Class roster | `/teacher/classes/:id` | From `class_enrollments` |
| AI question gen | ✅ Done Sprint 3 | Enhance with save-to-quiz |

---

## Phase 4: Parent Portal (Week 3)

| Feature | Route |
|---------|-------|
| Child attendance | `/parent/children/:id/attendance` |
| Homework view | `/parent/children/:id/homework` |
| AI tutor | ✅ Done Sprint 3 |
| Fee status | `/parent/fees` |

---

## Phase 5: Admin CRM (Week 4)

In `apps/admin`:

| Feature | Route |
|---------|-------|
| School management | `/dashboard/schools` |
| Subscription/billing | `/dashboard/billing` |
| Content moderation | `/dashboard/content` |
| AI analytics | ✅ Done Sprint 3 |

---

## Phase 6: AI Hardening (Parallel)

Carry forward Sprint 3 production GA conditions:

1. Redis response cache (`REDIS_URL` already in `.env.example`)
2. OpenAI streaming adapter (replace mock stream)
3. Provider moderation API
4. `ai_audit_logs` persistence
5. Load test: 50 concurrent streams

---

## Phase 7: Analytics Dashboard (Week 4)

- Real-time charts (Recharts) in admin
- Connect learning-service progress + ai-service usage
- Export CSV for tenant admins

---

## Dependencies

| Dependency | Owner | Blocker? |
|------------|-------|----------|
| Sprint 3 AI platform | ✅ Complete | No |
| RLS design doc | Architecture | Soft |
| Payment gateway | External | Fees deferred |
| Push notifications | Sprint 5 mobile | No |

---

## Success Criteria

- [ ] Teacher can create quiz from AI-generated questions
- [ ] Attendance marked and visible to parent
- [ ] RLS prevents cross-tenant queries (integration test)
- [ ] Admin can view school-level AI cost
- [ ] Audit logs persisted 90 days

---

## Out of Scope (Sprint 4)

- Full payment reconciliation
- Certificate PDF generation
- Mobile push notifications
- RAG / embeddings (Sprint 8)

---

## Estimated Effort

| Phase | Story Points |
|-------|--------------|
| DB + RLS | 13 |
| ERP APIs | 21 |
| Teacher portal | 21 |
| Parent portal | 13 |
| Admin CRM | 13 |
| AI hardening | 8 |
| **Total** | **~89 SP** |

---

## Entry Point Files

```
packages/database/prisma/schema.prisma  — add ERP + audit tables
services/learning-service/src/          — extend or split erp module
apps/web/src/app/teacher/               — quiz builder, roster
apps/web/src/app/parent/                  — attendance, fees
apps/admin/src/app/dashboard/             — schools, billing
services/ai-service/src/security/         — audit DB persistence
```

---

**Approved for planning.** Implementation begins only after Sprint 3 merge to `master` and stakeholder sign-off on this plan.
