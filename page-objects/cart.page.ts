import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly cartRows: Locator;
  readonly quantityCells: Locator;
  readonly deleteButtons: Locator;
  readonly emptyCartText: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.quantityCells = page.locator('.cart_quantity button');
    this.deleteButtons = page.locator('.cart_quantity_delete');
    this.emptyCartText = page.locator('text=Cart is empty');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
  }

  async gotoCart(): Promise<void> {
    await this.goto('/view_cart');
  }

  async getItemCount(): Promise<number> {
    return this.cartRows.count();
  }

  async getQuantityForRow(rowIndex: number): Promise<string> {
    return (await this.quantityCells.nth(rowIndex).textContent()) ?? '';
  }

  async removeItem(rowIndex: number): Promise<void> {
    await this.deleteButtons.nth(rowIndex).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
