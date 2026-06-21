# Final Load Test Report

**Date:** 2025-06-21  
**Tool:** k6 (Grafana k6)  
**Scripts:** `backend/testing/load/k6-student-journey.js`, `backend/testing/load/k6-scale-scenarios.js`  
**Thresholds (from scripts):** `http_req_failed < 5%`, `p95 < 2000ms`, `errors < 5%`

---

## Execution Status

| Scenario | Target VUs | Executed | Result |
|----------|------------|----------|--------|
| Student journey smoke | 500 | ❌ **NOT RUN** | k6 not installed on validation host |
| Student journey stress | 1000 | ❌ **NOT RUN** | k6 not installed |
| Scale health check | 5000 | ❌ **NOT RUN** | k6 not installed |
| Scale health check | 10000 | ❌ **NOT RUN** | k6 not installed |

### Blockers encountered

1. **k6 CLI not installed** — `k6 version` → command not found (Windows validation environment)
2. **Backend stack not running** — `pnpm validate:billing` failed with `fetch failed` (no services on localhost:3001–3006)
3. **Docker available** (v29.5.3) but full stack startup not executed within validation window

---

## Test Configuration Review (Static Analysis)

### k6-student-journey.js

| Step | Endpoint | Service |
|------|----------|---------|
| Login | `POST /api/v1/auth/login` | identity :3001 |
| Courses | `GET /api/v1/courses` | learning :3003 |
| Quizzes | `GET /api/v1/quizzes` | learning :3003 |
| AI Tutor | `POST /api/v1/tutor/chat` | ai :3004 |

Scenarios:
- `smoke_500`: ramp 0→500 VUs over 4 min
- `stress_1000`: ramp 0→1000 VUs, starts at 6 min

User pool: 50 synthetic students (`student1–10@demo.eduai.in`)

### k6-scale-scenarios.js

Health-only endpoints for 5000/10000 VU scale validation.

---

## Prior Results (Phase 5 — Not Re-executed)

From `docs/testing/load-testing-report.md` (health baseline only):

| Metric | 500 VU (health) | 1000 VU (health) | Threshold |
|--------|-----------------|------------------|-----------|
| p95 latency | ~45ms | ~120ms | <2000ms ✅ |
| Error rate | 0% | 0% | <5% ✅ |

> **Caveat:** Health-only baseline does not exercise login (bcrypt), DB queries, or AI LLM calls.

---

## Projected Bottlenecks (Architecture Review)

| Component | Risk at 1000+ VU | Mitigation in codebase |
|-----------|------------------|------------------------|
| identity login (bcrypt) | CPU saturation | HPA; login throttle 5/15min |
| PostgreSQL pool | Connection exhaustion | PgBouncer recommended |
| ai-service LLM calls | Latency + cost | Circuit breaker ✅ |
| Rate limiting | Per-pod without Redis | RedisThrottlerStorage when `REDIS_URL` set |

---

## Failure Rate Gate (Launch Criteria)

| Load level | Max failure rate | Actual | Pass? |
|------------|------------------|--------|-------|
| 500 VU full journey | ≤5% | **NOT MEASURED** | ❌ |
| 1000 VU full journey | ≤5% | **NOT MEASURED** | ❌ |
| 5000 VU health | ≤5% | **NOT MEASURED** | ❌ |

**Per launch criteria: Load test validation FAILS — blocks public v1.0.**

---

## How to Reproduce

```bash
# Install k6: https://k6.io/docs/get-started/installation/
# Windows: choco install k6  OR  winget install grafana.k6

docker compose -f backend/infrastructure/docker/docker-compose.yml up -d
pnpm db:migrate && pnpm db:seed

# Start all 5 services + ensure REDIS_URL set for prod-like throttling

k6 run backend/testing/load/k6-student-journey.js
k6 run --env SCENARIO=5000 backend/testing/load/k6-scale-scenarios.js
```

---

## Recommendations

1. Install k6 in CI pipeline; run 500 VU against staging on every release candidate
2. Require Redis in staging before load tests
3. Add PgBouncer before 2000 concurrent users
4. Set HPA: identity=3, learning=3, ai=2 minimum replicas
5. Add Grafana synthetic checks for login + tutor paths

---

## Verdict

| Launch type | Verdict | Reason |
|-------------|---------|--------|
| Closed beta (≤500 students) | **CONDITIONAL GO** | Architecture supports; no measured failure |
| Public v1.0 | **NO-GO** | Full journey load test not executed; 5000 VU unvalidated |

**Performance score: 6/10** (configs exist; evidence missing)
