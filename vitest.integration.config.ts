/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['test/integration/**/*.test.ts'],
    environment: 'node',
    environmentOptions: {
      happyDOM: {
        // Rendered pages reference Astro's bundled script and Google Fonts; tests drive the scripts directly.
        settings: { disableJavaScriptFileLoading: true, disableCSSFileLoading: true, disableJavaScriptEvaluation: true, handleDisabledFileLoadingAsSuccess: true },
      },
    },
    reporters: ['default', 'json'],
    outputFile: { json: 'coverage/integration/results.json' },
    coverage: {
      provider: 'v8',
      include: ['src/scripts/**/*.ts', 'src/lib/**/*.ts', 'src/pages/**/*.astro', 'src/layouts/**/*.astro', 'src/components/**/*.astro'],
      reporter: ['text', 'json-summary'],
      reportsDirectory: 'coverage/integration',
    },
  },
});
