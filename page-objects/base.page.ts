import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage holds behavior shared by every page object in the framework:
 * navigation, generic waits, and common assertions. Every other page
 * object extends this class instead of duplicating these helpers.
 */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string = '/'): Promise<void> {
  await this.page.goto(path, { waitUntil: 'domcontentloaded' });
}

  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  async waitForHidden(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'hidden' });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async expectUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }
}
