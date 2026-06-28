import { test, testUser } from "../fixtures";
import { HomePage, LoginPage } from "../page-objects";

test.describe("Wallet Home Page", () => {
  test.describe("Given an authenticated user", () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAndWaitForHome(testUser.email);
    });

    test.describe("When viewing the home page", () => {
      test("Then should display user greeting", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.expectGreetingVisible();
      });

      test("Then should display balance card", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.expectBalanceCardVisible();
        await homePage.expectBalanceAmountVisible();
      });
    });

    test.describe("When toggling balance visibility", () => {
      test("Then should hide balance when clicking hide button", async ({
        page,
      }) => {
        const homePage = new HomePage(page);

        await homePage.hideBalance();

        await homePage.expectBalanceHidden();
      });

      test("Then should show balance when clicking show button", async ({
        page,
      }) => {
        const homePage = new HomePage(page);

        await homePage.hideBalance();
        await homePage.expectBalanceHidden();

        await homePage.showBalance();

        await homePage.expectBalanceAmountVisible();
      });
    });

    test.describe("When the page loads", () => {
      test("Then should show loading skeletons initially", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        await homePage.expectSkeletonsVisible();
      });
    });

    test.describe("When balance data loads successfully", () => {
      test("Then should display formatted balance amount", async ({ page }) => {
        const homePage = new HomePage(page);

        const balance = await homePage.getBalanceAmount();

        test.expect(balance).toMatch(/\$[\d,]+\.\d{2}/);
      });
    });
  });

  test.describe("Given an unauthenticated user", () => {
    test.describe("When trying to access home page", () => {
      test("Then should redirect to login", async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);

        await homePage.goto();

        await loginPage.expectToBeOnLoginPage();
      });
    });
  });
});
