import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../page-objects/products.page';
import testProducts from '../../fixtures/test-products.json';

test.describe('Product Search', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await page.route(
      /googlesyndication|doubleclick|googleads|adservice|google-analytics/,
      route => route.abort()
    );
    await productsPage.gotoProducts();
  });

  test('searching a valid term returns results', async () => {
    await productsPage.searchProduct(testProducts.searchTerms.valid);
    const resultCount = await productsPage.getResultCount();
    expect(resultCount).toBeGreaterThan(0);
  });

  test('searching a nonsense term returns no results, not an error page', async ({ page }) => {
    await productsPage.searchProduct(testProducts.searchTerms.noResults);
    const resultCount = await productsPage.getResultCount();
    expect(resultCount).toBe(0);
    // Assert the page degrades gracefully rather than erroring out.
    await expect(page).toHaveURL(/products/);
  });

  test('search term persists in the input after searching', async ({ page }) => {
    await productsPage.searchProduct(testProducts.searchTerms.partial);
    await expect(productsPage.searchInput).toHaveValue(testProducts.searchTerms.partial);
  });
});
