# Phase 9 completion note — Security & compliance

**Date:** 2026-07-23  
**Status:** Complete — awaiting approval for Phase 10  
**Scope:** DPDP Consent + DSR models/APIs, parental consent scaffolding, threat model & residency docs, OWASP ASVS checklist, field encryption helpers, immutable audit + login anomalies, SSRF/upload hardening, fail-closed `AUTH_SECRET`, CI secret/deps scans

## Assumptions (not legal advice)

- Engineering ships mechanisms; **legal DPDP sign-off is Phase 12**.
- Unknown DOB is treated as minor for parental-grant paths (fail closed).
- OTP plaintext is never stored; hashed evidence only (dev may echo OTP in API response when `NODE_ENV !== production`).
- Erasure anonymizes identity fields + sessions; deep purge of learning history is deferred.
- AI subprocessors may process prompts outside India when keys are configured — disclosed in residency doc.

## Delivered

### Prisma (additive migration `20260723180000_phase9_dpdp_security`)
- Models: `ConsentRecord`, `DataSubjectRequest` + enums
- Immutable `audit_logs` triggers (block UPDATE/DELETE)
- RLS policies on consent/DSR (NULL-bypass pattern; see evaluation doc)

### Identity APIs
- `GET/POST /api/v1/consent`, `POST /consent/:id/verify`, `POST /consent/:id/withdraw`
- `GET/POST /api/v1/privacy/dsr`, `GET /privacy/dsr/:id/export`, `PATCH /privacy/dsr/:id`
- Tenant list endpoints for admin
- RBAC: `consent:*`, `privacy:*` permissions on roles
- Failed login → audit + anomaly counter

### Shared security (`@eduai/shared`)
- `encryptField` / `decryptField` (AES-256-GCM)
- `assertSafeExternalUrl` SSRF allowlist
- `validateUploadFile` + `scanUpload` hook
- `recordFailedLogin` / `emitAnomaly`
- `resolveAuthSecret` **fail-closed in production**

### Hardening
- Homework `imageUrl`/`pdfUrl` SSRF checks (ai-service)
- FileUploader MIME + path-safe validation
- CI: gitleaks + `pnpm audit` + `scripts/security/ci-security-scan.mjs`

### Docs & UI
- `threat-model.md`, `data-residency.md`, `owasp-asvs-checklist.md`, `postgres-rls-evaluation.md`
- Extended `SECURITY.md`
- Parent `/parent/privacy` + admin `/dashboard/privacy`

## Deferred (intentional)

| Item | Follow-up |
|------|-----------|
| Legal DPIA / DPDP opinion | Phase 12 |
| Live ClamAV sidecar | Ops: `SCAN_WEBHOOK_URL` |
| Encrypt legacy `users.phone` in place | Opt-in migration later (demo-safe) |
| SET LOCAL `app.tenant_id` for strict RLS | Phase 11+ |
| MFA | Post–Phase 9 |
| Email delivery of parental OTP | Scaffold only (hash + verify) |

## Key paths

- `backend/database/prisma/schema.prisma` + `migrations/20260723180000_phase9_dpdp_security/`
- `backend/services/identity-service/src/{consent,privacy,auth}/**`
- `backend/shared/shared/src/security/**`
- `backend/shared/auth/src/permissions.ts`
- `backend/services/ai-service/src/homework/homework.service.ts`
- `backend/docs/security/{threat-model,data-residency,owasp-asvs-checklist,postgres-rls-evaluation}.md`
- `SECURITY.md`, `.github/workflows/ci.yml`, `scripts/security/ci-security-scan.mjs`
- `frontend/web/src/app/parent/privacy/**`, `frontend/admin/src/app/dashboard/privacy/**`

## Verify

```bash
pnpm --filter @eduai/database generate
pnpm --filter @eduai/database build
pnpm --filter @eduai/shared build && pnpm --filter @eduai/shared test
pnpm --filter @eduai/auth build && pnpm --filter @eduai/auth test
pnpm --filter @eduai/identity-service typecheck && pnpm --filter @eduai/identity-service test
pnpm --filter @eduai/identity-service build
pnpm --filter @eduai/ai-service typecheck && pnpm --filter @eduai/ai-service build
pnpm --filter @eduai/i18n build
pnpm security:scan
```

## Results (2026-07-23)

| Command | Result |
|---------|--------|
| `@eduai/database` generate + build | Pass |
| `@eduai/shared` build + test | Pass (17 tests) |
| `@eduai/auth` build + test | Pass (9 tests) |
| `@eduai/identity-service` typecheck + build + jest | Pass |
| `@eduai/backend-unit-tests` (consent-dsr + tenant) | Pass (25 tests) |
| `@eduai/ai-service` typecheck + build | Pass |
| `@eduai/i18n` build | Pass |
| `pnpm security:scan` | Pass |
| `@eduai/web` / `@eduai/admin` typecheck | Pass |

Consent/DSR service tests live under Vitest (`backend/testing/unit/consent-dsr.test.ts`) because Jest relative imports fail when the monorepo path contains spaces (documented in `jest.nest.cjs`).

Additive migration only. **No commit / push.** Demo logins preserved (dev AUTH/JWT fallbacks unchanged outside production).

**Phase 9 complete — awaiting approval for Phase 10.**
