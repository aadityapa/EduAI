# EduAI — Performance Targets & SLAs

**Document ID:** EDUAI-PERF-001  
**Version:** 1.0.0  
**Status:** Approved for Pre-Development  
**Date:** June 2025  
**Owner:** Platform Engineering & SRE

---

## 1. Overview

This document defines EduAI's performance targets, service level agreements (SLAs), Core Web Vitals thresholds, API latency budgets, AI response times, and load testing criteria. These targets implement NFR-PERF, NFR-SCALE, and NFR-AVAIL from the [SRS](../srs/software-requirements-specification.md) and PRD Technical KPIs.

**Measurement philosophy:**
- Report at **p75** for user-facing web metrics (Google Core Web Vitals standard)
- Report at **p95** for API and backend metrics (tail latency matters for SLA)
- Report at **p99** for critical payment and auth paths
- All measurements from **ap-south-1** (Mumbai) with synthetic monitoring from Delhi, Bangalore, and Pune

**Related:** [DevOps Architecture](../devops/devops-architecture.md) · [Testing Strategy](./testing-strategy.md) · [Security Architecture](../security/security-architecture.md)

---

## 2. Service Level Agreements (SLAs)

### 2.1 Availability SLA

| Tier | Monthly Uptime | Max Downtime/Month | Applies To |
|------|------------------|--------------------|------------|
| **Platform SLA** | 99.9% | 43.8 minutes | All production services |
| **AI Tutor SLA** | 99.5% | 3.6 hours | AI inference endpoints (external dependency) |
| **Payment SLA** | 99.95% | 21.9 minutes | Razorpay checkout + webhook processing |

**Exclusions from downtime calculation:**
- Planned maintenance (Sundays 2–4 AM IST, notified 48 hours ahead)
- Force majeure (AWS region outage beyond RTO)
- Third-party provider outages (OpenAI/Gemini, Razorpay, Mux) beyond EduAI control

### 2.2 Incident Response SLA

| Severity | Definition | Response Time | Resolution Target |
|----------|------------|---------------|-------------------|
| P0 | Platform down or data breach | 15 minutes | 4 hours |
| P1 | Major feature unavailable (AI, payments) | 30 minutes | 8 hours |
| P2 | Degraded performance (latency 2× SLA) | 2 hours | 24 hours |
| P3 | Minor issue, workaround available | Next business day | 5 business days |

### 2.3 Recovery Objectives

| Metric | Target | Implementation |
|--------|--------|----------------|
| RPO (Recovery Point Objective) | 1 hour | RDS continuous backup + cross-AZ replication |
| RTO (Recovery Time Objective) | 4 hours | Multi-AZ RDS failover + K8s pod rescheduling |
| MTTR (Mean Time to Recovery) | < 2 hours | Automated failover + runbooks |

---

## 3. Core Web Vitals

Google Core Web Vitals are ranking signals and user experience benchmarks. Measured at **p75** using Chrome User Experience Report (CrUX) field data and Lighthouse lab data.

### 3.1 Targets

| Metric | Good | Needs Improvement | Poor | EduAI Target |
|--------|------|-------------------|------|--------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5–4.0s | > 4.0s | **< 2.5s** |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200–500ms | > 500ms | **< 200ms** |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 | **< 0.1** |

### 3.2 Targets by Page Type

| Page | LCP Target | INP Target | CLS Target | Rendering |
|------|------------|------------|------------|-----------|
| Marketing homepage | < 2.0s | < 150ms | < 0.05 | SSG |
| Pricing / features | < 2.5s | < 200ms | < 0.1 | SSG |
| Student dashboard | < 2.5s | < 200ms | < 0.1 | SSR |
| Lesson viewer (video) | < 3.0s | < 200ms | < 0.05 | SSR |
| AI tutor chat | < 2.0s | < 100ms | < 0.05 | CSR |
| Mock test interface | < 2.5s | < 150ms | < 0.01 | SSR |
| Teacher portal dashboard | < 2.5s | < 200ms | < 0.1 | SSR |
| Parent dashboard | < 2.5s | < 200ms | < 0.1 | SSR |
| Admin CRM | < 3.0s | < 250ms | < 0.1 | SSR |

