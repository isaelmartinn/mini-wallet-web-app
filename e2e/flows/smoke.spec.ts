import { expect, test } from "@playwright/test";

test.describe("Smoke Test", () => {
  test.describe("Given the application is running", () => {
    test.describe("When visiting the root page", () => {
      test("Then should display the app", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("Mini Wallet")).toBeVisible();
      });
    });
  });
});
