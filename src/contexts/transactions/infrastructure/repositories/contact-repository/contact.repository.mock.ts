import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import { Contact } from "#transactions/domain/entities";
import { ContactRepository } from "#transactions/domain/repositories";

import { MOCK_CONTACTS } from "./contact.fixtures";

export class ContactRepositoryMock implements ContactRepository {
  private contacts: Contact[] = [...MOCK_CONTACTS];

  async add(contact: Contact): Promise<void> {
    await this.simulateDelay();
    this.contacts.push(contact);
  }

  async findAll(): Promise<Contact[]> {
    await this.simulateDelay();
    return [...this.contacts];
  }

  async findById(id: string): Promise<Contact | null> {
    await this.simulateDelay();
    const contact = this.contacts.find((c) => c.getId() === id);
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