### 3.3 Optimization Strategies

| Metric | Optimization |
|--------|-------------|
| LCP | SSG/ISR for marketing; priority image loading; CDN (CloudFront); `next/font` with subset; server-side data prefetch |
| INP | Code splitting; defer non-critical JS; Web Workers for heavy computation; optimistic UI updates |
| CLS | Explicit width/height on images/videos; reserve space for dynamic content; no layout-shifting ads |
| TTFB | Edge caching; Redis cache for dashboard data; DB query optimization; connection pooling (PgBouncer) |
| FCP | Critical CSS inline; preload key resources; minimize render-blocking resources |

### 3.4 Monitoring

- **Lab data:** Lighthouse CI in GitHub Actions on every PR affecting web app (budget enforcement)
- **Field data:** Google Search Console Core Web Vitals report (weekly review)
- **Synthetic:** Datadog Browser Tests from Mumbai, Delhi, Bangalore every 5 minutes
- **Alert:** LCP p75 > 3.0s for 1 hour → P2 incident

---

## 4. API Latency Targets

All API latency measured at **p95** unless noted. Measured from API Gateway to response (excluding client network).

### 4.1 General API Endpoints

| Category | p50 | p95 Target | p99 | Examples |
|----------|-----|------------|-----|----------|
| **Auth** | 50ms | **100ms** | 200ms | Login, token refresh, logout |
| **Read (cached)** | 30ms | **100ms** | 150ms | Dashboard, profile, leaderboard |
| **Read (DB)** | 80ms | **200ms** | 400ms | Curriculum browse, search, analytics |
| **Write** | 100ms | **300ms** | 500ms | Submit homework, mark attendance, update profile |
| **Search (Elasticsearch)** | 100ms | **500ms** | 800ms | Lesson search, question bank search |
| **File upload (presigned URL)** | 50ms | **150ms** | 300ms | Generate S3 presigned URL |
| **WebSocket (connect)** | 100ms | **300ms** | 500ms | Notification stream, AI chat stream init |

**Overall platform target:** p95 < **300ms** for all non-AI endpoints (NFR-PERF-002).

### 4.2 Critical Path Latency Budget

```
Student Dashboard Load (target: < 2.5s LCP)
├── DNS + TLS:           100ms
├── TTFB (SSR):          400ms
│   ├── Auth validation:  50ms
│   ├── Dashboard API:   200ms (p95)
│   └── SSR render:      150ms
├── HTML download:        50ms
├── JS bundle load:      300ms (code split)
├── Hydration:           200ms
├── API calls (client):  300ms (parallel, cached)
└── LCP element render:  950ms
    Total budget:       ~2500ms
```

### 4.3 Database Query Targets

| Query Type | p95 Target | Notes |
|------------|------------|-------|
| Primary key lookup | < 5ms | Indexed UUID lookup |
| Tenant-scoped list (paginated) | < 50ms | Composite index on (tenant_id, created_at) |
| Complex join (analytics) | < 100ms | Materialized views for dashboards |
| Full-text search (PostgreSQL) | < 200ms | Prefer Elasticsearch for search |
| Write (INSERT/UPDATE) | < 20ms | Single row operations |
| Bulk import (500 rows) | < 2s | Batch INSERT with COPY |

**Overall DB target:** p95 < **100ms** for indexed queries (NFR-PERF-005).

---

## 5. AI Response Times

AI endpoints have higher latency budgets due to LLM inference. Measured separately from standard API targets.

### 5.1 AI Latency Targets

