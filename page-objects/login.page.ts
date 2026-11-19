import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // Login section locators
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  // Signup section locators
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorMessage: Locator;

  // Post-login indicator
  readonly loggedInAsText: Locator;

  constructor(page: Page) {
    super(page);
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginErrorMessage = page.locator('form[action="/login"] p');

    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.signupErrorMessage = page.locator('form[action="/signup"] p');

    this.loggedInAsText = page.locator('a:has-text("Logged in as")');
  }

  async gotoLogin(): Promise<void> {
    await this.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async getLoginErrorText(): Promise<string> {
    await this.waitForVisible(this.loginErrorMessage);
    return (await this.loginErrorMessage.textContent()) ?? '';
  }

  async getSignupErrorText(): Promise<string> {
    await this.waitForVisible(this.signupErrorMessage);
    return (await this.signupErrorMessage.textContent()) ?? '';
  }

  async isLoggedIn(): Promise<boolean> {
  await this.page.waitForLoadState('networkidle');
  return this.isVisible(this.loggedInAsText);
}
}
