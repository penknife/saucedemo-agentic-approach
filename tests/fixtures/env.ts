export function getRequiredEnv(name: string): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.[name] ?? '';
}

export function getSauceDemoPassword(): string {
  return getRequiredEnv('SAUCE_DEMO_PASSWORD');
}
