# Sprint 4 Gap Analysis

**Date:** June 21, 2025  
**Baseline:** Sprint 3 complete (commit 0fd46cc)  
**Branch:** `feature/sprint-4-enterprise`

---

## Executive Summary

Sprint 1–3 delivered multi-tenant auth, learning platform, and AI features. Sprint 4 closes the enterprise gap with School ERP, Teacher/Parent portals, Admin CRM, billing foundation, RLS, and analytics.

---

## Gap Status (Pre → Post Sprint 4)

| Domain | Pre-Sprint 4 | Sprint 4 Delivery | Priority |
|--------|--------------|-------------------|----------|
| **ERP: Attendance** | Docs only | ✅ Full API + UI | P0 |
| **ERP: Classes/Roster** | Missing | ✅ Full API + UI | P0 |
| **ERP: Fees** | Missing | ✅ Read API + parent UI | P0 |
| **ERP: Exams/Results** | Missing | ✅ API + parent dashboard | P0 |
| **ERP: Timetable** | Missing | ✅ API | P1 |
| **ERP: Assignments** | Missing | ✅ API + teacher UI | P0 |
| **ERP: Leave Management** | Missing | ✅ Schema + API scaffold | P2 |
| **ERP: Certificates** | Missing | ✅ Schema | P2 |
| **ERP: Transport/Hostel/Library/Inventory** | Missing | ✅ Schema + scaffold APIs | P3 |
| **Teacher Portal** | Placeholder | ✅ Dashboard, classes, attendance, assignments, quiz builder | P0 |
| **Parent Portal** | Partial (learning report) | ✅ Child dashboard, fees, notifications | P0 |
| **Admin CRM** | User list only | ✅ 14 CRM pages | P0 |
| **Multi-tenant / White-label** | Schema fields | ✅ Tenant types, branding table, RLS | P0 |
| **Billing** | Missing | ✅ billing-service, plans, webhooks, coupons | P0 |
| **Analytics** | AI only | ✅ ERP + revenue dashboards | P1 |
| **RLS** | Not started | ✅ PostgreSQL policies | P0 |
| **Security dashboard** | Missing | ✅ Admin security page | P1 |

---

## Priority Ranking (Remaining for Sprint 5+)

| Priority | Item | Rationale |
|----------|------|-----------|
| P0 | Payment checkout UI (Stripe/Razorpay) | Billing schema ready, needs checkout flow |
| P0 | Certificate PDF generation | Schema exists, no PDF engine |
| P1 | Push notifications | In-app only in Sprint 4 |
| P1 | Full CMS content editor | Admin placeholder |
| P2 | Mobile apps (Expo) | Sprint 5 scope |
| P2 | Dunning / renewal automation | Billing foundation only |
| P3 | Real-time analytics (WebSocket) | Polling/SSR sufficient for MVP |

---

## Sprint 1–3 Preservation

No modifications to Sprint 1–3 learning or AI code paths except:
- Prisma schema extension (additive migrations)
- Dashboard shell navigation additions
- Seed data extension

---

*Approved for Sprint 4 implementation.*
