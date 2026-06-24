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

export function getEnv(name: string): string {
  loadLocalEnvOnce();
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.[name] ?? '';
}

export function getSauceDemoPassword(): string | undefined {
  return getEnv('SAUCE_DEMO_PASSWORD') || undefined;
}
