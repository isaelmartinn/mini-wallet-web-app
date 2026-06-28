import { newContactData, test, testUser } from "../fixtures";
import { LoginPage, NewContactPage } from "../page-objects";

test.describe("Contacts Management", () => {
  test.describe("Given an authenticated user", () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAndWaitForHome(testUser.email);
    });

    test.describe("When creating contact with invalid data", () => {
      test("Then should show error for invalid email format", async ({
        page,
      }) => {
        const newContactPage = new NewContactPage(page);

        await newContactPage.goto();

        await newContactPage.fillContactFormWithEmail(
          newContactData.invalidEmail.name,
          newContactData.invalidEmail.email
        );
        await newContactPage.clickSave();

        await newContactPage.expectValidationError("Email inválido");
      });

      test("Then should show error for empty name", async ({ page }) => {
        const newContactPage = new NewContactPage(page);

        await newContactPage.goto();

        await newContactPage.fillContactFormWithPhone(
          newContactData.emptyName.name,
          newContactData.emptyName.phone
        );
        await newContactPage.clickSave();

        await newContactPage.expectValidationError("El nombre es requerido");
      });
    });

    test.describe("When canceling contact creation", () => {
      test("Then should return to previous page in history", async ({
        page,
      }) => {
        const newContactPage = new NewContactPage(page);

        await page.goto("/home");
        await page.goto("/contacts/new");

        await newContactPage.fillContactFormWithPhone(
          newContactData.validPhone.name,
          newContactData.validPhone.phone
        );
        await newContactPage.clickBack();

        await page.waitForURL("/home");
        test.expect(page.url()).toContain("/home");
      });
    });
  });

  test.describe("Given a non-authenticated user", () => {
    test.describe("When trying to access contacts page", () => {
      test("Then should redirect to login", async ({ page }) => {
        const newContactPage = new NewContactPage(page);
        const loginPage = new LoginPage(page);

        await newContactPage.goto();

        await loginPage.expectToBeOnLoginPage();
      });
    });
  });
});
