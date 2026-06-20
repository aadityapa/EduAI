# v1.0 Launch Blockers

**Date:** 2025-06-21  
**Decision:** NO-GO for v1.0.0  
**Current tag:** `v0.9.1-beta-hardening` (unchanged)

---

## P0 Blockers (Must fix before v1.0)

| ID | Blocker | Owner | Est. Fix Time | Status |
|----|---------|-------|---------------|--------|
| BLK-001 | **Content catalog <8/10** — only CBSE Class 8 demo (4 lessons, 1 quiz) | Product / Content | 8–12 weeks | Open |
| BLK-002 | **Load tests not executed** — k6 not run at 500/1000 VU against staging | DevOps / QA | 1 week | Open |
| BLK-003 | **No beta pilot feedback** — zero schools onboarded | Customer Success | 4–6 weeks | Open |
| BLK-004 | **RLS not fully wired** (SEC-H1) — 75% of tenant tables unprotected | Platform Eng | 2 weeks | Open |
| BLK-005 | **Email verification not enforced** (SEC-H2) | Identity team | 3 days | Open |
| BLK-006 | **No penetration test** | Security | 2 weeks | Open |
| BLK-007 | **Privacy policy + Terms not published** at public HTTPS URLs | Legal / Product | 1 week | Open |
| BLK-008 | **Mobile production API URLs** — app.json uses localhost | Mobile Eng | 2 days | Open |

---

## P1 Blockers (Should fix before v1.0)

| ID | Blocker | Owner | Est. Fix Time | Status |
|----|---------|-------|---------------|--------|
| BLK-009 | ESLint not configured for web/admin — `pnpm lint` fails | Frontend | 1 day | Open |
| BLK-010 | E2E tests not in CI (`e2e/tests/` exists but unwired) | QA | 1 week | Open |
| BLK-011 | Sentry error tracking not integrated | Platform Eng | 3 days | Open |
| BLK-012 | Payment validation not run live (Stripe/Razorpay sandbox) | Billing | 3 days | Open |
| BLK-013 | Password reset is stub | Identity | 1 week | Open |
| BLK-014 | Push notifications not configured (FCM/APNs) | Mobile | 1 week | Open |
| BLK-015 | App Store / Play Store assets (screenshots, listings) | Product / Design | 1 week | Open |
| BLK-016 | DR timed restore drill not executed | DevOps | 2 days | Open |

---

## P2 Improvements (Post-v1.0 or parallel track)

| ID | Item | Owner | Est. Fix Time |
|----|------|-------|---------------|
| BLK-017 | Upgrade vitest to ≥3.2.6 (CVE) | Platform Eng | 1 day |
| BLK-018 | Homework URL SSRF allowlist | AI team | 3 days |
| BLK-019 | Persist AI audit logs | AI team | 1 week |
| BLK-020 | Scaffold services (content, notification, quiz, analytics) — implement or remove | Architecture | 4+ weeks |
| BLK-021 | Frontend unit tests (web/admin) | Frontend | 2 weeks |
| BLK-022 | PgBouncer for 2000+ concurrent users | DevOps | 3 days |

---

## Critical Path to v1.0

```
Week 1–2:   BLK-004, BLK-005, BLK-008, BLK-009 (engineering quick wins)
Week 2–3:   BLK-002, BLK-011, BLK-012 (staging deploy + validation)
Week 3–4:   BLK-007, BLK-006 (legal + pen test)
Week 4–8:   BLK-003 (pilot schools)
Week 1–12:  BLK-001 (content production — longest pole)
Week 12:    Re-run full launch validation → target v1.0.0 tag
```

---

## What IS Ready (Closed Beta)

- Monorepo builds (20/20 packages)
- 69 unit tests passing
- 5 microservices with health endpoints
- RBAC with 100+ permissions
- Payment webhook code with signature verification
- k6 load test scripts (configs ready)
- Pilot onboarding documentation
- Terraform/K8s infrastructure definitions

**Proceed with closed beta under `v0.9.1-beta-hardening`. Do not promote to v1.0.0 until all P0 blockers are closed and launch validation re-run passes.**
