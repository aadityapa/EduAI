# Phase 12 — Performance summary

**Honest scope:** What was measured vs deferred.

## Measured / documented

| Signal | Source | Result |
|--------|--------|--------|
| API latency targets | `docs/testing/performance-targets.md`, Phase 8 k6 reports | p95 < 250 ms target; reports attached under `docs/testing/*load*` |
| Capacity / pooling | Phase 8 docs | PgBouncer + Redis strategy documented |
| Frontend perf mindset | Phase 3 | Prefetch/Suspense/fonts; **Lighthouse ≥ 95 not re-run in Phase 12 CI** |

## Deferred / signed exceptions

- Lighthouse CI job not added (flaky without stable preview URL); run manually before public launch.
- k6 in GitHub Actions not wired (runner image / binary); use `pnpm load:test` on a load host.
- Autoscaling “verified” = manifests + docs; live HPA proof needs staging traffic.
