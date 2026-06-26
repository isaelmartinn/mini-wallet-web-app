import { expect, test } from "@playwright/test";

test.describe("Transactions Flow", () => {
  test.describe("Given an authenticated user", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="credential"]', "+5215512345678");
      await page.click('button[type="submit"]');
      await page.waitForURL("/home");
    });

    test.describe("When viewing the home page", () => {
      test("Then should display the movements list", async ({ page }) => {
        await expect(
          page.getByRole("heading", { name: /movimientos recientes/i })
        ).toBeVisible();
      });

      test("Then should display transaction items", async ({ page }) => {
        const transactionItems = page
          .locator('[data-testid="transaction-item"]')
          .or(page.locator("text=/Transferencia|Pago|Compra/i").first());

        await expect(transactionItems.first()).toBeVisible({ timeout: 10000 });
      });

      test("Then should display transaction amounts with correct formatting", async ({
        page,
      }) => {
        const amounts = page.locator("text=/[+-]\\$[0-9,]+\\.[0-9]{2}/");

        await expect(amounts.first()).toBeVisible({ timeout: 10000 });
      });

      test("Then should display transaction dates", async ({ page }) => {
        const dates = page.locator("text=/\\d+ de [a-z]+, \\d{4}/i");

        await expect(dates.first()).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe("When transactions fail to load", () => {
      test("Then should display error state", async ({ page }) => {
        await page.route("**/api/transactions*", (route) =>
          route.abort("failed")
        );

        await page.reload();

        await expect(
          page.getByText(/error al cargar movimientos/i)
        ).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe("When there are different transaction types", () => {
      test("Then should display credit transactions with positive amounts", async ({
        page,
      }) => {
        const creditAmounts = page.locator("text=/\\+\\$/");

        const count = await creditAmounts.count();
        expect(count).toBeGreaterThan(0);
      });

      test("Then should display debit transactions with negative amounts", async ({
        page,
      }) => {
        const debitAmounts = page.locator("text=/-\\$/");

        const count = await debitAmounts.count();
        expect(count).toBeGreaterThan(0);
      });
    });

    test.describe("When there are transactions with different statuses", () => {
      test("Then should display pending status when applicable", async ({
        page,
      }) => {
        const pendingStatus = page.locator("text=/pendiente/i");

        if ((await pendingStatus.count()) > 0) {
          await expect(pendingStatus.first()).toBeVisible();
        }
      });

      test("Then should display failed status when applicable", async ({
        page,
      }) => {
        const failedStatus = page.locator("text=/fallida/i");

        if ((await failedStatus.count()) > 0) {
          await expect(failedStatus.first()).toBeVisible();
        }
      });
    });
  });

  test.describe("Given a non-authenticated user", () => {
    test.describe("When trying to access the home page", () => {
      test("Then should redirect to login", async ({ page }) => {
        await page.goto("/home");

        await page.waitForURL("/login", { timeout: 5000 });
        expect(page.url()).toContain("/login");
      });
    });
  });
});
