# Runbook — Redis cache miss spike

**Alert:** `RedisCacheMissSpike`

1. Confirm Redis/ElastiCache health and connection counts.
2. Check recent deploy for cache key schema changes (curriculum keys).
3. Warm critical keys or temporarily increase TTL if stampede.
4. See `connection-pooling.md` and Phase 8 capacity plan for sizing.
