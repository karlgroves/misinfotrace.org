import { defineConfig } from '@playwright/test';

// The test server's port. Fixed by default so every run agrees, overridable
// because `reuseExistingServer: false` makes a port clash fatal.
const PORT = Number(process.env.E2E_PORT ?? 8181);

export default defineConfig({
  testDir: './e2e',
  // The a11y-assert engine evaluates rules in the real browser, which is
  // thorough but slow on long pages; give each test room so a slow pass is not
  // reported as a timeout.
  timeout: 120_000,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    screenshot: 'only-on-failure',
  },
  // `npm run test:e2e` builds first (pretest:e2e); this serves that build
  // with the production headers from _site/_headers.
  webServer: {
    command: 'node scripts/serve.mjs',
    port: PORT,
    env: { PORT: String(PORT) },
    reuseExistingServer: false,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
