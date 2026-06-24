import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/login';
import { getSauceDemoPassword } from '../tests/fixture/env';

const AUTH_DIR = path.join(process.cwd(), '.auth');
const WORKER_COUNT = 4;
const BASE_URL = 'https://www.saucedemo.com';
const USERNAME = process.env.STANDARD_USER ?? 'standard_user';
const isCI = !!process.env.CI;

async function globalSetup(_config: FullConfig): Promise<void> {
  const password = getSauceDemoPassword();
  if (!password) {
    throw new Error('SAUCE_DEMO_PASSWORD is required for authentication setup');
  }

  const stateFiles = Array.from(
    { length: WORKER_COUNT },
    (_, i) => path.join(AUTH_DIR, `state-${i}.json`),
  );

  const allExist = stateFiles.every((f) => fs.existsSync(f));
  if (allExist && !process.env.FORCE_AUTH) {
    console.log('[global-setup] Auth state files already exist — skipping login. Set FORCE_AUTH=1 to force re-auth.');
    return;
  }

  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const browser = await chromium.launch({
    ...(isCI ? {} : { channel: 'chrome' }),
    headless: true,
  });
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.goto('/');
  await loginPage.login(USERNAME, password);

  // Verify login succeeded before saving state
  await page.waitForURL('**/inventory.html');

  await context.storageState({ path: stateFiles[0] });
  for (let i = 1; i < WORKER_COUNT; i++) {
    fs.copyFileSync(stateFiles[0], stateFiles[i]);
  }

  await browser.close();
  console.log(`[global-setup] Auth state written to .auth/state-{0..${WORKER_COUNT - 1}}.json`);
}

export default globalSetup;
