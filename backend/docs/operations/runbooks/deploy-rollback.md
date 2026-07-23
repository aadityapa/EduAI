# Runbook — Deploy & automatic rollback

## Staging → production gates

1. CI green on `master`/`main` (typecheck, lint, unit, coverage critical, contract, build, Storybook, E2E smoke).
2. `deploy.yml` **staging** environment applies manifests + smoke health.
3. On rollout/smoke failure, workflow runs `kubectl rollout undo` for identity/learning/web.
4. **Production** job requires `workflow_dispatch` with `target=production` and GitHub Environment reviewers.

## Manual rollback

```bash
kubectl rollout undo deployment/identity-service -n eduai-staging
kubectl rollout status deployment/identity-service -n eduai-staging --timeout=3m
```

## Migrations

- Forward-only Prisma migrations; run `prisma migrate deploy` before cutting traffic to new pods when schema changes.
- Reversible strategy: expand/contract; never destructive drops without Phase sign-off.
- Demo seeds must remain loadable after migrate (`pnpm db:seed`).

## Feature flags

Env-based flags (`FEATURE_FLAGS_JSON`, `FF_*`) gate risky launches without redeploying binaries. See `@eduai/nest-common` `isFeatureEnabled`.

## Zero-downtime

Prefer rolling updates (K8s Deployment default). Blue-green optional when migration coupling requires dual-write — document per release.
