# Phase 6 completion note — Backend hardening

**Date:** 2026-07-23  
**Status:** Complete — awaiting approval for Phase 7  
**Scope:** Cross-cutting `@eduai/nest-common`, five live Nest services (identity / learning / ai / erp / billing), OpenAPI generator, real ESLint, tenant/RBAC tests  
**Recovery:** Resumed substantial partial work from a prior failed Phase 6 agent attempt (no `phase-6-completion.md` yet; nest-common + service diffs already in the working tree).

## Delivered

### `@eduai/nest-common`
- Standard error envelope `{ code, message, details?, traceId }` (+ nested `error` for older clients)
- Trace/request ID middleware; Helmet (prod CSP/HSTS) + strict CORS allowlist (incl. `Idempotency-Key`, webhook signatures)
- Global `ValidationPipe` (whitelist / forbidNonWhitelisted / transform)
- Idempotency interceptor (in-process; Redis swap deferred Phase 7–8)
- Throttler presets: `default`, `auth`, `mutate`, `webhook` (+ per-service `ai`)
- Shared pagination DTO helpers; `assertSameTenant` / `tenantWhere`
- Redis-backed access-token revocation helper (`getAccessTokenRevocation`) — best-effort when `REDIS_URL` set
- Vitest: tenant helpers + error-filter envelope tests

### Services (identity / learning / ai / erp / billing)
- `configureNestApp` Swagger tags + docs/json/yaml endpoints per service
- JWT strategies keep `resolveJwtSecret`; revoke check wired on validate
- Auth stricter `@Throttle`; logout DTO; logout/logout-all revoke + audit
- Billing branding/subscriptions DTOs + mutate throttles + privileged `AuditLog` writes
- Webhook route webhook throttles
- Soft-delete / user admin tenant-scoped with audit

### OpenAPI clients
- Generator: `pnpm openapi:generate` → `backend/testing/scripts/openapi-generate.mjs`
- Package scaffold: `frontend/shared-ui/api-clients` (`@eduai/api-clients`)
- Full typed client commit requires running services locally (deferred until specs fetched)

### RBAC / tenant isolation tests
- `@eduai/auth` permission matrix extensions (parent / tenant_admin / student vs teacher)
- `@eduai/backend-unit-tests` Vitest suite: UsersService / SubscriptionsService / AttendanceService cross-tenant negatives (9 tests)
- Service-local Jest specs retained; **Jest relative `.ts` imports fail when the repo path contains spaces** (`AI Learning`) — Vitest is the Phase 6 DoD path; Jest modernization deferred Phase 10

### Lint / typing
- Shared ESLint flat config `backend/eslint/nest.flat.js`; real `lint` scripts (no echo) on five services + nest-common
- ADR 003: defer monorepo-wide `exactOptionalPropertyTypes`

## Deferred (intentional)

| Item | Follow-up |
|------|-----------|
| Commit generated OpenAPI TS clients from live specs | Run `pnpm openapi:generate` with `dev:backend` up |
| Redis-backed idempotency store | Phase 7–8 |
| Postgres RLS | Phase 9 defense-in-depth |
| `exactOptionalPropertyTypes` enable | ADR 003 / Phase 10 |
| Scaffold services lint (`notification`/`content`/`quiz`/`analytics`) | Remain echo until promoted |
| Jest green on spaced Windows paths | Phase 10 (Vitest covers isolation DoD) |
| Exhaustive DTO on every obscure scaffold route | Incremental; mutating payment/auth/branding covered |

## Key paths

- `backend/shared/nest-common/**`
- `backend/eslint/{nest.flat.js,jest.nest.cjs,ts-jest-transformer.cjs}`
- `backend/services/{identity,learning,ai,erp,billing}-service/**`
- `backend/testing/scripts/openapi-generate.mjs`
- `backend/testing/unit/**`
- `frontend/shared-ui/api-clients/**`
- `backend/docs/architecture/adr/003-exact-optional-property-types.md`
- `backend/docs/execution/hundred-cr-roadmap.md`

## Verify

```bash
pnpm --filter @eduai/nest-common build
pnpm --filter @eduai/nest-common --filter @eduai/auth test
pnpm --filter @eduai/backend-unit-tests test
pnpm --filter @eduai/identity-service --filter @eduai/learning-service --filter @eduai/ai-service --filter @eduai/erp-service --filter @eduai/billing-service typecheck
pnpm --filter @eduai/identity-service --filter @eduai/learning-service --filter @eduai/ai-service --filter @eduai/erp-service --filter @eduai/billing-service build
pnpm --filter @eduai/nest-common --filter @eduai/identity-service --filter @eduai/learning-service --filter @eduai/ai-service --filter @eduai/erp-service --filter @eduai/billing-service lint
```

## Results (2026-07-23)

| Command | Result |
|---------|--------|
| `@eduai/nest-common` build / typecheck / test | Pass (8 tests) |
| `@eduai/auth` test | Pass (7 tests) |
| `@eduai/backend-unit-tests` tenant isolation | Pass (9 tests) |
| Five services typecheck | Pass |
| Five services build | Pass |
| Five services + nest-common lint | Pass (warnings only; ≤ max-warnings) |
| Service Jest suites | Partial — path-with-spaces limitation; Vitest covers DoD |

**No DB migrations. No commit / push** (not requested). Demo login path preserved (`resolveJwtSecret` + existing auth DTOs).

**Phase 6 complete — awaiting approval for Phase 7.**
