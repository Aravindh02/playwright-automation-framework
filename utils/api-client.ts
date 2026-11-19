import { APIRequestContext, APIResponse, request } from '@playwright/test';

/**
 * Thin wrapper around Playwright's APIRequestContext for
 * automationexercise.com's public API. Centralizing endpoint calls here
 * keeps test files free of raw URL strings and repeated boilerplate,
 * and gives us one place to update if the API changes.
 */
export class ApiClient {
  private constructor(private context: APIRequestContext) {}

  static async create(baseURL: string): Promise<ApiClient> {
    const context = await request.newContext({ baseURL });
    return new ApiClient(context);
  }

  async dispose(): Promise<void> {
    await this.context.dispose();
  }

  async getProductsList(): Promise<APIResponse> {
    return this.context.get('/api/productsList');
  }

  async getBrandsList(): Promise<APIResponse> {
    return this.context.get('/api/brandsList');
  }

  async searchProduct(searchTerm: string): Promise<APIResponse> {
    return this.context.post('/api/searchProduct', {
      form: { search_product: searchTerm },
    });
  }

  async verifyLogin(email: string, password: string): Promise<APIResponse> {
    return this.context.post('/api/verifyLogin', {
      form: { email, password },
    });
  }

  async createAccount(userData: Record<string, string>): Promise<APIResponse> {
    return this.context.post('/api/createAccount', {
      form: userData,
    });
  }

  async deleteAccount(email: string, password: string): Promise<APIResponse> {
    return this.context.delete('/api/deleteAccount', {
      form: { email, password },
    });
  }
}
