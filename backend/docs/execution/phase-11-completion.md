# Phase 11 completion — CI/CD & release

**Date:** 2026-07-23  
**Status:** Complete  
**Scope:** Hardened CI matrix, staging→prod deploy gates + rollback, feature flags, infra/DR/runbook docs

## Delivered

### CI (`.github/workflows/ci.yml`)
- Secret scan, audit, security scripts
- Lint, typecheck, unit tests, **critical coverage**, **contract fixtures**, build
- **Storybook static build**
- **Playwright `@smoke`** (chromium)
- Optional Chromatic when `CHROMATIC_PROJECT_TOKEN` set
- Concurrency cancel-in-progress; pnpm cache

### CD (`.github/workflows/deploy.yml`)
- Staging deploy on push (when AWS secrets present)
- Rollout wait + **automatic `kubectl rollout undo` on failure**
- Smoke health curls
- Production job: `workflow_dispatch` + GitHub `production` environment (manual approval)
- Migration gating notes → runbook

### Feature flags
- `@eduai/nest-common` `loadFeatureFlags` / `isFeatureEnabled` (`FEATURE_FLAGS_JSON`, `FF_*`)

### Docs
- `runbooks/deploy-rollback.md`, on-call guide, `infra-review-phase11.md`
- Alert → runbook links

## Signed exceptions

| Item | Reason |
|------|--------|
| Staging deploy not executed here | No AWS OIDC secrets in agent environment; workflow correctly no-ops |
| Blue-green | Rolling updates documented; blue-green optional for coupled migrations |
| Terraform apply | Doc review only (`infra-review-phase11.md`) |
| DR timed restore | Checklist via `pnpm validate:dr`; full timed drill needs staging AWS |

## Key paths

- `.github/workflows/ci.yml`, `deploy.yml`
- `backend/docs/operations/runbooks/**`
- `backend/docs/operations/infra-review-phase11.md`
- `backend/docs/operations/on-call-incident-response.md`
- `backend/shared/nest-common/src/feature-flags/**`
