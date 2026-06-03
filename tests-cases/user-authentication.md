---
source: User Authentication — login with valid/invalid credentials, mandatory field validation, login actions, error handling, session management, and locked-user restriction on SauceDemo.
created: 2026-06-01
---

## Scope

Tests cover the Login page of SauceDemo (`/`): credential validation, mandatory-field enforcement, login trigger mechanisms (button and keyboard), error message display/dismissal, authenticated session creation, access restriction for unauthenticated users, and locked-account behaviour.

## Preconditions

- Browser is open and navigated to the SauceDemo login page (`https://www.saucedemo.com`).
- No active authenticated session exists (cookies/storage cleared) unless stated otherwise.
- Network connectivity is available.

## Test Data

| Label | Value |
|---|---|
| Valid username | `standard_user` |
| Valid password | from env var `SAUCE_DEMO_PASSWORD` |
| Locked username | `locked_out_user` |
| Invalid username | `invalid_user_xyz` |
| Invalid password | `wrongpassword123` |
| Protected page URL | `https://www.saucedemo.com/inventory.html` |

## Test Cases

| ID | Title | Steps | Expected Result | Priority | Requirement | Tags |
|----|-------|-------|-----------------|----------|-------------|------|
| TC-001 | Successful login with valid credentials | 1. Navigate to login page. 2. Enter username `standard_user`. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Click **Login** button. | User is redirected to the Products page (`/inventory.html`). Page title or header displays "Products". | High | FR-001 | @happy @login |
| TC-002 | Login rejected with invalid username | 1. Navigate to login page. 2. Enter username `invalid_user_xyz`. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Error message is displayed containing text referencing username/password mismatch (e.g. "Username and password do not match any user in this service"). | High | FR-002 | @negative @login |
| TC-003 | Login rejected with invalid password | 1. Navigate to login page. 2. Enter username `standard_user`. 3. Enter password `wrongpassword123`. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Error message is displayed containing text referencing username/password mismatch (e.g. "Username and password do not match any user in this service"). | High | FR-003 | @negative @login |
| TC-004 | Login rejected with both credentials invalid | 1. Navigate to login page. 2. Enter username `invalid_user_xyz`. 3. Enter password `wrongpassword123`. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Error message is displayed containing text referencing username/password mismatch (e.g. "Username and password do not match any user in this service"). | High | FR-004 | @negative @login |
| TC-005 | Login rejected when username is empty | 1. Navigate to login page. 2. Leave username field empty. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Error message is displayed indicating the username field is required (e.g. "Username is required"). | High | FR-005 | @negative @login |
| TC-006 | Login rejected when password is empty | 1. Navigate to login page. 2. Enter username `standard_user`. 3. Leave password field empty. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Error message is displayed indicating the password field is required (e.g. "Password is required"). | High | FR-006 | @negative @login |
| TC-007 | Login rejected when both fields are empty | 1. Navigate to login page. 2. Leave username field empty. 3. Leave password field empty. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Error message is displayed indicating a required field is missing (e.g. "Username is required"). | High | FR-007 | @negative @edge @login |
| TC-008 | Login button is visible and enabled on page load | 1. Navigate to login page. 2. Observe the **Login** button on the page. | Login button is visible on the page and is enabled (no `disabled` attribute present). | Medium | FR-008 | @happy @ui @login |
| TC-009 | Login button triggers authentication | 1. Navigate to login page. 2. Enter username `standard_user`. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Click **Login** button. | Authentication request is initiated; user is redirected to `/inventory.html`. | High | FR-009 | @happy @login |
| TC-010 | Login via Enter key after filling credentials | 1. Navigate to login page. 2. Enter username `standard_user`. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Press **Enter** key (while focus is in the password field). | Authentication request is initiated; user is redirected to `/inventory.html`. | High | FR-010 | @happy @login |
| TC-011 | Login via Enter key from username field | 1. Navigate to login page. 2. Enter username `standard_user`. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Focus the username field and press **Enter**. | Authentication request is initiated; user is redirected to `/inventory.html`. | Medium | FR-010 | @happy @edge @login |
| TC-012 | Error message is displayed on failed login | 1. Navigate to login page. 2. Enter username `invalid_user_xyz`. 3. Enter password `wrongpassword123`. 4. Click **Login** button. | An error message element becomes visible within the login form area. | High | FR-011 | @negative @login |
| TC-013 | Error message is meaningful for wrong credentials | 1. Navigate to login page. 2. Enter username `invalid_user_xyz`. 3. Enter password `wrongpassword123`. 4. Click **Login** button. 5. Read the text of the error message. | Error message text references username/password mismatch (e.g. contains "Username and password do not match"). | High | FR-012 | @negative @login |
| TC-014 | Error message is meaningful for empty username | 1. Navigate to login page. 2. Leave username empty. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Click **Login** button. 5. Read the text of the error message. | Error message text indicates that the username field is required (e.g. "Username is required"). | Medium | FR-012 | @negative @login |
| TC-015 | Error message is meaningful for empty password | 1. Navigate to login page. 2. Enter username `standard_user`. 3. Leave password empty. 4. Click **Login** button. 5. Read the text of the error message. | Error message text indicates that the password field is required (e.g. "Password is required"). | Medium | FR-012 | @negative @login |
| TC-016 | Error message can be dismissed | 1. Navigate to login page. 2. Enter username `invalid_user_xyz`. 3. Enter password `wrongpassword123`. 4. Click **Login** button. 5. Verify error message is displayed. 6. Click the **×** (close) icon on the error message. | Error message disappears and is no longer visible on the page. | Medium | FR-013 | @happy @login |
| TC-017 | Authenticated session persists after login | 1. Log in with `standard_user` / password from env var `SAUCE_DEMO_PASSWORD`. 2. Navigate to the Products page. 3. Navigate to the Cart page. 4. Navigate back to the Products page. | User remains authenticated throughout; no redirect to login page occurs during navigation. | High | FR-014 | @happy @login |
| TC-018 | Unauthenticated access to protected page is denied | 1. Ensure no active session (clear cookies). 2. Directly navigate to `https://www.saucedemo.com/inventory.html`. | Access is denied; user is redirected to the login page (`/`). | High | FR-015 | @negative @login |
| TC-019 | Unauthenticated access to cart page is denied | 1. Ensure no active session (clear cookies). 2. Directly navigate to `https://www.saucedemo.com/cart.html`. | Access is denied; user is redirected to the login page (`/`). | Medium | FR-015 | @negative @edge @login |
| TC-020 | Locked user is denied login | 1. Navigate to login page. 2. Enter username `locked_out_user`. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Click **Login** button. | Login is denied. User remains on login page. An error message is displayed indicating the account is locked (e.g. "Sorry, this user has been locked out"). | High | FR-016 | @negative @login |
| TC-021 | Login rejected with whitespace-only username | 1. Navigate to login page. 2. Enter a string of spaces (e.g. three spaces) into the username field. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Error message is displayed (e.g. "Username and password do not match any user in this service" or "Username is required"). | High | FR-002 | @negative @edge @login |
| TC-022 | Login rejected with whitespace-only password | 1. Navigate to login page. 2. Enter username `standard_user`. 3. Enter a string of spaces (e.g. three spaces) into the password field. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Error message is displayed (e.g. "Username and password do not match any user in this service" or "Password is required"). | High | FR-003 | @negative @edge @login |
| TC-023 | Login field accepts and handles excessively long username input | 1. Navigate to login page. 2. Enter a string of 256 or more characters into the username field. 3. Enter password from env var `SAUCE_DEMO_PASSWORD`. 4. Click **Login** button. | Login is denied. User remains on login page (`/`). Input is either truncated to the field's maximum length or an error message indicating invalid credentials is displayed. No unhandled error or page crash occurs. | Medium | FR-002 | @negative @edge @login |

