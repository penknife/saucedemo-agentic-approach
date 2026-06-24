import { expect } from '@playwright/test';
import { testWithPages } from './page-fixtures';
import type { TestFixtures } from './types';

/**
 * Main fixture entrypoint used by authenticated tests.
 * Inherits worker storage-state and all page/component fixtures.
 */
export const test = testWithPages;

export { expect };

/**
 * Fixture variant with empty storage state (no active session).
 * Useful for login and access-control scenarios.
 *
 * WHY the test-scoped override works: worker-fixtures.ts overrides Playwright's
 * built-in `storageState` at worker scope to point at .auth/state-N.json.
 * A test-scoped fixture override (like the one below) takes precedence over a
 * worker-scoped one when Playwright resolves the value for a given test context,
 * so this correctly clears the session for each testNoAuth call.
 * Do NOT remove this fixture or move it to worker scope — that would break
 * unauthenticated tests by leaking the worker's saved session into them.
 */
export const testNoAuth = test.extend<TestFixtures>({
  storageState: async ({}, use) => {
    await use({ cookies: [], origins: [] });
  },
});
