import { Page } from '@playwright/test';

/**
 * Abstract base for all Page Objects.
 * Provides common navigation and readiness helpers.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
    await this.waitForReady();
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  get url(): string {
    return this.page.url();
  }
}
