import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { CartBadgeComponent } from './components/CartBadgeComponent';

/**
 * Cart page — /cart.html
 */
export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartBadge: CartBadgeComponent;

  private readonly cartItems = this.page.locator('.cart_item');
  private readonly continueShoppingButton = this.page.locator('#continue-shopping');
  private readonly checkoutButton = this.page.locator('#checkout');

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page.locator('#header_container'));
    this.cartBadge = new CartBadgeComponent(page.locator('.shopping_cart_container'));
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async removeItemByName(name: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: name });
    await item.locator('[id^="remove"]').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
