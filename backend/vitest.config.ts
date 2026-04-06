import { defineConfig } from 'vitest/config';
import { join } from 'node:path';

export default defineConfig(() => {
  return {
    test: {
      setupFiles: ['./vitest.setup.ts'],
      alias: {
        '#': join(process.cwd(), 'src'),
      },
      globals: true,
      environment: 'node',
    },
  };
});
