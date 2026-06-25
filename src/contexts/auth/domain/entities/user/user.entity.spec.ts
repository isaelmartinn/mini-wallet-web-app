import { describe, expect, it } from "vitest";

import { Email, Phone } from "#auth/domain/value-objects";

import { User } from "./user.entity";

describe("User Entity", () => {
  describe("Given valid user data with all fields", () => {
    describe("When creating a User instance", () => {
      it("Then should create successfully with all properties", () => {
        const email = Email.create("test@example.com");
        const phone = Phone.create("+525512345678");

        const user = User.create({
          email,
          id: "user-123",
          name: "John Doe",
          phone,
        });

        expect(user).toBeInstanceOf(User);
        expect(user.getId()).toBe("user-123");
        expect(user.getName()).toBe("John Doe");
        expect(user.getEmail()).toBe(email);
        expect(user.getPhone()).toBe(phone);
      });
    });
  });

  describe("Given valid user data with only required fields", () => {
    describe("When creating a User instance", () => {
      it("Then should create successfully with null optional fields", () => {
        const user = User.create({
          id: "user-456",
          name: "Jane Smith",
        });

        expect(user).toBeInstanceOf(User);
        expect(user.getId()).toBe("user-456");
        expect(user.getName()).toBe("Jane Smith");
        expect(user.getEmail()).toBeNull();
        expect(user.getPhone()).toBeNull();
      });
    });
  });

  describe("Given valid user data with only email", () => {
    describe("When creating a User instance", () => {
      it("Then should create successfully with email and null phone", () => {
        const email = Email.create("jane@example.com");

        const user = User.create({
          email,
          id: "user-789",
          name: "Jane Doe",
        });

        expect(user.getId()).toBe("user-789");
        expect(user.getName()).toBe("Jane Doe");
        expect(user.getEmail()).toBe(email);
        expect(user.getPhone()).toBeNull();
      });
    });
  });

  describe("Given valid user data with only phone", () => {
    describe("When creating a User instance", () => {
      it("Then should create successfully with phone and null email", () => {
        const phone = Phone.create("+525587654321");

        const user = User.create({
          id: "user-101",
          name: "Bob Smith",
          phone,
        });

        expect(user.getId()).toBe("user-101");
        expect(user.getName()).toBe("Bob Smith");
        expect(user.getEmail()).toBeNull();
        expect(user.getPhone()).toBe(phone);
      });
    });
  });

  describe("Given a User instance", () => {
    describe("When accessing user properties", () => {
      it("Then should return correct id", () => {
        const user = User.create({
          id: "user-202",
          name: "Test User",
        });

        expect(user.getId()).toBe("user-202");
      });

      it("Then should return correct name", () => {
        const user = User.create({
          id: "user-303",
          name: "Another User",
        });

        expect(user.getName()).toBe("Another User");
      });

      it("Then should return correct email when provided", () => {
        const email = Email.create("user@test.com");
        const user = User.create({
          email,
          id: "user-404",
          name: "Email User",
        });

        expect(user.getEmail()).toBe(email);
        expect(user.getEmail()?.getValue()).toBe("user@test.com");
      });

      it("Then should return correct phone when provided", () => {
        const phone = Phone.create("+525511223344");
        const user = User.create({
          id: "user-505",
          name: "Phone User",
          phone,
        });

        expect(user.getPhone()).toBe(phone);
        expect(user.getPhone()?.getValue()).toBe("+525511223344");
      });
    });
  });
});
