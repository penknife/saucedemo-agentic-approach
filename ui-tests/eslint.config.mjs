import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';
import requireTestTag from './eslint/rules/require-test-tag.mjs';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  // TypeScript rules for all .ts files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // Playwright + custom tag rule for spec files
  {
    files: ['**/*.spec.ts', 'tests/**/*.ts', 'tests-cases/**/*.ts'],
    plugins: {
      playwright,
      local: { rules: { 'require-test-tag': requireTestTag } },
    },
    settings: {
      playwright: {
        globalAliases: {
          test: ['testNoAuth'],
        },
      },
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'local/require-test-tag': ['error', { testIdentifiers: ['test', 'testNoAuth'] }],
    },
  },
];
