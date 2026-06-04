import * as path from 'path';

let triedEnvFileLoad = false;

function loadLocalEnvOnce(): void {
  if (triedEnvFileLoad) {
    return;
  }
  triedEnvFileLoad = true;

  const proc = (globalThis as {
    process?: {
      loadEnvFile?: (file?: string) => void;
    };
  }).process;

  if (typeof proc?.loadEnvFile === 'function') {
    // Auto-load repo-local .env for Playwright runs when shell vars are missing.
    try {
      proc.loadEnvFile(path.join(process.cwd(), '.env'));
    } catch {
      // Ignore missing .env and keep existing shell environment.
    }
  }
}

export function getRequiredEnv(name: string): string {
  loadLocalEnvOnce();
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.[name] ?? '';
}

export function getSauceDemoPassword(): string {
  const password = getRequiredEnv('SAUCE_DEMO_PASSWORD');
  if (!password) {
    throw new Error('SAUCE_DEMO_PASSWORD environment variable is not set');
  }
  return password;
}
