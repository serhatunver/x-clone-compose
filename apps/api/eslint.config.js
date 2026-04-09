// @ts-check
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import e18e from '@e18e/eslint-plugin';
import json from '@eslint/json';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  {
    name: 'global-ignores',
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.js'],
  },

  {
    name: 'base-config',
    files: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.mts'],
    extends: [
      js.configs.recommended,
      ...ts.configs.recommendedTypeChecked,
      ...ts.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2025 },
      parser: ts.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      e18e,
    },
    rules: {
      // @ts-expect-error
      ...(e18e.configs?.recommended?.rules ?? {}),
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },

  {
    name: 'disable-type-check-files',
    files: ['**/*.js', '**/*.mjs', 'eslint.config.js'],
    extends: [ts.configs.disableTypeChecked],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  {
    name: 'json-check',
    files: ['**/*.json'],
    language: 'json/json',
    plugins: {
      e18e,
      json,
    },
    rules: {
      'e18e/ban-dependencies': 'error',
    },
  },

  prettierConfig,
);
