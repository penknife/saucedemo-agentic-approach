import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";

dotenv.config({ path: ".env" });
const isCI = !!process.env.CI;

export const BASE_URL = "https://www.saucedemo.com";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 4,
  reporter: [["list"], ["html", { open: "never" }]],
  // Authentication is owned by the worker fixture (tests/fixture/worker-fixtures.ts),
  // which logs in on demand and self-heals stale/missing .auth state. No global
  // setup step is required. `npm run auth` still runs global-setup for an optional
  // explicit pre-warm/reset of the .auth files.
  use: {
    baseURL: BASE_URL,
    headless: isCI,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // On CI, use Playwright's bundled Chromium to avoid missing Chrome channel.
        ...(isCI ? {} : { channel: "chrome" }),
      },
    },
  ],
});
