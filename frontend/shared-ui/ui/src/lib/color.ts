/**
 * Color helpers for runtime white-label theming (TenantBranding → CSS variables).
 * No third-party deps — keep `@eduai/ui` lean.
 */

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Normalize `#RGB` / `#RRGGBB` to `#rrggbb`. Returns null if invalid. */
export function normalizeHex(input: string): string | null {
  const trimmed = input.trim();
  const match = HEX_RE.exec(trimmed);
  if (!match?.[1]) return null;
  let raw = match[1].toLowerCase();
  if (raw.length === 3) {
    raw = raw
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${raw}`;
}

/** Convert `#rrggbb` to space-separated HSL channels for `hsl(var(--token))` usage. */
export function hexToHslChannels(hex: string): string | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Approximate relative luminance (sRGB) for contrast checks — 0..1. */
export function relativeLuminance(hex: string): number | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = channel(parseInt(normalized.slice(1, 3), 16));
  const g = channel(parseInt(normalized.slice(3, 5), 16));
  const b = channel(parseInt(normalized.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Pick black or white foreground for AA-ish contrast on a solid brand fill. */
export function contrastingForeground(hex: string): string {
  const lum = relativeLuminance(hex);
  if (lum === null) return '0 0% 100%';
  return lum > 0.45 ? '0 0% 10%' : '0 0% 100%';
}
