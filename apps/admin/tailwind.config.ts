import type { Config } from 'tailwindcss';
import uiConfig from '@eduai/ui/tailwind.config';

export default {
  ...uiConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
} satisfies Config;
