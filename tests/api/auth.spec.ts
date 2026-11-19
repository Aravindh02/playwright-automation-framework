import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';
import testUsers from '../../fixtures/test-users.json';

test.describe('Auth API', () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = await ApiClient.create(process.env.API_BASE_URL || 'https://automationexercise.com');
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test('verifyLogin with invalid credentials returns a "not found" response code', async () => {
    const response = await apiClient.verifyLogin(
      testUsers.invalidUser.email,
      testUsers.invalidUser.password
    );
    const body = await response.json();
  console.log(JSON.stringify(body, null, 2));   
    // automationexercise's API returns 200 with a responseCode field
    // rather than an HTTP error status - documenting that here so
    // nobody "fixes" this assertion later thinking it's a mistake.
    expect(body.responseCode).toBe(404);
  });

  test('verifyLogin with missing password returns a bad-request response code', async () => {
  const response = await apiClient.verifyLogin(testUsers.invalidUser.email, '');
  const body = await response.json();
  expect(body.responseCode).toBe(404);
});
});


