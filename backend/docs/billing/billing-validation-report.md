# Billing Validation Report — Phase 5

**Date:** 2025-06-21  
**Script:** `backend/testing/scripts/billing-validation.mjs`

---

## Flows Validated

| Flow | Method | Status | Notes |
|------|--------|--------|-------|
| Health / readiness | Automated script | ✅ | DB connectivity |
| List plans | GET /plans | ✅ | Auth required in prod |
| Create subscription | POST /subscriptions | ⚠️ Manual | Requires admin JWT + Stripe/Razorpay keys |
| Invoice generation | Service logic | ✅ | Unit tests pass |
| Stripe webhook signature | POST /webhooks/stripe | ✅ | Rejects invalid sig in prod |
| Razorpay webhook HMAC | POST /webhooks/razorpay | ✅ | Rejects invalid sig in prod |
| Coupon validation | GET /coupons/validate | ✅ | Rate limited |
| Subscription renewal | Webhook-driven | ⚠️ Manual | Test with Stripe test mode |
| Cross-tenant isolation | Unit tests | ✅ | Sprint 4 fix verified |

---

## Manual Test Checklist

### Stripe (Test Mode)

- [ ] Create customer with test card `4242...`
- [ ] Subscribe to Starter plan
- [ ] Trigger `invoice.paid` webhook via CLI
- [ ] Verify invoice status = `paid` in admin
- [ ] Cancel subscription → verify access revoked at period end

### Razorpay (Test Mode)

- [ ] Create order for INR plan
- [ ] Complete test payment
- [ ] Verify webhook updates subscription
- [ ] Test failed payment webhook

### Coupons

- [ ] Apply valid coupon → discounted amount
- [ ] Expired coupon rejected
- [ ] Max redemptions enforced

---

## Run Validation Script

```bash
pnpm --filter @eduai/billing-service dev
node backend/testing/scripts/billing-validation.mjs --base http://localhost:3006
```

---

## Findings

| ID | Severity | Finding | Action |
|----|----------|---------|--------|
| BILL-M1 | Medium | No automated e2e payment test | Add Playwright + Stripe test mode in v1.0 |
| BILL-L1 | Low | Coupon enumeration possible | Accept for beta; CAPTCHA in v1.0 |

**Verdict:** Billing flows **ready for pilot** with manual webhook verification in staging.
