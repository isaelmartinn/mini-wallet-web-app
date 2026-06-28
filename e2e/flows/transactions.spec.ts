import { expect, test, testUser } from "../fixtures";
import { HomePage, LoginPage } from "../page-objects";

test.describe("Transactions Flow", () => {
  test.describe("Given an authenticated user", () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAndWaitForHome(testUser.phone);
    });

    test.describe("When viewing the home page", () => {
      test("Then should display transaction items", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.expectTransactionItemsVisible();
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

      test("Then should display transaction descriptions", async ({ page }) => {
        const descriptions = page.locator(
          "text=/Transferencia|Pago|Compra|Depósito|Reembolso/i"
        );

        await expect(descriptions.first()).toBeVisible({ timeout: 10000 });
      });
    });
  });

  test.describe("Given a non-authenticated user", () => {
    test.describe("When trying to access the home page", () => {
      test("Then should redirect to login", async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);

        await homePage.goto();

        await loginPage.expectToBeOnLoginPage();
      });
    });
  });
});
