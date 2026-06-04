import { Page, Locator } from '@playwright/test';
import { BasePage } from './base';
import { HeaderComponent } from './components/header';
import { CartBadgeComponent } from './components/cart-badge';

/**
 * Inventory (product listing) page — /inventory.html
 */
export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartBadge: CartBadgeComponent;

  private readonly inventoryList = this.page.locator('.inventory_list');
  private readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  private readonly pageTitle = this.page.locator('[data-test="title"]');

  get titleLocator(): Locator {
    return this.pageTitle;
  }

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page.locator('#header_container'));
    this.cartBadge = new CartBadgeComponent(page.locator('.shopping_cart_container'));
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  async getItemCount(): Promise<number> {
    return this.inventoryList.locator('.inventory_item').count();
  }

  async getItemNames(): Promise<string[]> {
    return this.inventoryList.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryList.locator('.inventory_item_price').allTextContents();
    return priceTexts.map((t) => parseFloat(t.replace('$', '')));
  }

  async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryList.locator(`.inventory_item:has(.inventory_item_name:text("${name}"))`);
    await item.locator('[id^="add-to-cart"]').click();
  }

  async removeItemFromCartByName(name: string): Promise<void> {
    const item = this.inventoryList.locator(`.inventory_item:has(.inventory_item_name:text("${name}"))`);
    await item.locator('[id^="remove"]').click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async openItemByName(name: string): Promise<void> {
    await this.inventoryList.locator(`.inventory_item_name:text("${name}")`).click();
  }
}
