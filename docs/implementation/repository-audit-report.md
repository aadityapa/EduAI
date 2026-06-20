# EduAI Repository Audit Report

**Date:** June 20, 2025  
**Scope:** Full monorepo audit — structure, security, multi-tenancy, CI/CD, documentation alignment  
**Baseline:** Sprint 1 complete (do not rebuild)

---

## Executive Summary

EduAI delivers a **solid Sprint 1 foundation**: Turborepo monorepo, identity-service with JWT auth, Prisma multi-tenant schema (auth/RBAC), Next.js web/admin apps, and CI pipeline. Sprint 2+ domains (learning, AI, ERP) exist in documentation and RBAC permissions but **not in runtime code** prior to Sprint 2 work.

| Area | Rating | Summary |
|------|--------|---------|
| Monorepo structure | ✅ Low risk | Matches planned layout; 6 service scaffolds present |
| Database (Sprint 1) | ✅ Low risk | Auth/RBAC tables implemented; RLS-ready |
| Authentication | ⚠️ Medium | JWT + Auth.js working; OAuth/OTP/reset stubbed |
| RBAC | ✅ Low risk | Full matrix in `@eduai/auth`; enforced in identity-service |
| Multi-tenant | ⚠️ Medium | `tenant_id` on tables; no RLS enforcement |
| Security | ⚠️ Medium | Rate limiting on auth; Redis unused; no email verification |
| CI/CD | ✅ Low risk | lint → typecheck → test → build with Postgres |
| Documentation | ✅ Low risk | 24+ docs aligned; minor sprint numbering drift |
| Learning platform | ❌ High gap | Pre-Sprint 2: scaffolds only |
| AI platform | ❌ High gap | Stub client only |
| Mobile / ERP / Prod | ❌ High gap | Scaffolds / placeholders |

---

## 1. Folder Structure vs Planned Monorepo

| Planned | Present | Status |
|---------|---------|--------|
| `apps/web`, `admin`, `mobile` | ✅ | web/admin functional; mobile Expo placeholder |
| `packages/auth`, `database`, `shared`, `ui` | ✅ | Implemented |
| `packages/ai`, `analytics` | ✅ | Stubs only |
| `packages/i18n` | ❌ | Missing (Sprint 2) |
| `services/identity-service` | ✅ | Full NestJS implementation |
| `services/learning-service` + 5 others | ⚠️ | `_scaffold/main.js` only |
| `infrastructure/docker` | ✅ | Postgres 5433 + Redis |
| `infrastructure/kubernetes`, `terraform` | ⚠️ | README placeholders |
| `.github/workflows/ci.yml` | ✅ | Functional pipeline |

**Severity:** Low — structure matches HLD; gaps are intentional Sprint 1 scope.

---

## 2. Database Design (Prisma)

**Implemented (Sprint 1):** `tenants`, `schools`, `users`, `roles`, `permissions`, `role_permissions`, `user_roles`, `user_sessions`, `audit_logs`

**Documented but not migrated:** boards, subjects, chapters, lessons, quizzes, progress, gamification, parent links, AI tables, ERP tables (~40+ tables in `docs/database/database-schema.md`)

| Finding | Severity |
|---------|----------|
| RLS policies documented, not applied | Medium |
| `withTenantContext()` in `@eduai/database` exists but unused in services | Medium |
| `school.board_id` nullable vs docs require NOT NULL | Low |
| pgvector extension in docs, not in migrations | Low (Sprint 3) |
| Soft delete pattern consistent on core tables | ✅ |

---

## 3. Authentication Flow

| Component | Path | Status |
|-----------|------|--------|
| Identity login/register/refresh | `services/identity-service/src/auth/` | ✅ Working |
| JWT claims (roles, permissions, tenant) | `auth.service.ts` | ✅ Working |
| Auth.js credentials bridge | `apps/web/src/auth.ts` | ✅ Working |
| Session middleware | `apps/web/src/middleware.ts` | ✅ Role routing |
| Refresh in PostgreSQL | `user_sessions` | ✅ (docs prefer Redis) |
| OTP / OAuth / password reset | Stub endpoints | ⚠️ Medium |
| Email verification | Schema field only | ⚠️ Medium |
| Account lockout | Not implemented | ⚠️ Medium |

**Severity:** Medium — production auth needs hardening (Sprint 2 backlog item).

---

## 4. RBAC Implementation

