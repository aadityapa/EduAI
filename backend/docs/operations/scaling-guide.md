# Scaling Guide

## Current Capacity (Beta)

- ~500 concurrent users per tenant
- Single-region (ap-south-1)
- 2 replicas per service (HPA on identity + learning)

## Horizontal Scaling

```bash
kubectl scale deployment learning-service --replicas=5 -n eduai-staging
```

HPA auto-scales identity and learning at CPU > 70%.

## Database

- RDS db.r6g.large → db.r6g.xlarge for 2x capacity
- Read replicas for analytics / catalog (`DATABASE_READ_URL` → `prismaRead`)
- PgBouncer connection pooling — see [connection-pooling.md](./connection-pooling.md)
  - Local: `docker compose --profile pooling up -d` (port 6432)

## Cache Layer

- ElastiCache / local Redis for:
  - Rate limiting (`RedisThrottlerStorage`)
  - **Course catalog / hub / quiz cache** (TTL 5 min, explicit invalidation via `invalidateCurriculumCache`)
  - Access-token revocation + idempotency keys
  - BullMQ job queues (`@eduai/jobs`)

## CDN

- CloudFront for static assets and video delivery
- S3 origin for `@eduai/content` uploads

## AI Scaling

- Token quota per tenant/user (implemented)
- Queue-based AI requests via BullMQ when `AI_JOBS_ASYNC=true` + Redis
- Model routing via `@eduai/ai` provider abstraction

## Multi-Region (v2.0 / Phase 11)

- Primary: ap-south-1 (Mumbai)
- DR: ap-southeast-1 (Singapore)
- Cross-region RDS read replica + Route53 failover
