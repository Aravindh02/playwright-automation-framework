import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';
import { LoginPage } from '../../page-objects/login.page';
import { buildNewUserPayload } from '../../utils/test-data-generator';
import newUserFixture from '../../fixtures/test-users.json';

/**
 * These tests seed state through the API (fast, reliable) and then
 * verify the result through the UI (what the user actually experiences).
 * This is deliberately kept separate from pure UI tests and pure API
 * tests: it exercises the integration between the two layers, which is
 * exactly where real bugs tend to hide (e.g. an account that creates
 * successfully via API but can't log in via the UI).
 */
test.describe('Hybrid: account creation via API, verified via UI', () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = await ApiClient.create(process.env.API_BASE_URL || 'https://automationexercise.com');
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test('account created via API can immediately log in through the UI', async ({ page }) => {
    const newUser = buildNewUserPayload(newUserFixture.newUserTemplate);

    // 1. Create the account directly via API - fast, avoids driving
    //    the multi-step signup form just to get a logged-in state.
    const createResponse = await apiClient.createAccount(newUser);
    const createBody = await createResponse.json();
    expect(createBody.responseCode).toBe(201);

    // 2. Verify the UI reflects it: log in through the real login form.
    const loginPage = new LoginPage(page);
    await loginPage.gotoLogin();
    await loginPage.login(newUser.email, newUser.password);

    expect(await loginPage.isLoggedIn()).toBe(true);

    // 3. Clean up via API so repeated runs don't accumulate test accounts.
    await apiClient.deleteAccount(newUser.email, newUser.password);
  });

  test('account deleted via API can no longer log in through the UI', async ({ page }) => {
    const newUser = buildNewUserPayload(newUserFixture.newUserTemplate);

    await apiClient.createAccount(newUser);
    await apiClient.deleteAccount(newUser.email, newUser.password);

    const loginPage = new LoginPage(page);
    await loginPage.gotoLogin();
    await loginPage.login(newUser.email, newUser.password);

    expect(await loginPage.isLoggedIn()).toBe(false);
    const errorText = await loginPage.getLoginErrorText();
    expect(errorText).toContain('Your email or password is incorrect');
  });
});
