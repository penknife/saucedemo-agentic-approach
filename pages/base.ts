import { Page } from "@playwright/test";

/**
 * Abstract base for all Page Objects.
 * Provides common navigation and readiness helpers.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = "/"): Promise<void> {
    await this.page.goto(path);
    await this.waitForReady();
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  get url(): string {
    return this.page.url();
  }

  /**
   * Clears the SauceDemo cart from localStorage without touching the session.
   * Use in beforeEach to ensure a clean cart before each test.
   */
  async clearCartStorage(): Promise<void> {
    await this.page.evaluate(() => {
      window.localStorage.removeItem("cart-contents");
    });
    // Reload so the UI reflects the cleared cart
    await this.page.reload();
    await this.waitForReady();
  }
}
