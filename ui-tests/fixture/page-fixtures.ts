import { LoginPage } from '../../pages/login';
import { InventoryPage } from '../../pages/inventory';
import { CartPage } from '../../pages/cart';
import { CheckoutPage } from '../../pages/checkout';
import { HeaderComponent } from '../../pages/components/header';
import { CartBadgeComponent } from '../../pages/components/cart-badge';
import { testWithWorkerStorage } from './worker-fixtures';
import type { TestFixtures } from './types';

/** Test-scoped page object and component fixtures. */
export const testWithPages = testWithWorkerStorage.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  header: async ({ page }, use) => {
    await use(new HeaderComponent(page.locator('#header_container')));
  },

  cartBadge: async ({ page }, use) => {
    await use(new CartBadgeComponent(page.locator('.shopping_cart_container')));
  },
});
