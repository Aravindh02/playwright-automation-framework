import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productItems: Locator;
  readonly noProductsFoundText: Locator;
  readonly addToCartButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productItems = page.locator('.features_items .product-image-wrapper');
    this.noProductsFoundText = page.locator('text=No products found');
    this.addToCartButtons = page.locator('a:has-text("Add to cart")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.viewCartLink = page.locator('a[href="/view_cart"]');
  }

  async gotoProducts(): Promise<void> {
    await this.goto('/products');
  }

 async searchProduct(term: string): Promise<void> {
  await this.searchInput.fill(term);

  for (let attempt = 1; attempt <= 3; attempt++) {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        r => r.url().includes('/products') && r.url().includes('search='),
        { timeout: 30000 }
      ),
      this.searchButton.click(),
    ]);

    if (response.status() < 500 && response.status() !== 520) break;

    if (attempt === 3) {
      throw new Error(`Site returned ${response.status()} for search "${term}" after 3 attempts`);
    }
    await this.page.goto('/products');
    await this.searchInput.fill(term);
  }

  await expect(this.page.locator('.features_items')).toBeVisible();
}

  async getResultCount(): Promise<number> {
    return this.productItems.count();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }

 async continueShopping(): Promise<void> {
  await this.continueShoppingButton.waitFor({ state: 'visible', timeout: 5000 });
  await this.continueShoppingButton.click();
}
}

