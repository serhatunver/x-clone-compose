// @ts-check
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';

/**
 * @param {string} dirname
 */
export const nextJsConfig = (dirname) => {
  const gitignorePath = path.resolve(dirname, '.gitignore');

  return defineConfig([
    includeIgnoreFile(gitignorePath),
    ...nextVitals,
    ...nextTs,

    {
      name: 'repo-next-overrides',
      plugins: {
        turbo: turboPlugin,
      },
      rules: {
        'turbo/no-undeclared-env-vars': 'warn',
        'no-console': 'warn',
      },
      settings: {
        next: {
          rootDir: dirname,
        },
      },
    },

    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

    prettierConfig,
  ]);
};
