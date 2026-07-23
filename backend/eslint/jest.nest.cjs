const path = require('path');

/**
 * Shared Jest config for EduAI Nest services (pnpm).
 * Note: Jest 29 relative `.ts` imports can fail when the monorepo path contains
 * spaces (e.g. `AI Learning`). Prefer `@eduai/backend-unit-tests` (Vitest) for
 * tenant-isolation coverage until Phase 10 Jest modernization.
 */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.tsx?$': [
      path.join(__dirname, 'ts-jest-transformer.cjs'),
      { tsconfig: '<rootDir>/tsconfig.json', diagnostics: false },
    ],
  },
  moduleNameMapper: {
    '^@nestjs/(.*)$': '<rootDir>/node_modules/@nestjs/$1',
    '^@eduai/(.*)$': '<rootDir>/node_modules/@eduai/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
  ],
  coverageDirectory: './coverage',
  // Phase 10: enforce floors on Nest service unit suites.
  // Signed exception: path-with-spaces Jest issues — raise gradually; critical shared
  // packages use Vitest thresholds in nest-common / auth / backend-unit-tests.
  coverageThreshold: process.env.JEST_COVERAGE_RELAXED
    ? undefined
    : {
        global: {
          statements: 20,
          branches: 10,
          functions: 15,
          lines: 20,
        },
      },
};
