import { defineConfig } from '@playwright/test';

const PORT = 4322;

export default defineConfig({
  testDir: 'test/e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test/e2e/evidence/results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // Use the Chrome already installed on this Mac; no Playwright browser download.
    channel: 'chrome',
    headless: true,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: {
    command: `npm run build && npx astro preview --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
