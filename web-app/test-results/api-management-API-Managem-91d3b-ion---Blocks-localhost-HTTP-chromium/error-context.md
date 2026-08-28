# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-management.spec.ts >> API Management Dashboard E2E >> Suite B: Webhook Registration >> Form Validation - Blocks localhost/HTTP
- Location: tests\e2e\api-management.spec.ts:130:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Add Webhook/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]: Enterprise Tier 1
            - generic [ref=e24]: OpenAPI 3.1 Supported
          - heading "Payment Orchestration Gateway" [level=1] [ref=e25]
          - paragraph [ref=e26]: Manage your secure API keys and explore our massive suite of Core Banking and Multi-Rail Routing modules.
        - generic [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e30]:
              - heading "API Keys & Security Controls" [level=3] [ref=e31]
              - paragraph [ref=e32]: Manage HMAC SHA256 keys for API access. Bind keys to specific isolated VAM sub-accounts.
            - button "+ Create New Key" [ref=e33]
          - paragraph [ref=e36]: No active API keys found in database.
        - generic [ref=e37]:
          - generic [ref=e38]:
            - button "External Webhook Endpoints" [ref=e39]
            - button "Local Webhook Testing" [ref=e40]
          - generic [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e43]:
                - heading "Webhook Endpoints" [level=3] [ref=e44]
                - paragraph [ref=e45]: Receive real-time HTTPS callbacks for events happening in your accounts.
              - button "+ Add Endpoint" [ref=e46]
            - paragraph [ref=e49]: No active webhooks configured.
        - generic [ref=e51]:
          - heading "Live API Documentation" [level=2] [ref=e52]
          - paragraph [ref=e53]: Interactive developer gateway reference. Test endpoints directly using your generated API keys.
          - generic [ref=e54]:
            - generic [ref=e55]: Documentation Error
            - generic [ref=e56]: "Network error loading API spec: Failed to fetch"
    - contentinfo [ref=e57]: © 2026 NovaBank Enterprise. Next.js App Router Hardened Architecture.
  - generic [ref=e62] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e63]
    - generic [ref=e67]:
      - button "Open issues overlay" [ref=e68]:
        - generic [ref=e69]:
          - generic [ref=e70]: "0"
          - generic [ref=e71]: "1"
        - generic [ref=e72]: Issue
      - button "Collapse issues badge" [ref=e73]
  - alert [ref=e76]
