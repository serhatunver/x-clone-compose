import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export const webConfig = [
  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfig,
  {
    rules: {
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off',
    },
  },
];
