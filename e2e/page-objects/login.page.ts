import { expect, type Page } from "@playwright/test";

export class LoginPage {
  private readonly selectors = {
    credentialInput: '[data-testid="credential-input"]',
    loginButton: '[data-testid="login-button"]',
    pageHeading: "role=heading[name=/iniciar sesión/i]",
  };

  constructor(private readonly page: Page) {}

  async clickLogin(): Promise<void> {
    const button = this.page.locator(this.selectors.loginButton);
    await button.waitFor({ state: "visible" });
    await button.click({ force: false });
  }

  async expectAllElementsVisible(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeVisible();
    await expect(
      this.page.locator(this.selectors.credentialInput)
    ).toBeVisible();
    await expect(this.page.locator(this.selectors.loginButton)).toBeVisible();
  }

  async expectCredentialInputEmpty(): Promise<void> {
    await expect(this.page.locator(this.selectors.credentialInput)).toHaveValue(
      ""
    );
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectToBeOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL("/login");
  }

  async fillCredential(credential: string): Promise<void> {
    await this.page.fill(this.selectors.credentialInput, credential);
    await this.page.waitForTimeout(500);
  }

  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  async login(credential: string): Promise<void> {
    await this.fillCredential(credential);
    await this.clickLogin();
  }

  async loginAndWaitForHome(credential: string): Promise<void> {
    await this.fillCredential(credential);
    await this.clickLogin();
    await this.waitForSuccessfulLogin();
  }

  async waitForSuccessfulLogin(): Promise<void> {
    await this.page.waitForURL("/home", { timeout: 30000 });
    await this.page.waitForLoadState("domcontentloaded");
  }
}
