# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-management.spec.ts >> API Management Dashboard E2E >> Suite A: API Key Management >> Revocation Flow
- Location: tests\e2e\api-management.spec.ts:85:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('div').filter({ hasText: 'pk_live_123' }).last().getByRole('button', { name: /Revoke/i })

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e2]:
    - banner [ref=f1e3]:
      - generic [ref=f1e4]:
        - generic [ref=f1e5]:
          - link "N NovaBank" [ref=f1e6] [cursor=pointer]:
            - /url: /accounts
            - generic [ref=f1e7]: "N"
            - text: NovaBank
          - navigation [ref=f1e8]:
            - link "Accounts" [ref=f1e9] [cursor=pointer]:
              - /url: /accounts
            - link "Transfers" [ref=f1e10] [cursor=pointer]:
              - /url: /transfers
            - link "Transactions" [ref=f1e11] [cursor=pointer]:
              - /url: /transactions/history
            - link "Statements" [ref=f1e12] [cursor=pointer]:
              - /url: /statements
            - link "Products" [ref=f1e13] [cursor=pointer]:
              - /url: /products
            - link "Developer API" [ref=f1e15] [cursor=pointer]:
              - /url: /api
        - generic [ref=f1e16]:
          - button "👁️ Reveal" [ref=f1e17]
          - button "Sign Out" [ref=f1e18]
    - main [ref=f1e19]:
      - generic [ref=f1e20]:
        - generic [ref=f1e21]:
          - generic [ref=f1e22]:
            - generic [ref=f1e23]: Enterprise Tier 1
            - generic [ref=f1e24]: OpenAPI 3.1 Supported
          - heading "Payment Orchestration Gateway" [level=1] [ref=f1e25]
          - paragraph [ref=f1e26]: Manage your secure API keys and explore our massive suite of Core Banking and Multi-Rail Routing modules.
        - generic [ref=f1e28]:
          - generic [ref=f1e29]:
            - generic [ref=f1e30]:
              - heading "API Keys & Security Controls" [level=3] [ref=f1e31]
              - paragraph [ref=f1e32]: Manage HMAC SHA256 keys for API access. Bind keys to specific isolated VAM sub-accounts.
            - button "+ Create New Key" [ref=f1e33]
          - generic [ref=f1e35]:
            - generic [ref=f1e36]:
              - generic [ref=f1e37]:
                - heading "Old App" [level=5] [ref=f1e38]
                - generic [ref=f1e39]: SANDBOX
                - generic [ref=f1e40]: EXPIRES IN 10D
              - generic [ref=f1e41]: pk_live_123
              - generic [ref=f1e42]:
                - generic [ref=f1e43]: "Created: 8/28/2026"
                - generic [ref=f1e44]: "Last Used: Never"
            - generic [ref=f1e45]:
              - button "Rotate Key" [ref=f1e46]
              - button "Revoke" [ref=f1e47]
        - generic [ref=f1e48]:
          - generic [ref=f1e49]:
            - button "External Webhook Endpoints" [ref=f1e50]
            - button "Local Webhook Testing" [ref=f1e51]
          - generic [ref=f1e52]:
            - generic [ref=f1e53]:
              - generic [ref=f1e54]:
                - heading "Webhook Endpoints" [level=3] [ref=f1e55]
                - paragraph [ref=f1e56]: Receive real-time HTTPS callbacks for events happening in your accounts.
              - button "+ Add Endpoint" [ref=f1e57]
            - paragraph [ref=f1e60]: No active webhooks configured.
        - generic [ref=f1e62]:
          - heading "Live API Documentation" [level=2] [ref=f1e63]
          - paragraph [ref=f1e64]: Interactive developer gateway reference. Test endpoints directly using your generated API keys.
          - generic [ref=f1e65]:
            - generic [ref=f1e66]: Documentation Error
            - generic [ref=f1e67]: "Network error loading API spec: Failed to fetch"
    - contentinfo [ref=f1e68]: © 2026 NovaBank Enterprise. Next.js App Router Hardened Architecture.
  - generic [ref=f1e73] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=f1e74]
    - generic [ref=f1e78]:
      - button "Open issues overlay" [ref=f1e79]:
        - generic [ref=f1e80]:
          - generic [ref=f1e81]: "0"
          - generic [ref=f1e82]: "1"
        - generic [ref=f1e83]: Issue
      - button "Collapse issues badge" [ref=f1e84]
  - alert [ref=f1e87]
```

# Test source

```ts
  19  |         status: 200,
  20  |         json: { id: 'MERCH-505', role: 'MERCHANT', name: 'Test Merchant' }
  21  |       });
  22  |     });
  23  | 
  24  |     // 2. Default Mocks for API Keys and Webhooks (Empty State)
  25  |     await page.route('**/*apikeys*', async route => {
  26  |       if (route.request().method() === 'GET') {
  27  |         await route.fulfill({ status: 200, json: { data: [] } });
  28  |       } else {
  29  |         await route.continue();
  30  |       }
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
> 119 |       await keyCard.getByRole('button', { name: /Revoke/i }).click();
      |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  131 |       await page.getByRole('button', { name: /Add Webhook/i }).click();
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