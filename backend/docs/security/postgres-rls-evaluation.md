# Postgres RLS evaluation (Phase 9)

## Current state

- **App-level tenant isolation** is the primary control: every Nest query includes `tenantId`, with `assertSameTenant` / `tenantWhere` helpers and automated cross-tenant negative tests (Phase 6).  
- **RLS** was introduced in migration `20250621110000_sprint4_rls` for ERP/billing tables. Policies use `app_current_tenant_id()` and **bypass when the setting is NULL** so Prisma service connections keep working without session vars.  
- Phase 9 extends RLS to `consent_records` and `data_subject_requests` with the same bypass pattern.

## Decision (Phase 9)

| Option | Verdict |
|--------|---------|
| Enforce RLS by setting `app.tenant_id` on every request | **Deferred** — requires Prisma middleware / connection checkout hooks and careful PgBouncer transaction-mode support |
| Keep bypass-NULL policies as defense-in-depth | **Accepted for now** |
| Rely on app filters + tests as primary | **Accepted** |

## When to tighten (Phase 11+)

1. Add Prisma `$extends` or middleware to `SET LOCAL app.tenant_id` per request inside a transaction.  
2. Prefer **session pooling** or direct connections when using `SET LOCAL`.  
3. Remove NULL bypass for non-superuser roles (`eduai_app`) while keeping a migration role for deploys.  
4. Expand RLS to `users`, `audit_logs` (select-only), learning tables.

## Residual risk

Without session `app.tenant_id`, RLS does not block a buggy query missing `tenantId`. Mitigations: code review, tenant isolation tests, lint/patterns, and Phase 10 integration tests with Testcontainers.
