import { Page } from "@playwright/test";
import { BasePage } from "./base";
import { HeaderComponent } from "./components/header";
import { CartBadgeComponent } from "./components/cart-badge";

/**
 * Product detail page — /inventory-item.html
 */
export class ProductDetailPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartBadge: CartBadgeComponent;

  private readonly addToCartButton = this.page.locator('[id^="add-to-cart"]');
  private readonly removeButton = this.page.locator('[id^="remove"]');
  private readonly backButton = this.page.locator('[id="back-to-products"]');

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page.locator("#header_container"));
    this.cartBadge = new CartBadgeComponent(
      page.locator(".shopping_cart_container"),
    );
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async goBackToProducts(): Promise<void> {
    await this.backButton.click();
  }

  get addToCartLocator() {
    return this.addToCartButton;
  }

  get removeLocator() {
    return this.removeButton;
  }
}
