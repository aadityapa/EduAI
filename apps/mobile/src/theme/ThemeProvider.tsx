import React, { createContext, useContext, useMemo } from 'react';

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
  appName: string;
}

const DEFAULT_THEME: TenantTheme = {
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#f59e0b',
  fontFamily: 'System',
  appName: 'EduAI',
};

const ThemeContext = createContext<TenantTheme>(DEFAULT_THEME);

export function ThemeProvider({
  theme,
  children,
}: {
  theme?: Partial<TenantTheme>;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function themeStyles(theme: TenantTheme) {
  return {
    header: { backgroundColor: theme.primaryColor },
    button: { backgroundColor: theme.primaryColor },
    accent: { color: theme.accentColor },
    title: { color: theme.primaryColor },
  };
}
