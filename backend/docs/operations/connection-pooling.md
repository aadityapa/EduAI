# Connection pooling & read replicas (Phase 8)

**Status:** Ready for staging; full Multi-AZ / managed PgBouncer is Phase 11 Terraform.

## PgBouncer (local / self-hosted)

Optional Compose profile:

```bash
docker compose -f backend/infrastructure/docker/docker-compose.yml --profile pooling up -d
```

- Postgres: `localhost:5433`
- PgBouncer: `localhost:6432` → pool mode `transaction`

App connection string through PgBouncer:

```env
DATABASE_URL="postgresql://eduai:eduai_dev@localhost:6432/eduai?schema=public&pgbouncer=true"
```

Config file: `backend/infrastructure/docker/pgbouncer/pgbouncer.ini`

### Prisma + PgBouncer notes

- Prefer **transaction** pooling for Nest/Prisma (session features like advisory locks are limited).
- Set `pgbouncer=true` in the URL so Prisma disables prepared statements that break under transaction pooling (Prisma 5+).
- Keep direct `DATABASE_URL` to Postgres for migrations (`prisma migrate deploy`) — never run migrations through PgBouncer.

Suggested split:

| Env | Use |
|-----|-----|
| `DATABASE_URL` | App runtime (via PgBouncer in staging/prod) |
| `DATABASE_DIRECT_URL` | Migrations / Prisma Studio (direct RDS) |
| `DATABASE_READ_URL` | Optional read replica (see below) |

Wire `directUrl` in `schema.prisma` when promoting to staging:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")
}
```

*(Not applied in Phase 8 schema to avoid breaking local migrate without the new env — document for Phase 11.)*

## Read-replica readiness

`@eduai/database` exports:

- `prisma` — primary writer
- `prismaRead` — uses `DATABASE_READ_URL` when set, else primary
- `withReadReplica(fn)` — helper for SELECT-heavy paths
- `isReadReplicaConfigured()`

Curriculum catalog paths may later call `withReadReplica` once a replica exists. Replication lag tolerance: hub/catalog OK; auth/billing/payments must stay on primary.

## Capacity notes (Phase 8)

| Concurrent users | Pooling | Notes |
|------------------|---------|-------|
| < 200 | Direct Postgres OK | Local/dev |
| 200–2k | PgBouncer required | Avoid pool exhaustion |
| 2k–10k | PgBouncer + read replica | Analytics/catalog on replica |
| 10k+ | Phase 11 Multi-AZ + HPA | See `scaling-guide.md` |

Target API p95 (non-AI): **< 250 ms** under k6 latency scenario (`backend/testing/load/k6-latency-p95.js`).

## Ops checklist

1. Point apps at PgBouncer; keep migrate on direct URL
2. Monitor PgBouncer `cl_waiting`, `sv_active`
3. When adding RDS read replica, set `DATABASE_READ_URL` and restart services
4. Redis (`REDIS_URL`) for curriculum cache + BullMQ + throttling + idempotency
