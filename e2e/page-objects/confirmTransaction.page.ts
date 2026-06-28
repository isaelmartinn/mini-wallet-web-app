import { expect, type Page } from "@playwright/test";

export class ConfirmTransactionPage {
  private readonly selectors = {
    backToHomeButton: '[data-testid="back-to-home-button"]',
    cancelButton: '[data-testid="cancel-button"]',
    confirmButton: '[data-testid="confirm-button"]',
    downloadReceiptButton: '[data-testid="download-receipt-button"]',
    errorMessage: '[data-testid="error-message"]',
    loadingSpinner: '[data-testid="loading-spinner"]',
    pageHeading: "role=heading[name=/confirmar transferencia/i]",
    receiptAmount: '[data-testid="receipt-amount"]',
    receiptDate: '[data-testid="receipt-date"]',
    receiptId: '[data-testid="receipt-id"]',
    receiptRecipient: '[data-testid="receipt-recipient"]',
    receiptStatus: '[data-testid="receipt-status"]',
    retryButton: '[data-testid="retry-button"]',
    shareReceiptButton: '[data-testid="share-receipt-button"]',
    successIcon: '[data-testid="success-icon"]',
    transactionAmount: '[data-testid="transaction-amount"]',
    transactionRecipient: '[data-testid="transaction-recipient"]',
  };

  constructor(private readonly page: Page) {}

  async clickBackToHome(): Promise<void> {
    await this.page.click(this.selectors.backToHomeButton);
  }

  async clickCancel(): Promise<void> {
    await this.page.click(this.selectors.cancelButton);
  }

  async clickConfirm(): Promise<void> {
    await this.page.click(this.selectors.confirmButton);
  }

  async clickDownloadReceipt(): Promise<void> {
    await this.page.click(this.selectors.downloadReceiptButton);
  }

  async clickRetry(): Promise<void> {
    await this.page.click(this.selectors.retryButton);
  }

  async clickShareReceipt(): Promise<void> {
    await this.page.click(this.selectors.shareReceiptButton);
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(message, "i"))).toBeVisible({
      timeout: 15000,
    });
  }

  async expectLoadingVisible(): Promise<void> {
    await expect(
      this.page.locator(this.selectors.loadingSpinner)
    ).toBeVisible();
  }

  async expectReceiptAmount(amount: number): Promise<void> {
    const formattedAmount = `$${amount.toFixed(2)}`;
    await expect(this.page.locator(this.selectors.receiptAmount)).toContainText(
      formattedAmount
    );
  }

  async expectReceiptRecipient(recipient: string): Promise<void> {
    await expect(
      this.page.locator(this.selectors.receiptRecipient)
    ).toContainText(recipient);
  }

  async expectReceiptStatusSuccess(): Promise<void> {
    await expect(this.page.locator(this.selectors.receiptStatus)).toContainText(
      /exitosa|completada|success/i
    );
  }

  async expectReceiptVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.receiptId)).toBeVisible();
    await expect(this.page.locator(this.selectors.receiptAmount)).toBeVisible();
    await expect(
      this.page.locator(this.selectors.receiptRecipient)
    ).toBeVisible();
    await expect(this.page.locator(this.selectors.receiptDate)).toBeVisible();
    await expect(this.page.locator(this.selectors.receiptStatus)).toBeVisible();
  }

  async expectRetryButtonVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.retryButton)).toBeVisible();
  }

  async expectSuccessIconVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.successIcon)).toBeVisible({
      timeout: 15000,
    });
  }

  async expectToBeOnConfirmPage(): Promise<void> {
    await expect(this.page).toHaveURL("/transactions/confirm");
  }

  async expectTransactionDetails(
    amount: number,
    recipient: string
  ): Promise<void> {
    const formattedAmount = `$${amount.toFixed(2)}`;
    await expect(
      this.page.locator(this.selectors.transactionAmount)
    ).toContainText(formattedAmount);
    await expect(
      this.page.locator(this.selectors.transactionRecipient)
    ).toContainText(recipient);
  }

  async getReceiptId(): Promise<string> {
    return (
      (await this.page.locator(this.selectors.receiptId).textContent()) || ""
    );
  }

  async goto(): Promise<void> {
    await this.page.goto("/transactions/confirm");
  }

  async waitForLoadingComplete(): Promise<void> {
    await this.page.waitForSelector(this.selectors.loadingSpinner, {
      state: "hidden",
      timeout: 15000,
    });
  }
}
