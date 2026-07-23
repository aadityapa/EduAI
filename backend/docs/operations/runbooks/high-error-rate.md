# Runbook — High 5xx error rate

**Alert:** `HighErrorRate`  
**SLO:** < 1% 5xx over 5 minutes

## Triage

1. Confirm scope: Grafana → Platform Overview → Error Rate panel; note `service` label.
2. Check recent deploys: `kubectl rollout history deployment/<svc> -n eduai-staging`.
3. Pull structured logs by `traceId` / service: CloudWatch / Loki `{service="<svc>"} |= "unhandled_exception"`.
4. Sentry (if DSN configured): filter by service tag.

## Mitigate

- Feature-flag off risky paths: `FEATURE_FLAGS_JSON` / `FF_*` (see `feature-flags.ts`).
- Roll back: `kubectl rollout undo deployment/<svc> -n eduai-staging` (see `deploy-rollback.md`).
- Scale if saturation: HPA / increase replicas.

## Escalate

On-call platform → service owner. Page if auth (identity) or payments (billing) > 5% for 10m.
