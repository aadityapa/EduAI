import React, { createContext, useContext, useMemo } from 'react';
import { darkColorOverrides, tokens } from './tokens';

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tertiaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  appName: string;
  colorScheme?: 'light' | 'dark' | 'high-contrast';
}

const DEFAULT_THEME: TenantTheme = {
  primaryColor: tokens.colors.primary,
  secondaryColor: tokens.colors.secondary,
  accentColor: tokens.colors.warning,
  tertiaryColor: tokens.colors.tertiary,
  fontFamily: 'System',
  appName: 'EduAI',
  colorScheme: 'light',
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

/** Resolve palette for current colorScheme (StyleSheet consumers). */
export function resolveColors(scheme: TenantTheme['colorScheme'] = 'light') {
  if (scheme === 'dark') {
    return { ...tokens.colors, ...darkColorOverrides };
  }
  if (scheme === 'high-contrast') {
    return {
      ...tokens.colors,
      text: '#000000',
      textMuted: '#1F1F1F',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      border: '#000000',
      primary: '#005BBF',
    };
  }
  return tokens.colors;
}

export function themeStyles(theme: TenantTheme) {
  const colors = resolveColors(theme.colorScheme);
  return {
    header: { backgroundColor: theme.primaryColor },
    button: { backgroundColor: theme.primaryColor },
    accent: { color: theme.accentColor },
    title: { color: theme.primaryColor },
    screen: { backgroundColor: colors.background },
  };
}

export { tokens, darkColorOverrides };
