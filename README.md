# saucedemo-agentic-approach
Agentic approach to write playwright tests

## Environment Variables

`SAUCE_DEMO_PASSWORD` must be available before running tests.  
The easiest approach for any OS is the **`.env` file** — the test runner loads it automatically, so VS Code Test Explorer and CLI runs both work without extra shell setup.

### Quickest setup (all platforms): `.env` file

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in the password:
   ```
   SAUCE_DEMO_PASSWORD=<your-password>
   ```
3. Run tests — no further setup needed:
   ```bash
   npx playwright test
   ```

> `.env` is listed in `.gitignore` and will never be committed.

---

### macOS / Linux — persistent shell variable

Set the variable once so every terminal session and VS Code window picks it up automatically.

**macOS (zsh):**
```bash
echo "export SAUCE_DEMO_PASSWORD='<your-password>'" >> ~/.zshrc
source ~/.zshrc
```

**Linux (bash):**
```bash
echo "export SAUCE_DEMO_PASSWORD='<your-password>'" >> ~/.bashrc
source ~/.bashrc
```

Verify it is set:
```bash
echo "$SAUCE_DEMO_PASSWORD"
```

---

### Windows — persistent environment variable

#### Option A: PowerShell (current user, permanent)
```powershell
[System.Environment]::SetEnvironmentVariable("SAUCE_DEMO_PASSWORD", "<your-password>", "User")
```
Restart VS Code or your terminal after running this command.

Verify it is set:
```powershell
echo $env:SAUCE_DEMO_PASSWORD
```

#### Option B: Command Prompt (current session only)
```cmd
set SAUCE_DEMO_PASSWORD=<your-password>
npx playwright test
```

#### Option C: GUI
1. Open **Start** → search for **"Edit the system environment variables"**
2. Click **Environment Variables…**
3. Under **User variables**, click **New**
4. Variable name: `SAUCE_DEMO_PASSWORD`  
   Variable value: `<your-password>`
5. Click **OK** and restart VS Code

---

### CI / CD

Pass the variable as a secret in your pipeline and expose it as an environment variable. Example for GitHub Actions:

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    SAUCE_DEMO_PASSWORD: ${{ secrets.SAUCE_DEMO_PASSWORD }}
```
