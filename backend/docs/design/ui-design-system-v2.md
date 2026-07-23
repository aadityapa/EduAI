# EduAI Design System v2

**Version:** 2.1 (Phase 1 foundation)  
**Package:** `@eduai/ui`  
**Fonts:** Inter (UI) + Plus Jakarta Sans (display/learner) + Noto Sans Devanagari via `next/font`  
**Palette:** Stitch Google Blue primary `#1A73E8` / deep `#005BBF`; tertiary purple `#9334E6`  
**ADR:** [`../architecture/adr/001-design-token-architecture.md`](../architecture/adr/001-design-token-architecture.md)

---

## Design Principles

1. **4px base grid** — `--spacing-unit: 4px`; legacy 8px `grid-*` aliases retained
2. **Stitch-aligned brand** — Blue primary, purple AI secondary, green success
3. **Themes first-class** — Light + dark + high-contrast (class strategy)
4. **Accessible by default** — WCAG 2.2 AA contrast targets; focus-visible rings; `prefers-reduced-motion`
5. **White-label ready** — `TenantThemeProvider` maps `TenantBranding` → CSS variables

---

## Color Tokens

| Token | Light (approx hex) | Usage |
|-------|-------------------|-------|
| `--primary` | `#1A73E8` | CTAs, links, active nav |
| `--primary-deep` | `#005BBF` | Hero gradients, emphasis |
| `--primary-fg` / `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--secondary` / `--tertiary` | `#9334E6` | AI features, brand accent |
| `--success` | `#34A853` | Positive / progress |
| `--warning` | `#F59E0B` | Caution |
| `--destructive` | `#D93025` | Errors, destructive actions |
| `--info` | `#0EA5E9` | Informational |
| `--color-bg` / `--background` | `#F8FAFD` | Page background |
| `--surface` / `--card` | `#FFFFFF` | Cards, panels |
| `--surface-elevated` | `#EEF2F7` | Raised panels |
| `--text` / `--foreground` | `#1F1F1F` | Primary text |
| `--text-muted` / `--muted-foreground` | `#5F6368` | Secondary text |
| `--border` | `#DADCE0` | Borders, dividers |
| `--xp` / `--streak` / `--achievement` | gold / orange / coral | Gamification |

### Sidebar & chart

- `--sidebar`, `--sidebar-foreground`, `--sidebar-border`, `--sidebar-accent`, `--sidebar-muted`
- `--chart-1` … `--chart-5`

---

## Themes

| Theme | Activation |
|-------|------------|
| Light | default `:root` |
| Dark | `class="dark"` on `<html>` |
| High contrast | `class="high-contrast"` |
| Dark + HC | `class="dark high-contrast"` |

Web: `next-themes` with `attribute="class"` and `themes={['light','dark','high-contrast']}`.

---

## Typography Scale

| Token / class | Size | Usage |
|---------------|------|-------|
| `text-display` / `--text-display` | 48px | Hero / learner display |
| `text-h1` … `text-h6` | 36 → 16px | Headings |
| `text-body` / `text-body-sm` | 16 / 14px | Body |
| `text-label` | 14px | Form labels |
| `text-caption` | 12px | Helpers, meta |
| `text-code` / `font-mono` | 14px | Code |

**Faces:** `font-sans` (Inter + Devanagari), `font-display` / `font-learner` (Plus Jakarta Sans).  
Stitch reference: Google Sans Flex / Roboto — not loaded at runtime (see ADR).

---

## Spacing

- Base: `--spacing-unit` = **4px** (Tailwind default scale is already 4px-based)
- Legacy aliases: `grid-1` (8px) … `grid-8` (64px), `--spacing-unit-legacy`

---

## Radius / shadow / z-index / motion

| Concern | Tokens |
|---------|--------|
| Radius | `--radius-sm` 8, `--radius` 12, `--radius-lg` 16, `--radius-xl` 24 |
| Shadow | `--shadow-sm` / `md` / `lg` (soft elevation) |
| Z-index | `--z-dropdown` 50 → `--z-tooltip` 500 |
| Motion | `--motion-fast` 120ms, `--motion-normal` 200ms, `--motion-slow` 320ms, `--motion-spring` |

---

## White-label

```tsx
import { TenantThemeProvider } from '@eduai/ui';

<TenantThemeProvider
  theme={{
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    accentColor: branding.accentColor,
    fontFamily: branding.fontFamily,
    appName: branding.mobileAppName ?? 'EduAI',
    logoUrl: branding.logoUrl,
  }}
>
  {children}
</TenantThemeProvider>
```

Maps hex → `--primary`, `--secondary`, `--ring`, etc. at runtime.

---

## Component Library

Primitives and composites live in `@eduai/ui` (Phase 2 expands coverage). Storybook: `pnpm --filter @eduai/ui storybook`.

### Usage

```tsx
import '@eduai/ui/globals.css';
import { Button, TenantThemeProvider } from '@eduai/ui';
```

Tailwind:

```ts
import eduaiPreset from '@eduai/ui/tailwind-preset';

export default { ...eduaiPreset, content: ['./src/**/*.{ts,tsx}'] };
```

---

## Files

| File | Purpose |
|------|---------|
| `frontend/shared-ui/ui/src/globals.css` | CSS custom properties + utilities |
| `frontend/shared-ui/ui/tailwind-preset.ts` | Shared Tailwind theme |
| `frontend/shared-ui/ui/tailwind.config.ts` | Package config (fixed content paths) |
| `frontend/mobile/src/theme/tokens.ts` | Mobile hex mirror |
| `frontend/shared-ui/ui/stories/*` | Storybook UI kit |
