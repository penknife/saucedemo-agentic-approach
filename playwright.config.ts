import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

dotenv.config({ path: '.env' });
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 4,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  globalSetup: require.resolve('./tests-setup/global-setup'),
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // On CI, use Playwright's bundled Chromium to avoid missing Chrome channel.
        ...(isCI ? {} : { channel: 'chrome' }),
      },
    },
  ],
});
