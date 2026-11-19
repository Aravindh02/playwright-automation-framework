/**
 * Generates unique test data at run time so tests that create real
 * accounts/data (e.g. via createAccount) don't collide with each
 * other across parallel runs or repeated executions.
 */
export function generateUniqueEmail(prefix: string = 'qa.portfolio'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}.${timestamp}.${random}@example.com`;
}

export function buildNewUserPayload(
  template: Record<string, string>,
  overrides: Record<string, string> = {}
): Record<string, string> {
  return {
    ...template,
    email: generateUniqueEmail(),
    ...overrides,
  };
}
