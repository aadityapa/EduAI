# Beta Launch Guide

## Pre-Launch (T-7 days)

- [ ] Deploy staging environment (Terraform + K8s)
- [ ] Run `pnpm build && pnpm test`
- [ ] Verify demo tenant seed
- [ ] Configure Stripe/Razorpay test mode webhooks
- [ ] Set up Grafana dashboards
- [ ] Prepare beta invite list (50–100 schools)

## Launch Day (T-0)

1. Tag release: `v0.9.0-beta`
2. Deploy to staging via GitHub Actions
3. Send beta invite emails with credentials
4. Publish mobile app to TestFlight / Play Internal Testing
5. Monitor Grafana for 24 hours

## Beta User Onboarding

**Web:** https://staging.eduai.in  
**Admin:** https://admin.staging.eduai.in  
**Demo:** `admin@demo.eduai.in` / `Demo1234!`

### Roles to Test
- Student: courses, AI tutor, quizzes
- Teacher: attendance, assignments
- Parent: fees, child reports
- Admin: billing, CRM, branding

## Feedback Collection

- In-app support tickets via erp notifications
- Admin CRM leads/tickets dashboard
- Weekly beta survey (Google Form)

## Success Metrics

| Metric | Target (Beta) |
|--------|---------------|
| Uptime | 99.5% |
| Login success rate | > 98% |
| AI tutor response | < 5s p95 |
| Mobile crash rate | < 1% |

## Exit Criteria for v1.0

- 30 days stable beta
- All P1 security items resolved
- App Store approval received
- 10+ paying school tenants
