import { expect, type Page } from "@playwright/test";

export class NewTransactionPage {
  private readonly selectors = {
    amountInput: '[data-testid="amount-input"]',
    backButton: '[data-testid="back-button"]',
    contactItem: '[data-testid="contact-item"]',
    contactSearchInput: '[data-testid="contact-search-input"]',
    contactSelector: '[data-testid="contact-selector"]',
    continueButton: '[data-testid="continue-button"]',
    newContactButton: '[data-testid="new-contact-button"]',
    pageHeading: "role=heading[name=/nueva transferencia/i]",
    recipientInput: '[data-testid="recipient-input"]',
    summaryAmount: '[data-testid="summary-amount"]',
    summaryRecipient: '[data-testid="summary-recipient"]',
  };

  constructor(private readonly page: Page) {}

  async clickBack(): Promise<void> {
    await this.page.click(this.selectors.backButton);
  }

  async clickContinue(): Promise<void> {
    await this.page.click(this.selectors.continueButton);
  }

  async clickNewContact(): Promise<void> {
    await this.page.click(this.selectors.newContactButton);
  }

  async expectAmountError(error: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(error, "i"))).toBeVisible();
  }

  async expectContactVisible(contactName: string): Promise<void> {
    await expect(
      this.page.locator(
        `${this.selectors.contactItem}:has-text("${contactName}")`
      )
    ).toBeVisible();
  }

  async expectContinueButtonDisabled(): Promise<void> {
    await expect(
      this.page.locator(this.selectors.continueButton)
    ).toBeDisabled();
  }

  async expectContinueButtonEnabled(): Promise<void> {
    await expect(
      this.page.locator(this.selectors.continueButton)
    ).toBeEnabled();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(message, "i"))).toBeVisible();
  }

  async expectHeadingVisible(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /nueva transferencia/i })
    ).toBeVisible();
  }

  async expectSummaryAmount(amount: number): Promise<void> {
    const formattedAmount = `$${amount.toFixed(2)}`;
    await expect(this.page.locator(this.selectors.summaryAmount)).toContainText(
      formattedAmount
    );
  }

  async expectSummaryRecipient(recipient: string): Promise<void> {
    await expect(
      this.page.locator(this.selectors.summaryRecipient)
    ).toContainText(recipient);
  }

  async expectToBeOnNewTransactionPage(): Promise<void> {
    await expect(this.page).toHaveURL("/transactions/new");
  }

  async fillAmount(amount: number): Promise<void> {
    const input = this.page.locator(`${this.selectors.amountInput} input`);
    await input.fill(amount.toString());
  }

  async fillAndContinue(amount: number, recipient: string): Promise<void> {
    await this.fillTransactionForm(amount, recipient);
    await this.clickContinue();
  }

  async fillRecipient(recipient: string): Promise<void> {
    await this.page.fill(this.selectors.recipientInput, recipient);
  }

  async fillTransactionForm(amount: number, recipient: string): Promise<void> {
    await this.fillAmount(amount);
    await this.fillRecipient(recipient);
  }

  async goto(): Promise<void> {
    await this.page.goto("/transactions/new");
  }

  async searchContact(query: string): Promise<void> {
    await this.page.fill(this.selectors.contactSearchInput, query);
  }

  async selectContact(contactName: string): Promise<void> {
    await this.page.click(
      `${this.selectors.contactItem}:has-text("${contactName}")`
    );
  }
}
