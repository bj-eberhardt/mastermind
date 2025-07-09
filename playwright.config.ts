import { defineConfig, devices } from '@playwright/test';

// Don't use the web server if BASE_URL is set, useful for CI/CD environments
const webServerConfig = !process.env.BASE_URL
  ? {
      webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
      },
    }
  : {};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    // Screenshot bei Fehlern aktivieren
    screenshot: 'only-on-failure',
    // Video bei Fehlern aufnehmen
    video: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ...webServerConfig,
});
