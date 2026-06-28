import { expect, type Page } from "@playwright/test";

export class HomePage {
  private readonly selectors = {
    balanceAmount: "text=/\\$/i",
    balanceCard: "text=/saldo disponible/i",
    balanceHidden: "text=/••••••/",
    greetingText: "text=/buenos días|buenas tardes|buenas noches/i",
    hideBalanceButton: '[aria-label*="Ocultar saldo"]',
    logoutButton: '[data-testid="logout-button"]',
    movementsHeading: "role=heading[name=/movimientos recientes/i]",
    newTransactionButton: '[data-testid="new-transaction-button"]',
    showBalanceButton: '[aria-label*="Mostrar saldo"]',
    skeleton: '[data-loading="true"]',
    transactionItem: '[data-testid="transaction-item"]',
  };

  constructor(private readonly page: Page) {}

  async clickLogout(): Promise<void> {
    await this.page.click(this.selectors.logoutButton);
  }

  async clickNewTransaction(): Promise<void> {
    const button = this.page.locator(this.selectors.newTransactionButton);
    await button.waitFor({ state: "visible" });
    await button.click();
    await this.page.waitForURL("**/transactions/new", { timeout: 10000 });
  }

  async expectBalanceAmountVisible(): Promise<void> {
    await expect(this.page.getByTestId("balance-amount")).toBeVisible();
  }

  async expectBalanceCardVisible(): Promise<void> {
    await expect(this.page.getByText(/saldo disponible/i)).toBeVisible();
  }

  async expectBalanceHidden(): Promise<void> {
    await expect(this.page.getByText("••••••")).toBeVisible();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(message, "i"))).toBeVisible({
      timeout: 10000,
    });
  }

  async expectGreetingVisible(): Promise<void> {
    await expect(
      this.page.getByText(/buenos días|buenas tardes|buenas noches/i)
    ).toBeVisible();
  }

  async expectMovementsHeadingVisible(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /movimientos recientes/i })
    ).toBeVisible();
  }

  async expectSkeletonsVisible(): Promise<void> {
    const skeletons = this.page.locator(this.selectors.skeleton);
    await expect(skeletons.first()).toBeVisible();
  }

  async expectToBeOnHomePage(): Promise<void> {
    await expect(this.page).toHaveURL("/home");
  }

  async expectTransactionItemsVisible(): Promise<void> {
    const transactionItems = this.page
      .locator(this.selectors.transactionItem)
      .or(this.page.locator("text=/Transferencia|Pago|Compra/i").first());

    await expect(transactionItems.first()).toBeVisible({ timeout: 10000 });
  }

  async getBalanceAmount(): Promise<string> {
    const balanceElement = this.page
      .locator(this.selectors.balanceAmount)
      .first();
    return (await balanceElement.textContent()) || "";
  }

  async getTransactionItemsCount(): Promise<number> {
    return await this.page.locator(this.selectors.transactionItem).count();
  }

  async goto(): Promise<void> {
    await this.page.goto("/home");
  }

  async hideBalance(): Promise<void> {
    await this.page.click(this.selectors.hideBalanceButton);
  }

  async showBalance(): Promise<void> {
    await this.page.click(this.selectors.showBalanceButton);
  }
}
