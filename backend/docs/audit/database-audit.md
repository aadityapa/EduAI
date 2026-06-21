# Database Audit — EduAI Platform

**Date:** 2025-06-21  
**Schema:** `backend/database/prisma/schema.prisma` (55 models)  
**Migrations:** 6 applied

---

## Migration Inventory

| Migration | Sprint | Contents |
|-----------|--------|----------|
| `20250620000000_init` | 1 | Auth: tenants, users, RBAC, sessions, audit_logs |
| `20250620120000_sprint2_learning` | 2 | Curriculum, quizzes, gamification, i18n |
| `20260620182639_sprint2_learning` | 2 | updated_at default cleanup |
| `20250620140000_sprint3_ai` | 3 | AI conversations, messages, quota |
| `20250621100000_sprint4_erp` | 4 | ERP, billing, CRM, tenant_branding |
| `20250621110000_sprint4_rls` | 4 | RLS on 14 tenant-scoped ERP/billing tables |

---

## Indexes — Strengths

- Composite tenant indexes: `idx_users_tenant_school`, `idx_courses_tenant_status`, `idx_attendance_class_date`
- Unique constraints on natural keys: `(tenant_id, email)`, `(tenant_id, invoice_number)`
- AI quota: `uq_ai_quota` on `(tenant_id, user_id, usage_date)`

## Indexes — Gaps (Medium)

| Table | Missing Index | Impact |
|-------|---------------|--------|
| `quiz_attempts` | `quiz_id` | Slow per-quiz analytics |
| `parent_student_links` | `(parent_id)`, `(student_id)` | Parent portal lookups |
| `fee_payments` | `external_id` | Webhook idempotency lookups |
| `billing_invoices` | `external_id` | Payment provider reconciliation |

---

## Foreign Keys

**Strong:** Sprint 4 ERP migration adds comprehensive FKs with appropriate ON DELETE behavior.

**Gaps:**

| Severity | Issue |
|----------|-------|
| High | `UserRole.classId` — no FK to `academic_classes` |
| Medium | `Lesson.tenantId`, `Quiz.tenantId` nullable without FK |
| Medium | `AcademicClass.teacherId` — no FK to users |
| Low | `Assignment.lessonId` — no FK |

---

## RLS Policies

**Enabled (14 tables):** academic_classes, class_enrollments, attendance_records, leave_requests, fee_invoices, fee_payments, exams, exam_results, assignments, notifications, activity_logs, tenant_subscriptions, billing_invoices, support_tickets

**Policy pattern:**
```sql
USING (tenant_id = app_current_tenant_id() OR app_current_tenant_id() IS NULL)
```

**Findings:**

| ID | Severity | Finding |
|----|----------|---------|
| DB-H1 | High | NULL bypass allows full access when session var unset |
| DB-H2 | High | RLS covers ~25% of tenant-scoped tables |
| DB-H3 | High | `withTenantContext()` stub not invoked by services |
| DB-M1 | Medium | Missing RLS on users, ai_messages, lesson_progress |

**Recommendation (Sprint 5+):** Extend RLS to core PII tables; remove NULL bypass for application DB role; wire tenant context middleware.

---

## Tenant Branding (Sprint 5 Extension)

Extended in migration `20250621120000_sprint5_branding`:
- `font_family`, `accent_color`, `custom_domain_verified`
- `email_header_html`, `email_footer_html`, `mobile_app_name`

---

## Performance Recommendations

1. Partial indexes on soft-delete columns (`WHERE deleted_at IS NULL`)
2. Time-based partitioning for `audit_logs` / `activity_logs` at 10M+ rows
3. Connection pooling via PgBouncer in production (documented in scaling guide)

---

## Sign-Off

Database schema is **production-ready for beta** with documented RLS and index gaps tracked for v1.0.
