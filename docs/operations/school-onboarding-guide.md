# School Onboarding Guide

## Step 1: Create Tenant

1. Platform admin creates tenant via admin dashboard
2. Set `slug`, `type` (single_school, coaching_institute, franchise, white_label)
3. Choose `subscription_tier`

## Step 2: Subscription

```bash
POST /api/v1/subscriptions/trial
{ "planCode": "school_starter", "trialDays": 14 }
```

Or configure Stripe/Razorpay subscription via billing webhooks.

## Step 3: Branding

Configure logo, colors, domain via `/dashboard/branding` or PATCH `/api/v1/branding`.

## Step 4: School Setup

1. Create school record linked to tenant
2. Create academic classes for current year
3. Import students/teachers (CSV or admin UI)

## Step 5: Content

1. Assign board (CBSE/ICSE)
2. Enroll students in courses
3. Configure AI token budget in tenant settings

## Step 6: Go Live

1. Verify custom domain DNS
2. Send welcome emails to admins
3. Share mobile app download links
4. Schedule teacher training session

## Demo Checklist

- [ ] Admin can login at admin portal
- [ ] Teacher can mark attendance
- [ ] Student can access courses + AI tutor
- [ ] Parent can view child fees
- [ ] Mobile app login works

## Support

Create support ticket via admin CRM or `POST /api/v1/crm/tickets`.
