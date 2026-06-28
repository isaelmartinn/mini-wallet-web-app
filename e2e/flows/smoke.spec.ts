import { expect, test, testUser } from "../fixtures";
import { HomePage, LoginPage } from "../page-objects";

test.describe("Smoke Test", () => {
  test.describe("Given the application is running", () => {
    test.describe("When visiting the root page", () => {
      test("Then should load without errors", async ({ page }) => {
        const response = await page.goto("/");

        test.expect(response?.status()).toBeLessThan(400);
      });

      test("Then should redirect to login or home", async ({ page }) => {
        await page.goto("/");
        await page.waitForURL(/\/(login|home)/, { timeout: 10000 });

        const url = page.url();
        test.expect(url).toMatch(/\/login|\/home/);
      });
    });

    test.describe("When checking critical pages", () => {
      test("Then login page should load", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.expectAllElementsVisible();
      });

      test("Then home page should load after authentication", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.goto();
        await loginPage.loginAndWaitForHome(testUser.email);

        await homePage.expectGreetingVisible();
        await homePage.expectBalanceCardVisible();
      });

      test("Then new transaction page should load after authentication", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.loginAndWaitForHome(testUser.email);

        await page.goto("/transactions/new");

        await expect(
          page.getByRole("heading", { name: /nueva transferencia/i })
        ).toBeVisible();
      });
    });

    test.describe("When checking application health", () => {
      test("Then should have valid HTML structure", async ({ page }) => {
        await page.goto("/");

        const title = await page.title();
        test.expect(title).toBeTruthy();
      });
    });
  });
});
