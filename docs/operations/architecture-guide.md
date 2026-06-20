# Architecture Guide

## System Overview

```
                    ┌─────────────┐
                    │  CloudFront │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌──────────┐     ┌───────────┐
    │   Web   │      │  Admin   │     │  Mobile   │
    │  :3000  │      │  :3002   │     │   Expo    │
    └────┬────┘      └────┬─────┘     └─────┬─────┘
         │                │                  │
         └────────────────┼──────────────────┘
                          ▼
              ┌───────────────────────┐
              │    ALB / Ingress      │
              └───────────┬───────────┘
                          │
    ┌─────────┬─────────┬─┴───┬─────────┬─────────┐
    ▼         ▼         ▼     ▼         ▼         ▼
 Identity  Learning   AI    ERP    Billing   Redis
  :3001     :3003    :3004  :3005    :3006
    │         │         │     │         │
    └─────────┴─────────┴──┬──┴─────────┘
                           ▼
                    ┌─────────────┐
                    │ RDS Postgres│
                    └─────────────┘
```

## Multi-Tenancy

- `tenant_id` on all business tables
- JWT carries `tenant_id` + roles + permissions
- Partial PostgreSQL RLS on ERP/billing tables
- White-label via `tenant_branding` + `TenantThemeProvider`

## Service Boundaries

| Service | Owns |
|---------|------|
| identity | Auth, users, sessions |
| learning | Courses, quizzes, gamification |
| ai | Tutor, homework, planner, generators |
| erp | Attendance, fees, exams, assignments |
| billing | Subscriptions, invoices, CRM, branding |

## Observability

- Prometheus scrapes `/metrics` (internal)
- Grafana dashboards in `infrastructure/monitoring/`
- OpenTelemetry collector for distributed traces
- Sentry for error tracking (stub config)
