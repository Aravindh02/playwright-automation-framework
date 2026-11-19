import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/login.page';
import testUsers from '../../fixtures/test-users.json';

test.describe('Authentication - Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.gotoLogin();
  });

  test('shows an error for a non-existent account', async () => {
    await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
    const errorText = await loginPage.getLoginErrorText();
    expect(errorText).toContain('Your email or password is incorrect');
  });

  test('rejects a malformed email on the login form', async ({ page }) => {
    await loginPage.login(testUsers.invalidEmailFormat.email, testUsers.invalidEmailFormat.password);
    // Browser-native validation blocks submission; the field should report invalid.
    const isInvalid = await page.locator('input[data-qa="login-email"]').evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBe(true);
  });

  test('login form is present and accessible from the nav', async () => {
    await expect(loginPage.loginEmailInput).toBeVisible();
    await expect(loginPage.loginPasswordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});

test.describe('Authentication - Signup', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.gotoLogin();
  });

  test('shows an error when signing up with an already-registered email', async () => {
    // existingUser is assumed pre-registered; if you swap fixtures, register
    // this account once via the API before relying on this test.
    await loginPage.startSignup('Existing User', testUsers.existingUser.email);
    const errorText = await loginPage.getSignupErrorText();
    expect(errorText).toContain('Email Address already exist');
  });

  test('signup form is present and accessible from the nav', async () => {
    await expect(loginPage.signupNameInput).toBeVisible();
    await expect(loginPage.signupEmailInput).toBeVisible();
    await expect(loginPage.signupButton).toBeVisible();
  });
});
