import { Locator } from '@playwright/test';
import { BaseComponent } from './base';

/**
 * Header navigation component.
 *
 * Reusable on any page that renders `#header_container`
 * (InventoryPage, CartPage, CheckoutPage, …).
 *
 * Usage:
 *   const header = new HeaderComponent(page.locator('#header_container'));
 */
export class HeaderComponent extends BaseComponent {
  private readonly burgerMenuButton: Locator;
  private readonly menuWrap: Locator;
  private readonly logoText: Locator;

constructor(root: Locator) {
    super(root);
    this.burgerMenuButton = root.locator('#react-burger-menu-btn');
    this.menuWrap = root.locator('.bm-menu-wrap');
    this.logoText = root.locator('.app_logo');
  }

  async openMenu(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.menuWrap.waitFor({ state: 'visible' });
  }

  async closeMenu(): Promise<void> {
    await this.root.locator('#react-burger-cross-btn').click();
    await this.menuWrap.waitFor({ state: 'hidden' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.root.locator('#logout_sidebar_link').click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.root.locator('#reset_sidebar_link').click();
    await this.closeMenu();
  }

  async getLogoText(): Promise<string> {
    return (await this.logoText.textContent()) ?? '';
  }
}
