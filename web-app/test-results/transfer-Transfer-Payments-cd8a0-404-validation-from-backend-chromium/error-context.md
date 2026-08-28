# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: transfer.spec.ts >> Transfer & Payments - UI Integration >> Internal Transfer - Successfully catches 404 validation from backend
- Location: tests\e2e\transfer.spec.ts:20:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Confirm & Authorize")')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - link "N NovaBank" [ref=e6] [cursor=pointer]:
            - /url: /accounts
            - generic [ref=e7]: "N"
            - text: NovaBank
          - navigation [ref=e8]:
            - link "Accounts" [ref=e9] [cursor=pointer]:
              - /url: /accounts
            - link "Transfers" [ref=e10] [cursor=pointer]:
              - /url: /transfers
            - link "Transactions" [ref=e11] [cursor=pointer]:
              - /url: /transactions/history
            - link "Statements" [ref=e12] [cursor=pointer]:
              - /url: /statements
            - link "Products" [ref=e13] [cursor=pointer]:
              - /url: /products
            - link "Developer API" [ref=e15] [cursor=pointer]:
              - /url: /api
        - generic [ref=e16]:
          - button "👁️ Reveal" [ref=e17]
          - button "Sign Out" [ref=e18]
    - main [ref=e19]:
      - generic [ref=e20]:
        - link "Back to Options" [ref=e21] [cursor=pointer]:
          - /url: /transfers
        - generic [ref=e24]:
          - heading "Between My Accounts" [level=1] [ref=e25]
          - paragraph [ref=e26]: Transfer instantly between your NovaBank accounts.
        - generic [ref=e27]:
          - generic [ref=e28]:
            - generic [ref=e29]: ●
            - generic [ref=e30]: Details
          - generic [ref=e32]:
            - generic [ref=e33]: ○
            - generic [ref=e34]: Review
          - generic [ref=e36]:
            - generic [ref=e37]: ○
            - generic [ref=e38]: Authorization
        - generic [ref=e40]:
          - generic [ref=e41]: Source and recipient accounts are required.
          - generic [ref=e42]:
            - generic [ref=e43]: From Account
            - combobox [ref=e44] [cursor=pointer]
          - generic [ref=e45]:
            - generic [ref=e46]: To Account
            - textbox "Recipient's account number" [ref=e47]: INVALID-999
          - generic [ref=e48]:
            - generic [ref=e49]: Amount (PHP)
            - spinbutton "0.00" [ref=e50]: "50.00"
          - generic [ref=e51]:
            - generic [ref=e52]: Memo (Optional)
            - textbox "What is this for?" [ref=e53]
          - button "Review Transfer" [active] [ref=e54]
    - contentinfo [ref=e55]: © 2026 NovaBank Enterprise. Next.js App Router Hardened Architecture.
  - button "Open Next.js Dev Tools" [ref=e61] [cursor=pointer]
  - alert [ref=e65]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Transfer & Payments - UI Integration', () => {
  4  | 
  5  |   test.beforeEach(async ({ context }) => {
  6  |     // Set authentication cookie to satisfy middleware / auth guards
  7  |     await context.addCookies([
  8  |       {
  9  |         name: 'bank_session',
  10 |         value: 'mock-test-jwt-token',
  11 |         domain: 'localhost',
  12 |         path: '/',
  13 |       },
  14 |     ]);
  15 |   });
  16 | 
  17 |   // ==========================================
  18 |   // INTERNAL TRANSFER TESTING
  19 |   // ==========================================
  20 |   test('Internal Transfer - Successfully catches 404 validation from backend', async ({ page }) => {
  21 |     // 1. Mock the Next.js BFF proxy route to simulate the backend 404
  22 |     await page.route('**/api/proxy/transfers/internal', route => {
  23 |       route.fulfill({
  24 |         status: 404,
  25 |         contentType: 'application/json',
  26 |         body: JSON.stringify({ 
  27 |           success: false,
  28 |           errorCode: 'RESOURCE_NOT_FOUND',
  29 |           message: "Transfer failed: Destination account 'INVALID-999' does not exist." 
  30 |         })
  31 |       });
  32 |     });
  33 | 
  34 |     // Navigate to the internal transfer page (Next.js App Router route group (portals)/(dashboard) is omitted in URL)
  35 |     await page.goto('/transfers/internal');
  36 | 
  37 |     // 2. Fill the transfer form
  38 |     await page.fill('input[placeholder="Recipient\'s account number"]', 'INVALID-999');
  39 |     await page.fill('input[placeholder="0.00"]', '50.00');
  40 |     
  41 |     // 3. Submit Form
  42 |     await page.click('button:has-text("Review Transfer")');
  43 | 
  44 |     // 4. Confirm in Review step
> 45 |     await page.click('button:has-text("Confirm & Authorize")');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  46 | 
  47 |     // 5. Bypass WebAuthn in DEV mode
  48 |     await page.click('button:has-text("[DEV] Bypass Access")');
  49 | 
  50 |     // 6. Verify the TransactionError component displays the specific backend error
  51 |     const errorBanner = page.locator('text=Transfer failed: Destination account \'INVALID-999\' does not exist.');
  52 |     await expect(errorBanner).toBeVisible();
  53 |   });
  54 | 
  55 | 
  56 |   // ==========================================
  57 |   // EXTERNAL PAYMENT TESTING
  58 |   // ==========================================
  59 |   test('External Payment - Successfully executes and redirects', async ({ page }) => {
  60 |     // 1. Mock a successful 200 OK response from the backend
  61 |     await page.route('**/api/proxy/transactions/external-payment', route => {
  62 |       route.fulfill({
  63 |         status: 200,
  64 |         contentType: 'application/json',
  65 |         body: JSON.stringify({ 
  66 |           success: true, 
  67 |           data: { 
  68 |             transactionReference: 'TXN-EXT-12345',
  69 |             status: 'SUCCESS',
  70 |             processedAt: new Date().toISOString()
  71 |           }
  72 |         })
  73 |       });
  74 |     });
  75 | 
  76 |     // Navigate to the external payment page
  77 |     await page.goto('/transfers/bank');
  78 | 
  79 |     // 2. Fill the external payment form
  80 |     await page.selectOption('select', { index: 1 }); // Selects the first available bank
  81 |     await page.fill('input[placeholder="000000000"]', 'EXT-GLOBAL-999');
  82 |     await page.fill('input[placeholder="Enter recipient name"]', 'John Doe');
  83 |     await page.fill('input[placeholder="0.00"]', '1000.00');
  84 |     
  85 |     // 3. Submit
  86 |     await page.click('button:has-text("Review Transfer")');
  87 | 
  88 |     // 4. Confirm in Review step
  89 |     await page.click('button:has-text("Confirm & Authorize")');
  90 | 
  91 |     // 5. Bypass WebAuthn
  92 |     await page.click('button:has-text("[DEV] Bypass Access")');
  93 | 
  94 |     // 6. Verify the UI updates to show the transaction was successful
  95 |     await expect(page.locator('text=TXN-EXT-12345')).toBeVisible();
  96 |   });
  97 | 
  98 | });
  99 | 
```