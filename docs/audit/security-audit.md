# Security Audit — EduAI Platform

**Date:** 2025-06-21  
**Classification:** Internal — Pre-Production

---

## Findings Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 2 | ✅ Fixed |
| High | 5 | ✅ 3 Fixed, 2 Deferred |
| Medium | 8 | 📋 Tracked |
| Low | 5 | 📋 Tracked |

---

## Critical (Fixed)

### SEC-C1: Self-Service Role Escalation
- **Risk:** Public register accepted `tenant_admin`, `teacher`, etc.
- **Fix:** `SELF_REGISTER_ROLES` allowlist (`student`, `parent`) in `auth.service.ts`
- **File:** `services/identity-service/src/auth/auth.service.ts`

### SEC-C2: Unverified Payment Webhooks
- **Risk:** Forged Stripe/Razorpay events could mark invoices paid
- **Fix:** Stripe signature verification via `constructEvent`; Razorpay HMAC-SHA256; production rejects missing secrets; idempotent paid check + amount validation
- **File:** `services/billing-service/src/webhooks/webhooks.service.ts`

---

## High

### SEC-H1: Cross-Tenant Billing Exposure ✅ Fixed
- **Risk:** `listAllSubscriptions()` / `listAllInvoices()` returned all tenants for any `billing:manage:tenant` user
- **Fix:** Filter by `user.tenantId` unless `tenants:manage:global`

### SEC-H2: Default JWT Secret ✅ Fixed
- **Risk:** `'change-me-in-production'` fallback in all services
- **Fix:** `resolveJwtSecret()` throws in `NODE_ENV=production`

### SEC-H3: RLS Not Wired — Deferred
- **Risk:** App-layer filtering only; RLS NULL bypass
- **Plan:** Sprint 5 infra + middleware wiring

### SEC-H4: Stale JWT Permissions — Accepted for Beta
- **Mitigation:** 15-minute access token TTL; refresh rotation

### SEC-H5: Homework SSRF — Deferred
- **Risk:** User-controlled `imageUrl` passed to vision API
- **Plan:** Domain allowlist in v1.0

---

## Medium

| ID | Finding | Recommendation |
|----|---------|----------------|
| SEC-M1 | Email verification not enforced on login | Gate login on `emailVerifiedAt` for production |
| SEC-M2 | `/auth/refresh` unthrottled | Add `@Throttle` |
| SEC-M3 | AI stream skips output filter | Apply `filterOutput()` on SSE chunks |
| SEC-M4 | Regex-only prompt injection defense | Add LLM guardrails layer |
| SEC-M5 | AI audit logs in-memory | Persist to `audit_logs` table |
| SEC-M6 | Metrics endpoint was public | Changed to `@Internal()` |
| SEC-M7 | In-memory rate limiter | Redis store in production |
| SEC-M8 | Swagger exposed in prod | Disable via env flag |

---

## Low

| ID | Finding |
|----|---------|
| SEC-L1 | Forgot-password returns email in response |
| SEC-L2 | OAuth/OTP/password-reset stubs return 501 |
| SEC-L3 | Public coupon validation enables enumeration |
| SEC-L4 | `$executeRawUnsafe` for tenant context (UUID-validated) |
| SEC-L5 | CORS limited to localhost — must configure for prod |

---

## Positive Controls

- bcrypt cost factor 12 + SHA-256 refresh token hashing
- Global JwtAuthGuard + PermissionGuard on all microservices
- ValidationPipe whitelist + forbidNonWhitelisted
- Helmet on all backend services
- Quiz API strips `isCorrect` from student responses
- AI daily token quota enforcement
- ERP queries consistently scoped by `user.tenantId`

---

## Auth & Authorization Matrix

| Layer | Implementation |
|-------|----------------|
| Authentication | JWT Bearer + refresh rotation (identity-service) |
| Authorization | RBAC matrix in `@eduai/auth` (100+ permissions) |
| Multi-tenant | `tenant_id` claim + query filtering |
| RLS | Partial PostgreSQL policies (14 tables) |
| Rate limiting | NestJS Throttler (120/min default; auth 5/15min login) |
| AI security | Prompt guard, content filter, quota, permission gates |

---

## Payment Security

| Control | Status |
|---------|--------|
| No card data stored | ✅ Provider-handled |
| GST calculated server-side | ✅ |
| Webhook signature verification | ✅ Fixed |
| Idempotent payment processing | ✅ Fixed |
| Tenant-scoped invoice access | ✅ |

---

## Sign-Off

Critical and high-severity blockers remediated. Platform approved for **v0.9.0-beta** staging deployment with documented deferred items for v1.0.
