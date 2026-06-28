import { describe, expect, it } from "vitest";

import { Email, Phone } from "#shared/domain/value-objects";

import { Contact } from "./contact.entity";

describe("Contact", () => {
  describe("Given valid contact parameters", () => {
    describe("When creating a contact with email and phone", () => {
      it("Then should create contact successfully", () => {
        const email = Email.create("test@example.com");
        const phone = Phone.create("+525551234567");

        const contact = Contact.create({
          email,
          id: "contact-1",
          isFavorite: true,
          name: "John Doe",
          phone,
        });

        expect(contact.getId()).toBe("contact-1");
        expect(contact.getName()).toBe("John Doe");
        expect(contact.getEmail().getValue()).toBe("test@example.com");
        expect(contact.getPhone().getValue()).toBe("+525551234567");
        expect(contact.isFavorite()).toBe(true);
      });
    });

    describe("When creating a non-favorite contact", () => {
      it("Then should create contact with isFavorite as false", () => {
        const email = Email.create("another@example.com");
        const phone = Phone.create("+525598765432");

        const contact = Contact.create({
          email,
          id: "contact-2",
          isFavorite: false,
          name: "Jane Smith",
          phone,
        });

        expect(contact.getId()).toBe("contact-2");
        expect(contact.getName()).toBe("Jane Smith");
        expect(contact.getEmail().getValue()).toBe("another@example.com");
        expect(contact.getPhone().getValue()).toBe("+525598765432");
        expect(contact.isFavorite()).toBe(false);
      });
    });
  });
});
