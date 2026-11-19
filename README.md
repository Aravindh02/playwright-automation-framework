# Playwright + TypeScript Automation Framework

An end-to-end and API test automation framework built against
[automationexercise.com](https://automationexercise.com), a public
e-commerce demo site. Built as a portfolio project to demonstrate
framework design, not just individual test scripts.

## What this covers

- **UI tests** (`tests/ui/`) — login/signup validation, cart behavior,
  product search, and guest-checkout access control.
- **API tests** (`tests/api/`) — direct validation of the site's public
  REST API (products, brands, search, login) independent of the browser.
- **Hybrid tests** (`tests/hybrid/`) — seed state via the API, verify the
  result through the UI. This is where integration bugs between the two
  layers actually surface (e.g. an account created via API that can't
  log in through the UI).

## Architecture decisions

**Page Object Model.** Every page object extends `BasePage`, which
holds only genuinely shared behavior (navigation, waits, assertions).
Page-specific locators and actions live in their own class so a broken
locator only requires a one-line fix in one file, not a hunt through
every test that touches that page.

**No `waitForTimeout`.** All waits rely on Playwright's built-in
auto-waiting or explicit `waitFor({ state: ... })` calls tied to real
UI state. Fixed sleeps are the single most common cause of flaky
automation suites, so the framework treats them as a defect if
introduced.

**Test independence.** Every test creates whatever state it needs
(adds its own cart item, creates its own account via the API) rather
than depending on another test having run first. Tests can run in any
order or in parallel without side effects.

**API client as its own layer** (`utils/api-client.ts`). Tests don't
build raw request payloads inline — the client owns endpoint URLs and
request shapes, so an API change means updating one file, not every
test that hits that endpoint.

**Unique test data at runtime** (`utils/test-data-generator.ts`).
Account-creation tests generate a unique email per run so parallel
executions and repeated CI runs never collide on existing data, and
hybrid tests clean up (delete) the accounts they create.

## Project structure

```
├── .github/workflows/     CI pipeline (GitHub Actions)
├── fixtures/              Static test data (JSON)
├── page-objects/          One class per page, extending BasePage
├── tests/
│   ├── ui/                Browser-driven UI tests
│   ├── api/                Direct API tests, no browser
│   └── hybrid/             API setup + UI verification
├── utils/                 API client, test data generator
├── playwright.config.ts
└── tsconfig.json
```

## Running locally

```bash
npm install
npx playwright install --with-deps
cp .env.example .env        # fill in values if you customize them

npm test                    # run everything
npm run test:ui              # UI tests only
npm run test:api             # API tests only
npm run test:hybrid          # hybrid tests only
npm run test:headed          # watch the browser while it runs
npm run report               # open the last HTML report
```

## Running in CI

Every push and pull request to `main` triggers the GitHub Actions
workflow (`.github/workflows/playwright.yml`), which installs
dependencies, installs browsers, runs the full suite, and uploads the
HTML report as a workflow artifact — downloadable from the Actions tab
regardless of pass/fail.

## Known limitations / next steps

- Checkout is only tested up to the guest-login gate; a full
  "place order as a logged-in user" flow is a natural next hybrid test
  once an account-creation helper fixture is added to `tests/hybrid/`.
- No visual regression testing yet (Playwright supports screenshot
  comparison — a reasonable next addition).
- No cross-device/mobile viewport testing yet, despite Playwright
  supporting device emulation out of the box.
- Test data cleanup relies on the `deleteAccount` API call succeeding;
  a global teardown to sweep any orphaned test accounts would make the
  suite more resilient to a mid-run failure.
