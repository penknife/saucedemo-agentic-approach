import { test as base } from '@playwright/test';
import type { WorkerFixtures } from './types';

/**
 * Worker-level fixture layer.
 * Provides a unique storage-state path for each Playwright worker.
 */
export const testWithWorkerStorage = base.extend<{}, WorkerFixtures>({
  workerStorageState: [
    async ({}, use, workerInfo) => {
      await use(`.auth/state-${workerInfo.parallelIndex}.json`);
    },
    { scope: 'worker' },
  ],

  // Override Playwright's built-in storageState fixture with the per-worker path
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
});
