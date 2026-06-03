import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login page — the only page without a Header/Cart component.
 * Also used by global-setup to authenticate before saving storage state.
 */
export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('#user-name');
  private readonly passwordInput = this.page.locator('#password');
  private readonly loginButton = this.page.locator('#login-button');
  private readonly errorMessage = this.page.locator('[data-test="error"]');
  private readonly errorCloseButton = this.page.locator('[data-test="error"] button');

  constructor(page: Page) {
    super(page);
  }

  get errorLocator(): Locator {
    return this.errorMessage;
  }

  get loginButtonLocator(): Locator {
    return this.loginButton;
  }

  async navigate(): Promise<void> {
    await this.goto('/');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async submitViaEnterFromPassword(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  async submitViaEnterFromUsername(): Promise<void> {
    await this.usernameInput.press('Enter');
  }

  async dismissError(): Promise<void> {
    await this.errorCloseButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
