import { Page } from "@playwright/test";
import { BasePage } from "./base";
import { HeaderComponent } from "./components/header";
import { CartBadgeComponent } from "./components/cart-badge";

/**
 * Cart page — /cart.html
 */
export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartBadge: CartBadgeComponent;

  private readonly cartItems = this.page.locator(".cart_item");
  private readonly continueShoppingButton =
    this.page.locator("#continue-shopping");
  private readonly checkoutButton = this.page.locator("#checkout");

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page.locator("#header_container"));
    this.cartBadge = new CartBadgeComponent(
      page.locator(".shopping_cart_container"),
    );
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator(".inventory_item_name").allTextContents();
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

  get continueShoppingLocator() {
    return this.continueShoppingButton;
  }

  get checkoutLocator() {
    return this.checkoutButton;
  }

  /** Returns the name, description, quantity, and price of a cart item by name. */
  async getCartItemDetails(
    name: string,
  ): Promise<{
    name: string;
    description: string;
    quantity: string;
    price: string;
  }> {
    const item = this.cartItems.filter({ hasText: name });
    const itemName =
      (await item.locator(".inventory_item_name").textContent()) ?? "";
    const itemDescription =
      (await item.locator(".inventory_item_desc").textContent()) ?? "";
    const itemQuantity =
      (await item.locator(".cart_quantity").textContent()) ?? "";
    const itemPrice =
      (await item.locator(".inventory_item_price").textContent()) ?? "";
    return {
      name: itemName,
      description: itemDescription,
      quantity: itemQuantity,
      price: itemPrice,
    };
  }
}
