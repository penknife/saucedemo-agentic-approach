import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { HeaderComponent } from '../../pages/components/HeaderComponent';
import { CartBadgeComponent } from '../../pages/components/CartBadgeComponent';

/** Fixtures available in every test (test-scoped). */
export type TestFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  header: HeaderComponent;
  cartBadge: CartBadgeComponent;
};

/** Worker-scoped fixtures (shared across tests in the same worker). */
export type WorkerFixtures = {
  workerStorageState: string;
};
