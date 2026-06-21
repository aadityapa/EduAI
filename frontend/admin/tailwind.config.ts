import type { Config } from 'tailwindcss';
import uiConfig from '@eduai/ui/tailwind.config';

export default {
  ...uiConfig,
  content: ['./src/**/*.{ts,tsx}', '../shared-ui/ui/src/**/*.{ts,tsx}'],
} satisfies Config;
