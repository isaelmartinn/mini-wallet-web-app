import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(config.projects[0].use.baseURL || "http://localhost:3000");
  await page.evaluate(() => {
    localStorage.removeItem("auth-storage");
    sessionStorage.clear();
  });

  await browser.close();
}

export default globalSetup;
