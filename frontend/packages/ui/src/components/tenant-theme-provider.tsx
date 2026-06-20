'use client';

import React, { createContext, useContext, useMemo } from 'react';

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
  appName: string;
}

const DEFAULT: TenantTheme = {
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#f59e0b',
  fontFamily: 'Inter, system-ui, sans-serif',
  appName: 'EduAI',
};

const ThemeContext = createContext<TenantTheme>(DEFAULT);

export function TenantThemeProvider({
  theme,
  children,
}: {
  theme?: Partial<TenantTheme>;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ ...DEFAULT, ...theme }), [theme]);
  const cssVars = {
    '--brand-primary': value.primaryColor,
    '--brand-secondary': value.secondaryColor,
    '--brand-accent': value.accentColor,
    fontFamily: value.fontFamily,
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider value={value}>
      <div style={cssVars}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTenantTheme() {
  return useContext(ThemeContext);
}
