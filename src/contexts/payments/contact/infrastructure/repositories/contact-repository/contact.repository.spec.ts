import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import { Email, Phone } from "#shared/domain/value-objects";

import { ContactRepository } from "./contact.repository";

describe("ContactRepository", () => {
  let repository: ContactRepository;
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    localStorageMock = {};

    vi.stubGlobal("localStorage", {
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      key: vi.fn(),
      length: 0,
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
    } as Storage);

    repository = new ContactRepository();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe("Given an empty localStorage", () => {
    describe("When calling findAll", () => {
      it("Then should initialize with mock contacts", async () => {
        const contacts = await repository.findAll();

        expect(contacts.length).toBeGreaterThan(0);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "mini-wallet:contacts",
          expect.any(String)
        );
      });
    });
  });

  describe("Given a contact to add", () => {
    describe("When calling add", () => {
      it("Then should save contact to localStorage", async () => {
        const contact = Contact.create({
          email: Email.create("new@example.com"),
          id: "new-contact",
          isFavorite: false,
          name: "New Contact",
          phone: Phone.create("+525512345678"),
        });

        await repository.add(contact);

        expect(localStorage.setItem).toHaveBeenCalled();
        const stored = JSON.parse(localStorageMock["mini-wallet:contacts"]);
        const addedContact = stored.find(
          (c: { id: string }) => c.id === "new-contact"
        );
        expect(addedContact).toBeDefined();
        expect(addedContact.name).toBe("New Contact");
        expect(addedContact.email).toBe("new@example.com");
      });
    });
  });

  describe("Given contacts in localStorage", () => {
    describe("When calling findById with existing id", () => {
      it("Then should return the contact", async () => {
        const contact = Contact.create({
          email: Email.create("test@example.com"),
          id: "test-id",
          isFavorite: false,
          name: "Test User",
          phone: Phone.create("+525512345678"),
        });
        await repository.add(contact);

        const found = await repository.findById("test-id");

        expect(found).not.toBeNull();
        expect(found?.getId()).toBe("test-id");
        expect(found?.getName()).toBe("Test User");
      });
    });

    describe("When calling findById with non-existing id", () => {
      it("Then should return null", async () => {
        const found = await repository.findById("non-existing");

        expect(found).toBeNull();
      });
    });
  });

  describe("Given contacts with favorites", () => {
    describe("When calling findFavorites", () => {
      it("Then should return only favorite contacts", async () => {
        const favorite = Contact.create({
          email: Email.create("fav@example.com"),
          id: "fav-1",
          isFavorite: true,
          name: "Favorite",
          phone: Phone.create("+525512345678"),
        });
        const regular = Contact.create({
          email: Email.create("reg@example.com"),
          id: "reg-1",
          isFavorite: false,
          name: "Regular",
          phone: Phone.create("+525587654321"),
        });

        await repository.add(favorite);
        await repository.add(regular);

        const favorites = await repository.findFavorites();

        const favoriteIds = favorites.map((c) => c.getId());
        expect(favoriteIds).toContain("fav-1");
        expect(favoriteIds).not.toContain("reg-1");
        expect(favorites.every((c) => c.isFavorite())).toBe(true);
      });
    });
  });

  describe("Given contacts in localStorage", () => {
    describe("When calling findByName with existing name", () => {
      it("Then should return the contact", async () => {
        const contact = Contact.create({
          email: Email.create("john@example.com"),
          id: "john-id",
          isFavorite: false,
          name: "John Doe",
          phone: Phone.create("+525512345678"),
        });
        await repository.add(contact);

        const found = await repository.findByName("John Doe");

        expect(found).not.toBeNull();
        expect(found?.getName()).toBe("John Doe");
        expect(found?.getId()).toBe("john-id");
      });
    });

    describe("When calling findByName with case-insensitive match", () => {
      it("Then should return the contact", async () => {
        const contact = Contact.create({
          email: Email.create("jane@example.com"),
          id: "jane-id",
          isFavorite: false,
          name: "Jane Smith",
          phone: Phone.create("+525512345678"),
        });
        await repository.add(contact);

        const found = await repository.findByName("jane smith");

        expect(found).not.toBeNull();
        expect(found?.getName()).toBe("Jane Smith");
      });
    });

    describe("When calling findByName with non-existing name", () => {
      it("Then should return null", async () => {
        const found = await repository.findByName("Non Existing");

        expect(found).toBeNull();
      });
    });
  });

  describe("Given contacts in localStorage", () => {
    describe("When calling findByEmail with existing email", () => {
      it("Then should return the contact", async () => {
        const contact = Contact.create({
          email: Email.create("test@example.com"),
          id: "email-test-id",
          isFavorite: false,
          name: "Email Test",
          phone: Phone.create("+525512345678"),
        });
        await repository.add(contact);

        const email = Email.create("test@example.com");
        const found = await repository.findByEmail(email);

        expect(found).not.toBeNull();
        expect(found?.getEmail().getValue()).toBe("test@example.com");
        expect(found?.getId()).toBe("email-test-id");
      });
    });

    describe("When calling findByEmail with case-insensitive match", () => {
      it("Then should return the contact", async () => {
        const contact = Contact.create({
          email: Email.create("Test@Example.com"),
          id: "case-test-id",
          isFavorite: false,
          name: "Case Test",
          phone: Phone.create("+525512345678"),
        });
        await repository.add(contact);

        const email = Email.create("test@example.com");
        const found = await repository.findByEmail(email);

        expect(found).not.toBeNull();
        expect(found?.getEmail().getValue()).toBe("test@example.com");
      });
    });

    describe("When calling findByEmail with non-existing email", () => {
      it("Then should return null", async () => {
        const email = Email.create("nonexisting@example.com");
        const found = await repository.findByEmail(email);

        expect(found).toBeNull();
      });
    });
  });

  describe("Given contacts in localStorage", () => {
    describe("When calling findByPhone with existing phone", () => {
      it("Then should return the contact", async () => {
        const contact = Contact.create({
          email: Email.create("phone@example.com"),
          id: "phone-test-id",
          isFavorite: false,
          name: "Phone Test",
          phone: Phone.create("+529876543210"),
        });
        await repository.add(contact);

        const phone = Phone.create("+529876543210");
        const found = await repository.findByPhone(phone);

        expect(found).not.toBeNull();
        expect(found?.getPhone().getValue()).toBe("+529876543210");
        expect(found?.getId()).toBe("phone-test-id");
      });
    });

    describe("When calling findByPhone with non-existing phone", () => {
      it("Then should return null", async () => {
        const phone = Phone.create("+529999999999");
        const found = await repository.findByPhone(phone);

        expect(found).toBeNull();
      });
    });
  });

  describe("Given localStorage throws an error", () => {
    describe("When calling findAll", () => {
      it("Then should return initial contacts without crashing", async () => {
        vi.spyOn(localStorage, "getItem").mockImplementation(() => {
          throw new Error("localStorage error");
        });

        const contacts = await repository.findAll();

        expect(contacts.length).toBeGreaterThan(0);
      });
    });
  });
});
