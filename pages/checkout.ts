import { Page } from "@playwright/test";
import { BasePage } from "./base";
import { HeaderComponent } from "./components/header";
import { CartBadgeComponent } from "./components/cart-badge";

/**
 * Checkout pages — /checkout-step-one.html and /checkout-step-two.html and /checkout-complete.html
 * All three steps are handled by this single page object since they share the same navigation context.
 */
export class CheckoutPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartBadge: CartBadgeComponent;

  // Step 1 — shipping info
  private readonly firstNameInput = this.page.locator("#first-name");
  private readonly lastNameInput = this.page.locator("#last-name");
  private readonly postalCodeInput = this.page.locator("#postal-code");
  private readonly continueButton = this.page.locator("#continue");

  // Step 2 — order overview
  private readonly finishButton = this.page.locator("#finish");
  private readonly summaryTotal = this.page.locator(".summary_total_label");
  private readonly summarySubtotal = this.page.locator(
    ".summary_subtotal_label",
  );
  private readonly summaryTax = this.page.locator(".summary_tax_label");
  private readonly cartItems = this.page.locator(".cart_item");

  // Step 3 — confirmation
  private readonly confirmationHeader = this.page.locator(".complete-header");
  private readonly backHomeButton = this.page.locator(
    '[data-test="back-to-products"]',
  );

  // Shared
  private readonly cancelButton = this.page.locator("#cancel");
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page.locator("#header_container"));
    this.cartBadge = new CartBadgeComponent(
      page.locator(".shopping_cart_container"),
    );
  }

  // ── Step 1 ──────────────────────────────────────────────────────────────

  async fillShippingInfo(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  // ── Step 2 ──────────────────────────────────────────────────────────────

  async getOrderItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getSubtotal(): Promise<string> {
    return (await this.summarySubtotal.textContent()) ?? "";
  }

  async getTax(): Promise<string> {
    return (await this.summaryTax.textContent()) ?? "";
  }

  async getTotal(): Promise<string> {
    return (await this.summaryTotal.textContent()) ?? "";
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  // ── Shared ───────────────────────────────────────────────────────────────

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  get errorLocator() {
    return this.errorMessage;
  }

  get finishLocator() {
    return this.finishButton;
  }

  get cancelLocator() {
    return this.cancelButton;
  }

  get firstNameLocator() {
    return this.firstNameInput;
  }

  get lastNameLocator() {
    return this.lastNameInput;
  }

  get postalCodeLocator() {
    return this.postalCodeInput;
  }

  get continueLocator() {
    return this.continueButton;
  }

  get confirmationHeaderLocator() {
    return this.confirmationHeader;
  }

  async getOrderItemNames(): Promise<string[]> {
    return this.cartItems.locator(".inventory_item_name").allTextContents();
  }

  get summarySubtotalLocator() {
    return this.summarySubtotal;
  }

  get summaryTaxLocator() {
    return this.summaryTax;
  }

  get summaryTotalLocator() {
    return this.summaryTotal;
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
