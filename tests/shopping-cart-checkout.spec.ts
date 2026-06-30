import { test, expect } from "./fixture/test-fixtures";

const PRODUCT_A = "Sauce Labs Backpack";
const PRODUCT_B = "Sauce Labs Bike Light";
const PRODUCT_C = "Sauce Labs Bolt T-Shirt";

const FIRST_NAME = "John";
const LAST_NAME = "Doe";
const POSTAL_CODE = "12345";

test.describe("Feature: Shopping Cart and Checkout", () => {
  test.beforeEach(async ({ inventoryPage, page }) => {
    // Navigate to inventory first so we have a valid origin for localStorage access.
    await inventoryPage.goto("/inventory.html");
    // Sanity guard: the worker fixture self-heals auth (logs in on demand and
    // saves storage state), so we should always land on inventory. This assert
    // surfaces any unexpected session problem clearly instead of mid-test.
    await expect(
      page,
      "Precondition: expected an authenticated session on /inventory.html (worker fixture handles login automatically).",
    ).toHaveURL(/inventory\.html/);
    // Clear cart contents from localStorage without touching the session cookie,
    // ensuring each test starts with an empty cart regardless of prior test state.
    await inventoryPage.clearCartStorage();
  });

  // ── US-01: Add to cart ──────────────────────────────────────────────────

  test(
    "TC-001 Add single product to cart from inventory page",
    { tag: ["@high"] },
    async ({ inventoryPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);

      const label = await inventoryPage.getCartButtonLabel(PRODUCT_A);
      expect(
        label,
        "TC-001: Product A button label should change to Remove after adding to cart",
      ).toBe("Remove");

      const count = await cartBadge.getCount();
      expect(
        count,
        "TC-001: Cart badge should display 1 after adding one item",
      ).toBe(1);
    },
  );

  test(
    "TC-002 Add multiple distinct products updates badge count",
    { tag: ["@high"] },
    async ({ inventoryPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      expect(
        await cartBadge.getCount(),
        "TC-002: Cart badge should display 1 after adding Product A",
      ).toBe(1);

      await inventoryPage.addItemToCartByName(PRODUCT_B);
      expect(
        await cartBadge.getCount(),
        "TC-002: Cart badge should display 2 after adding Product B",
      ).toBe(2);

      await inventoryPage.addItemToCartByName(PRODUCT_C);
      expect(
        await cartBadge.getCount(),
        "TC-002: Cart badge should display 3 after adding Product C",
      ).toBe(3);

      const labelA = await inventoryPage.getCartButtonLabel(PRODUCT_A);
      expect(labelA, "TC-002: Product A button label should be Remove").toBe(
        "Remove",
      );
      const labelB = await inventoryPage.getCartButtonLabel(PRODUCT_B);
      expect(labelB, "TC-002: Product B button label should be Remove").toBe(
        "Remove",
      );
      const labelC = await inventoryPage.getCartButtonLabel(PRODUCT_C);
      expect(labelC, "TC-002: Product C button label should be Remove").toBe(
        "Remove",
      );
    },
  );

  test(
    "TC-003 Added item persists when navigating from inventory to product detail page",
    { tag: ["@high"] },
    async ({ inventoryPage, productDetailPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.openItemByName(PRODUCT_A);

      // Back to inventory
      await productDetailPage.goBackToProducts();

      const label = await inventoryPage.getCartButtonLabel(PRODUCT_A);
      expect(
        label,
        "TC-003: Product A button should still show Remove after navigating back from detail page",
      ).toBe("Remove");

      expect(
        await cartBadge.getCount(),
        "TC-003: Cart badge should remain 1 after navigating back from detail page",
      ).toBe(1);
    },
  );

  test(
    "TC-004 Remove product from cart on inventory page",
    { tag: ["@high"] },
    async ({ inventoryPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.removeItemFromCartByName(PRODUCT_A);

      const label = await inventoryPage.getCartButtonLabel(PRODUCT_A);
      expect(
        label,
        "TC-004: Product A button label should revert to Add to cart after removal",
      ).toBe("Add to cart");

      expect(
        await cartBadge.isBadgeVisible(),
        "TC-004: Cart badge should not be visible after removing the only item",
      ).toBe(false);
    },
  );

  test(
    "TC-005 Cart badge disappears when all items are removed",
    { tag: ["@high"] },
    async ({ inventoryPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.addItemToCartByName(PRODUCT_B);

      expect(
        await cartBadge.getCount(),
        "TC-005: Cart badge should display 2 after adding two items",
      ).toBe(2);

      await inventoryPage.removeItemFromCartByName(PRODUCT_A);
      expect(
        await cartBadge.getCount(),
        "TC-005: Cart badge should display 1 after removing Product A",
      ).toBe(1);

      await inventoryPage.removeItemFromCartByName(PRODUCT_B);
      expect(
        await cartBadge.isBadgeVisible(),
        "TC-005: Cart badge should not be visible after removing all items",
      ).toBe(false);
    },
  );

  test(
    "TC-006 Remove product from cart page",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.addItemToCartByName(PRODUCT_B);
      await inventoryPage.cartBadge.openCart();

      await cartPage.removeItemByName(PRODUCT_A);

      const names = await cartPage.getCartItemNames();
      expect(
        names,
        "TC-006: Product A should be removed from cart listing",
      ).not.toContain(PRODUCT_A);
      expect(
        names,
        "TC-006: Product B should remain in cart after removing Product A",
      ).toContain(PRODUCT_B);

      expect(
        await cartBadge.getCount(),
        "TC-006: Cart badge should decrement to 1 after removing Product A",
      ).toBe(1);
    },
  );

  // ── US-03: View cart ────────────────────────────────────────────────────

  test(
    "TC-007 Cart page lists correct item details",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();

      const details = await cartPage.getCartItemDetails(PRODUCT_A);
      expect(
        details.name,
        "TC-007: Cart item name should match Product A",
      ).toBe(PRODUCT_A);
      expect(
        details.description,
        "TC-007: Cart item description should be non-empty",
      ).not.toBe("");
      expect(details.quantity, "TC-007: Cart item quantity should be 1").toBe(
        "1",
      );
      expect(
        details.price,
        "TC-007: Cart item price should be non-empty",
      ).not.toBe("");

      const count = await cartPage.getCartItemCount();
      expect(count, "TC-007: No other items should be listed in the cart").toBe(
        1,
      );
    },
  );

  test(
    "TC-008 Cart page provides Continue Shopping and Checkout buttons",
    { tag: ["@medium"] },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();

      await expect(
        cartPage.continueShoppingLocator,
        "TC-008: Continue Shopping button should be visible on cart page",
      ).toBeVisible();
      await expect(
        cartPage.checkoutLocator,
        "TC-008: Checkout button should be visible on cart page",
      ).toBeVisible();
    },
  );

  test(
    "TC-009 Continue Shopping button returns to inventory page",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, cartBadge, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.continueShopping();

      await expect(
        page,
        "TC-009: User should be navigated back to inventory page",
      ).toHaveURL(/inventory\.html/);
      expect(
        await cartBadge.getCount(),
        "TC-009: Cart badge should still show 1 after returning to inventory",
      ).toBe(1);
    },
  );

  test(
    "TC-010 Empty cart page is accessible and displays no items",
    { tag: ["@medium"] },
    async ({ cartPage, page }) => {
      // beforeEach already cleared the cart; navigate directly to cart page
      await cartPage.goto("/cart.html");

      await expect(
        page,
        "TC-010: Cart page should load at /cart.html",
      ).toHaveURL(/cart\.html/);

      const count = await cartPage.getCartItemCount();
      expect(
        count,
        "TC-010: No item rows should be listed in an empty cart",
      ).toBe(0);

      await expect(
        cartPage.checkoutLocator,
        "TC-010: Checkout button should be visible on empty cart page",
      ).toBeVisible();
      await expect(
        cartPage.continueShoppingLocator,
        "TC-010: Continue Shopping button should be visible on empty cart page",
      ).toBeVisible();
    },
  );

  test(
    "TC-011 Checkout button navigates to checkout information page",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();

      await expect(
        page,
        "TC-011: User should be navigated to checkout information page",
      ).toHaveURL(/checkout-step-one\.html/);
      await expect(
        checkoutPage.firstNameLocator,
        "TC-011: First Name field should be visible on checkout info page",
      ).toBeVisible();
      await expect(
        checkoutPage.lastNameLocator,
        "TC-011: Last Name field should be visible on checkout info page",
      ).toBeVisible();
      await expect(
        checkoutPage.postalCodeLocator,
        "TC-011: Postal Code field should be visible on checkout info page",
      ).toBeVisible();
    },
  );

  // ── US-04: Checkout information ─────────────────────────────────────────

  test(
    "TC-012 Checkout information page shows required fields",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();

      await expect(
        page,
        "TC-012: User should be on checkout information page",
      ).toHaveURL(/checkout-step-one\.html/);
      await expect(
        checkoutPage.firstNameLocator,
        "TC-012: First Name input should be visible",
      ).toBeVisible();
      await expect(
        checkoutPage.lastNameLocator,
        "TC-012: Last Name input should be visible",
      ).toBeVisible();
      await expect(
        checkoutPage.postalCodeLocator,
        "TC-012: Postal Code input should be visible",
      ).toBeVisible();
      await expect(
        checkoutPage.continueLocator,
        "TC-012: Continue button should be visible",
      ).toBeVisible();
      await expect(
        checkoutPage.cancelLocator,
        "TC-012: Cancel button should be visible",
      ).toBeVisible();
    },
  );

  test(
    "TC-013 Successful submission of checkout information proceeds to overview",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, POSTAL_CODE);
      await checkoutPage.continue();

      await expect(
        page,
        "TC-013: User should be navigated to order overview page after valid checkout info",
      ).toHaveURL(/checkout-step-two\.html/);

      const itemNames = await checkoutPage.getOrderItemNames();
      expect(
        itemNames,
        "TC-013: Overview page should list Product A by name",
      ).toContain(PRODUCT_A);

      const itemCount = await checkoutPage.getOrderItemCount();
      expect(
        itemCount,
        "TC-013: Overview page should list exactly one order item",
      ).toBe(1);
    },
  );

  test(
    "TC-014 Continue rejected when First Name is blank",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo("", LAST_NAME, POSTAL_CODE);
      await checkoutPage.continue();

      await expect(
        page,
        "TC-014: User should remain on checkout information page when First Name is blank",
      ).toHaveURL(/checkout-step-one\.html/);
      await expect(
        checkoutPage.errorLocator,
        "TC-014: Error message should be displayed when First Name is missing",
      ).toBeVisible();
      await expect(
        checkoutPage.errorLocator,
        "TC-014: Error message should indicate First Name is required",
      ).toContainText("First Name is required");
    },
  );

  test(
    "TC-015 Continue rejected when Last Name is blank",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, "", POSTAL_CODE);
      await checkoutPage.continue();

      await expect(
        page,
        "TC-015: User should remain on checkout information page when Last Name is blank",
      ).toHaveURL(/checkout-step-one\.html/);
      await expect(
        checkoutPage.errorLocator,
        "TC-015: Error message should be displayed when Last Name is missing",
      ).toBeVisible();
      await expect(
        checkoutPage.errorLocator,
        "TC-015: Error message should indicate Last Name is required",
      ).toContainText("Last Name is required");
    },
  );

  test(
    "TC-016 Continue rejected when Postal Code is blank",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, "");
      await checkoutPage.continue();

      await expect(
        page,
        "TC-016: User should remain on checkout information page when Postal Code is blank",
      ).toHaveURL(/checkout-step-one\.html/);
      await expect(
        checkoutPage.errorLocator,
        "TC-016: Error message should be displayed when Postal Code is missing",
      ).toBeVisible();
      await expect(
        checkoutPage.errorLocator,
        "TC-016: Error message should indicate Postal Code is required",
      ).toContainText("Postal Code is required");
    },
  );

  test(
    "TC-017 Continue rejected when all checkout fields are blank",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.continue();

      await expect(
        page,
        "TC-017: User should remain on checkout information page when all fields are blank",
      ).toHaveURL(/checkout-step-one\.html/);
      await expect(
        checkoutPage.errorLocator,
        "TC-017: Error message should be displayed when all fields are blank",
      ).toBeVisible();
      await expect(
        checkoutPage.errorLocator,
        "TC-017: Error message should indicate at least First Name is required",
      ).toContainText("First Name is required");
    },
  );

  test(
    "TC-018 Cancel on checkout information page returns to cart with items intact",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, cartBadge, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, POSTAL_CODE);
      await checkoutPage.cancel();

      await expect(
        page,
        "TC-018: User should be navigated back to cart page after clicking Cancel on checkout info",
      ).toHaveURL(/cart\.html/);

      const names = await cartPage.getCartItemNames();
      expect(
        names,
        "TC-018: Product A should still be listed in the cart after cancel",
      ).toContain(PRODUCT_A);
      expect(
        await cartBadge.getCount(),
        "TC-018: Cart badge should still show 1 after cancel",
      ).toBe(1);
    },
  );

  // ── US-05: Order overview ───────────────────────────────────────────────

  test(
    "TC-019 Order overview page displays items and summary",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, POSTAL_CODE);
      await checkoutPage.continue();

      await expect(
        page,
        "TC-019: User should be on order overview page",
      ).toHaveURL(/checkout-step-two\.html/);

      const itemNames = await checkoutPage.getOrderItemNames();
      expect(itemNames, "TC-019: Overview should list Product A").toContain(
        PRODUCT_A,
      );

      await expect(
        checkoutPage.summarySubtotalLocator,
        "TC-019: Item subtotal should be visible on overview page",
      ).toBeVisible();
      await expect(
        checkoutPage.summaryTaxLocator,
        "TC-019: Tax amount should be visible on overview page",
      ).toBeVisible();
      await expect(
        checkoutPage.summaryTotalLocator,
        "TC-019: Total amount should be visible on overview page",
      ).toBeVisible();
      await expect(
        checkoutPage.finishLocator,
        "TC-019: Finish button should be visible on overview page",
      ).toBeVisible();
      await expect(
        checkoutPage.cancelLocator,
        "TC-019: Cancel button should be visible on overview page",
      ).toBeVisible();
    },
  );

  test(
    "TC-020 Order overview total equals subtotal plus tax",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, POSTAL_CODE);
      await checkoutPage.continue();

      const subtotalText = await checkoutPage.getSubtotal();
      const taxText = await checkoutPage.getTax();
      const totalText = await checkoutPage.getTotal();

      const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ""));
      const tax = parseFloat(taxText.replace(/[^0-9.]/g, ""));
      const total = parseFloat(totalText.replace(/[^0-9.]/g, ""));

      expect(
        Math.abs(total - (subtotal + tax)),
        "TC-020: Total should equal subtotal plus tax within rounding tolerance",
      ).toBeLessThanOrEqual(0.01);
    },
  );

  // ── US-06: Complete order ───────────────────────────────────────────────

  test(
    "TC-021 Finish button on overview completes the order",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, POSTAL_CODE);
      await checkoutPage.continue();
      await checkoutPage.finish();

      await expect(
        page,
        "TC-021: User should be navigated to order confirmation page after clicking Finish",
      ).toHaveURL(/checkout-complete\.html/);
      await expect(
        checkoutPage.confirmationHeaderLocator,
        "TC-021: Confirmation header should display success message",
      ).toContainText("Thank you for your order");
    },
  );

  test(
    "TC-022 Cart is emptied after order completion",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.addItemToCartByName(PRODUCT_B);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, POSTAL_CODE);
      await checkoutPage.continue();
      await checkoutPage.finish();

      expect(
        await cartBadge.isBadgeVisible(),
        "TC-022: Cart badge should not be visible on confirmation page after order completion",
      ).toBe(false);
    },
  );

  test(
    "TC-023 Back Home button on confirmation page returns to inventory",
    { tag: ["@high"] },
    async ({ inventoryPage, cartPage, checkoutPage, cartBadge, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, POSTAL_CODE);
      await checkoutPage.continue();
      await checkoutPage.finish();

      await checkoutPage.backHome();

      await expect(
        page,
        "TC-023: User should be navigated to inventory page after clicking Back Home",
      ).toHaveURL(/inventory\.html/);
      expect(
        await cartBadge.isBadgeVisible(),
        "TC-023: Cart badge should not be visible after returning home from order completion",
      ).toBe(false);
    },
  );

  test(
    "TC-024 Cancel on overview page returns to inventory",
    { tag: ["@medium"] },
    async ({ inventoryPage, cartPage, checkoutPage, cartBadge, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo(FIRST_NAME, LAST_NAME, POSTAL_CODE);
      await checkoutPage.continue();
      await checkoutPage.cancel();

      await expect(
        page,
        "TC-024: User should be navigated to inventory page after cancelling on overview page",
      ).toHaveURL(/inventory\.html/);
      // OQ-003: The test case expected the cart to be cleared on cancel from overview,
      // but actual SauceDemo behaviour preserves the cart. Asserting the real behaviour.
      expect(
        await cartBadge.isBadgeVisible(),
        "TC-024: Cart badge should still be visible after cancelling from overview page (cart is preserved)",
      ).toBe(true);
    },
  );

  // ── US-01/02: Product detail page interactions ──────────────────────────

  test(
    "TC-025 Product detail page shows Remove button after item added from inventory",
    { tag: ["@medium"] },
    async ({ inventoryPage, productDetailPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.openItemByName(PRODUCT_A);

      await expect(
        productDetailPage.removeLocator,
        "TC-025: Product detail page should show Remove button after item was added from inventory",
      ).toBeVisible();
      expect(
        await cartBadge.getCount(),
        "TC-025: Cart badge should show 1 on product detail page",
      ).toBe(1);
    },
  );

  test(
    "TC-026 Removing item from product detail page updates badge",
    { tag: ["@medium"] },
    async ({ inventoryPage, productDetailPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.openItemByName(PRODUCT_A);
      await productDetailPage.removeFromCart();

      await expect(
        productDetailPage.addToCartLocator,
        "TC-026: Product detail page button should revert to Add to cart after removal",
      ).toBeVisible();
      expect(
        await cartBadge.isBadgeVisible(),
        "TC-026: Cart badge should not be visible after removing item from product detail page",
      ).toBe(false);
    },
  );

  test(
    "TC-027 Cart badge count reflects exact number of distinct items added",
    { tag: ["@medium"] },
    async ({ inventoryPage, cartBadge }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      expect(
        await cartBadge.getCount(),
        "TC-027: Badge should show 1 after adding Product A",
      ).toBe(1);

      await inventoryPage.addItemToCartByName(PRODUCT_B);
      expect(
        await cartBadge.getCount(),
        "TC-027: Badge should show 2 after adding Product B",
      ).toBe(2);

      await inventoryPage.addItemToCartByName(PRODUCT_C);
      expect(
        await cartBadge.getCount(),
        "TC-027: Badge should show 3 after adding Product C",
      ).toBe(3);
    },
  );

  test(
    "TC-028 Checkout information error message is inline and does not navigate away",
    { tag: ["@medium"] },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addItemToCartByName(PRODUCT_A);
      await inventoryPage.cartBadge.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.continue();

      await expect(
        page,
        "TC-028: Page URL should remain on checkout-step-one after submitting blank form",
      ).toHaveURL(/checkout-step-one\.html/);
      await expect(
        checkoutPage.errorLocator,
        "TC-028: Error element should be visible inline on the page (no redirect or modal)",
      ).toBeVisible();
    },
  );

  test(
    "TC-029 Checkout button on empty cart page navigates to checkout information page",
    { tag: ["@medium"] },
    async ({ cartPage, page }) => {
      // beforeEach already cleared the cart; navigate directly to the empty cart page
      await cartPage.goto("/cart.html");
      await cartPage.proceedToCheckout();

      // SauceDemo allows proceeding to checkout from an empty cart (OQ-006)
      await expect(
        page,
        "TC-029: Clicking Checkout on empty cart should navigate to checkout information page",
      ).toHaveURL(/checkout-step-one\.html/);
    },
  );

  test(
    "TC-030 Add item to cart from product detail page",
    { tag: ["@medium"] },
    async ({ inventoryPage, productDetailPage, cartBadge }) => {
      await inventoryPage.openItemByName(PRODUCT_A);
      await productDetailPage.addToCart();

      await expect(
        productDetailPage.removeLocator,
        "TC-030: Product detail page button should change to Remove after adding to cart",
      ).toBeVisible();
      expect(
        await cartBadge.getCount(),
        "TC-030: Cart badge should display 1 after adding from product detail page",
      ).toBe(1);

      await productDetailPage.goBackToProducts();

      const label = await inventoryPage.getCartButtonLabel(PRODUCT_A);
      expect(
        label,
        "TC-030: Product A button on inventory page should show Remove after adding from detail page",
      ).toBe("Remove");
    },
  );
});
