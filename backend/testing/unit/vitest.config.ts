import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@eduai/nest-common': path.resolve(__dirname, '../../shared/nest-common/src/index.ts'),
      '@eduai/shared': path.resolve(__dirname, '../../shared/shared/src/index.ts'),
      '@eduai/database': path.resolve(__dirname, '../../database/src/index.ts'),
      '@eduai/auth': path.resolve(__dirname, '../../shared/auth/src/index.ts'),
    },
  },
});
