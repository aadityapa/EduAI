# EduAI Design System v2

**Version:** 2.0  
**Package:** `@eduai/ui`  
**Font:** Inter (via `next/font/google`)

---

## Design Principles

1. **8px grid** — All spacing aligns to multiples of 8px
2. **Enterprise clarity** — Stripe/Vercel/Linear-level information hierarchy
3. **Dark mode first-class** — All tokens have light + dark variants
4. **Accessible by default** — WCAG AA focus rings, keyboard nav, ARIA labels

---

## Color Tokens

| Token | Light | Hex Reference | Usage |
|-------|-------|---------------|-------|
| `--primary` | `262 69% 50%` | `#6D28D9` | CTAs, active nav, brand |
| `--secondary` | `258 90% 66%` | `#8B5CF6` | Accents, secondary actions |
| `--success` | `142 71% 45%` | `#22C55E` | Positive states |
| `--warning` | `38 92% 50%` | `#F59E0B` | Caution states |
| `--destructive` | `0 84% 60%` | `#EF4444` | Errors, destructive actions |

### Sidebar Tokens
- `--sidebar`, `--sidebar-foreground`, `--sidebar-border`
- `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-muted`

### Chart Tokens
- `--chart-1` through `--chart-5` — Recharts theming

---

## Typography Scale

| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-display-lg` | 48px | 600 | Hero headings |
| `text-display-md` | 36px | 600 | Page titles |
| `text-display-sm` | 30px | 600 | Section titles |
| `text-2xl` | 24px | 600 | Card titles |
| `text-lg` | 18px | 500 | Subheadings |
| `text-base` | 16px | 400 | Body |
| `text-sm` | 14px | 400 | Secondary text |
| `text-xs` | 12px | 400 | Labels, captions |

---

## Spacing (8px Grid)

Tailwind utilities: `grid-1` (8px) through `grid-8` (64px)

Standard padding:
- Card content: `p-6` (24px)
- Page content: `p-6` (24px)
- Sidebar items: `px-3 py-2` (12px / 8px)

---

## Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | 6px |
| `--radius` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |

---

## Dark Mode

Activated via `class="dark"` on `<html>` (next-themes).

```tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

---

## Component Library

### Primitives
Button, Input, Label, Card, Avatar, Badge, Separator, ScrollArea, Skeleton

### Overlays
Dialog, Sheet (Drawer), DropdownMenu, Tooltip, Command (⌘K palette)

### Data Display
Table, DataTable, KpiCard, StatCard, ChartContainer + Recharts wrappers

### Composite
ActivityFeed, KanbanBoard, FileUploader, ProgressBar, LeaderboardRow

### Feedback
Toaster (Sonner), toast()

---

## Usage

```tsx
import '@eduai/ui/globals.css';
import { Button, KpiCard, DataTable, toast } from '@eduai/ui';
```

Tailwind config extends from `@eduai/ui/tailwind.config`.

---

## Motion

- Page transitions: Framer Motion `AnimatePresence`
- Sidebar collapse: 200ms ease-in-out
- Reduced motion: respects `prefers-reduced-motion`

---

## Files

| File | Purpose |
|------|---------|
| `packages/ui/src/globals.css` | CSS custom properties |
| `packages/ui/tailwind.config.ts` | Tailwind theme extension |
| `packages/ui/src/index.ts` | Public exports |
