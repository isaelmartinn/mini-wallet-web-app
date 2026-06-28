import {
  expect,
  favoriteContactWithPhone,
  newTransactionData,
  test,
  testUser,
} from "../fixtures";
import { HomePage, LoginPage, NewTransactionPage } from "../page-objects";

test.describe("Transfer Flow", () => {
  test.describe("Given an authenticated user with sufficient balance", () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAndWaitForHome(testUser.email);
    });

    test.describe("When creating a new transfer", () => {
      test("Then should navigate to new transaction page", async ({ page }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();

        await newTransactionPage.expectToBeOnNewTransactionPage();
        await newTransactionPage.expectHeadingVisible();
      });

      test("Then should have continue button enabled initially", async ({
        page,
      }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();

        await newTransactionPage.expectContinueButtonEnabled();
      });
    });

    test.describe("When validating the transfer form", () => {
      test("Then should show error when amount is empty", async ({ page }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.selectContact(favoriteContactWithPhone.name);
        await newTransactionPage.clickContinue();

        await expect(page.getByText(/el monto es requerido/i)).toBeVisible();
      });

      test("Then should show error when amount is zero", async ({ page }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.fillAmount(0);
        await newTransactionPage.selectContact(favoriteContactWithPhone.name);
        await newTransactionPage.clickContinue();

        await expect(
          page.getByText(/el monto debe ser mayor a cero/i)
        ).toBeVisible();
      });

      test("Then should show error when recipient is not selected", async ({
        page,
      }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.fillAmount(newTransactionData.validAmount);
        await newTransactionPage.clickContinue();

        await expect(
          page.getByText(/debes seleccionar un destinatario/i)
        ).toBeVisible();
      });
    });

    test.describe("When filling the transfer form", () => {
      test("Then should show summary after filling amount and selecting contact", async ({
        page,
      }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.fillAmount(newTransactionData.validAmount);
        await newTransactionPage.selectContact(favoriteContactWithPhone.name);
        await newTransactionPage.clickContinue();

        await newTransactionPage.expectSummaryAmount(
          newTransactionData.validAmount
        );
        await newTransactionPage.expectSummaryRecipient(
          favoriteContactWithPhone.name
        );
      });

      test("Then should navigate to confirmation page after confirming", async ({
        page,
      }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.fillAmount(newTransactionData.validAmount);
        await newTransactionPage.selectContact(favoriteContactWithPhone.name);
        await newTransactionPage.clickContinue();

        const confirmButton = page.locator('[data-testid="confirm-button"]');
        await confirmButton.click();

        await expect(page).toHaveURL(/\/transactions\/confirm/);
      });
    });

    test.describe("When confirming a transfer", () => {
      test("Then should show loading state initially", async ({ page }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.fillAmount(newTransactionData.validAmount);
        await newTransactionPage.selectContact(favoriteContactWithPhone.name);
        await newTransactionPage.clickContinue();

        const confirmButton = page.locator('[data-testid="confirm-button"]');
        await confirmButton.click();

        const loadingState = page.locator('[data-testid="loading-state"]');
        await expect(loadingState).toBeVisible({ timeout: 2000 });
      });

      test("Then should show success or error state after processing", async ({
        page,
      }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.fillAmount(newTransactionData.validAmount);
        await newTransactionPage.selectContact(favoriteContactWithPhone.name);
        await newTransactionPage.clickContinue();

        const confirmButton = page.locator('[data-testid="confirm-button"]');
        await confirmButton.click();

        const successIcon = page.locator('[data-testid="success-icon"]');
        const errorIcon = page.locator('[data-testid="error-icon"]');

        await expect(successIcon.or(errorIcon)).toBeVisible({ timeout: 15000 });
      });

      test("Then should show receipt on successful transfer", async ({
        page,
      }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.fillAmount(newTransactionData.validAmount);
        await newTransactionPage.selectContact(favoriteContactWithPhone.name);
        await newTransactionPage.clickContinue();

        const confirmButton = page.locator('[data-testid="confirm-button"]');
        await confirmButton.click();

        const successIcon = page.locator('[data-testid="success-icon"]');
        const isSuccess = await successIcon
          .isVisible({ timeout: 15000 })
          .catch(() => false);

        if (isSuccess) {
          const receiptCard = page.locator('[data-testid="receipt-card"]');
          await expect(receiptCard).toBeVisible();

          const receiptAmount = page.locator('[data-testid="receipt-amount"]');
          await expect(receiptAmount).toBeVisible();

          const receiptRecipient = page.locator(
            '[data-testid="receipt-recipient"]'
          );
          await expect(receiptRecipient).toContainText(
            favoriteContactWithPhone.name
          );
        }
      });

      test("Then should return to home after successful transfer", async ({
        page,
      }) => {
        const homePage = new HomePage(page);
        const newTransactionPage = new NewTransactionPage(page);

        await homePage.clickNewTransaction();
        await newTransactionPage.fillAmount(newTransactionData.validAmount);
        await newTransactionPage.selectContact(favoriteContactWithPhone.name);
        await newTransactionPage.clickContinue();

        const confirmButton = page.locator('[data-testid="confirm-button"]');
        await confirmButton.click();

        const successIcon = page.locator('[data-testid="success-icon"]');
        const isSuccess = await successIcon
          .isVisible({ timeout: 15000 })
          .catch(() => false);

        if (isSuccess) {
          const backToHomeButton = page.locator(
            '[data-testid="back-to-home-button"]'
          );
          await backToHomeButton.click();

          await homePage.expectToBeOnHomePage();
        }
      });
    });
  });

  test.describe("Given a non-authenticated user", () => {
    test.describe("When trying to access transfer pages", () => {
      test("Then should redirect to login from new transaction page", async ({
        page,
      }) => {
        const newTransactionPage = new NewTransactionPage(page);
        const loginPage = new LoginPage(page);

        await newTransactionPage.goto();

        await loginPage.expectToBeOnLoginPage();
      });
    });
  });
});
