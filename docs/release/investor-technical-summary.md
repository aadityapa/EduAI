# Investor Technical Summary — EduAI

**Version:** v0.9.0-beta  
**Date:** June 2025

---

## Executive Summary

EduAI is an AI-powered, multi-tenant education SaaS platform serving K-10 schools, coaching institutes, and franchises across India. The platform combines learning management, school ERP, AI tutoring, and subscription billing in a unified Turborepo monorepo with production-ready AWS infrastructure.

---

## Platform Metrics

| Metric | Value |
|--------|-------|
| Services | 5 microservices + 3 apps |
| Database models | 55 |
| Unit tests | 50+ |
| Supported locales | 3 (en, hi, mr) |
| Target market | 1.5M+ schools in India |

---

## Technology Stack

- **Frontend:** Next.js 15, React Native/Expo 52, Tailwind, Shadcn UI
- **Backend:** NestJS 10, PostgreSQL 16, Prisma, Redis
- **AI:** OpenAI/Gemini with prompt guard, quota management
- **Infra:** AWS EKS, RDS, ElastiCache, CloudFront, Terraform
- **Payments:** Stripe + Razorpay with GST invoicing

---

## Competitive Differentiation

1. **AI-native learning** — Tutor, homework analyzer, study planner, content generators
2. **Unified ERP + LMS** — Attendance, fees, exams integrated with courses
3. **White-label ready** — Custom branding, domains, mobile app names
4. **India-first** — CBSE/ICSE boards, Hindi/Marathi i18n, GST billing, Razorpay

---

## Roadmap

### v0.9 Beta (Current)
- Mobile apps (student/parent/teacher)
- Production infrastructure on AWS ap-south-1
- White-label branding
- Closed beta with 50–100 schools

### v1.0 Launch (Q3 2025)
- App Store / Play Store public release
- Redis rate limiting, integration tests
- Email verification, full RLS
- 100+ paying tenants target

### v2.0 Scale (2026)
- Multi-region deployment
- OpenSearch content discovery
- Franchise analytics dashboard
- API marketplace for third-party integrations
- 10,000+ schools, ₹50Cr ARR target

---

## Security & Compliance

- Pre-production security audit completed (GO decision)
- RBAC with 100+ granular permissions
- JWT auth with refresh rotation
- Payment webhook signature verification
- DPDP-ready data localization (ap-south-1)

---

## Team & Execution

Sprint-based delivery: 5 sprints completed from monorepo foundation to production beta in ~6 months. Architecture supports horizontal scaling to 100k+ concurrent users with documented scaling guide.

---

## Ask

Seeking seed funding for v1.0 launch: App Store marketing, sales team (5 BDEs), and AWS production scale-up.
