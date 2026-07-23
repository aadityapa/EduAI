'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { contrastingForeground, hexToHslChannels, normalizeHex } from '../lib/color';

/**
 * Runtime white-label theme mapped from `TenantBranding` (Prisma) / branding API.
 * Injects CSS variables so Tailwind semantic colors (`bg-primary`, etc.) pick up tenant brand.
 */
export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
  appName: string;
}

/** Stitch-aligned EduAI defaults (Google Blue + tertiary purple). */
export const DEFAULT_TENANT_THEME: TenantTheme = {
  primaryColor: '#1A73E8',
  secondaryColor: '#9334E6',
  accentColor: '#F59E0B',
  fontFamily: 'Inter, var(--font-noto-devanagari), system-ui, sans-serif',
  appName: 'EduAI',
};

const ThemeContext = createContext<TenantTheme>(DEFAULT_TENANT_THEME);

function buildCssVars(theme: TenantTheme): React.CSSProperties {
  const primaryHex = normalizeHex(theme.primaryColor) ?? DEFAULT_TENANT_THEME.primaryColor;
  const secondaryHex = normalizeHex(theme.secondaryColor) ?? DEFAULT_TENANT_THEME.secondaryColor;
  const accentHex = normalizeHex(theme.accentColor) ?? DEFAULT_TENANT_THEME.accentColor;

  const primaryHsl = hexToHslChannels(primaryHex);
  const secondaryHsl = hexToHslChannels(secondaryHex);
  const accentHsl = hexToHslChannels(accentHex);
  const primaryFg = contrastingForeground(primaryHex);

  const vars: Record<string, string> = {
    '--brand-primary': primaryHex,
    '--brand-secondary': secondaryHex,
    '--brand-accent': accentHex,
  };

  if (primaryHsl) {
    vars['--primary'] = primaryHsl;
    vars['--primary-fg'] = primaryFg;
    vars['--primary-foreground'] = primaryFg;
    vars['--ring'] = primaryHsl;
    vars['--sidebar-accent'] = primaryHsl;
    vars['--sidebar-accent-foreground'] = primaryFg;
    vars['--chart-1'] = primaryHsl;
  }
  if (secondaryHsl) {
    vars['--secondary'] = secondaryHsl;
    vars['--tertiary'] = secondaryHsl;
    vars['--chart-4'] = secondaryHsl;
  }
  if (accentHsl) {
    /* Accent as soft tint surface; keep readable accent-foreground via brand hex */
    vars['--warning'] = accentHsl;
  }

  return {
    ...vars,
    fontFamily: theme.fontFamily,
  } as React.CSSProperties;
}

/**
 * Wraps a subtree with tenant branding CSS variables.
 * Pass fields from `TenantBranding` / identity branding API when available.
 * Scaffold: safe to use with defaults when branding fetch is not wired yet.
 */
export function TenantThemeProvider({
  theme,
  children,
  className,
  as: Comp = 'div',
}: {
  theme?: Partial<TenantTheme>;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'span' | 'section';
}) {
  const value = useMemo(() => ({ ...DEFAULT_TENANT_THEME, ...theme }), [theme]);
  const cssVars = useMemo(() => buildCssVars(value), [value]);

  return (
    <ThemeContext.Provider value={value}>
      <Comp className={className} style={cssVars} data-tenant-theme={value.appName}>
        {children}
      </Comp>
    </ThemeContext.Provider>
  );
}

export function useTenantTheme(): TenantTheme {
  return useContext(ThemeContext);
}
