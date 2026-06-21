# Operations Guide

## Daily Operations

| Task | Command / Location |
|------|-------------------|
| Check service health | `kubectl get pods -n eduai-staging` |
| View logs | `kubectl logs -f deployment/identity-service -n eduai-staging` |
| DB migrations | `pnpm db:migrate` (via CI or manual job) |
| Seed demo tenant | `pnpm db:seed` |

## Monitoring

- **Grafana:** Import `backend/infrastructure/monitoring/grafana/dashboards/platform-overview.json`
- **Alerts:** `backend/infrastructure/monitoring/alerting-rules.yml`
- **Metrics:** Prometheus at `:9090` in monitoring namespace

## Incident Response

1. Check Grafana platform overview dashboard
2. Identify failing service via health endpoints
3. Roll back deployment if needed
4. See `disaster-recovery.md` for DB recovery

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
