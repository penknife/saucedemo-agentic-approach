# API Tests — Project Guidelines

## Overview

Vitest + TypeScript API test suite using axios as the HTTP client.

## Project Structure

| Path | Purpose |
|------|---------|
| `src/client.ts` | Base axios instance factory |
| `src/env.ts` | Environment variable helpers |
| `tests/*.test.ts` | Vitest test files |
| `tests/setup.ts` | Global setup (loads dotenv) |

## TypeScript Conventions

- Strict mode (`"strict": true`). Never use `any` or non-null assertions (`!`).
- ESNext modules with `.js` extension in imports (required by the bundler module resolution).

## Test Authoring

- Test title format: `TC-NNN Short description` (e.g., `TC-001 GET /products returns 200`)
- Every `expect()` must include a failure message: `expect(x, 'TC-NNN: what should be true').toBe(...)`

## Environment Variables

- `API_BASE_URL` — base URL for the API under test (required)
- Copy `.env.example` to `.env` and fill in values. Never hardcode URLs or credentials.

## Commands

```bash
npm test          # Run all tests once
npm run test:watch  # Watch mode
npm run test:ui   # Vitest UI
npm run lint      # Lint
```