| Metric | p50 | p95 Target | p99 | Notes |
|--------|-----|------------|-----|-------|
| **First token (streaming)** | 800ms | **< 2s** | 4s | Time to first visible character |
| **Complete response (short)** | 2s | **< 4s** | 8s | < 200 tokens |
| **Complete response (long)** | 5s | **< 10s** | 15s | 200–800 tokens |
| **RAG retrieval** | 100ms | **< 300ms** | 500ms | Vector search + reranking |
| **Content safety filter** | 50ms | **< 200ms** | 400ms | Post-LLM moderation |
| **QPG generation** | 5s | **< 30s** | 45s | Full question paper (async job) |
| **Mock test generation** | 3s | **< 15s** | 30s | Auto-generated test (async job) |
| **Study planner generation** | 2s | **< 10s** | 20s | Weekly schedule (async job) |
| **Weekly progress report** | 10s | **< 60s** | 120s | Background job (report-worker) |

**Overall AI target:** First token p95 < **4s** (NFR-PERF-003 / PRD Technical KPI).

### 5.2 AI Performance Strategies

| Strategy | Impact | Implementation |
|----------|--------|----------------|
| Model tier routing | 60% cost reduction on simple queries | Mini model for FAQ-style; full model for complex reasoning |
| RAG cache | 40% latency reduction on repeated topics | Redis cache for frequent chapter retrievals (TTL: 1 hour) |
| Streaming | Perceived latency ↓ 70% | WebSocket streaming; first token target < 2s |
| Prompt optimization | 20% token reduction | Concise system prompts; structured output format |
| Queue-based generation | Prevents timeout on long jobs | QPG, mock tests, reports via BullMQ workers |
| Provider failover | Availability ↑ | OpenAI primary → Gemini fallback (Sprint 8 decision) |

### 5.3 AI Cost Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| AI COGS as % of ARPU | < 25% | Monthly billing vs token spend |
| Cost per AI query (avg) | < ₹0.50 | Token metering per tenant |
| Daily queries per active user | 3–5 (avg) | Quota enforcement prevents abuse |
| Cache hit rate (RAG) | > 30% | Redis RAG cache metrics |

---

## 6. Load Test Targets

### 6.1 Target: 50,000 Concurrent Users

EduAI must support **50,000 simultaneous active users** without degradation (NFR-PERF-004). Validated in Sprint 14 (baseline) and Sprint 16 (final GA gate).

### 6.2 Traffic Model

Based on expected usage patterns for 250K MAU with 25% DAU/MAU ratio and peak hour concentration:

| User Type | % of Concurrent | Count at 50K | Primary Actions |
|-----------|-----------------|--------------|-----------------|
| Students (learning) | 60% | 30,000 | Browse curriculum, watch video, take quiz |
| Students (AI tutor) | 15% | 7,500 | AI chat queries |
| Students (mock test) | 10% | 5,000 | Timed mock test |
| Parents | 5% | 2,500 | Dashboard, progress review |
| Teachers | 5% | 2,500 | Grading, analytics, QPG |
| Admin/Ops | 1% | 500 | CRM, tenant management |
| Background jobs | 4% | 2,000 | Reports, notifications, AI generation |

### 6.3 Load Test Scenarios (k6)

| Scenario | Virtual Users | Duration | Ramp-Up | Pass Criteria |
|----------|---------------|----------|---------|---------------|
| **Baseline load** | 10,000 | 30 min | 5 min | All SLAs met |
| **Target load** | 50,000 | 60 min | 15 min | All SLAs met |
| **Stress test** | 75,000 | 30 min | 10 min | Identify breaking point; graceful degradation |
| **Spike test** | 5K → 50K → 5K | 20 min | 2 min each | Recovery within 5 min; no data loss |
| **Soak test** | 10,000 | 72 hours | 10 min | No memory leaks; stable latency |
| **AI load** | 7,500 AI queries | 30 min | 5 min | First token p95 < 4s; no quota errors |
| **Auth burst** | 5,000 logins | 5 min | 1 min | Login p95 < 200ms; no lockout false positives |

### 6.4 Load Test Pass Criteria (50K Concurrent)

