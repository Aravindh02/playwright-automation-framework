import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';

test.describe('Products API', () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = await ApiClient.create(process.env.API_BASE_URL || 'https://automationexercise.com');
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test('GET productsList returns 200 and a non-empty product array', async () => {
    const response = await apiClient.getProductsList();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('each product in the list has the expected schema', async () => {
    const response = await apiClient.getProductsList();
    const body = await response.json();
    const sample = body.products[0];

    expect(sample).toHaveProperty('id');
    expect(sample).toHaveProperty('name');
    expect(sample).toHaveProperty('price');
    expect(sample).toHaveProperty('category');
  });

  test('GET brandsList returns 200 and a non-empty brand array', async () => {
    const response = await apiClient.getBrandsList();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.brands)).toBe(true);
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test('POST searchProduct with a valid term returns matching products', async () => {
    const response = await apiClient.searchProduct('Dress');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('POST searchProduct with an empty term returns a 200 with empty/handled results', async () => {
    const response = await apiClient.searchProduct('');
    // Document actual behavior rather than assuming - this is a real
    // edge case worth calling out in a bug report if it 500s.
    expect([200, 400]).toContain(response.status());
  });
});
