import { expect, test } from "@playwright/test";

test.describe("Wallet Home Page", () => {
  test.describe("Given an authenticated user", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.fill('[data-testid="credential-input"]', "test@example.com");
      await page.click('[data-testid="login-button"]');
      await page.waitForURL("/home");
    });

    test.describe("When viewing the home page", () => {
      test("Then should display user profile information", async ({ page }) => {
        await expect(
          page.getByText(/buenos días|buenas tardes|buenas noches/i)
        ).toBeVisible();

        await expect(page.getByRole("heading")).toBeVisible();
      });

      test("Then should display balance card", async ({ page }) => {
        await expect(page.getByText(/saldo disponible/i)).toBeVisible();

        await expect(page.getByText(/\$/)).toBeVisible();
      });

      test("Then should allow toggling balance visibility", async ({
        page,
      }) => {
        await page.click('[aria-label*="Ocultar saldo"]');

        await expect(page.getByText("••••••")).toBeVisible();

        await page.click('[aria-label*="Mostrar saldo"]');

        await expect(page.getByText(/\$/)).toBeVisible();
      });
    });

    test.describe("When the page loads", () => {
      test("Then should show loading skeletons initially", async ({ page }) => {
        await page.goto("/home");

        const skeletons = page.locator('[data-loading="true"]');

        await expect(skeletons.first()).toBeVisible();
      });
    });
  });

  test.describe("Given an unauthenticated user", () => {
    test.describe("When trying to access home page", () => {
      test("Then should redirect to login", async ({ page }) => {
        await page.goto("/home");

        await expect(page).toHaveURL("/login");
      });
    });
  });
});
