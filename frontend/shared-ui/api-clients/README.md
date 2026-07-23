# Generated OpenAPI clients

Run from monorepo root (services must be up, or URLs set via env):

```bash
pnpm openapi:generate
```

Produces:

- `{service}.openapi.json` — raw Swagger document
- `{service}.ts` — `openapi-typescript` types
- `index.ts` — re-exports

Phase 6 ships the generator + `@eduai/api-clients` package scaffold. Commit concrete `{service}.ts` outputs after a local `pnpm dev:backend` run. Full TanStack Query adoption remains a later follow-up.
