# Phase 12 — Accessibility summary

## Measured

| Layer | Method | Status |
|-------|--------|--------|
| Design system | Storybook `addon-a11y` | Phase 2 baseline |
| Login smoke | Playwright + axe (`@a11y`) | CI: **zero critical**; serious `color-contrast` on muted login chrome residual |
| Portals | Manual / deferred deep axe | Full portal crawl deferred |

## Residual (honest)

- Login page muted text / tabs fail axe `color-contrast` (serious) — token/contrast hardening follow-up before public v1.
- Radix Tabs `aria-valid-attr-value` disabled in smoke (axe false positive on generated IDs).

## Deferred

- Automated axe on every authenticated route (needs demo login storage state in CI)
- Manual WCAG audit with assistive tech on teacher dense tables
- Lighthouse Accessibility ≥ 95 CI gate

## Standard

Target remains **WCAG 2.2 AA**; CI fails on **critical** smoke violations.
