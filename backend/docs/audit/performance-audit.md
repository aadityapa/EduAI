# Performance Audit — EduAI Platform

**Date:** 2025-06-21  
**Target SLOs:** API p95 < 500ms (read), < 2s (AI); 99.5% uptime beta

---

## API Performance

| Service | Hot Paths | Current Pattern | Risk |
|---------|-----------|-----------------|------|
| identity | login, users list | Paginated users (max 100) | Low |
| learning | courses catalog | Full `findMany` no pagination | **Medium** |
| learning | hub dashboard | Aggregated queries | Medium |
| ai | tutor chat/stream | External LLM latency dominates | Expected |
| erp | teacher classes | Nested enrollments + students | **Medium** |
| billing | subscription list | Hard `take: 100` | Low for beta |

---

## Database Queries

**Good patterns:**
- Indexed tenant filters on most list queries
- Parallel `Promise.all` in parent ERP dashboard
- AI conversation list with configurable limit (max 50)

**Concerns:**
- Course catalog loads all published courses with board/subject includes
- `getTeacherClasses` loads all students per class in one query tree
- No cursor-based pagination anywhere

**Recommendations:**
1. Add `page`/`page_size` to courses, classes, CRM endpoints (v1.0)
2. Use `select` projections to reduce payload size
3. Add DataLoader or Prisma `include` optimization for teacher dashboard

---

## Caching

| Layer | Status |
|-------|--------|
| Redis (docker-compose) | Available, not used by services |
| Next.js ISR/cache | Default Next 15 caching on static pages |
| API response cache | Not implemented |
| CDN (CloudFront) | Sprint 5 Terraform scaffold |

**Sprint 5 plan:** Redis for session store, rate limiting, and course catalog cache (TTL 5min).

---

## Redis Usage

- `ioredis` in identity-service dependencies — **unused**
- Throttler uses in-memory store — ineffective across replicas
- **Action:** Wire Redis in production K8s via ElastiCache (see `backend/infrastructure/terraform/`)

---

## Search

- No full-text search engine (Elasticsearch/OpenSearch) deployed
- Course/subject filtering via Prisma `where` clauses
- **Future:** OpenSearch for content search at v2.0 scale

---

## AI Service Performance

| Metric | Current |
|--------|---------|
| Rate limit | 120/min global (ai profile 30/min defined, apply in v1.0) |
| Token quota | Per-user daily budget from tenant settings |
| Streaming | SSE for tutor — no timeout configured |
| Mock mode | Falls back when API keys unset (dev) |

---

## Load Test Baseline (Estimated)

| Endpoint | Est. p95 (no LLM) |
|----------|-------------------|
| GET /courses | 80–150ms |
| GET /hub | 100–200ms |
| POST /auth/login | 150–300ms (bcrypt) |
| POST /tutor/chat | 2–8s (LLM dependent) |

---

## Monitoring (Sprint 5)

- Prometheus metrics on ai-service (`/metrics` — internal only)
- Grafana dashboards in `backend/infrastructure/monitoring/`
- OpenTelemetry stubs in all services
- Alert rules for error rate > 1%, p95 > 1s

---

## Verdict

Performance is **acceptable for beta** (< 500 concurrent users per tenant). Pagination and Redis caching required before v1.0 launch at scale.
