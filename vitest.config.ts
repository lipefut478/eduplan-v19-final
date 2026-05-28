import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['supabase/functions/**/*.ts', 'src/lib/**/*.ts'],
      exclude: ['supabase/functions/**/*.test.ts', 'tests/**'],
    },
  },
});
