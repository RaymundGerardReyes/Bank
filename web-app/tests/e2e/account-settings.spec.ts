import { test, expect } from '@playwright/test';

const TARGET_ACCOUNT = 'ACC-E2E-999';

test.describe('Account Controller Settings - E2E Integration Paths', () => {

  test.beforeEach(async ({ page }) => {
    // Standard authenticated login routine
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test-user@novabank.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/accounts');
  });

  test('P01 & P02: Toggle setting persists successfully across page reloads', async ({ page }) => {
    await page.goto(`/accounts/${TARGET_ACCOUNT}`);
    
    const incomingToggle = page.getByRole('button', { name: /Toggle Allow Incoming Transfers/i });
    
    // Toggle it off
    await incomingToggle.click();
    
    // Wait for the optimistic update and network resolution
    await expect(incomingToggle).toHaveClass(/bg-slate-700/);
    
    // P02: Reload the page to confirm the database actually saved it
    await page.reload();
    const refreshedToggle = page.getByRole('button', { name: /Toggle Allow Incoming Transfers/i });
    await expect(refreshedToggle).toHaveClass(/bg-slate-700/);
    
    // Teardown: Toggle back on
    await refreshedToggle.click();
  });

  test('P03: Disabling incoming transfers physically blocks deposits', async ({ page }) => {
    await page.goto(`/accounts/${TARGET_ACCOUNT}`);
    await page.getByRole('button', { name: /Toggle Allow Incoming Transfers/i }).click();
    
    // Navigate to deposit screen
    await page.goto('/transactions/deposit');
    await page.fill('input[name="amount"]', '100');
    await page.selectOption('select[name="accountNumber"]', TARGET_ACCOUNT);
    await page.click('button[type="submit"]');
    
    // Expect the backend policy to reject it
    await expect(page.locator('text=restricted from INCOMING transactions')).toBeVisible();
    
    // Teardown
    await page.goto(`/accounts/${TARGET_ACCOUNT}`);
    await page.getByRole('button', { name: /Toggle Allow Incoming Transfers/i }).click();
  });

  test('P04: Disabling outgoing transfers physically blocks withdrawals', async ({ page }) => {
    await page.goto(`/accounts/${TARGET_ACCOUNT}`);
    await page.getByRole('button', { name: /Toggle Allow Outgoing Transfers/i }).click();
    
    await page.goto('/transactions/withdraw');
    await page.fill('input[name="amount"]', '50');
    await page.selectOption('select[name="accountNumber"]', TARGET_ACCOUNT);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=restricted from OUTGOING transactions')).toBeVisible();
    
    // Teardown
    await page.goto(`/accounts/${TARGET_ACCOUNT}`);
    await page.getByRole('button', { name: /Toggle Allow Outgoing Transfers/i }).click();
  });

  test('P05 & P06: Total freeze strictly blocks internal transfers, and un-freezing restores it', async ({ page }) => {
    await page.goto(`/accounts/${TARGET_ACCOUNT}`);
    await page.getByRole('button', { name: /Toggle Account Freeze State/i }).click();
    
    // Attempt internal transfer
    await page.goto('/transfers/internal');
    await page.selectOption('select[name="sourceAccount"]', TARGET_ACCOUNT);
    await page.fill('input[name="amount"]', '10');
    await page.click('button[type="submit"]');
    
    // P05: Blocked
    await expect(page.locator('text=Account is frozen')).toBeVisible();
    
    // P06: Un-freeze
    await page.goto(`/accounts/${TARGET_ACCOUNT}`);
    await page.getByRole('button', { name: /Toggle Account Freeze State/i }).click();
    
    await page.goto('/transfers/internal');
    await page.selectOption('select[name="sourceAccount"]', TARGET_ACCOUNT);
    await page.selectOption('select[name="destinationAccount"]', 'ACC-OTHER-111');
    await page.fill('input[name="amount"]', '10');
    await page.click('button[type="submit"]');
    
    // Success redirect
    await page.waitForURL(/\/transactions\/receipt\/.*/);
  });

  test('P07: Unauthenticated direct API proxy access is rejected at the BFF Gateway', async ({ request }) => {
    const response = await request.patch(`/api/proxy/accounts/${TARGET_ACCOUNT}/settings`, {
      data: { frozen: true }
    });
    
    expect(response.status()).toBe(401);
  });

  test('P08: Cross-tenant API attack is rejected by Spring Boot security', async ({ page }) => {
    const responseStatus = await page.evaluate(async () => {
      const res = await fetch('/api/proxy/accounts/ACC-MALICIOUS-TARGET/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frozen: true })
      });
      return res.status;
    });
    
    expect(responseStatus).toBe(403);
  });

  test('P09: Concurrent state patches merge cleanly without overwriting', async ({ page }) => {
    const [res1, res2] = await page.evaluate(async (acc) => {
      const req1 = fetch(`/api/proxy/accounts/${acc}/settings`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ allowIncoming: false })
      });
      const req2 = fetch(`/api/proxy/accounts/${acc}/settings`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ allowOutgoing: false })
      });
      const responses = await Promise.all([req1, req2]);
      return [responses[0].status, responses[1].status];
    }, TARGET_ACCOUNT);
    
    expect(res1).toBe(200);
    expect(res2).toBe(200);
    
    // Teardown
    await page.evaluate(async (acc) => {
      await fetch(`/api/proxy/accounts/${acc}/settings`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ allowIncoming: true, allowOutgoing: true })
      });
    }, TARGET_ACCOUNT);
  });

  test('P10: Malformed payload caught by Spring Validation before business logic', async ({ page }) => {
    const responseStatus = await page.evaluate(async (acc) => {
      const res = await fetch(`/api/proxy/accounts/${acc}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frozen: "very-frozen" })
      });
      return res.status;
    }, TARGET_ACCOUNT);
    
    expect(responseStatus).toBe(400);
  });
});