## Out of Scope

- Password reset / forgot-password flows.
- Account registration or user management.
- Multi-factor authentication.
- OAuth / SSO login flows.
- Session timeout and automatic logout behaviour.
- Concurrent/multiple session handling.
- UI styling, responsiveness, and cross-browser visual regression.
- Performance / load testing of the login endpoint.

## Open Questions

- **OQ-001 (FR-010):** Should pressing Enter from the username field (without tabbing to password) also submit the form? Currently covered by TC-011 as medium priority pending clarification.
- **OQ-002 (FR-014):** Is there an explicit session cookie/token that should be validated, or is redirect behaviour sufficient to confirm session creation?
- **OQ-003 (FR-015):** Does the application redirect to login for ALL protected routes (e.g. `/checkout-step-one.html`), or only selected ones? Additional TC-019-style cases may be needed. See also TC-023 for max-length boundary.
- **OQ-004 (FR-012):** Are the exact error message strings specified/fixed? If so, please provide them so expected results in TC-013–015 can use exact string assertions.
- **OQ-005 (FR-001/FR-009):** TC-001 ("Successful login with valid credentials") and TC-009 ("Login button triggers authentication") test the same scenario with nearly identical steps and expected results. Consider merging TC-009 into TC-001 or clarifying the distinct acceptance criteria each must satisfy.
- **OQ-006 (FR-002/FR-003):** TC-021 and TC-022 cover whitespace-only input. Clarify whether the application trims whitespace before validation (resulting in an "empty field" error) or treats spaces as invalid characters (resulting in a "mismatch" error), so expected results can be made exact.
- **OQ-007 (FR-002):** TC-023 covers max-length input. Does the username or password field carry a `maxlength` HTML attribute? If so, the boundary value and expected truncation behaviour should be confirmed and documented in Test Data.

