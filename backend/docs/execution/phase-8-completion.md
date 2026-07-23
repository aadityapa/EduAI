# Phase 8 completion note — Data & performance

**Date:** 2026-07-23  
**Status:** Complete — awaiting approval for Phase 9  
**Scope:** Additive Prisma indexes, curriculum Redis cache + invalidation, PgBouncer/read-replica docs + hooks, `@eduai/jobs` BullMQ scaffold, k6 p95 suite, HTTP timeouts + graceful shutdown, Redis idempotency

## Delivered

### Indexes (additive migration)
- Migration `20260723160000_phase8_data_performance`
- Composite indexes on courses (soft-delete aware), lessons, quizzes, questions/options, enrollments, quiz attempts, parent links, user XP leaderboard, fee invoices, leads, lesson contents/resources
- No destructive drops; seed/demo data preserved

### Curriculum cache
- `@eduai/nest-common`: `JsonCache`, `getCurriculumCache`, `invalidateCurriculumCache`, `CurriculumCacheKeys`
- Wired into learning-service: catalog, course by id, course lessons, hub tree (progress merged per-user after cache), quiz payload
- Default TTL 300s (`CURRICULUM_CACHE_TTL_SEC`); Redis when `REDIS_URL` set, else memory

### Pooling & replicas
- Docs: `backend/docs/operations/connection-pooling.md`
- Docker Compose `--profile pooling` PgBouncer (port 6432)
- `@eduai/database`: `prismaRead`, `withReadReplica`, `isReadReplicaConfigured` via `DATABASE_READ_URL`

### BullMQ (`@eduai/jobs`)
- Queues: email, QPG, mock-test, AI batch
- Enqueue helpers + stub worker (`pnpm --filter @eduai/jobs worker`)
- ai-service generators optionally enqueue when `AI_JOBS_ASYNC=true` (sync default — demo safe)

### Resilience
- Nest `enableShutdownHooks()` in `configureNestApp` (all five services)
- K8s probes verified (liveness `/api/v1/health`, readiness `/api/v1/health/ready`)
- `fetchWithTimeout` + `HTTP_TIMEOUT_MS` in `@eduai/shared`
- AI circuit breaker unchanged; Redis-backed idempotency when `REDIS_URL` set

### k6 / capacity
- New `k6-latency-p95.js` with thresholds `http_req_duration p(95)<250`
- Updated `k6-student-journey.js` (courses/quizzes p95 < 250; AI separate budget)
- Capacity notes: `backend/docs/testing/capacity-plan-phase8.md`
- Scaling guide updated for cache + PgBouncer

## Deferred (intentional)

| Item | Follow-up |
|------|-----------|
| Soft-delete columns on Question / Enrollment / FeeInvoice | Only where product needs; indexes cover current filters |
| Prisma `directUrl` in schema | Documented; wire when staging uses PgBouncer (Phase 11) |
| Real email/QPG worker processors + K8s Job manifests | Phase 11 |
| Vector semantic cache | Still deferred |
| Full Multi-AZ / managed ElastiCache | Phase 11 |
| Inter-service HTTP call sites using `fetchWithTimeout` | No Nest→Nest HTTP clients yet; helper ready |

## Key paths

- `backend/database/prisma/schema.prisma` + `migrations/20260723160000_phase8_data_performance/`
- `backend/database/src/index.ts` (read replica)
- `backend/shared/nest-common/src/cache/**`
- `backend/shared/jobs/**`
- `backend/services/learning-service/src/{courses,hub,quizzes}/**`
- `backend/services/ai-service/src/generators/generators.service.ts`
- `backend/testing/load/k6-latency-p95.js`
- `backend/docs/operations/connection-pooling.md`
- `backend/docs/testing/capacity-plan-phase8.md`

## Verify

```bash
pnpm --filter @eduai/database generate
pnpm --filter @eduai/database build
pnpm --filter @eduai/shared build && pnpm --filter @eduai/nest-common build && pnpm --filter @eduai/nest-common test
pnpm --filter @eduai/jobs build && pnpm --filter @eduai/jobs test
pnpm --filter @eduai/learning-service --filter @eduai/ai-service typecheck
pnpm --filter @eduai/learning-service --filter @eduai/ai-service build

# k6 (requires binary or Docker + running services)
k6 run backend/testing/load/k6-latency-p95.js
```

## Results (2026-07-23)

| Command | Result |
|---------|--------|
| `@eduai/database` generate + build | Pass |
| `@eduai/shared` build | Pass |
| `@eduai/nest-common` build + test | Pass (12 tests) |
| `@eduai/jobs` build + test | Pass (2 tests) |
| `@eduai/learning-service` typecheck + build | Pass |
| `@eduai/ai-service` typecheck + build | Pass |
| k6 latency p95 | **Signed exception** — `k6` not installed on this agent; scripts + thresholds ship. Re-run on staging: `k6 run backend/testing/load/k6-latency-p95.js` |

Additive migration only. **No commit / push.** Demo sync AI/QPG preserved unless `AI_JOBS_ASYNC=true`.

**Phase 8 complete — awaiting approval for Phase 9.**
