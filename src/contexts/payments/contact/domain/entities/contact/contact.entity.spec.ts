import { describe, expect, it } from "vitest";

import { Contact } from "./contact.entity";

describe("Contact", () => {
  describe("Given valid contact parameters", () => {
    describe("When creating a contact with email and phone", () => {
      it("Then should create contact successfully", () => {
        const contact = Contact.create({
          email: "test@example.com",
          id: "contact-1",
          isFavorite: true,
          name: "John Doe",
          phone: "+5215512345678",
        });

        expect(contact.getId()).toBe("contact-1");
        expect(contact.getName()).toBe("John Doe");
        expect(contact.getEmail()).toBe("test@example.com");
        expect(contact.getPhone()).toBe("+5215512345678");
        expect(contact.isFavorite()).toBe(true);
      });
    });

    describe("When creating a contact with only email", () => {
      it("Then should create contact with null phone", () => {
        const contact = Contact.create({
          email: "test@example.com",
          id: "contact-1",
          isFavorite: false,
          name: "John Doe",
          phone: null,
        });

        expect(contact.getEmail()).toBe("test@example.com");
        expect(contact.getPhone()).toBeNull();
      });
    });

    describe("When creating a contact with only phone", () => {
      it("Then should create contact with null email", () => {
        const contact = Contact.create({
          email: null,
          id: "contact-1",
          isFavorite: false,
          name: "John Doe",
          phone: "+5215512345678",
        });

        expect(contact.getEmail()).toBeNull();
        expect(contact.getPhone()).toBe("+5215512345678");
      });
    });
  });
});
