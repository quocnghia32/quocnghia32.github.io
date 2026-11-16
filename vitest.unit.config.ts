import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/unit/**/*.test.ts'],
    environment: 'node',
    reporters: ['default', 'json'],
    outputFile: { json: 'coverage/unit/results.json' },
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      reporter: ['text', 'json-summary'],
      reportsDirectory: 'coverage/unit',
      thresholds: { lines: 95, functions: 95, branches: 90, statements: 95 },
    },
  },
});
