import { getEnv } from "@saucedemo/shared";

export { getEnv } from "@saucedemo/shared";

function requireEnv(key: string): string {
  const value = getEnv(key);
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export function getApiBaseUrl(): string {
  return requireEnv("API_BASE_URL");
}
