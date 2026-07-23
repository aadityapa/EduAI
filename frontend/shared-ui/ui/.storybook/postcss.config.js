import type { Preview } from '@storybook/react';

/**
 * PostCSS / Tailwind for Storybook — mirrors app tooling.
 */
const config = {
  plugins: {
    tailwindcss: { config: '../tailwind.config.ts' },
    autoprefixer: {},
  },
};

export default config;
