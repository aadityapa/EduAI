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
- Read replicas for analytics queries
- PgBouncer connection pooling (add to K8s)

## Cache Layer

- ElastiCache Redis for:
  - Rate limiting (replace in-memory Throttler)
  - Course catalog cache (TTL 5min)
  - Session store

## CDN

- CloudFront for static assets and video delivery
- S3 origin for `@eduai/content` uploads

## AI Scaling

- Token quota per tenant/user (implemented)
- Queue-based AI requests at 10k+ concurrent (v2.0)
- Model routing via `@eduai/ai` provider abstraction

## Multi-Region (v2.0)

- Primary: ap-south-1 (Mumbai)
- DR: ap-southeast-1 (Singapore)
- Cross-region RDS read replica + Route53 failover
