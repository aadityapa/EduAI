# ADR 003 — Deferred `exactOptionalPropertyTypes` for Nest services

**Status:** Accepted  
**Date:** 2026-07-23  
**Phase:** 6 (Backend hardening)

## Context

The master prompt asks for TypeScript `exactOptionalPropertyTypes` (EOPT). Root `tsconfig.json` already enables `strict` and `noUncheckedIndexedAccess`, but not EOPT. Enabling EOPT across five Nest services + shared packages surfaces hundreds of optional-property assignment mismatches (`T | undefined` vs omitting the key), especially around Prisma create/update payloads and class-validator DTOs.

## Decision

**Defer** enabling `exactOptionalPropertyTypes` monorepo-wide until Phase 10 (testing) or a dedicated typing sprint.

Keep:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`

## Consequences

- Phase 6 DoD does not require EOPT green.
- Incremental enablement can start in `@eduai/shared` / `@eduai/nest-common` before services.
- When enabled, prefer explicit `?: T` vs `| undefined` cleanup rather than `as` casts.
