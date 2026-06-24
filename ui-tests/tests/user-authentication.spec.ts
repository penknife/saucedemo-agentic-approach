import { test, testNoAuth, expect } from './fixture/test-fixtures';
import { getSauceDemoPassword } from './fixture/env';

test.describe('Feature: User Authentication', () => {

  testNoAuth.describe('Login form interactions', () => {

    testNoAuth('TC-001 Successful login with valid credentials', { tag: ['@high'] }, async ({ loginPage, inventoryPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', getSauceDemoPassword()!);
      await expect(page, 'TC-001: User should be redirected to inventory page after valid login').toHaveURL(/inventory\.html/);
      await expect(inventoryPage.titleLocator, 'TC-001: Inventory title should display Products after successful login').toHaveText('Products');
    });

    testNoAuth('TC-002 Login rejected with invalid username', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', getSauceDemoPassword()!);
      await expect(page, 'TC-002: User should remain on login page after invalid username').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-002: Error banner should be visible for invalid username').toBeVisible();
      await expect(loginPage.errorLocator, 'TC-002: Error text should indicate username and password mismatch').toContainText('Username and password do not match');
    });

    testNoAuth('TC-003 Login rejected with invalid password', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', 'wrongpassword123');
      await expect(page, 'TC-003: User should remain on login page after invalid password').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-003: Error banner should be visible for invalid password').toBeVisible();
      await expect(loginPage.errorLocator, 'TC-003: Error text should indicate username and password mismatch').toContainText('Username and password do not match');
    });

    testNoAuth('TC-004 Login rejected with both credentials invalid', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', 'wrongpassword123');
      await expect(page, 'TC-004: User should remain on login page when both credentials are invalid').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-004: Error banner should be visible for invalid username and password').toBeVisible();
      await expect(loginPage.errorLocator, 'TC-004: Error text should indicate username and password mismatch').toContainText('Username and password do not match');
    });

    testNoAuth('TC-005 Login rejected when username is empty', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('', getSauceDemoPassword()!);
      await expect(page, 'TC-005: User should remain on login page when username is empty').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-005: Error banner should be visible when username is empty').toBeVisible();
      await expect(loginPage.errorLocator, 'TC-005: Error text should indicate username is required').toContainText('Username is required');
    });

    testNoAuth('TC-006 Login rejected when password is empty', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', '');
      await expect(page, 'TC-006: User should remain on login page when password is empty').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-006: Error banner should be visible when password is empty').toBeVisible();
      await expect(loginPage.errorLocator, 'TC-006: Error text should indicate password is required').toContainText('Password is required');
    });

    testNoAuth('TC-007 Login rejected when both fields are empty', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('', '');
      await expect(page, 'TC-007: User should remain on login page when both credentials are empty').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-007: Error banner should be visible when both credentials are empty').toBeVisible();
      await expect(loginPage.errorLocator, 'TC-007: Error text should indicate username is required when both fields are empty').toContainText('Username is required');
    });

    testNoAuth('TC-008 Login button is visible and enabled on page load', { tag: ['@medium'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await expect(loginPage.loginButtonLocator, 'TC-008: Login button should be visible on initial page load').toBeVisible();
      await expect(loginPage.loginButtonLocator, 'TC-008: Login button should be enabled on initial page load').toBeEnabled();
    });

    testNoAuth('TC-009 Login button triggers authentication', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.fillUsername('standard_user');
      await loginPage.fillPassword(getSauceDemoPassword()!);
      await loginPage.clickLoginButton();
      await expect(page, 'TC-009: Clicking login button should navigate authenticated user to inventory page').toHaveURL(/inventory\.html/);
    });

    testNoAuth('TC-010 Login via Enter key after filling credentials', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.fillUsername('standard_user');
      await loginPage.fillPassword(getSauceDemoPassword()!);
      await loginPage.submitViaEnterFromPassword();
      await expect(page, 'TC-010: Pressing Enter from password field should submit login and open inventory page').toHaveURL(/inventory\.html/);
    });

    testNoAuth('TC-011 Login via Enter key from username field', { tag: ['@medium'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.fillUsername('standard_user');
      await loginPage.fillPassword(getSauceDemoPassword()!);
      await loginPage.submitViaEnterFromUsername();
      await expect(page, 'TC-011: Pressing Enter from username field should submit login and open inventory page').toHaveURL(/inventory\.html/);
    });

    testNoAuth('TC-012 Error message is displayed on failed login', { tag: ['@high'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', 'wrongpassword123');
      await expect(loginPage.errorLocator, 'TC-012: Error banner should be visible after failed login').toBeVisible();
    });

    testNoAuth('TC-013 Error message is meaningful for wrong credentials', { tag: ['@high'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', 'wrongpassword123');
      await expect(loginPage.errorLocator, 'TC-013: Error text should clearly indicate username and password mismatch').toContainText('Username and password do not match');
    });

    testNoAuth('TC-014 Error message is meaningful for empty username', { tag: ['@medium'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('', getSauceDemoPassword()!);
      await expect(loginPage.errorLocator, 'TC-014: Error text should indicate username is required when left blank').toContainText('Username is required');
    });

    testNoAuth('TC-015 Error message is meaningful for empty password', { tag: ['@medium'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', '');
      await expect(loginPage.errorLocator, 'TC-015: Error text should indicate password is required when left blank').toContainText('Password is required');
    });

    testNoAuth('TC-016 Error message can be dismissed', { tag: ['@medium'] }, async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login('invalid_user_xyz', 'wrongpassword123');
      await expect(loginPage.errorLocator, 'TC-016: Error banner should be visible before dismiss action').toBeVisible();
      await loginPage.dismissError();
      await expect(loginPage.errorLocator, 'TC-016: Error banner should be hidden after dismiss action').toBeHidden();
    });

    testNoAuth('TC-020 Locked user is denied login', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('locked_out_user', getSauceDemoPassword()!);
      await expect(page, 'TC-020: Locked user should remain on login page after login attempt').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-020: Error banner should be visible for locked user').toBeVisible();
      await expect(loginPage.errorLocator, 'TC-020: Error text should mention locked out account state').toContainText('locked out');
    });

    testNoAuth('TC-021 Login rejected with whitespace-only username', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('   ', getSauceDemoPassword()!);
      await expect(page, 'TC-021: User should remain on login page when username contains only whitespace').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-021: Error banner should be visible for whitespace-only username').toBeVisible();
    });

    testNoAuth('TC-022 Login rejected with whitespace-only password', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', '   ');
      await expect(page, 'TC-022: User should remain on login page when password contains only whitespace').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-022: Error banner should be visible for whitespace-only password').toBeVisible();
    });

    testNoAuth('TC-023 Login field accepts and handles excessively long username input', { tag: ['@medium'] }, async ({ loginPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('a'.repeat(256), getSauceDemoPassword()!);
      await expect(page, 'TC-023: User should remain on login page after excessively long username input').toHaveURL('/');
      await expect(loginPage.errorLocator, 'TC-023: Error banner should be visible for excessively long username input').toBeVisible();
    });
  });

  test.describe('Authenticated session persistence', () => {
    test('TC-017 Authenticated session persists after login', { tag: ['@high'] }, async ({ loginPage, inventoryPage, cartPage, page }) => {
      await loginPage.navigate();
      await loginPage.login('standard_user', getSauceDemoPassword()!);
      await expect(page, 'TC-017: User should be redirected to inventory page after valid login').toHaveURL(/inventory\.html/);
      await cartPage.goto('/cart.html');
      await expect(page, 'TC-017: Session should remain active when navigating to cart page').toHaveURL(/cart\.html/);
      await inventoryPage.goto('/inventory.html');
      await expect(page, 'TC-017: Session should persist when returning from cart to inventory page').toHaveURL(/inventory\.html/);
    });
  });

  testNoAuth.describe('Unauthenticated access protection', () => {

    testNoAuth('TC-018 Unauthenticated access to protected page is denied', { tag: ['@high'] }, async ({ loginPage, page }) => {
      await loginPage.goto('/inventory.html');
      await expect(page, 'TC-018: Unauthenticated user should be redirected to login when opening inventory page directly').toHaveURL('/');
    });

    testNoAuth('TC-019 Unauthenticated access to cart page is denied', { tag: ['@medium'] }, async ({ loginPage, page }) => {
      await loginPage.goto('/cart.html');
      await expect(page, 'TC-019: Unauthenticated user should be redirected to login when opening cart page directly').toHaveURL('/');
    });
  });
});
