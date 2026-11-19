import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../page-objects/products.page';
import { CartPage } from '../../page-objects/cart.page';

test.describe('Cart', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    await productsPage.gotoProducts();
  });

  test('adding a product shows it in the cart', async () => {
    await productsPage.addFirstProductToCart();
    await productsPage.continueShopping();
    await cartPage.gotoCart();

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('removing the only item empties the cart', async () => {
    await productsPage.addFirstProductToCart();
    await productsPage.continueShopping();
    await cartPage.gotoCart();

    await cartPage.removeItem(0);
    await expect(cartPage.emptyCartText).toBeVisible();
  });

  test('cart persists item details after navigating away and back', async ({ page }) => {
    await productsPage.addFirstProductToCart();
    await productsPage.continueShopping();
    await cartPage.gotoCart();
    const countBefore = await cartPage.getItemCount();

    await page.goto('/');
    await cartPage.gotoCart();
    const countAfter = await cartPage.getItemCount();

    expect(countAfter).toBe(countBefore);
  });
});
