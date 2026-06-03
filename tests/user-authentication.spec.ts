import { test, testNoAuth, expect } from './fixtures/test-fixtures';
import { SAUCE_DEMO_PASSWORD } from './fixtures/env';

test.describe('Feature: User Authentication', () => {
  testNoAuth.describe('Login form interactions', () => {

    testNoAuth('TC-001 Successful login with valid credentials', { tag: ['@high'] }, async ({ loginPage, inventoryPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', SAUCE_DEMO_PASSWORD);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.titleLocator).toHaveText('Products');
    });

    testNoAuth('TC-002 Login rejected with invalid username', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', SAUCE_DEMO_PASSWORD);
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
      await expect(loginPage.errorLocator).toContainText('Username and password do not match');
    });

    testNoAuth('TC-003 Login rejected with invalid password', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', 'wrongpassword123');
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
      await expect(loginPage.errorLocator).toContainText('Username and password do not match');
    });

    testNoAuth('TC-004 Login rejected with both credentials invalid', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', 'wrongpassword123');
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
      await expect(loginPage.errorLocator).toContainText('Username and password do not match');
    });

    testNoAuth('TC-005 Login rejected when username is empty', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('', SAUCE_DEMO_PASSWORD);
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
      await expect(loginPage.errorLocator).toContainText('Username is required');
    });

    testNoAuth('TC-006 Login rejected when password is empty', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', '');
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
      await expect(loginPage.errorLocator).toContainText('Password is required');
    });

    testNoAuth('TC-007 Login rejected when both fields are empty', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('', '');
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
      await expect(loginPage.errorLocator).toContainText('Username is required');
    });

    testNoAuth('TC-008 Login button is visible and enabled on page load', { tag: ['@medium'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await expect(loginPage.loginButtonLocator).toBeVisible();
      await expect(loginPage.loginButtonLocator).toBeEnabled();
    });

    testNoAuth('TC-009 Login button triggers authentication', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.fillUsername('standard_user');
      await loginPage.fillPassword(SAUCE_DEMO_PASSWORD);
      await loginPage.clickLoginButton();
      await expect(page).toHaveURL(/inventory\.html/);
    });

    testNoAuth('TC-010 Login via Enter key after filling credentials', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.fillUsername('standard_user');
      await loginPage.fillPassword(SAUCE_DEMO_PASSWORD);
      await loginPage.submitViaEnterFromPassword();
      await expect(page).toHaveURL(/inventory\.html/);
    });

    testNoAuth('TC-011 Login via Enter key from username field', { tag: ['@medium'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.fillUsername('standard_user');
      await loginPage.fillPassword(SAUCE_DEMO_PASSWORD);
      await loginPage.submitViaEnterFromUsername();
      await expect(page).toHaveURL(/inventory\.html/);
    });

    testNoAuth('TC-012 Error message is displayed on failed login', { tag: ['@high'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', 'wrongpassword123');
      await expect(loginPage.errorLocator).toBeVisible();
    });

    testNoAuth('TC-013 Error message is meaningful for wrong credentials', { tag: ['@high'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', 'wrongpassword123');
      await expect(loginPage.errorLocator).toContainText('Username and password do not match');
    });

    testNoAuth('TC-014 Error message is meaningful for empty username', { tag: ['@medium'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('', SAUCE_DEMO_PASSWORD);
      await expect(loginPage.errorLocator).toContainText('Username is required');
    });

    testNoAuth('TC-015 Error message is meaningful for empty password', { tag: ['@medium'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', '');
      await expect(loginPage.errorLocator).toContainText('Password is required');
    });

    testNoAuth('TC-016 Error message can be dismissed', { tag: ['@medium'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', 'wrongpassword123');
      await expect(loginPage.errorLocator).toBeVisible();
      await loginPage.dismissError();
      await expect(loginPage.errorLocator).not.toBeVisible();
    });

    testNoAuth('TC-020 Locked user is denied login', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('locked_out_user', SAUCE_DEMO_PASSWORD);
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
      await expect(loginPage.errorLocator).toContainText('locked out');
    });

    testNoAuth('TC-021 Login rejected with whitespace-only username', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('   ', SAUCE_DEMO_PASSWORD);
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
    });

    testNoAuth('TC-022 Login rejected with whitespace-only password', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', '   ');
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
    });

    testNoAuth('TC-023 Login field accepts and handles excessively long username input', { tag: ['@medium'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('a'.repeat(256), SAUCE_DEMO_PASSWORD);
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorLocator).toBeVisible();
    });
  });

  test.describe('Authenticated session persistence', () => {
    test('TC-017 Authenticated session persists after login', { tag: ['@high'] }, async ({ inventoryPage, cartPage, page }) => {
      await inventoryPage.goto('/inventory.html');
      await expect(page).toHaveURL(/inventory\.html/);
      await cartPage.goto('/cart.html');
      await expect(page).toHaveURL(/cart\.html/);
      await inventoryPage.goto('/inventory.html');
      await expect(page).toHaveURL(/inventory\.html/);
    });
  });

  testNoAuth.describe('Unauthenticated access protection', () => {

    testNoAuth('TC-018 Unauthenticated access to protected page is denied', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.goto('/inventory.html');
      await expect(page).toHaveURL('/');
    });

    testNoAuth('TC-019 Unauthenticated access to cart page is denied', { tag: ['@medium'] }, async ({ loginPage, page }) => {
      await loginPage.goto('/cart.html');
      await expect(page).toHaveURL('/');
    });
  });
});
