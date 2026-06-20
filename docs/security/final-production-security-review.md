# Final Production Security Review

**Date:** 2025-06-21  
**Scope:** identity-service, billing-service, ai-service, packages/auth, packages/ai, packages/nest-common  
**Classification:** Internal — Pre-v1.0 Launch  
**Methodology:** OWASP ASVS L1, code review, dependency audit, payment/AI controls

---

## Severity Summary

| Severity | Count | Production blockers |
|----------|-------|---------------------|
| **Critical** | 0 | None — **deployment not blocked on Critical** |
| **High** | 2 | SEC-H1 (RLS), SEC-H2 (email verification) |
| **Medium** | 7 | See findings below |
| **Low** | 5 | Documented |

> **Deployment gate:** No Critical issues remain. High issues block **public v1.0** but not closed beta with documented mitigations.

---

## Critical Findings

**None identified in application runtime code.**

Note: `pnpm audit` reports **Critical** on `vitest@2.1.9` (GHSA-5xrq-8626-4rwp). This is a **dev/test dependency** requiring Vitest UI server — not deployed to production. Classified as **Medium (dev tooling)** for launch purposes.

---

## High Findings

### SEC-H1: RLS Not Fully Wired — **High (Open)**

**Evidence:**
- RLS policies exist on 14 ERP/billing tables (`20250621110000_sprint4_rls`)
- Core PII tables (`users`, `lesson_progress`, `ai_messages`, `courses`) lack RLS
- `withTenantContext()` implemented in `erp-service` only; uses string interpolation for tenant ID
- Application-layer tenant filters are primary defense

**Risk:** Single missed `tenantId` filter could expose cross-tenant data; RLS NULL bypass if session var unset.

**Remediation:** Prisma middleware on all services; extend RLS to core tables; parameterized `set_config`.

**Beta mitigation:** Service-layer tenant scoping audited; closed pilot with ≤5 schools.

---

### SEC-H2: Email Verification Not Enforced — **High (Open)**

**Evidence:** `identity-service/src/auth/auth.controller.ts` — login succeeds for `pending_verification` users if password valid. Seed sets `emailVerifiedAt` for demo users only.

**Risk:** Account takeover via unverified email registration in open enrollment.

**Remediation:** Reject login when `emailVerifiedAt IS NULL` in production.

---

## Medium Findings

| ID | Finding | Location | Status |
|----|---------|----------|--------|
| SEC-M1 | Password reset stub returns success without action | `auth.controller.ts:96-98` | Open |
| SEC-M2 | OTP/Google/Apple auth stubs (501/placeholder) | `auth.controller.ts:100-124` | Open |
| SEC-M3 | In-memory throttler fallback when Redis unavailable | `throttler-config.ts:30-32` | Mitigated if `REDIS_URL` set |
| SEC-M4 | AI audit logs in-memory only | ai-service | Open |
| SEC-M5 | Homework imageUrl SSRF — no domain allowlist | ai-service homework | Open |
| SEC-M6 | CORS production URLs not validated in code review | all services | Open |
| SEC-M7 | Swagger exposed when `SWAGGER_ENABLED=true` | nest bootstrap | Gated by env |

---

## Low Findings

| ID | Finding |
|----|---------|
| SEC-L1 | Demo password `Demo1234!` in seed and k6 tests |
| SEC-L2 | `withTenantContext` SQL string interpolation (UUID-only mitigates injection) |
| SEC-L3 | AI stream output filter partial |
| SEC-L4 | Activity logs not shipped to SIEM |
| SEC-L5 | No WAF/rate limit at edge (relies on app throttler) |

---

## Authentication & RBAC

| Control | Status | Evidence |
|---------|--------|----------|
| JWT access + refresh tokens | ✅ | identity-service |
| bcrypt password hashing (cost 12) | ✅ | seed.ts, auth.service |
| Login rate limit 5/15min | ✅ | `@Throttle({ auth: { limit: 5, ttl: 900000 } })` |
| Refresh rate limit 20/15min | ✅ | auth.controller.ts:61 |
| RBAC permission matrix | ✅ | packages/auth — 100+ permissions, 6 roles |
| JwtAuthGuard + PermissionGuard | ✅ | All 5 microservices |
| Quiz `isCorrect` stripped for students | ✅ | learning-service |

---

## Payment Security

| Control | Stripe | Razorpay |
|---------|--------|----------|
| Webhook signature verification | ✅ `constructEvent` | ✅ HMAC-SHA256 |
| Reject webhooks without secret in prod | ✅ | ✅ |
| Idempotent invoice paid mark | ✅ | ✅ |
| Amount mismatch logging | ✅ | ✅ |

Code reference: `services/billing-service/src/webhooks/webhooks.service.ts`

---

## AI Security

| Control | Status |
|---------|--------|
| Prompt injection regex guard | ✅ packages/ai |
| Output content filter | ✅ |
| Daily token budget | ✅ cost.service |
| Circuit breaker | ✅ packages/ai |
| Stream output filter | ⚠️ Partial |
| Homework URL SSRF allowlist | ❌ Open |

21 AI package tests + 11 ai-service tests passing.

---

## OWASP Top 10 (2021)

| OWASP | Status | Notes |
|-------|--------|-------|
| A01 Broken Access Control | ⚠️ | RBAC strong; RLS partial |
| A02 Cryptographic Failures | ✅ | bcrypt, JWT |
| A03 Injection | ✅ | Prisma parameterized |
| A04 Insecure Design | ✅ | Multi-tenant by design |
| A05 Security Misconfiguration | ⚠️ | ESLint missing; CORS TBD |
| A06 Vulnerable Components | ⚠️ | Dev deps have CVEs |
| A07 Auth Failures | ⚠️ | Email verification gap |
| A08 Software/Data Integrity | ✅ | Webhook signatures |
| A09 Logging Failures | ⚠️ | AI audit ephemeral |
| A10 SSRF | ⚠️ | Homework URLs |

---

## Secrets & Environment

- `.env.example` documents required vars (JWT_SECRET, DATABASE_URL, STRIPE_*, RAZORPAY_*, REDIS_URL)
- Production webhook handlers reject missing secrets when `NODE_ENV=production`
- No hardcoded production secrets found in source

---

## Fixes Applied This Validation

**None required for Critical blockers** — no Critical runtime issues found.

---

## Recommendations for v1.0

1. Complete RLS wiring (SEC-H1) — **P0**
2. Enforce email verification (SEC-H2) — **P0**
3. Implement password reset flow (SEC-M1) — **P1**
4. Homework URL domain allowlist (SEC-M5) — **P1**
5. Persist AI audit logs to PostgreSQL — **P1**
6. Third-party penetration test — **P0 before public launch**
7. Upgrade vitest to ≥3.2.6 — **P2**

---

## Security Launch Decision

| Launch type | Decision | Rationale |
|-------------|----------|-----------|
| Closed beta (≤5 schools) | **GO** | No Critical issues; High issues documented and mitigated by scale |
| Public v1.0 | **NO-GO** | SEC-H1, SEC-H2, no pen test, SSRF open |

**Security score: 7/10**
