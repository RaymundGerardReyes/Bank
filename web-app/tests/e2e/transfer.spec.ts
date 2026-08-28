import { test, expect } from '@playwright/test';

test.describe('Transfer & Payments - UI Integration', () => {

  test.beforeEach(async ({ context }) => {
    // Set authentication cookie to satisfy middleware / auth guards
    await context.addCookies([
      {
        name: 'bank_session',
        value: 'mock-test-jwt-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  // ==========================================
  // INTERNAL TRANSFER TESTING
  // ==========================================
  test('Internal Transfer - Successfully catches 404 validation from backend', async ({ page }) => {
    // 1. Mock the Next.js BFF proxy route to simulate the backend 404
    await page.route('**/api/proxy/transfers/internal', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: false,
          errorCode: 'RESOURCE_NOT_FOUND',
          message: "Transfer failed: Destination account 'INVALID-999' does not exist." 
        })
      });
    });

    // Navigate to the internal transfer page (Next.js App Router route group (portals)/(dashboard) is omitted in URL)
    await page.goto('/transfers/internal');

    // 2. Fill the transfer form
    await page.fill('input[placeholder="Recipient\'s account number"]', 'INVALID-999');
    await page.fill('input[placeholder="0.00"]', '50.00');
    
    // 3. Submit Form
    await page.click('button:has-text("Review Transfer")');

    // 4. Confirm in Review step
    await page.click('button:has-text("Confirm & Authorize")');

    // 5. Bypass WebAuthn in DEV mode
    await page.click('button:has-text("[DEV] Bypass Access")');

    // 6. Verify the TransactionError component displays the specific backend error
    const errorBanner = page.locator('text=Transfer failed: Destination account \'INVALID-999\' does not exist.');
    await expect(errorBanner).toBeVisible();
  });


  // ==========================================
  // EXTERNAL PAYMENT TESTING
  // ==========================================
  test('External Payment - Successfully executes and redirects', async ({ page }) => {
    // 1. Mock a successful 200 OK response from the backend
    await page.route('**/api/proxy/transactions/external-payment', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          data: { 
            transactionReference: 'TXN-EXT-12345',
            status: 'SUCCESS',
            processedAt: new Date().toISOString()
          }
        })
      });
    });

    // Navigate to the external payment page
    await page.goto('/transfers/bank');

    // 2. Fill the external payment form
    await page.selectOption('select', { index: 1 }); // Selects the first available bank
    await page.fill('input[placeholder="000000000"]', 'EXT-GLOBAL-999');
    await page.fill('input[placeholder="Enter recipient name"]', 'John Doe');
    await page.fill('input[placeholder="0.00"]', '1000.00');
    
    // 3. Submit
    await page.click('button:has-text("Review Transfer")');

    // 4. Confirm in Review step
    await page.click('button:has-text("Confirm & Authorize")');

    // 5. Bypass WebAuthn
    await page.click('button:has-text("[DEV] Bypass Access")');

    // 6. Verify the UI updates to show the transaction was successful
    await expect(page.locator('text=TXN-EXT-12345')).toBeVisible();
  });

});
