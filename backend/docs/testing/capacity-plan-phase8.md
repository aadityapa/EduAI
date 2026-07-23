# Capacity plan — Phase 8 snapshot

**Date:** 2026-07-23  
**Related:** [performance-targets.md](./performance-targets.md) · [connection-pooling.md](../operations/connection-pooling.md) · [scaling-guide.md](../operations/scaling-guide.md)

## Latency target (program DoD)

| Metric | Target | Proof |
|--------|--------|-------|
| API p95 (non-AI, cached reads) | **< 250 ms** | `k6-latency-p95.js` |
| API p95 (mixed student journey) | < 500 ms warm / document soak | `k6-student-journey.js` |
| AI tutor first token | < 2–4 s | Excluded from 250 ms gate |

## Current levers shipped in Phase 8

1. **Composite indexes** on courses, lessons, quizzes, questions, enrollments, fees, leads, XP leaderboard
2. **Curriculum Redis cache** (TTL 5 min default) + explicit invalidation helpers
3. **PgBouncer** Compose profile + runbook
4. **Read-replica hook** (`DATABASE_READ_URL` → `prismaRead`)
5. **BullMQ** queues for QPG / mock / email / AI batch (scaffold workers)
6. **Redis idempotency** when `REDIS_URL` set
7. **`fetchWithTimeout`** for inter-service HTTP; Nest `enableShutdownHooks`

## How to run k6

Requires [k6](https://k6.io/docs/get-started/installation/) binary (or Docker).

```bash
# Latency proof (p95 < 250ms on health + cached catalog paths)
k6 run backend/testing/load/k6-latency-p95.js

# Student journey (identity + learning + AI)
k6 run backend/testing/load/k6-student-journey.js

# Scale health-only
k6 run -e SCENARIO=500 backend/testing/load/k6-scale-scenarios.js
```

Env overrides: `BASE_URL`, `LEARNING_URL`, `AI_URL`, `TENANT_ID`, `TEST_PASSWORD`, `USER_POOL_SIZE`.

Docker (if local k6 missing):

```bash
docker run --rm -i --network host grafana/k6 run - < backend/testing/load/k6-latency-p95.js
```

## Signed exception policy

If staging infra cannot meet p95 < 250 ms in this environment (no Docker/k6, cold start, no Redis), attach command output + note in phase-8-completion and re-run on staging before Phase 11 GA gate.

## Deferred to Phase 11

- Managed RDS Multi-AZ + ElastiCache
- HPA verification under 10k VU
- K8s Job manifests for `@eduai/jobs` workers
