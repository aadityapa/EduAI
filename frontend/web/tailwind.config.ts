import type { Config } from 'tailwindcss';
import uiConfig from '@eduai/ui/tailwind.config';

const config: Config = {
  ...uiConfig,
  content: [
    './src/**/*.{ts,tsx}',
    '../shared-ui/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
