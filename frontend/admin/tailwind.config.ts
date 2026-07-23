import type { Config } from 'tailwindcss';
import eduaiPreset from '@eduai/ui/tailwind-preset';

const config = {
  ...eduaiPreset,
  content: ['./src/**/*.{ts,tsx}', '../shared-ui/ui/src/**/*.{ts,tsx}'],
} as Config;

export default config;
