# Beta Launch Checklist — Phase 5

**Target:** Closed beta with 3–5 pilot schools  
**Tag:** `v0.9.1-beta-hardening`

---

## Engineering

- [x] Phase 5 hardening merged
- [x] Production hardening report published
- [x] Load test configs in `tests/load/`
- [x] Security review updated
- [ ] Sentry DSN configured in staging/prod
- [ ] Redis enabled for rate limiting in staging
- [ ] Full k6 run against staging (500 VU)

## Content

- [x] Content data model documented
- [x] Content production SOP published
- [ ] Minimum viable catalog: 1 board × 2 classes × 3 subjects (pilot)

## Pilot Operations

- [x] School onboarding guide
- [x] Teacher / parent / student guides
- [x] Support SOP
- [ ] CSM assigned per pilot school
- [ ] WhatsApp support channel live

## Mobile & Stores

- [x] Mobile readiness report
- [x] App store listing templates
- [ ] TestFlight + Play Internal Testing builds uploaded
- [ ] Privacy policy published at public URL

## Billing

- [x] Webhook signature validation
- [x] Billing validation script
- [ ] Stripe/Razorpay test transactions in staging

## Go-Live Day

- [ ] Smoke test all roles on production subdomain
- [ ] Enable monitoring alerts to on-call
- [ ] Send welcome email to pilot schools
- [ ] War room channel open for 48 hours

---

## Rollback Plan

1. Revert K8s deployment to previous image tag
2. Disable new school signups in admin
3. Communicate via status page within 30 minutes
