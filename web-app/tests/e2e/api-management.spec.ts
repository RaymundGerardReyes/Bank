import { test, expect } from '@playwright/test';

test.describe('API Management Dashboard E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Mock Authentication Context
    await page.route('**/api/v1/auth/me', async route => {
      await route.fulfill({
        status: 200,
        json: { id: 'MERCH-505', role: 'MERCHANT', name: 'Test Merchant' }
      });
    });

    // 2. Default Mocks for API Keys and Webhooks (Empty State)
    await page.route('**/api-keys*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, json: { data: [] } });
      } else {
        await route.continue();
      }
    });

    await page.route('**/webhooks*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, json: { data: [] } });
      } else {
        await route.continue();
      }
    });

    // Navigate to the API Management page
    await page.goto('/api');
  });

  // ==========================================================
  // SUITE A: API KEY MANAGEMENT
  // ==========================================================
  test.describe('Suite A: API Key Management', () => {
    test('Generate Key Flow & Clipboard Copy', async ({ page }) => {
      // Mock the POST request to generate a key
      const mockSecret = 'sk_live_super_secret_123';
      await page.route('**/api-keys', async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            json: { data: { id: 'key_1', publicKey: 'pk_live_123', secretKey: mockSecret, label: 'E2E App' } }
          });
        }
      });

      // Interact with the UI
      await page.getByRole('button', { name: /Generate New Key/i }).click();
      
      // Fill out the modal
      await page.getByLabel(/Key Label/i).fill('E2E App');
      await page.getByRole('checkbox', { name: /PAYMENTS_READ/i }).check();
      await page.getByRole('button', { name: /Create Key/i }).click();

      // Assert the secure modal appears with the secret key
      await expect(page.getByText(mockSecret)).toBeVisible();

      // Test clipboard functionality
      await page.getByRole('button', { name: /Copy to clipboard/i }).click();
      
      // Verify clipboard content
      const clipboardText = await page.evaluate("navigator.clipboard.readText()");
      expect(clipboardText).toEqual(mockSecret);

      // Close modal and verify secret is gone
      await page.getByRole('button', { name: /I have copied/i }).click();
      await expect(page.getByText(mockSecret)).not.toBeVisible();
    });

    test('Revocation Flow', async ({ page }) => {
      // Setup: Mock an existing active key
      await page.route('**/api-keys*', async route => {
        if (route.request().method() === 'GET') {
          await route.fulfill({ status: 200, json: { data: [{ id: 'key_1', publicKey: 'pk_live_123', label: 'Old App', status: 'ACTIVE' }] } });
        } else if (route.request().method() === 'DELETE') {
          await route.fulfill({ status: 200, json: { success: true } });
        }
      });

      await page.reload(); // Reload to fetch the seeded key

      // Find the row and click Revoke
      const row = page.locator('tr', { hasText: 'pk_live_123' });
      await row.getByRole('button', { name: /Revoke/i }).click();

      // Confirm in destructive modal
      await expect(page.getByRole('dialog', { name: /Revoke API Key/i })).toBeVisible();
      await page.getByRole('button', { name: /Confirm Revocation/i }).click();

      // Assert the DELETE call succeeded and UI might optimistically update or show success toast
      await expect(page.getByText(/Key revoked successfully/i)).toBeVisible();
    });
  });

  // ==========================================================
  // SUITE B: WEBHOOK REGISTRATION
  // ==========================================================
  test.describe('Suite B: Webhook Registration', () => {
    test('Form Validation - Blocks localhost/HTTP', async ({ page }) => {
      await page.getByRole('button', { name: /Add Webhook/i }).click();

      // Attempt to enter invalid URL
      await page.getByLabel(/Endpoint URL/i).fill('http://127.0.0.1/hook');
      await page.getByRole('checkbox', { name: /payment.success/i }).check();
      await page.getByRole('button', { name: /Register/i }).click();

      // Assert SSRF/HTTP protection
      await expect(page.getByText(/Internal or localhost IPs are strictly prohibited/i)).toBeVisible();
    });

    test('Webhook Ping Test Flow', async ({ page }) => {
      // Setup: Mock an active webhook
      await page.route('**/webhooks*', async route => {
        if (route.request().method() === 'GET') {
          await route.fulfill({ status: 200, json: { data: [{ id: 'wh_1', url: 'https://app.com/hook', events: ['payment.success'], status: 'ACTIVE' }] } });
        }
      });

      // Mock the Ping POST request
      await page.route('**/webhooks/*/ping', async route => {
        await route.fulfill({ status: 200, json: { data: { statusCode: 200, message: 'OK' } } });
      });

      await page.reload();

      // Expand details and Ping
      const row = page.locator('tr', { hasText: 'https://app.com/hook' });
      await row.getByRole('button', { name: /Ping/i }).click();

      // Verify success toast
      await expect(page.getByText(/External app responded with 200 OK/i)).toBeVisible();
    });
  });

  // ==========================================================
  // SUITE C: API DOCUMENTATION
  // ==========================================================
  test.describe('Suite C: API Documentation', () => {
    test('Iframe renders correctly in Documentation Tab', async ({ page }) => {
      // Click the documentation tab
      await page.getByRole('tab', { name: /Documentation/i }).click();

      // Locate the iframe
      const docsIframe = page.locator('iframe[title="API Reference"]');
      await expect(docsIframe).toBeVisible();

      // Verify the src attribute points to our Swagger/Scalar endpoint
      await expect(docsIframe).toHaveAttribute('src', /\/developers|openapi/);
    });
  });
});
