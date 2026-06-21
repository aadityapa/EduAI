# EduAI Gap Analysis Report

**Date:** June 20, 2025  
**Purpose:** Identify missing features, technical debt, and risks for Sprint 2–5 planning

---

## 1. Missing Features by Domain

### Learning Platform (Sprint 2 — Primary Gap)

| Feature | Docs | Code (pre-S2) | Priority |
|---------|------|---------------|----------|
| Course catalog & enrollment | ✅ | ❌ | P0 |
| Chapters, lessons, content resources | ✅ | ❌ | P0 |
| Lesson progress tracking | ✅ | ❌ | P0 |
| Learning hub filters (board/class/subject) | ✅ | ❌ | P0 |
| Quiz engine (MCQ, multi-select, fill-blank, T/F) | ✅ | ❌ | P0 |
| Quiz attempts & auto-evaluation | ✅ | ❌ | P0 |
| Gamification (XP, coins, badges, streaks) | ✅ | ❌ | P0 |
| Leaderboards | ✅ | ❌ | P1 |
| Parent-child linking | ✅ | ❌ | P0 |
| Parent learning reports | ✅ | ❌ | P1 |
| i18n (en/hi/mr) | ✅ | ❌ | P0 |
| Student dashboard (live data) | Partial UI | ❌ | P0 |

### AI Platform (Sprint 3)

| Feature | Status |
|---------|--------|
| AI Tutor (multilingual) | Stub `@eduai/ai` |
| Homework assistant (OCR pipeline) | Not started |
| Study planner | Not started |
| Question / mock test generators | Not started |
| Token usage analytics | Not started |
| pgvector RAG embeddings | Schema only in docs |

### School ERP + CRM (Sprint 4)

| Feature | Status |
|---------|--------|
| Attendance, timetable, exams | Docs only |
| Teacher portal (upload, quiz builder) | Placeholder dashboards |
| Admin CRM (tenant/subscription mgmt) | Partial user list |
| Fee management | Not started |
| RLS enforcement | Not started |

### Mobile + White Label + Production (Sprint 5)

| Feature | Status |
|---------|--------|
| React Native apps | Expo placeholder |
| Offline / push notifications | Not started |
| White label (domains, branding) | Schema fields only |
| Razorpay/Stripe billing | Not started |
| K8s / Terraform / monitoring | Placeholder dirs |

---

## 2. Technical Debt

| Item | Impact | Effort | Recommendation |
|------|--------|--------|----------------|
| Redis env wired, unused | Session perf, rate limits | M | Integrate in Sprint 2 auth hardening |
| Sessions in Postgres not Redis | Scale under load | M | Migrate refresh tokens to Redis |
| OAuth/OTP/password reset stubs | User friction | M | Sprint 2 auth hardening |
| Admin app no middleware | Security gap | S | Add NextAuth middleware |
| `backend/shared/auth` exports `./rbac` missing file | Import confusion | S | Remove or add file |
| Scaffold services pass CI with echo tests | False confidence | S | Real tests or exclude from coverage |
| Default JWT secrets in `.env.example` | Dev-only risk | S | Document + startup validation |
| Web student dashboard hardcoded zeros | UX | M | Sprint 2 API integration |
| No API gateway | Service routing manual | L | Sprint 4–5 |
| Monolithic Prisma schema growth | Migration complexity | M | Consider schema modules later |

---

## 3. Security Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cross-tenant data access without RLS | Medium | Critical | Tenant filters + RLS Sprint 2–3 |
| JWT theft (no rotation hardening) | Low | High | Refresh rotation, Redis blacklist |
| Admin portal unauthenticated routes | Medium | High | Middleware + role guard |
| No email verification | Medium | Medium | Verification flow Sprint 2 |
| AI prompt injection (Sprint 3) | Medium | High | Input sanitization, system prompts |
| File upload attacks (homework OCR) | Medium | High | Type/size validation, virus scan |
| Rate limit bypass across services | Low | Medium | Shared Redis limiter |

---

## 4. Architecture Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| Service proliferation | 7 microservices for MVP | learning-service consolidates quiz/content for Sprint 2 |
| Shared database | All services use one Prisma DB | Acceptable for MVP; split read replicas later |
| No event bus | Sync coupling between services | Add Redis pub/sub or queue Sprint 4 |
| i18n in DB vs files | Translation storage choice | Hybrid: UI strings in package, content in DB |
| Gamification consistency | Concurrent XP updates | DB transactions + idempotent award keys |
| Leaderboard at scale | Full table scans | Redis sorted sets Sprint 4 |

---

## 5. Scaling Implications

| Component | Current | At 10K students | At 100K students |
|-----------|---------|-----------------|------------------|
| Postgres | Single instance | Read replica | Sharding by tenant |
| Identity JWT | Stateless | OK | OK + CDN for JWKS |
| Lesson progress writes | N/A | Index `(tenant_id, user_id)` | Partition by tenant |
| Quiz attempts JSON | N/A | Archive old attempts | Cold storage |
| AI tokens (S3) | N/A | Per-tenant budgets enforced | Provider routing + cache |
| Media (video/PDF) | N/A | S3 + CloudFront | Mux/Cloudinary integration |

---

## 6. Sprint 2 Must-Address Gaps

1. **Database migrations** — curriculum, progress, quizzes, gamification, parent links, i18n
2. **learning-service** — NestJS with JWT/RBAC parity to identity-service
3. **Student web UX** — dashboard, catalog, hub, quiz UI, gamification
4. **i18n package** — en/hi/mr with dynamic switcher
5. **Seed data** — demo courses, quizzes, badges
6. **Tests** — quiz evaluation, gamification, progress (>90% on new code paths)
7. **Parent portal shell** — link child + view reports

---

## 7. Deferred to Sprint 3–5 (Explicit)

| Item | Sprint | Rationale |
|------|--------|-----------|
| AI tutor & homework | 3 | Depends on learning content + token infra |
| pgvector embeddings | 3 | Requires AI service |
| Full ERP | 4 | Depends on class/enrollment from Sprint 2 |
| Mobile offline | 5 | Depends on stable APIs |
| Payment integration | 5 | Depends on subscription model |
| Production K8s/Terraform | 5 | After feature stability |

---

## 8. Observability Gaps

| Capability | Status | Target Sprint |
|------------|--------|---------------|
| Structured logging | Console only | 3 |
| OpenTelemetry traces | None | 3 |
| Prometheus metrics | None | 4 |
| Error tracking (Sentry) | None | 4 |
| AI cost dashboards | None | 3 |

---

*This gap analysis informs Sprint 2 technical design and architecture review pre-Sprint 3.*
