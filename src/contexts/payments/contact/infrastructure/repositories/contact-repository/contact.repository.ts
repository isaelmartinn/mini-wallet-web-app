import { useAuthStore } from "#auth/session/infrastructure/store/auth-store/auth.store";
import { Contact } from "#payments/contact/domain/entities";
import { ContactRepository as ContactRepositoryInterface } from "#payments/contact/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";
import { HttpClient, HttpError } from "#shared/infrastructure";

interface ContactResponse {
  email: string;
  id: string;
  isFavorite: boolean;
  name: string;
  phone: string;
}

interface StoredContact {
  email: string;
  id: string;
  isFavorite: boolean;
  name: string;
  phone: string;
}

export class ContactRepository implements ContactRepositoryInterface {
  private contactsCache: Map<string, Contact[]> = new Map();
  private readonly httpClient: HttpClient;
  private readonly STORAGE_KEY_PREFIX = "mini-wallet:contacts";

  constructor() {
    this.httpClient = new HttpClient();
  }

  async add(contact: Contact): Promise<void> {
    const userId = this.getUserId();

    const response = await this.httpClient.post<ContactResponse>(
      "/api/contacts",
      {
        email: contact.getEmail().getValue(),
        id: contact.getId(),
        isFavorite: contact.isFavorite(),
        name: contact.getName(),
        phone: contact.getPhone().getValue(),
        userId,
      }
    );

    const cached = this.contactsCache.get(userId);
    if (cached) {
      this.contactsCache.set(userId, [...cached, contact]);
    }

    const stored = this.getFromStorage();
    stored.push({
      email: response.email,
      id: response.id,
      isFavorite: response.isFavorite,
      name: response.name,
      phone: response.phone,
    });
    this.saveToStorage(stored);
  }

  async findAll(): Promise<Contact[]> {
    const userId = this.getUserId();

    const cached = this.contactsCache.get(userId);
    if (cached) {
      return cached;
    }

    const stored = this.getFromStorage();
    if (stored.length > 0) {
      const contacts = stored.map((item) =>
        Contact.create({
          email: Email.rehydrate(item.email),
          id: item.id,
          isFavorite: item.isFavorite,
          name: item.name,
          phone: Phone.rehydrate(item.phone),
        })
      );
      this.contactsCache.set(userId, contacts);
      return contacts;
    }

    const response = await this.httpClient.get<ContactResponse[]>(
      `/api/contacts?userId=${userId}`
    );

    const contacts = response.map((item) =>
      Contact.create({
        email: Email.rehydrate(item.email),
        id: item.id,
        isFavorite: item.isFavorite,
        name: item.name,
        phone: Phone.rehydrate(item.phone),
      })
    );

    this.contactsCache.set(userId, contacts);

    const storedContacts = response.map((item) => ({
      email: item.email,
      id: item.id,
      isFavorite: item.isFavorite,
      name: item.name,
      phone: item.phone,
    }));
    this.saveToStorage(storedContacts);

    return contacts;
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
    const userId = this.getUserId();
    const cached = this.contactsCache.get(userId);

    if (cached) {
      const found = cached.find((c) => c.getId() === id);
      if (found) return found;
    }

    try {
      const response = await this.httpClient.get<ContactResponse>(
        `/api/contacts/${id}`
      );

      return Contact.create({
        email: Email.rehydrate(response.email),
        id: response.id,
        isFavorite: response.isFavorite,
        name: response.name,
        phone: Phone.rehydrate(response.phone),
      });
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return null;
      }
      throw error;
    }
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

  private getInitialContacts(_userId: string): StoredContact[] {
    return [];
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
