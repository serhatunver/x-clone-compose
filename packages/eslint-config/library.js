// @ts-check
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';

/**
 * @param {string} dirname
 */
export const libraryConfig = (dirname) => {
  const gitignorePath = path.resolve(dirname, '.gitignore');

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
      name: 'library-base-config',
      files: ['src/**/*.ts', 'index.ts'],
      extends: [js.configs.recommended, ...ts.configs.recommendedTypeChecked],
      languageOptions: {
        parser: ts.parser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: dirname,
        },
      },
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
      },
    },
    prettierConfig
  );
};