| Metric | Target | Measurement Point |
|--------|--------|-------------------|
| API p95 latency (non-AI) | < 300ms | API Gateway |
| API p95 latency (AI first token) | < 4s | AI service |
| Error rate (5xx) | < 0.1% | All services |
| Error rate (4xx, excluding 429) | < 1% | All services |
| Throughput | > 10,000 req/s | API Gateway |
| Database connection pool | < 80% utilization | PgBouncer |
| Redis memory | < 70% utilization | ElastiCache |
| CPU (service pods) | < 80% avg | K8s metrics |
| Memory (service pods) | < 85% avg | K8s metrics |
| HPA scaling | Pods scale up within 2 min of threshold | K8s events |
| WebSocket connections | 7,500 concurrent AI streams | AI service |

### 6.5 Infrastructure at 50K Concurrent

| Resource | Staging (load test) | Production (50K) |
|----------|--------------------|--------------------|
| EKS nodes | 10 × m6i.xlarge | 15 × m6i.xlarge (HPA max 20) |
| RDS PostgreSQL | db.r6g.xlarge + 2 replicas | db.r6g.2xlarge + 2 replicas |
| ElastiCache Redis | 3 shards × cache.r6g.large | 3 shards × cache.r6g.xlarge |
| AI worker pods | 5 × ai-worker | 10 × ai-worker (HPA on queue depth) |
| OpenSearch | 3 nodes | 3 nodes × r6g.large.search |
| CloudFront | Standard | Standard (auto-scales) |

---

## 7. Mobile Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| App launch (cold start) | < 3s | Detox + Firebase Performance |
| App launch (warm start) | < 1s | Firebase Performance |
| Screen transition | < 300ms | React Navigation profiling |
| AI tutor first token (4G) | < 3s | k6 mobile network profile |
| Lesson video start (online) | < 2s | Mux player metrics |
| Offline lesson start | < 500ms | Local storage read |
| App size (initial download) | < 50MB | App Store / Play Store |
| App size (with offline content) | < 500MB | Pro tier max download |
| Battery drain (1 hr session) | < 15% | Manual device testing |
| Memory usage (peak) | < 300MB | Xcode Instruments / Android Profiler |
| Crash-free rate | > 99.5% | Firebase Crashlytics |
| ANR rate (Android) | < 0.5% | Google Play Console |

---

## 8. CDN & Media Performance

| Asset Type | Delivery | Cache TTL | Target Latency |
|------------|----------|-----------|----------------|
| Static JS/CSS (hashed) | CloudFront | 1 year | < 50ms (edge) |
| Marketing images (WebP) | CloudFront | 1 day | < 100ms (edge) |
| Video (Mux) | Mux CDN | Adaptive bitrate | Start < 2s |
| User uploads (homework) | S3 presigned → CloudFront | No cache | Upload < 5s (10MB) |
| Fonts | CloudFront | 1 year | < 50ms (edge) |
| API responses (cacheable) | CloudFront (selected GETs) | 60s–300s | < 100ms (edge hit) |

---

## 9. Performance Budget Enforcement

### 9.1 CI Performance Gates

| Gate | Tool | Threshold | Action |
|------|------|-----------|--------|
| Lighthouse LCP | Lighthouse CI | < 2.5s | Block PR merge |
| Lighthouse INP | Lighthouse CI | < 200ms | Block PR merge |
| Lighthouse CLS | Lighthouse CI | < 0.1 | Block PR merge |
| JS bundle size | `@next/bundle-analyzer` | < 250KB initial (gzipped) | Warn on PR |
| API latency regression | k6 smoke test | p95 < 300ms | Block staging deploy |
| DB query regression | Custom benchmark | p95 < 100ms | Warn on PR |

