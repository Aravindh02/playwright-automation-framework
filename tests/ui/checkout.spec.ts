import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../page-objects/products.page';
import { CartPage } from '../../page-objects/cart.page';

test.describe('Checkout - guest access', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    await productsPage.gotoProducts();
  });

  test('proceeding to checkout while logged out prompts for account/login', async ({ page }) => {
    await productsPage.addFirstProductToCart();
    await productsPage.continueShopping();
    await cartPage.gotoCart();
    await cartPage.proceedToCheckout();

    // Site shows a "Register / Login" modal for guests rather than the checkout form.
    
    await expect(page.getByRole('link', { name: 'Register / Login' })).toBeVisible();
  });

  // NOTE: A full "place order as logged-in user" test belongs in
  // tests/hybrid/, since it needs an account created via the API first
  // (see account-creation-flow.spec.ts) rather than a manually
  // maintained test account here.
});
