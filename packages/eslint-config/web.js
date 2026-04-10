// @ts-check
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';

/**
 * @param {string} dirname
 * @returns {import("eslint").Linter.Config[]}
 */
export const webConfig = (dirname) => {
  const gitignorePath = path.resolve(dirname, '.gitignore');

  return defineConfig(
    includeIgnoreFile(gitignorePath),
    {
      name: 'global-ignores',
      ignores: [
        '.nuxt/**',
        '.output/**',
        'dist/**',
        'node_modules/**',
        'eslint.config.js',
      ],
    },
    {
      name: 'turbo-check',
      plugins: { turbo: turboPlugin },
      rules: { 'turbo/no-undeclared-env-vars': 'warn' },
    },
    {
      name: 'web-base',
      files: ['**/*.ts', '**/*.js', '**/*.vue'],
      extends: [js.configs.recommended, ...ts.configs.recommended],
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.es2025,
        },
        parser: ts.parser,
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
      },
      rules: {
        'no-console': 'warn',
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
      },
    },
    prettierConfig
  );
};
