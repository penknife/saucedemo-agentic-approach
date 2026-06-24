import { config } from "dotenv";

config();

export function getEnv(name: string): string {
  return process.env[name] ?? "";
}

export function getSauceDemoPassword(): string | undefined {
  return getEnv("SAUCE_DEMO_PASSWORD") || undefined;
}
