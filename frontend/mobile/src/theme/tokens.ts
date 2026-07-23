/**
 * EduAI mobile design tokens — mirror of `@eduai/ui` / Stitch semantic palette.
 *
 * Phase 1: StyleSheet/hex mirror only (no full NativeWind rewrite).
 * Keep hex values in sync with `frontend/shared-ui/ui/src/globals.css` light theme
 * and Stitch DESIGN.md (`#1A73E8` primary, `#9334E6` tertiary).
 *
 * See ADR: `backend/docs/architecture/adr/001-design-token-architecture.md`
 */

export const tokens = {
  colors: {
    /** Stitch / Material primary blue */
    primary: '#1A73E8',
    primaryDeep: '#005BBF',
    primaryBright: '#1A73E8',
    primaryContainer: '#D3E3FD',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#041E49',

    /** Stitch tertiary purple — AI / brand secondary on web */
    tertiary: '#9334E6',
    tertiaryContainer: '#A145F4',
    secondary: '#9334E6',

    /** Success / growth (Stitch secondary green) */
    success: '#34A853',
    successDeep: '#006E2C',
    successContainer: '#86F898',
    onSuccessContainer: '#00722F',
    /** Legacy Stitch names used by existing mobile components */
    secondaryContainer: '#86F898',
    onSecondaryContainer: '#00722F',
    secondaryGreen: '#006E2C',

    warning: '#F59E0B',
    error: '#D93025',
    info: '#0EA5E9',

    background: '#F8FAFD',
    surface: '#FFFFFF',
    surfaceElevated: '#EEF2F7',
    surfaceHigh: '#E6E8F2',
    text: '#1F1F1F',
    textMuted: '#5F6368',
    border: '#DADCE0',
    outlineVariant: '#C1C6D6',

    /** Gamification */
    xp: '#F5B400',
    streak: '#F97316',
    achievement: '#F472B6',
  },

  /** 4px base grid (master prompt); sm=8 keeps prior rhythm */
  spacing: {
    unit: 4,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  /** Mirrors CSS type scale (approx px) */
  fontSize: {
    caption: 12,
    label: 14,
    body: 16,
    h6: 16,
    h5: 18,
    h4: 20,
    h3: 24,
    h2: 30,
    h1: 36,
    display: 48,
    /** Legacy aliases */
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
  },

  motion: {
    instant: 80,
    fast: 120,
    normal: 200,
    slow: 320,
  },

  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 6,
    },
  },

  themes: {
    light: 'light',
    dark: 'dark',
    highContrast: 'high-contrast',
  },
} as const;

export type EduaiMobileTokens = typeof tokens;

/** Dark theme color overrides (apply in ThemeProvider when dark mode lands). */
export const darkColorOverrides = {
  background: '#0B1220',
  surface: '#121A2B',
  surfaceElevated: '#1A2438',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  border: '#2A3548',
  primary: '#4B8EF1',
  tertiary: '#B57BFF',
  secondary: '#B57BFF',
} as const;
