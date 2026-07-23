import type { Config } from 'tailwindcss';
import eduaiPreset from './tailwind-preset';

/**
 * Package-level Tailwind config for `@eduai/ui`.
 * Apps should prefer `import preset from '@eduai/ui/tailwind-preset'` and set their own `content`.
 */
const config: Config = {
  ...eduaiPreset,
  content: [
    './src/**/*.{ts,tsx}',
    /* Correct monorepo paths (was incorrectly ../../apps/*) */
    '../web/src/**/*.{ts,tsx}',
    '../admin/src/**/*.{ts,tsx}',
  ],
};

export default config;
