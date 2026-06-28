import { test, testUser } from "../fixtures";
import { HomePage, LoginPage } from "../page-objects";

test.describe("Authentication Flow", () => {
  test.describe("Given a user on the login page", () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
    });

    test.describe("When the login form is displayed", () => {
      test("Then should show all required elements", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.expectAllElementsVisible();
      });

      test("Then should have empty credential input", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.expectCredentialInputEmpty();
      });
    });

    test.describe("When entering valid email credentials", () => {
      test("Then should redirect to home page", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.login(testUser.email);

        await homePage.expectToBeOnHomePage();
      });
    });

    test.describe("When entering valid phone credentials", () => {
      test("Then should redirect to home page", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.login(testUser.phone);

        await homePage.expectToBeOnHomePage();
      });
    });
  });

  test.describe("Given an authenticated user", () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAndWaitForHome(testUser.email);
    });

    test.describe("When logging out", () => {
      test("Then should redirect to login page", async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);

        await homePage.clickLogout();

        await loginPage.expectToBeOnLoginPage();
      });

      test("Then should clear session and require login again", async ({
        page,
      }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);

        await homePage.clickLogout();
        await loginPage.expectToBeOnLoginPage();

        await homePage.goto();

        await loginPage.expectToBeOnLoginPage();
      });
    });
  });

  test.describe("Given a non-authenticated user", () => {
    test.describe("When trying to access protected routes", () => {
      test("Then should redirect to login from /home", async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);

        await homePage.goto();

        await loginPage.expectToBeOnLoginPage();
      });

      test("Then should redirect to login from /transactions/new", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);

        await page.goto("/transactions/new");

        await loginPage.expectToBeOnLoginPage();
      });

      test("Then should redirect to login from /transactions/confirm", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);

        await page.goto("/transactions/confirm");

        await loginPage.expectToBeOnLoginPage();
      });
    });
  });

  test.describe("Given a user with an active session", () => {
    test.describe("When navigating directly to /login", () => {
      test("Then should redirect to home if already authenticated", async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.goto();
        await loginPage.loginAndWaitForHome(testUser.email);

        await loginPage.goto();

        await homePage.expectToBeOnHomePage();
      });
    });
  });
});
