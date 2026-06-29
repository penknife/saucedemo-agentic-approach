import { LoginPage } from "../../pages/login";
import { InventoryPage } from "../../pages/inventory";
import { CartPage } from "../../pages/cart";
import { CheckoutPage } from "../../pages/checkout";
import { ProductDetailPage } from "../../pages/product-detail";
import { HeaderComponent } from "../../pages/components/header";
import { CartBadgeComponent } from "../../pages/components/cart-badge";

/** Fixtures available in every test (test-scoped). */
export type TestFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productDetailPage: ProductDetailPage;
  header: HeaderComponent;
  cartBadge: CartBadgeComponent;
};

/** Worker-scoped fixtures (shared across tests in the same worker). */
export type WorkerFixtures = {
  workerStorageState: string;
};
