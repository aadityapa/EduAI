import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/observability/prometheus-metrics.ts',
        'src/feature-flags/feature-flags.ts',
        'src/filters/all-exceptions.filter.ts',
        'src/middleware/trace-id.middleware.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 60,
        statements: 70,
        branches: 50,
      },
    },
  },
});
