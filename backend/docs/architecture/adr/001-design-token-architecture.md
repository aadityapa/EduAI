# ADR 001 — Design token architecture & mobile mirroring

**Status:** Accepted  
**Date:** 2026-07-23  
**Phase:** 1 — Design system foundation  
**Deciders:** Principal Engineer + Head of Design (EduAI)

## Context

EduAI had token drift across:

- `frontend/shared-ui/ui/src/globals.css` (indigo/violet HSL, Google Fonts `@import`)
- `backend/docs/design/ui-design-system-v2.md` (Inter / `#6D28D9`)
- `frontend/mobile/src/theme/tokens.ts` (Stitch `#005bbf` / `#8621d9`)
- Stitch DESIGN.md (`#1A73E8` primary, `#9334E6` tertiary)

Phase 1 requires a single semantic token source for web, admin, and mobile, plus light/dark/high-contrast and white-label hooks.

## Decision

1. **Canonical source (web/admin):** CSS custom properties in `@eduai/ui` `globals.css`, consumed via Tailwind preset `frontend/shared-ui/ui/tailwind-preset.ts`.
2. **Palette consolidation:** Adopt **Stitch Google Blue** as primary (`#1A73E8`, deep `#005BBF`) and **tertiary purple** (`#9334E6`) as `--secondary` / `--tertiary` (AI accents). Success green aligns to Stitch `#34A853`. This replaces the prior indigo/`#6D28D9` doc drift while keeping purple in the system as the AI/brand secondary — not a random blue↔purple flip.
3. **Semantic aliases:** Expose both master-prompt names (`--color-bg`, `--surface`, `--text`, `--primary-fg`, …) and existing shadcn names (`--background`, `--foreground`, `--card`, …) mapped 1:1 so current components keep working.
4. **Themes:** Class strategy on `<html>`: `.dark`, `.high-contrast`, and stacked `.dark.high-contrast`. Web wires `next-themes` with `themes={['light','dark','high-contrast']}`.
5. **Spacing:** **4px** `--spacing-unit` per master prompt; retain `grid-*` **8px** aliases and `--spacing-unit-legacy` to avoid layout churn.
6. **Typography:** Ship Inter (UI) + Plus Jakarta Sans (display/learner) + Noto Sans Devanagari via `next/font` (no blocking Google CSS `@import`). Stitch’s Google Sans Flex remains a design reference, not a runtime dependency (not available on `next/font`).
7. **Motion:** 120 / 200 / 320ms (+ spring easing); global `prefers-reduced-motion` kill-switch retained.
8. **White-label:** `TenantThemeProvider` converts `TenantBranding` hex → HSL channels for `--primary` / `--secondary` / `--ring` at runtime (scaffold; full branding API wiring stays with admin Phase 4).
9. **Mobile:** **Hex/StyleSheet mirror** in `frontend/mobile/src/theme/tokens.ts` — same semantic names/values. Mobile does not import CSS variables directly.
10. **NativeWind (Phase 5 decision):** Full NativeWind migration remains **deferred**. Phase 5 strengthened StyleSheet + token parity, shared loading/error/offline patterns, and EAS config instead. Revisit NativeWind only if cross-platform class sharing becomes a hard requirement (cost: Expo Metro config, className churn across all screens).

## Consequences

- Web/admin visual primary shifts from indigo toward Stitch blue; purple remains for secondary/AI surfaces.
- Demo logins/routes unchanged; only token values and font loading change.
- Storybook scaffolds theme switching for visual QA.
- Prisma `TenantBranding` defaults may still say `#6366f1` until a later data migration — runtime provider defaults are Stitch blue; seed updates are out of Phase 1 scope unless needed for demos.

## Alternatives considered

| Option | Why not now |
|--------|-------------|
| Keep indigo primary (master prompt wording) | Conflicts with shipped Stitch screens + mobile tokens; user Phase 1 instruction prefers Stitch consolidation |
| NativeWind shared tokens in Phase 1 | Higher churn; Phase 5 mobile parity is the right home |
| Google CSS `@import` for Google Sans Flex | CLS / critical-path cost; prefer `next/font` |
