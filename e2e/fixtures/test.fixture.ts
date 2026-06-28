import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("auth-storage");
      sessionStorage.clear();
    });
    await use(page);
  },
});

export { expect } from "@playwright/test";
