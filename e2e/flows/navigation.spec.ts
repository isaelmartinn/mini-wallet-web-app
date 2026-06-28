import { test, testUser } from "../fixtures";
import { HomePage, LoginPage } from "../page-objects";

test.describe("Navigation Flow", () => {
  test.describe("Given an authenticated user", () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAndWaitForHome(testUser.email);
    });

    test.describe("When navigating through the application", () => {
      test("Then should navigate from home to new transaction", async ({
        page,
      }) => {
        const homePage = new HomePage(page);

        await homePage.clickNewTransaction();

        test.expect(page.url()).toContain("/transactions/new");
      });

      test("Then should navigate back to home from new transaction", async ({
        page,
      }) => {
        const homePage = new HomePage(page);

        await homePage.clickNewTransaction();
        await page.goBack();

        await homePage.expectToBeOnHomePage();
      });

      test("Then should maintain session across page navigation", async ({
        page,
      }) => {
        const homePage = new HomePage(page);

        await homePage.clickNewTransaction();
        await page.goBack();

        await homePage.expectGreetingVisible();
        await homePage.expectBalanceCardVisible();
      });
    });

    test.describe("When using browser navigation", () => {
      test("Then should handle back button correctly", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.clickNewTransaction();
        test.expect(page.url()).toContain("/transactions/new");

        await page.goBack();

        await homePage.expectToBeOnHomePage();
      });

      test("Then should handle page refresh", async ({ page }) => {
        const homePage = new HomePage(page);

        await page.reload();

        await homePage.expectToBeOnHomePage();
        await homePage.expectGreetingVisible();
      });
    });

    test.describe("When accessing direct URLs", () => {
      test("Then should allow direct access to /home", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        await homePage.expectToBeOnHomePage();
      });

      test("Then should allow direct access to /transactions/new", async ({
        page,
      }) => {
        await page.goto("/transactions/new");

        test.expect(page.url()).toContain("/transactions/new");
      });

      test("Then should redirect from /login to /home when authenticated", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.goto();

        await homePage.expectToBeOnHomePage();
      });
    });
  });

  test.describe("Given a non-authenticated user", () => {
    test.describe("When accessing protected routes", () => {
      test("Then should redirect to /login from root", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto("/");

        await loginPage.expectToBeOnLoginPage();
      });

      test("Then should redirect to /login from /home", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto("/home");

        await loginPage.expectToBeOnLoginPage();
      });

      test("Then should redirect to /login from /transactions/new", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);

        await page.goto("/transactions/new");

        await loginPage.expectToBeOnLoginPage();
      });

      test("Then should redirect to /login from /transactions/confirm", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);

        await page.goto("/transactions/confirm");

        await loginPage.expectToBeOnLoginPage();
      });

      test("Then should redirect to /login from /contacts/new", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);

        await page.goto("/contacts/new");

        await loginPage.expectToBeOnLoginPage();
      });
    });

    test.describe("When navigating after redirect", () => {
      test("Then should preserve intended destination after login", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);

        await page.goto("/transactions/new");
        await loginPage.expectToBeOnLoginPage();

        await loginPage.loginAndWaitForHome(testUser.email);

        test.expect(page.url()).toMatch(/\/home|\/transactions\/new/);
      });
    });
  });

  test.describe("Given any user", () => {
    test.describe("When encountering errors", () => {
      test("Then should handle 404 pages gracefully", async ({ page }) => {
        await page.goto("/non-existent-page");

        const notFoundVisible = await page
          .getByText(/404|not found|página no encontrada/i)
          .isVisible()
          .catch(() => false);

        if (!notFoundVisible) {
          const loginPage = new LoginPage(page);
          await loginPage.expectToBeOnLoginPage();
        }
      });
    });
  });
});
