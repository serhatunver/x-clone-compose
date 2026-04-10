// @ts-check
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import e18e from '@e18e/eslint-plugin';
import json from '@eslint/json';
import turboPlugin from 'eslint-plugin-turbo';

/**
 * @param {string} dirname
 * @returns {import("eslint").Linter.Config[]}
 */
export const apiConfig = (dirname) => {
  const gitignorePath = path.resolve(dirname, '.gitignore');

  // @ts-expect-error - Plugin tipleri Flat Config ile bazen çatışır
  const e18eRules = e18e.configs?.recommended?.rules ?? {};

  return defineConfig(
    includeIgnoreFile(gitignorePath),
    {
      name: 'global-ignores',
      ignores: ['dist/**', 'node_modules/**', 'eslint.config.js'],
    },
    {
      name: 'turbo-check',
      plugins: { turbo: turboPlugin },
      rules: { 'turbo/no-undeclared-env-vars': 'warn' },
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
          tsconfigRootDir: dirname,
        },
      },
      plugins: {
        e18e,
      },
      rules: {
        ...e18eRules,
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
      languageOptions: { globals: globals.node },
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
    {
      name: 'json-check',
      files: ['**/*.json'],
      language: 'json/json',
      plugins: { e18e, json },
      rules: { 'e18e/ban-dependencies': 'error' },
    },
    prettierConfig
  );
};
