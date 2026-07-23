# Runbook — Service down (Prometheus `up == 0`)

**Alert:** `IdentityServiceDown` / `LearningServiceDown` (extend for others)

## Triage

1. `kubectl get pods -n eduai-staging -l app=<service>`
2. `kubectl describe pod …` / `kubectl logs … --previous`
3. Health: `curl http://<svc>:<port>/api/v1/health`
4. Metrics scrape: `curl http://<svc>:<port>/api/v1/metrics | head`

## Mitigate

- Restart deployment if crash-loop with known bad config.
- Roll back last release (`deploy-rollback.md`).
- Verify secrets / ConfigMap (`JWT_SECRET`, `DATABASE_URL`, `OTEL_*`).

## Escalate

Identity down blocks all logins — P1. Learning down blocks student journeys — P1 during school hours.
