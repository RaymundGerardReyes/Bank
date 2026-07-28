import { test, expect } from "@playwright/test";

test.describe("Login Flow E2E", () => {
  test("should render the sign in form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h3")).toContainText("Secure Client Sign In");
    await expect(page.locator("input[type='text']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });
});
