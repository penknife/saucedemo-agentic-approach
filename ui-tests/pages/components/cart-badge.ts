import { Locator } from '@playwright/test';
import { BaseComponent } from './base';

/**
 * Shopping-cart badge + link component.
 *
 * Reusable on any page that renders `.shopping_cart_container`
 * (InventoryPage, CartPage, CheckoutPage, …).
 *
 * Usage:
 *   const cartBadge = new CartBadgeComponent(page.locator('.shopping_cart_container'));
 */
export class CartBadgeComponent extends BaseComponent {
  private readonly badge: Locator;
  private readonly cartLink: Locator;

  constructor(root: Locator) {
    super(root);
    this.badge = root.locator('.shopping_cart_badge');
    this.cartLink = root.locator('.shopping_cart_link');
  }

  /** Returns the numeric count shown on the badge, or 0 if the badge is not visible. */
  async getCount(): Promise<number> {
    const visible = await this.badge.isVisible();
    if (!visible) return 0;
    const text = await this.badge.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  async isBadgeVisible(): Promise<boolean> {
    return this.badge.isVisible();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
