import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base";
import { HeaderComponent } from "./components/header";
import { CartBadgeComponent } from "./components/cart-badge";

/**
 * Inventory (product listing) page — /inventory.html
 */
export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartBadge: CartBadgeComponent;

  private readonly inventoryList = this.page.locator(".inventory_list");
  private readonly pageTitle = this.page.locator('[data-test="title"]');

  get titleLocator(): Locator {
    return this.pageTitle;
  }

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page.locator("#header_container"));
    this.cartBadge = new CartBadgeComponent(
      page.locator(".shopping_cart_container"),
    );
  }

  async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryList.locator(
      `.inventory_item:has(.inventory_item_name:text("${name}"))`,
    );
    await item.locator('[id^="add-to-cart"]').click();
  }

  async removeItemFromCartByName(name: string): Promise<void> {
    const item = this.inventoryList.locator(
      `.inventory_item:has(.inventory_item_name:text("${name}"))`,
    );
    await item.locator('[id^="remove"]').click();
  }

  async openItemByName(name: string): Promise<void> {
    await this.inventoryList
      .locator(`.inventory_item_name:text("${name}")`)
      .click();
  }

  /** Returns the label text on the cart-action button for a named product ("Add to cart" or "Remove"). */
  async getCartButtonLabel(name: string): Promise<string> {
    const item = this.inventoryList.locator(
      `.inventory_item:has(.inventory_item_name:text("${name}"))`,
    );
    const addBtn = item.locator('[id^="add-to-cart"]');
    const removeBtn = item.locator('[id^="remove"]');
    const addVisible = await addBtn.isVisible();
    if (addVisible) return (await addBtn.textContent()) ?? "Add to cart";
    return (await removeBtn.textContent()) ?? "Remove";
  }
}
