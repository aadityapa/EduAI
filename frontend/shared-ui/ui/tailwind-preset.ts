import type { Config } from 'tailwindcss';

/**
 * Shared Tailwind preset for EduAI web + admin.
 * Consumed via `@eduai/ui/tailwind-preset` or the package `tailwind.config`.
 *
 * Tokens live as CSS variables in `src/globals.css` (light / dark / high-contrast).
 */
const eduaiPreset = {
  darkMode: 'class' as const,
  theme: {
    extend: {
      spacing: {
        /** 4px base unit (master prompt) */
        unit: 'var(--spacing-unit)',
        /** Legacy 8px unit — prefer `unit` + Tailwind scale going forward */
        'unit-legacy': 'var(--spacing-unit-legacy)',
        /** 8px-grid aliases (backward compatible) */
        'grid-1': '8px',
        'grid-2': '16px',
        'grid-3': '24px',
        'grid-4': '32px',
        'grid-5': '40px',
        'grid-6': '48px',
        'grid-8': '64px',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        /** Semantic aliases */
        bg: 'hsl(var(--color-bg))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          elevated: 'hsl(var(--surface-elevated))',
        },
        text: {
          DEFAULT: 'hsl(var(--text))',
          muted: 'hsl(var(--text-muted))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          deep: 'hsl(var(--primary-deep))',
          container: 'hsl(var(--primary-container))',
          fg: 'hsl(var(--primary-fg))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
          foreground: 'hsl(var(--tertiary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          border: 'hsl(var(--sidebar-border))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          muted: 'hsl(var(--sidebar-muted))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        glass: {
          bg: 'hsl(var(--glass-bg))',
          border: 'hsl(var(--glass-border))',
        },
        xp: 'hsl(var(--xp))',
        streak: 'hsl(var(--streak))',
        achievement: 'hsl(var(--achievement))',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      backdropBlur: {
        glass: 'var(--glass-blur)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glass: 'var(--glass-shadow)',
      },
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },
      transitionDuration: {
        instant: 'var(--motion-instant)',
        fast: 'var(--motion-fast)',
        normal: 'var(--motion-normal)',
        slow: 'var(--motion-slow)',
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--motion-ease)',
        out: 'var(--motion-ease-out)',
        in: 'var(--motion-ease-in)',
        spring: 'var(--motion-spring)',
      },
      fontFamily: {
        sans: ['var(--font-sans-stack)'],
        display: ['var(--font-display-stack)'],
        learner: ['var(--font-display-stack)'],
        mono: ['var(--font-mono-stack)'],
        /** Legacy aliases used by older layout classNames */
        inter: ['var(--font-inter)', 'var(--font-noto-devanagari)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: [
          'var(--text-display)',
          { lineHeight: 'var(--leading-display)', letterSpacing: '-0.02em', fontWeight: '600' },
        ] as [string, { lineHeight: string; letterSpacing: string; fontWeight: string }],
        h1: [
          'var(--text-h1)',
          { lineHeight: 'var(--leading-heading)', letterSpacing: '-0.02em', fontWeight: '600' },
        ] as [string, { lineHeight: string; letterSpacing: string; fontWeight: string }],
        h2: [
          'var(--text-h2)',
          { lineHeight: 'var(--leading-heading)', letterSpacing: '-0.02em', fontWeight: '600' },
        ] as [string, { lineHeight: string; letterSpacing: string; fontWeight: string }],
        h3: [
          'var(--text-h3)',
          { lineHeight: 'var(--leading-heading)', letterSpacing: '-0.01em', fontWeight: '600' },
        ] as [string, { lineHeight: string; letterSpacing: string; fontWeight: string }],
        h4: [
          'var(--text-h4)',
          { lineHeight: 'var(--leading-heading)', fontWeight: '500' },
        ] as [string, { lineHeight: string; fontWeight: string }],
        h5: [
          'var(--text-h5)',
          { lineHeight: 'var(--leading-heading)', fontWeight: '500' },
        ] as [string, { lineHeight: string; fontWeight: string }],
        h6: [
          'var(--text-h6)',
          { lineHeight: 'var(--leading-heading)', fontWeight: '500' },
        ] as [string, { lineHeight: string; fontWeight: string }],
        body: [
          'var(--text-body)',
          { lineHeight: 'var(--leading-body)', fontWeight: '400' },
        ] as [string, { lineHeight: string; fontWeight: string }],
        'body-sm': [
          'var(--text-body-sm)',
          { lineHeight: 'var(--leading-body)', fontWeight: '400' },
        ] as [string, { lineHeight: string; fontWeight: string }],
        label: [
          'var(--text-label)',
          { lineHeight: 'var(--leading-label)', fontWeight: '500' },
        ] as [string, { lineHeight: string; fontWeight: string }],
        caption: [
          'var(--text-caption)',
          { lineHeight: 'var(--leading-label)', fontWeight: '400' },
        ] as [string, { lineHeight: string; fontWeight: string }],
        code: [
          'var(--text-code)',
          { lineHeight: 'var(--leading-body)', fontWeight: '400' },
        ] as [string, { lineHeight: string; fontWeight: string }],
        'display-lg': [
          '3rem',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' },
        ] as [string, { lineHeight: string; letterSpacing: string; fontWeight: string }],
        'display-md': [
          '2.25rem',
          { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' },
        ] as [string, { lineHeight: string; letterSpacing: string; fontWeight: string }],
        'display-sm': [
          '1.875rem',
          { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' },
        ] as [string, { lineHeight: string; letterSpacing: string; fontWeight: string }],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in var(--motion-normal) var(--motion-ease-out)',
        'slide-in-left': 'slide-in-left var(--motion-normal) var(--motion-ease-out)',
        'accordion-down': 'accordion-down var(--motion-normal) var(--motion-ease-out)',
        'accordion-up': 'accordion-up var(--motion-normal) var(--motion-ease-out)',
      },
    },
  },
  plugins: [],
} satisfies Omit<Config, 'content'>;

export default eduaiPreset;
