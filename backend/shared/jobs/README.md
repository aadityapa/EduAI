# @eduai/jobs — BullMQ scaffolding

Background queues for heavy AI batches, QPG, mock tests, and emails.

## Env

| Variable | Purpose |
|----------|---------|
| `REDIS_URL` or `JOBS_REDIS_URL` | Redis for BullMQ |
| `JOBS_ENABLED` | Set `false` to disable enqueue/workers |
| `JOBS_CONCURRENCY` | Worker concurrency (default 2) |
| `AI_JOBS_ASYNC` | When `true`, ai-service QPG/mock enqueue instead of sync |

## Run worker (scaffold)

```bash
pnpm --filter @eduai/jobs build
pnpm --filter @eduai/jobs worker
```

Processors currently acknowledge jobs and log — wire real providers later.

## Enqueue from services

```ts
import { enqueueQpg, isJobsEnabled } from '@eduai/jobs';

const result = await enqueueQpg({ tenantId, userId, subject, topic, classLevel, count });
if (result.queued) return { jobId: result.jobId, status: 'queued' };
// fall back to sync generation
```
