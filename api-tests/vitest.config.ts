import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const sharedSrc = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../shared/src/index.ts",
);

export default defineConfig({
  resolve: {
    alias: {
      "@saucedemo/shared": sharedSrc,
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
  },
});
