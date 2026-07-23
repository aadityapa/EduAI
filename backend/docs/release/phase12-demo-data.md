# Phase 12 — Demo data & docs readiness

## Demo seed

```bash
pnpm db:generate && pnpm db:migrate && pnpm db:seed
```

Demo tabbed logins (student / teacher / parent / admin) must remain intact — **do not change casually**.

## Content

- Pilot catalog remains limited (Phase 12 risk: content breadth). Soft-launch with agreed boards/classes.
- See `docs/release/content-readiness-review.md` for historical assessment.

## Docs map

| Doc | Purpose |
|-----|---------|
| `README.md` / `ARCHITECTURE.md` | Entrypoints |
| `docs/execution/hundred-cr-roadmap.md` | Program checklist |
| `docs/operations/runbooks/**` | On-call |
| Swagger `/api/docs` per service | API |
| Storybook `@eduai/ui` | Design system |
| ADRs under `docs/architecture/adr/` | Decisions |