```

# Test source

```ts
  31  |     });
  32  | 
  33  |     await page.route('**/webhooks*', async route => {
  34  |       if (route.request().method() === 'GET') {
  35  |         await route.fulfill({ status: 200, json: { data: [] } });
  36  |       } else {
  37  |         await route.continue();
  38  |       }
  39  |     });
  40  | 
  41  |     // Navigate to the API Management page
  42  |     await page.goto('/api');
  43  |   });
  44  | 
  45  |   // ==========================================================
  46  |   // SUITE A: API KEY MANAGEMENT
  47  |   // ==========================================================
  48  |   test.describe('Suite A: API Key Management', () => {
  49  |     test('Generate Key Flow & Clipboard Copy', async ({ page }) => {
  50  |       // Mock the POST request to generate a key
  51  |       const mockSecret = 'sk_live_super_secret_123';
  52  |       await page.route('**/*apikeys*', async route => {
  53  |         if (route.request().method() === 'POST') {
  54  |           await route.fulfill({
  55  |             status: 200,
  56  |             json: { data: { id: 1, name: 'E2E App', keyPrefix: 'pk_live_', maskedHash: '123', rawKey: mockSecret, environment: 'SANDBOX', cidrWhitelist: '0.0.0.0/0', scopes: ['treasury:read'], expiresAt: new Date(Date.now() + 864000000).toISOString(), createdAt: new Date().toISOString() } }
  57  |           });
  58  |         } else {
  59  |           await route.continue();
  60  |         }
  61  |       });
  62  | 
  63  |       // Interact with the UI - click Create New Key
  64  |       await page.getByRole('button', { name: /Create New Key/i }).click();
  65  |       
  66  |       // Fill out the inline creation form
  67  |       await page.getByLabel(/Key Name/i).fill('E2E App');
  68  |       await page.getByRole('button', { name: 'Generate', exact: true }).click();
  69  | 
  70  |       // Assert the secure banner/modal appears with the raw key
  71  |       await expect(page.getByText(mockSecret)).toBeVisible();
  72  | 
  73  |       // Test clipboard functionality
  74  |       await page.getByRole('button', { name: /Copy Key/i }).click();
  75  |       
  76  |       // Verify clipboard content
  77  |       const clipboardText = await page.evaluate("navigator.clipboard.readText()");
  78  |       expect(clipboardText).toEqual(mockSecret);
  79  | 
  80  |       // Close key notification and verify secret is hidden
  81  |       await page.getByRole('button', { name: /I have saved this key/i }).click();
  82  |       await expect(page.getByText(mockSecret)).not.toBeVisible();
  83  |     });
  84  | 
  85  |     test('Revocation Flow', async ({ page }) => {
  86  |       // Setup: Mock an existing active key
  87  |       await page.route('**/*apikeys*', async route => {
  88  |         if (route.request().method() === 'GET') {
  89  |           await route.fulfill({ 
  90  |             status: 200, 
  91  |             json: { 
  92  |               data: [{ 
  93  |                 id: 1, 
  94  |                 name: 'Old App', 
  95  |                 keyPrefix: 'pk_live_', 
  96  |                 maskedHash: '123', 
  97  |                 environment: 'SANDBOX', 
  98  |                 cidrWhitelist: '0.0.0.0/0', 
  99  |                 scopes: [], 
  100 |                 expiresAt: new Date(Date.now() + 864000000).toISOString(), 
  101 |                 createdAt: new Date().toISOString() 
  102 |               }] 
  103 |             } 
  104 |           });
  105 |         } else if (route.request().method() === 'POST') {
  106 |           await route.fulfill({ status: 200, json: { success: true } });
  107 |         } else {
  108 |           await route.continue();
  109 |         }
  110 |       });
  111 | 
  112 |       await page.reload(); // Reload to fetch the seeded key
  113 | 
  114 |       // Handle native browser confirm dialog
  115 |       page.once('dialog', dialog => dialog.accept());
  116 | 
  117 |       // Find key container card (div) containing the key prefix and click Revoke
  118 |       const keyCard = page.locator('div').filter({ hasText: 'pk_live_123' }).last();
  119 |       await keyCard.getByRole('button', { name: /Revoke/i }).click();
  120 | 
  121 |       // Assert that the key card updates status to REVOKED
  122 |       await expect(page.getByText('REVOKED')).toBeVisible();
  123 |     });
  124 |   });
  125 | 
  126 |   // ==========================================================
  127 |   // SUITE B: WEBHOOK REGISTRATION
  128 |   // ==========================================================
  129 |   test.describe('Suite B: Webhook Registration', () => {
  130 |     test('Form Validation - Blocks localhost/HTTP', async ({ page }) => {
> 131 |       await page.getByRole('button', { name: /Add Webhook/i }).click();
      |                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  132 | 
  133 |       // Attempt to enter invalid URL
  134 |       await page.getByLabel(/Endpoint URL/i).fill('http://127.0.0.1/hook');
  135 |       await page.getByRole('checkbox', { name: /payment.success/i }).check();
  136 |       await page.getByRole('button', { name: /Register/i }).click();
  137 | 
  138 |       // Assert SSRF/HTTP protection
  139 |       await expect(page.getByText(/Internal or localhost IPs are strictly prohibited/i)).toBeVisible();
  140 |     });
  141 | 
  142 |     test('Webhook Ping Test Flow', async ({ page }) => {
  143 |       // Setup: Mock an active webhook
  144 |       await page.route('**/webhooks*', async route => {
  145 |         if (route.request().method() === 'GET') {
  146 |           await route.fulfill({ status: 200, json: { data: [{ id: 'wh_1', url: 'https://app.com/hook', events: ['payment.success'], status: 'ACTIVE' }] } });
  147 |         }
  148 |       });
  149 | 
  150 |       // Mock the Ping POST request
  151 |       await page.route('**/webhooks/*/ping', async route => {
  152 |         await route.fulfill({ status: 200, json: { data: { statusCode: 200, message: 'OK' } } });
  153 |       });
  154 | 
  155 |       await page.reload();
  156 | 
  157 |       // Expand details and Ping
  158 |       const row = page.locator('tr', { hasText: 'https://app.com/hook' });
  159 |       await row.getByRole('button', { name: /Ping/i }).click();
  160 | 
  161 |       // Verify success toast
  162 |       await expect(page.getByText(/External app responded with 200 OK/i)).toBeVisible();
  163 |     });
  164 |   });
  165 | 
  166 |   // ==========================================================
  167 |   // SUITE C: API DOCUMENTATION
  168 |   // ==========================================================
  169 |   test.describe('Suite C: API Documentation', () => {
  170 |     test('Iframe renders correctly in Documentation Tab', async ({ page }) => {
  171 |       // Click the documentation tab
  172 |       await page.getByRole('tab', { name: /Documentation/i }).click();
  173 | 
  174 |       // Locate the iframe
  175 |       const docsIframe = page.locator('iframe[title="API Reference"]');
  176 |       await expect(docsIframe).toBeVisible();
  177 | 
  178 |       // Verify the src attribute points to our Swagger/Scalar endpoint
  179 |       await expect(docsIframe).toHaveAttribute('src', /\/developers|openapi/);
  180 |     });
  181 |   });
  182 | });
  183 | 
```