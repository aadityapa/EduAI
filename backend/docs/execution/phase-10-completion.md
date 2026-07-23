# Phase 10 completion — Testing & observability

**Date:** 2026-07-23  
**Status:** Complete  
**Scope:** Test pyramid scaffolding, OTel/W3C tracing, Prometheus RED metrics, structured logs, Sentry env-gated init, coverage gates, Playwright smoke + axe, contract fixtures, Storybook/Chromatic notes

## Delivered

### Observability (`@eduai/nest-common`)
- `initObservability()` before Nest bootstrap (all 5 services)
- W3C `traceparent` + `x-trace-id` propagation; error envelope retains `traceId`
- Prometheus text exposition at `/api/v1/metrics` (RED: `http_requests_total`, `http_request_duration_seconds`)
- Structured JSON access + error logs
- Sentry soft-init when `SENTRY_DSN` set (dynamic `@sentry/node`; PII scrubbing)
- OTel NodeSDK soft-init when `OTEL_EXPORTER_OTLP_ENDPOINT` + packages present
- Alert rules annotated with runbook URLs; runbooks under `docs/operations/runbooks/`

### Frontend Sentry
- Env-gated scaffolding: web / admin / mobile (`NEXT_PUBLIC_SENTRY_DSN` / `EXPO_PUBLIC_SENTRY_DSN`)

### Testing
- `@eduai/e2e` Playwright package: portal smoke, a11y axe on login, `@live` optional
- `@eduai/contract-tests` OpenAPI fixture verification
- Coverage thresholds on critical Vitest modules (`nest-common` observability/flags/trace/errors; `@eduai/auth`)
- Jest coverageThreshold scaffold (enforced when `--coverage`)
- Chromatic notes (ADR 002 follow-up)

### AI metrics
- `MetricsService` writes into shared `ai-service` Prometheus registry (compatible with alerts)

## Signed exceptions

| Item | Reason |
|------|--------|
| Full OTel auto-instrumentation packages | Soft-load; install `@opentelemetry/sdk-node` + OTLP exporter in deploy images when collector live |
| `@sentry/*` not added as hard deps | Avoid unused SaaS SDK until DSN provisioned; dynamic import |
| E2E full journeys (quiz/billing/cross-tenant UI) | Require live Nest stack; `@live` gated; CI runs `@smoke` only |
| k6 in CI | Binary often absent locally; Phase 8 reports remain source of truth |
| Full portal axe without Radix exception | Login smoke disables `aria-valid-attr-value` (Radix Tabs ID false positive) |

| Trace quiz across Tempo live | Needs deployed collector; local W3C + metrics verified in unit tests |

## Key paths

- `backend/shared/nest-common/src/observability/**`
- `backend/shared/nest-common/src/feature-flags/**` (shared with Phase 11)
- `backend/services/*/src/main.ts`
- `backend/testing/e2e/**`, `backend/testing/contract/**`
- `frontend/{web,admin}/src/lib/sentry.ts`, `frontend/mobile/src/lib/sentry.ts`
- `backend/docs/operations/runbooks/**`
- `backend/docs/testing/chromatic-storybook-notes.md`

### Results (2026-07-23)

| Command | Result |
|---------|--------|
| `@eduai/nest-common` build + test + coverage | Pass (22 tests; critical module coverage ≥70%) |
| `@eduai/auth` test:coverage | Pass (9 tests; permissions ~99%) |
| `pnpm test:contract` | Pass (5 fixtures) |
| All 5 Nest services typecheck | Pass |
| `@eduai/web` / `@eduai/admin` typecheck | Pass |
| `pnpm build-storybook` | Pass |
| Playwright `@smoke` / a11y | Pass (critical axe gate; color-contrast serious residual) |
| CI/deploy YAML parse | Pass |

**No commit / push.** Demo logins preserved.
