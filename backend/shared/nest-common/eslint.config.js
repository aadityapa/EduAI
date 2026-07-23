import tseslint from 'typescript-eslint';

/** Shared Nest package ESLint (flat). Services extend via ../eslint/nest.flat.js */
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '**/*.js'] },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
