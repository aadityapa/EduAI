# EduAI AI Security Report — Sprint 3

**Date:** June 2025  
**Classification:** Internal — Engineering  
**Scope:** AI input/output pipeline, auth, rate limits, audit

---

## Threat Model

| Threat | Mitigation | Status |
|--------|------------|--------|
| Prompt injection | Pattern-based `guardPrompt()` in `@eduai/ai` + service validation | ✅ Implemented |
| Harmful content generation | `filterContent()` output filter | ✅ Implemented |
| Unauthorized AI access | JWT + RBAC (`ai:tutor:use:own`, etc.) | ✅ Implemented |
| Cross-tenant data leak | All queries scoped by `tenantId` + `userId` | ✅ Implemented |
| API abuse / cost drain | Throttler + daily token quota | ✅ Implemented |
| Credential theft | API keys server-side only; `.env` gitignored | ✅ Implemented |
| Audit trail gaps | In-memory audit log (1000 entries) | ⚠️ Partial |

---

## Implemented Controls

### Input Validation (`backend/shared/ai/src/security/prompt-guard.ts`)

- Max message length: 8,000 characters
- Blocks common injection patterns (ignore instructions, jailbreak, script tags)
- Sanitizes control characters

### Output Filtering (`backend/shared/ai/src/security/content-filter.ts`)

- Blocks known harmful content patterns
- Applied to all chat and stream responses

### Rate Limiting (`ai-service` ThrottlerModule)

| Bucket | TTL | Limit |
|--------|-----|-------|
| default | 60s | 120 req |
| ai | 60s | 30 req |
| auth | 15m | 20 req |

### Quota Enforcement (`CostService`)

- Daily budget = `tenant.aiMonthlyTokenBudget / 30`
- Returns `403 Forbidden` when exceeded

### Audit Logging (`AuditService`)

- Records: tenantId, userId, action, feature, metadata
- Actions: `ai.request`, `ai.request` (stream)
- **Gap:** Not persisted to database

---

## RBAC Matrix (AI Permissions)

| Permission | Student | Teacher | Parent | Tenant Admin |
|------------|---------|---------|--------|--------------|
| `ai:tutor:use:own` | ✅ | ✅ | ✅ | — |
| `ai:homework:use:own` | ✅ | ✅ | — | — |
| `ai:qpg:use:school` | — | ✅ | — | — |
| `ai:quota:manage:tenant` | — | — | — | ✅ |

---

## Residual Risks

1. **Sophisticated jailbreaks** — Pattern matching is not sufficient alone; recommend Azure/OpenAI moderation API in production.
2. **Image-based attacks** — Vision OCR path does not filter image content before sending to provider.
3. **Audit compliance** — In-memory logs lost on restart; SOC2 requires durable storage.
4. **Parent tutor access** — Parents can use tutor but not homework assistant; intentional scope decision.

---

## Recommendations

| Priority | Action |
|----------|--------|
| P0 | Add `ai_audit_logs` table + Prisma migration |
| P1 | Integrate provider moderation API (OpenAI `moderations`) |
| P1 | Add request signing for internal service-to-service calls |
| P2 | PII detection/redaction before provider calls |
| P2 | Per-tenant IP rate limits at API gateway |

---

## Conclusion

Security posture is **adequate for staging/beta** with authenticated users and quota controls. **Production hardening** requires durable audit logs and provider-level moderation before handling real student PII at scale.