## Review Log

### Review — 2026-06-01
**Reviewer:** Agent 02 (Test Cases Reviewer)
**Changes made:**
- Added `Requirement` column to the test cases table; moved all `@FR-XXX` values from Tags into the new column.
- Added `@login` tag to all TCs (tag hygiene — all tests cover the login feature).
- Added `@ui` tag to TC-008 (login button visibility is a UI assertion).
- Removed non-standard `@FR-XXX` tags from the Tags column.
- TC-002, TC-003, TC-004: Rewrote vague Expected Results ("An error message is visible") to specify remaining on the login page URL and the error text pattern.
- TC-005, TC-006, TC-007: Rewrote vague Expected Results ("Validation message … is displayed") to specify remaining on the login page URL and the expected error text pattern.
- TC-008: Retitled to "Login button is visible and enabled on page load"; rewrote Steps to remove assertion steps (steps 3 & 4) and moved observable outcome to Expected Result only, restoring AAA clarity.
- TC-012: Tightened Expected Result from "on the page" to "within the login form area" for specificity.
- Added TC-021: Login rejected with whitespace-only username (edge case — missing coverage).
- Added TC-022: Login rejected with whitespace-only password (edge case — missing coverage).
- Added TC-023: Login field handles excessively long username input (boundary/max-value edge case — missing coverage).
- OQ-003: Minor wording note added referencing TC-023.
- Added OQ-005: flags near-duplicate overlap between TC-001 and TC-009 for manual resolution.
- Added OQ-006: flags ambiguous expected behaviour for whitespace-only inputs (TC-021/TC-022).
- Added OQ-007: flags unknown `maxlength` constraint relevant to TC-023.
**New TCs added:** TC-021, TC-022, TC-023
**TCs modified:** TC-002 (vague expected result), TC-003 (vague expected result), TC-004 (vague expected result), TC-005 (vague expected result), TC-006 (vague expected result), TC-007 (vague expected result), TC-008 (AAA clarity — steps rewritten; title updated), TC-012 (specificity of expected result), all TCs (Requirement column added; tags cleaned)

### Review — 2026-06-01
**Reviewer:** Agent 04 (Playwright Tests Reviewer)
**Spec file:** tests/user-authentication.spec.ts
**Fixes applied:**
- Removed `test.use({ storageState: { cookies: [], origins: [] } })` from two describe blocks (`Login form interactions`, `Unauthenticated access protection`) — `storageState:` overrides are forbidden in spec files.
- Added `testNoAuth` export to `tests/fixtures/test-fixtures.ts` — extends the base fixture and overrides `storageState` to `{ cookies: [], origins: [] }`, moving the unauthenticated-state concern entirely into fixtures.
- Changed `test.describe('Login form interactions', ...)` and all 20 `test(...)` calls within it to use `testNoAuth.describe` / `testNoAuth(...)`.
- Changed `test.describe('Unauthenticated access protection', ...)` and its 2 `test(...)` calls (TC-018, TC-019) to use `testNoAuth.describe` / `testNoAuth(...)`.
- Added `testNoAuth` to the import line in the spec.
**Test run result:** PASSED 23/23
