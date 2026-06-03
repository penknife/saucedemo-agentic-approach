# saucedemo-agentic-approach
Agentic approach to write playwright tests

## Environment Variables

Set `SAUCE_DEMO_PASSWORD` before running tests.

```bash
cp .env.example .env
export SAUCE_DEMO_PASSWORD='<your-saucedemo-password>'
```

Run tests with the env var available in the shell:

```bash
SAUCE_DEMO_PASSWORD='<your-saucedemo-password>' npx playwright test
```