| Item | Status |
|------|--------|
| Permission catalog (~40 permissions) | ✅ `packages/auth/src/permissions.ts` |
| Role → permission mapping (6 roles) | ✅ Aligned with `docs/architecture/rbac-design.md` |
| `hasPermission`, `getPermissionsForRoles` | ✅ Unit tested |
| NestJS `@RequirePermission` + guards | ✅ identity-service |
| Web/admin permission checks | ⚠️ Role-only routing; no fine-grained UI gates |
| Learning/AI permissions defined | ✅ In matrix; no runtime enforcement yet |

**Severity:** Low for Sprint 1 scope; learning-service must replicate guard pattern.

---

## 5. Multi-Tenant Readiness

| Control | Status | Gap |
|---------|--------|-----|
| `tenant_id` on tenant-scoped tables | ✅ Sprint 1 tables | Sprint 2 tables must follow |
| Unique constraints per tenant | ✅ `(tenant_id, email)` etc. | — |
| JWT embeds `tenant_id` | ✅ | — |
| Query filtering by tenant in APIs | ✅ identity-service | Must extend to learning-service |
| PostgreSQL RLS | ❌ Not enforced | Critical for production |
| Cross-tenant data leak tests | ❌ None | Add integration tests |

**Severity:** Medium — application-level filtering sufficient for MVP; RLS required before multi-tenant production.

---

## 6. Security Configuration

| Control | Status | Severity if missing |
|---------|--------|---------------------|
| Helmet (identity-service) | ✅ | — |
| CORS allowlist | ✅ | — |
| `@nestjs/throttler` on auth | ✅ 20/15min | — |
| Global throttler 120/min | ✅ | — |
| Input validation (class-validator) | ✅ | — |
| bcrypt password hashing (cost 12) | ✅ | — |
| JWT secret from env | ✅ | Default weak in `.env.example` |
| Redis rate limit store | ❌ | Low |
| Audit logging | ✅ auth actions | Extend to learning |
| Secrets in repo | ✅ None found | — |
| Admin app auth middleware | ❌ No middleware file | Medium |

---

## 7. CI/CD

**File:** `.github/workflows/ci.yml`

| Stage | Status |
|-------|--------|
| Postgres 16 service container | ✅ |
| `pnpm install --frozen-lockfile` | ✅ |
| Prisma generate + migrate deploy | ✅ |
| lint, typecheck, test, build | ✅ |
| E2E / Playwright | ❌ Not configured |
| Deploy / staging | ❌ Not configured |
| Security scanning (SAST/dependency) | ❌ Not configured |

**Severity:** Low for dev; Medium for production readiness.

---

## 8. Documentation Alignment

| Document | Alignment |
|----------|-----------|
| `docs/database/database-schema.md` | Sprint 1 subset in Prisma; full DDL is target state |
| `docs/architecture/rbac-design.md` | ✅ Matches `@eduai/auth` |
| `docs/sprints/sprint-planning.md` | Sprint 1 auth merged early (documented in audit-report.md) |
| `docs/implementation/sprint-1-completion.md` | ✅ Accurate inventory |
| API docs | Identity service Swagger ✅; other services N/A |

**Severity:** Low — docs are authoritative for Sprint 2+ implementation.

---

## 9. Test Coverage Snapshot (Pre-Sprint 2)

| Package | Tests |
|---------|-------|
| `@eduai/auth` | Vitest — RBAC helpers |
| `@eduai/shared` | Vitest — utils, routing |
| `@eduai/identity-service` | Jest — minimal auth smoke |
| Apps, UI, database, services | `"no tests yet"` or scaffold echo |

**Severity:** Medium — critical paths under-tested; Sprint 2 must add quiz/gamification/progress tests.

---

## 10. Critical Findings for Sprint 2+

| ID | Finding | Severity | Sprint |
|----|---------|----------|--------|
| F-01 | No learning-service runtime | Critical | Sprint 2 |
| F-02 | No curriculum/progress DB tables | Critical | Sprint 2 |
| F-03 | No i18n package or UI switcher | High | Sprint 2 |
| F-04 | Parent-child links not in schema | High | Sprint 2 |
| F-05 | Redis configured but unused | Medium | Sprint 2 |
| F-06 | RLS not enforced | Medium | Sprint 2–3 |
| F-07 | Admin app lacks auth middleware | Medium | Sprint 2 |
| F-08 | No E2E tests | Medium | Sprint 2 |
| F-09 | AI service stub only | High | Sprint 3 |
| F-10 | ERP/mobile/prod infra stubs | High | Sprint 4–5 |

---

*Audit completed as Phase 0 of full product execution. See `gap-analysis-report.md` for remediation roadmap.*
