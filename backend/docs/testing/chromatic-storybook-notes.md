# Chromatic / Storybook visual regression notes (ADR 002 follow-up)

**Phase:** 10–11  
**ADR:** [`../architecture/adr/002-visual-regression-strategy.md`](../architecture/adr/002-visual-regression-strategy.md)

## Current

- Storybook for `@eduai/ui` with `addon-a11y`.
- CI builds static Storybook (`pnpm build-storybook`).
- Optional Chromatic job in `ci.yml` when `CHROMATIC_PROJECT_TOKEN` secret is set (`continue-on-error: true` until baselines stabilize).

## Enable Chromatic

1. Create Chromatic project; store token in GitHub Actions secrets (never commit).
2. Ensure `chromatic` CLI available via `@eduai/ui` or `pnpx chromatic`.
3. Remove `continue-on-error` once baselines accepted.

## Playwright visual (long-term)

Prefer Storybook test-runner or Playwright screenshots against Storybook static host — tracked as follow-up; smoke E2E + axe cover functional a11y today.
