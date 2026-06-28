import { Contact } from "#payments/contact/domain/entities";
import { ContactRepository } from "#payments/contact/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";
import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";

import { ALL_CONTACTS_BY_USER } from "./contact.fixtures";

export class ContactRepositoryMock implements ContactRepository {
  private contacts: Contact[] = [...ALL_CONTACTS_BY_USER];

  async add(contact: Contact): Promise<void> {
    await this.simulateDelay();
    this.contacts.push(contact);
  }

  async findAll(): Promise<Contact[]> {
    await this.simulateDelay();
    return [...this.contacts];
  }

  async findByEmail(email: Email): Promise<Contact | null> {
    await this.simulateDelay();
    const contact = this.contacts.find(
      (c) =>
        c.getEmail().getValue().toLowerCase() === email.getValue().toLowerCase()
    );
    return contact ?? null;
  }

  async findById(id: string): Promise<Contact | null> {
    await this.simulateDelay();
    const contact = this.contacts.find((c) => c.getId() === id);
    return contact ?? null;
  }

  async findByName(name: string): Promise<Contact | null> {
    await this.simulateDelay();
    const contact = this.contacts.find(
      (c) => c.getName().toLowerCase() === name.toLowerCase()
    );
    return contact ?? null;
  }

  async findByPhone(phone: Phone): Promise<Contact | null> {
    await this.simulateDelay();
    const contact = this.contacts.find(
      (c) => c.getPhone().getValue() === phone.getValue()
    );
    return contact ?? null;
  }

  async findFavorites(): Promise<Contact[]> {
    await this.simulateDelay();
    return this.contacts.filter((c) => c.isFavorite());
  }

  private simulateDelay(): Promise<void> {
    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