### 9.2 Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interaction-to-next-paint': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
  },
};
```

---

## 10. Monitoring & Alerting

### 10.1 Performance Dashboard (Grafana)

| Panel | Metrics | Alert |
|-------|---------|-------|
| API Latency | p50, p95, p99 by service | p95 > 300ms for 5 min |
| Core Web Vitals | LCP, INP, CLS (field data) | LCP p75 > 3.0s |
| AI Performance | First token latency, token spend | p95 > 4s for 10 min |
| Database | Query time, connections, replication lag | p95 > 100ms; lag > 30s |
| Infrastructure | CPU, memory, pod count, HPA events | CPU > 80% for 10 min |
| Error Rate | 5xx rate by service | > 0.1% for 5 min |
| Concurrent Users | Active sessions, WebSocket connections | Informational |
| Load Test Results | k6 trend over sprints | Regression > 20% |

### 10.2 SLA Reporting

| Report | Frequency | Audience |
|--------|-----------|----------|
| Uptime report | Monthly | Leadership, customers (B2B) |
| Performance summary | Weekly | Engineering |
| Core Web Vitals | Weekly | Frontend team |
| AI cost/performance | Daily | AI team, finance |
| Load test results | Per sprint (14, 16) | Engineering, leadership |

---

## 11. Performance Testing Schedule

| Sprint | Activity | Target |
|--------|----------|--------|
| 4 | Baseline API latency benchmark | Establish p95 baselines |
| 4 | Lighthouse CI integration | Enforce CWV on PRs |
| 8 | 10K concurrent load test | Validate architecture |
| 9 | AI latency benchmark | First token p95 < 4s |
| 10 | Mock test under load | 5K concurrent test takers |
| 14 | 50K concurrent load test (baseline) | Identify bottlenecks |
| 14 | Database stress test | Query p95 < 100ms at load |
| 15 | Mobile performance profiling | Cold start < 3s |
| 16 | **50K concurrent final load test** | **GA gate — all pass criteria** |
| 16 | 72-hour soak test | No degradation |
| 16 | Core Web Vitals audit | 100% marketing URLs pass |
| Post-GA | Monthly load test | Regression detection |

---

## 12. Graceful Degradation

When load exceeds capacity, EduAI degrades gracefully rather than failing completely:

| Priority | Feature | Degradation Strategy |
|----------|---------|---------------------|
| P0 (never degrade) | Auth, payments, data writes | Queue + retry; never drop |
| P1 | AI tutor | Switch to cached FAQ responses; queue with "high demand" message |
| P1 | Dashboard | Serve cached dashboard (Redis, 5 min TTL) |
| P2 | Leaderboards | Show stale data (15 min cache) |
| P2 | Search | Fall back to PostgreSQL full-text (slower) |
| P3 | Recommendations | Show default "continue learning" instead of personalized |
| P3 | Weekly reports | Delay generation by 24 hours |

---

## 13. Summary Table

| Category | Metric | Target | Measurement |
|----------|--------|--------|-------------|
| **Availability** | Uptime | 99.9% | Monthly |
| **Web** | LCP | < 2.5s (p75) | CrUX + Lighthouse |
| **Web** | INP | < 200ms (p75) | CrUX + Lighthouse |
| **Web** | CLS | < 0.1 (p75) | CrUX + Lighthouse |
| **API** | Non-AI latency | < 300ms (p95) | Prometheus |
| **API** | Auth latency | < 100ms (p95) | Prometheus |
| **Database** | Query time | < 100ms (p95) | pg_stat_statements |
| **Search** | Elasticsearch | < 500ms (p95) | Prometheus |
| **AI** | First token | < 2s (p95) | AI service metrics |
| **AI** | Complete response | < 4s (p95) | AI service metrics |
| **Load** | Concurrent users | 50,000 | k6 load test |
| **Load** | Error rate at 50K | < 0.1% (5xx) | k6 + Prometheus |
| **Mobile** | Cold start | < 3s | Firebase Performance |
| **Mobile** | Crash-free | > 99.5% | Crashlytics |

---

*Related: [DevOps Architecture](../devops/devops-architecture.md) · [Testing Strategy](./testing-strategy.md) · [SRS](../srs/software-requirements-specification.md)*
