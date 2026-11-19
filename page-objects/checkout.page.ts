import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly addressDetails: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderButton: Locator;
  readonly orderConfirmationText: Locator;

  constructor(page: Page) {
    super(page);
    this.addressDetails = page.locator('#address_delivery');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a:has-text("Place Order")');
    this.orderConfirmationText = page.locator('text=Congratulations! Your order has been confirmed!');
  }

  async gotoCheckout(): Promise<void> {
    await this.goto('/checkout');
  }

  async addOrderComment(comment: string): Promise<void> {
    await this.commentTextarea.fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async isOrderConfirmed(): Promise<boolean> {
    return this.isVisible(this.orderConfirmationText);
  }
}
