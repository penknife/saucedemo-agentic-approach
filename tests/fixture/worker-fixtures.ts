import { test as base } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import type { WorkerFixtures } from "./types";
import { LoginPage } from "../../pages/login";
import { getSauceDemoPassword, getEnv } from "./env";
import { BASE_URL } from "../../playwright.config";

const AUTH_DIR = path.join(process.cwd(), ".auth");

/**
 * Worker-level fixture layer.
 *
 * Owns authentication: each worker lazily ensures it has a valid, logged-in
 * session and exposes the path to its saved storage state. Login lives here
 * (not in a global setup step) so the suite is self-healing — a missing or
 * stale `.auth/state-{index}.json` is repaired automatically instead of
 * failing every test in the worker.
 */
export const testWithWorkerStorage = base.extend<{}, WorkerFixtures>({
  workerStorageState: [
    async ({ browser }, use, workerInfo) => {
      const fileName = path.join(
        AUTH_DIR,
        `state-${workerInfo.parallelIndex}.json`,
      );

      // Seed a context with any previously saved session, then verify it by
      // visiting a protected page. SauceDemo bounces unauthenticated users back
      // to the login page (the base URL "/"), so if we don't land on the
      // inventory page we log in once and persist fresh storage state.
      const context = await browser.newContext({
        storageState: fs.existsSync(fileName) ? fileName : undefined,
        baseURL: BASE_URL,
      });
      const page = await context.newPage();
      const loginPage = new LoginPage(page);

      await loginPage.goto("/inventory.html");

      const isLoggedIn = page.url().includes("/inventory.html");
      if (!isLoggedIn) {
        const password = getSauceDemoPassword();
        if (!password) {
          throw new Error(
            "SAUCE_DEMO_PASSWORD is required to authenticate the worker session",
          );
        }
        const username = getEnv("STANDARD_USER") || "standard_user";
        await loginPage.login(username, password);
        // Confirm login succeeded before persisting state.
        await page.waitForURL("**/inventory.html");
      }

      fs.mkdirSync(AUTH_DIR, { recursive: true });
      await context.storageState({ path: fileName });
      await context.close();

      await use(fileName);
    },
    { scope: "worker" },
  ],

  // Override Playwright's built-in storageState fixture with the per-worker path
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
});
