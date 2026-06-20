# Sprint 5 — Mobile + White Label + Production (Scaffold Status)

**Sprint theme:** React Native apps, White label, Subscriptions, Production infra  
**Status:** Scaffolded / Deferred

---

## Scope (Planned)

- React Native apps (student, parent, teacher) with offline, push, AI
- White label: custom domains, logos, colors
- Subscription system + Razorpay/Stripe
- Production infra: K8s manifests, Terraform, monitoring
- App store readiness

---

## Current State

| Item | Status |
|------|--------|
| `apps/mobile` Expo 52 | 🔶 Placeholder screen |
| `tenants.custom_domain` | 🔶 Schema field only |
| `tenant_branding` table | 📄 Documented, not migrated |
| `infrastructure/kubernetes` | 🔶 README placeholder |
| `infrastructure/terraform` | 🔶 README placeholder |
| Payment integration | ❌ Not started |

---

## Production Readiness Checklist (Future)

- [ ] K8s deployments for identity, learning, ai services
- [ ] Terraform modules for AWS EKS + RDS + ElastiCache
- [ ] Prometheus/Grafana dashboards
- [ ] Sentry error tracking
- [ ] CI/CD deploy pipeline (staging → production)
- [ ] Razorpay/Stripe webhook handlers
- [ ] App Store / Play Store submission docs
- [ ] White label DNS + TLS automation

---

## Mobile App Architecture (Planned)

```
apps/mobile (Expo)
  ├── student tab: dashboard, courses, AI tutor
  ├── parent tab: children, reports
  └── shared: @eduai/i18n, offline cache (SQLite)
```

APIs from Sprint 2–3 are mobile-ready (JWT Bearer auth).

---

*Sprint 5 deferred. Sprint 2 learning platform and Sprint 3 AI foundation are production-ready for local/staging deployment.*
