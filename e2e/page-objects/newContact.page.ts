import { expect, type Page } from "@playwright/test";

export class NewContactPage {
  private readonly selectors = {
    backButton: '[data-testid="back-button"]',
    emailInput: '[data-testid="contact-email-input"]',
    favoriteToggle: '[data-testid="contact-favorite-switch"]',
    nameInput: '[data-testid="contact-name-input"]',
    pageHeading: "role=heading[name=/nuevo contacto/i]",
    phoneInput: '[data-testid="contact-phone-input"]',
    saveButton: '[data-testid="save-contact-button"]',
  };

  constructor(private readonly page: Page) {}

  async clickBack(): Promise<void> {
    await this.page.click(this.selectors.backButton);
  }

  async clickSave(): Promise<void> {
    await this.page.click(this.selectors.saveButton);
  }

  async createContactWithEmail(
    name: string,
    email: string,
    isFavorite = false
  ): Promise<void> {
    await this.fillName(name);
    await this.fillEmail(email);
    if (isFavorite) {
      await this.toggleFavorite();
    }
    await this.clickSave();
  }

  async createContactWithPhone(
    name: string,
    phone: string,
    isFavorite = false
  ): Promise<void> {
    await this.fillName(name);
    await this.fillPhone(phone);
    if (isFavorite) {
      await this.toggleFavorite();
    }
    await this.clickSave();
  }

  async expectHeadingVisible(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /nuevo contacto/i })
    ).toBeVisible();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(this.page.getByText(/contacto agregado/i)).toBeVisible();
  }

  async expectToBeOnNewContactPage(): Promise<void> {
    await expect(this.page).toHaveURL("/contacts/new");
  }

  async expectValidationError(error: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(error, "i"))).toBeVisible();
  }

  async fillContactFormWithEmail(name: string, email: string): Promise<void> {
    await this.fillName(name);
    await this.fillEmail(email);
  }

  async fillContactFormWithPhone(name: string, phone: string): Promise<void> {
    await this.fillName(name);
    await this.fillPhone(phone);
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.fill(this.selectors.emailInput, email);
  }

  async fillName(name: string): Promise<void> {
    await this.page.fill(this.selectors.nameInput, name);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.page.fill(this.selectors.phoneInput, phone);
  }

  async goto(): Promise<void> {
    await this.page.goto("/contacts/new");
  }

  async toggleFavorite(): Promise<void> {
    await this.page.click(this.selectors.favoriteToggle);
  }
}
