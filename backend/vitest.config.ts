import { defineConfig } from 'vitest/config';
import { join } from 'node:path';

export default defineConfig(() => {
  return {
    test: {
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.test.ts'],
      exclude: ['node_modules', 'dist'],
      alias: {
        '#': join(process.cwd(), 'src'),
      },
      globals: true,
      environment: 'node',
    },
  };
});
