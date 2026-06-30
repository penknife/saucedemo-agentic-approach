import { Locator } from "@playwright/test";
import { BaseComponent } from "./base";

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
  constructor(root: Locator) {
    super(root);
  }
}
