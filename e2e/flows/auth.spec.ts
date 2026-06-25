import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.describe("Given a user on the login page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
    });

    test.describe("When entering valid credentials", () => {
      test("Then should redirect to home page", async ({ page }) => {
        await page.fill('[data-testid="credential-input"]', "test@example.com");
        await page.click('[data-testid="login-button"]');

        await expect(page).toHaveURL("/home");
      });
    });

    test.describe("When the login form is displayed", () => {
      test("Then should show all required elements", async ({ page }) => {
        await expect(
          page.getByRole("heading", { name: /iniciar sesión/i })
        ).toBeVisible();
        await expect(
          page.locator('[data-testid="credential-input"]')
        ).toBeVisible();
        await expect(
          page.locator('[data-testid="login-button"]')
        ).toBeVisible();
      });
    });
  });

  test.describe("Given an authenticated user", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.fill('[data-testid="credential-input"]', "test@example.com");
      await page.click('[data-testid="login-button"]');
      await page.waitForURL("/home");
    });

    test.describe("When logging out", () => {
      test("Then should redirect to login page", async ({ page }) => {
        await page.click('[data-testid="logout-button"]');

        await expect(page).toHaveURL("/login");
      });
    });
  });
});
