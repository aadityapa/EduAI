# Operations Guide

## Daily Operations

| Task | Command / Location |
|------|-------------------|
| Check service health | `kubectl get pods -n eduai-staging` |
| View logs | `kubectl logs -f deployment/identity-service -n eduai-staging` |
| DB migrations | `pnpm db:migrate` (via CI or manual job) |
| Seed demo tenant | `pnpm db:seed` |

## Monitoring

- **Grafana:** Import dashboards under `backend/infrastructure/monitoring/grafana/dashboards/` (platform-overview, ai-service, business-kpis)
- **Alerts:** `backend/infrastructure/monitoring/alerting-rules.yml` (each alert links a runbook)
- **Runbooks:** [`runbooks/`](runbooks/) — high error rate, latency, service down, deploy/rollback, Redis, resources
- **On-call:** [`on-call-incident-response.md`](on-call-incident-response.md)
- **Metrics:** scrape `/api/v1/metrics` on each Nest service; Prometheus at `:9090` in monitoring namespace
- **Sentry / OTel:** env-gated; see `.env.example` and `sentry.env.example`

## Incident Response

1. Acknowledge alert → open linked runbook
2. Check Grafana platform overview / business KPIs
3. Capture `traceId` from error envelope / structured logs
4. Mitigate via feature flag or `kubectl rollout undo` ([`runbooks/deploy-rollback.md`](runbooks/deploy-rollback.md))
5. See `disaster-recovery.md` for DB recovery; `pnpm validate:dr` for drill checklist

## Tenant Onboarding

See [`school-onboarding-guide.md`](school-onboarding-guide.md).

## Security

- Rotate JWT_SECRET quarterly
- Verify webhook secrets in Stripe/Razorpay dashboards
- Review audit logs via admin `/dashboard/audit-logs`

## Backups

- RDS automated snapshots (7-day retention)
- Manual snapshot before major migrations
- S3 versioning enabled for content assets
