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
 */
export const testNoAuth = test.extend<TestFixtures>({
  storageState: async ({}, use) => {
    await use({ cookies: [], origins: [] });
  },
});
