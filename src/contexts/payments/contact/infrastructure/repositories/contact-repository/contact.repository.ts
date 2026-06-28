import { useAuthStore } from "#auth/session/infrastructure/store/auth-store/auth.store";
import { Contact } from "#payments/contact/domain/entities";
import { ContactRepository as ContactRepositoryInterface } from "#payments/contact/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";

import { createMockContacts } from "./contact.fixtures";

interface StoredContact {
  email: string;
  id: string;
  isFavorite: boolean;
  name: string;
  phone: string;
}

export class ContactRepository implements ContactRepositoryInterface {
  private readonly STORAGE_KEY_PREFIX = "mini-wallet:contacts";

  async add(contact: Contact): Promise<void> {
    const stored = this.getFromStorage();

    stored.push({
      email: contact.getEmail().getValue(),
      id: contact.getId(),
      isFavorite: contact.isFavorite(),
      name: contact.getName(),
      phone: contact.getPhone().getValue(),
    });

    this.saveToStorage(stored);
  }

  async findAll(): Promise<Contact[]> {
    const stored = this.getFromStorage();

    return stored.map((item) =>
      Contact.create({
        email: Email.rehydrate(item.email),
        id: item.id,
        isFavorite: item.isFavorite,
        name: item.name,
        phone: Phone.rehydrate(item.phone),
      })
    );
  }

  async findByEmail(email: Email): Promise<Contact | null> {
    const stored = this.getFromStorage();
    const item = stored.find(
      (c) => c.email.toLowerCase() === email.getValue().toLowerCase()
    );

    if (!item) return null;

    return Contact.create({
      email: Email.rehydrate(item.email),
      id: item.id,
      isFavorite: item.isFavorite,
      name: item.name,
      phone: Phone.rehydrate(item.phone),
    });
  }

  async findById(id: string): Promise<Contact | null> {
    const stored = this.getFromStorage();
    const item = stored.find((c) => c.id === id);

    if (!item) return null;

    return Contact.create({
      email: Email.rehydrate(item.email),
      id: item.id,
      isFavorite: item.isFavorite,
      name: item.name,
      phone: Phone.rehydrate(item.phone),
    });
  }

  async findByName(name: string): Promise<Contact | null> {
    const stored = this.getFromStorage();
    const item = stored.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (!item) return null;

    return Contact.create({
      email: Email.rehydrate(item.email),
      id: item.id,
      isFavorite: item.isFavorite,
      name: item.name,
      phone: Phone.rehydrate(item.phone),
    });
  }

  async findByPhone(phone: Phone): Promise<Contact | null> {
    const stored = this.getFromStorage();
    const item = stored.find((c) => c.phone === phone.getValue());

    if (!item) return null;

    return Contact.create({
      email: Email.rehydrate(item.email),
      id: item.id,
      isFavorite: item.isFavorite,
      name: item.name,
      phone: Phone.rehydrate(item.phone),
    });
  }

  async findFavorites(): Promise<Contact[]> {
    const all = await this.findAll();
    return all.filter((c) => c.isFavorite());
  }

  private getFromStorage(): StoredContact[] {
    const userId = this.getUserId();
    const storageKey = this.getStorageKey(userId);

    if (typeof window === "undefined") {
      return this.getInitialContacts(userId);
    }

    try {
      const data = localStorage.getItem(storageKey);

      if (!data) {
        const initial = this.getInitialContacts(userId);
        this.saveToStorage(initial);
        return initial;
      }

      return JSON.parse(data) as StoredContact[];
    } catch (error) {
      console.error("Failed to load contacts from localStorage", error);
      return this.getInitialContacts(userId);
    }
  }

  private getInitialContacts(userId: string): StoredContact[] {
    const userContacts = createMockContacts(userId);
    return userContacts.map((contact) => ({
      email: contact.getEmail().getValue(),
      id: contact.getId(),
      isFavorite: contact.isFavorite(),
      name: contact.getName(),
      phone: contact.getPhone().getValue(),
    }));
  }

  private getStorageKey(userId: string): string {
    return `${this.STORAGE_KEY_PREFIX}:${userId}`;
  }

  private getUserId(): string {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error("User not authenticated");
    }
    return user.getId();
  }

  private saveToStorage(contacts: StoredContact[]): void {
    const userId = this.getUserId();
    const storageKey = this.getStorageKey(userId);

    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(contacts));
    } catch (error) {
      console.error("Failed to save contacts to localStorage", error);
    }
  }
}
