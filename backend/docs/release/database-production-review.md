# Production Database Review

**Date:** 2025-06-21  
**Engine:** PostgreSQL 16 + Prisma 6  
**Schema:** `backend/database/prisma/schema.prisma` (~1460 lines, 60+ models)

---

## Migration History

| Migration | Sprint | Purpose |
|-----------|--------|---------|
| `20250620000000_init` | 1 | Auth, tenants, RBAC foundation |
| `20250620120000_sprint2_learning` | 2 | Courses, lessons, quizzes |
| `20260620182639_sprint2_learning` | 2 | Learning schema fix |
| `20250620140000_sprint3_ai` | 3 | AI conversations, quota |
| `20250621100000_sprint4_erp` | 4 | ERP, billing, CRM tables |
| `20250621110000_sprint4_rls` | 4 | RLS on 14 tenant-scoped tables |
| `20250621120000_sprint5_branding` | 5 | TenantBranding white-label |

**Total:** 8 migration files, linear history, `migration_lock.toml` provider = postgresql.

---

## Schema Quality

| Aspect | Status | Notes |
|--------|--------|-------|
| Primary keys | ✅ | UUID via `gen_random_uuid()` |
| Foreign keys | ✅ | Tenant relations enforced |
| Soft deletes | ✅ | `deletedAt` on tenants, schools, users |
| Indexes | ⚠️ | Present on hot paths; some list queries need composite indexes |
| Enums | ✅ | 15 enums for type safety |
| JSON columns | ✅ | Settings, metadata with defaults |
| Multi-tenant discriminator | ✅ | `tenantId` on all tenant-scoped models |

---

## Row Level Security (RLS)

### Tables with RLS enabled (14)

From `20250621110000_sprint4_rls`:

- `academic_classes`, `class_enrollments`, `attendance_records`, `leave_requests`
- `fee_invoices`, `fee_payments`, `exams`, `exam_results`
- `assignments`, `notifications`, `activity_logs`
- `tenant_subscriptions`, `billing_invoices`, `support_tickets`

Policy pattern:
```sql
CREATE POLICY tenant_isolation_* ON <table>
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

### Tables WITHOUT RLS (critical gap)

- `users`, `schools`, `courses`, `lessons`, `lesson_progress`
- `quiz_attempts`, `ai_conversations`, `ai_messages`
- `parent_student_links`, `user_sessions`

**Coverage:** ~25% of tenant-scoped tables have RLS policies.

### Tenant context wiring

- `erp-service`: `withTenantContext()` sets `app.tenant_id` session variable
- Other services: application-layer `where: { tenantId }` only
- NULL bypass risk when session var unset (documented in architecture)

---

## Indexes Review

Present indexes include:
- `idx_schools_tenant` on schools
- Unique constraints: `[tenantId, code]`, `[tenantId, email]`, composite keys on enrollments

**Gaps (Medium):**
- Missing index on `lesson_progress(tenant_id, user_id, lesson_id)` for dashboard queries
- `ai_messages(conversation_id, created_at)` for tutor history pagination

---

## Data Integrity

| Constraint | Status |
|------------|--------|
| Unique tenant slug | ✅ |
| Unique user email per tenant | ✅ |
| Course enrollment uniqueness | ✅ `[tenantId, courseId, userId]` |
| Parent-student link uniqueness | ✅ |
| FK cascade behavior | ⚠️ Default RESTRICT — verify delete flows |

---

## Seed Data Summary

| Seed file | Content |
|-----------|---------|
| `seed.ts` | Demo tenant, 4 users, RBAC roles |
| `seed-sprint2.ts` | CBSE Class 8 — 2 courses, 4 lessons, 1 quiz |
| `seed-sprint4.ts` | ERP demo (Class 8), branding, fees, transport scaffold |

**Production concern:** Seed is demo-only; no production content migration path documented.

---

## Backup & DR

- Terraform defines RDS with automated backups (see `backend/infrastructure/terraform/`)
- DR checklist script: `backend/testing/scripts/dr-test-checklist.mjs`
- **No timed restore drill executed in this validation**

---

## Recommendations

| Priority | Action |
|----------|--------|
| P0 | Extend RLS to users, courses, ai_messages, lesson_progress |
| P0 | Wire `withTenantContext()` middleware on all services |
| P1 | Add missing composite indexes for list endpoints |
| P1 | Separate DB roles: app (RLS enforced) vs migration (superuser) |
| P2 | Add migration rollback test in CI |
| P2 | Document production seed vs content import pipeline |

---

## Database Launch Verdict

| Launch type | Verdict |
|-------------|---------|
| Closed beta | **GO** — schema stable, migrations apply cleanly |
| Public v1.0 | **NO-GO** — RLS gaps on core PII tables |

**Database readiness score: 7/10**
