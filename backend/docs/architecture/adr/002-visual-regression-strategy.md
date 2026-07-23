# ADR 002 — Visual regression strategy for `@eduai/ui`

**Status:** Accepted  
**Date:** 2026-07-23  
**Phase:** 2 — Component library  
**Deciders:** Principal Engineer + Head of Design (EduAI)

## Context

Phase 2 requires a visual regression baseline for the shared component library. Options:

1. **Chromatic** (Storybook cloud) — excellent DX, paid SaaS, needs project token / CI secrets
2. **Playwright screenshot tests** — self-hosted, free, heavier local CI setup, needs stable fonts/viewport fixtures

The monorepo already has Storybook + `@storybook/addon-a11y` in `@eduai/ui`. Chromatic integrates with Storybook publish but is not configured yet. Playwright E2E lives later under Phase 10.

## Decision

**Choose Playwright screenshot baselines as the long-term source of truth**, with an optional Chromatic path when a project token is available.

Phase 2 ships:

- Storybook stories for primitives + high-value domain components (`pnpm --filter @eduai/ui build-storybook`)
- `addon-a11y` enabled (manual / Storybook UI checks)
- This ADR documenting the choice

**Deferred to Phase 10 / 11:**

- Automated Playwright visual snapshots for key Storybook stories (or Storybook test-runner + Playwright)
- Optional Chromatic publish job when `CHROMATIC_PROJECT_TOKEN` is provisioned
- CI gate failing on visual diffs

## Consequences

- No paid Chromatic dependency blocks Phase 2 completion
- Visual “baseline” in Phase 2 = Storybook static build + documented strategy (not yet CI-enforced pixel diffs)
- Teams can still run Storybook locally for visual QA across light / dark / high-contrast themes

## Alternatives considered

| Option | Why not now |
|--------|-------------|
| Chromatic-only in Phase 2 | Requires secrets + org billing; blocks DoD without infra |
| Full Playwright visual suite in Phase 2 | Better owned with Phase 10 testing pyramid + CI matrix |
