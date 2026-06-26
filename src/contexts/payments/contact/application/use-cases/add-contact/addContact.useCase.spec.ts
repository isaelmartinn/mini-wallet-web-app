import { describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import {
  ContactNameEmptyError,
  DuplicateContactEmailError,
  DuplicateContactNameError,
  DuplicateContactPhoneError,
} from "#payments/contact/domain/errors";
import { ContactRepository } from "#payments/contact/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";

import { AddContactUseCase } from "./addContact.useCase";

describe("AddContactUseCase", () => {
  describe("Given a contact with empty name", () => {
    describe("When executing the use case", () => {
      it("Then should throw ContactNameEmptyError", async () => {
        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn(),
          findById: vi.fn(),
          findByName: vi.fn(),
          findByPhone: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new AddContactUseCase(mockRepository);

        await expect(
          useCase.execute({
            email: "test@example.com",
            isFavorite: false,
            name: "",
            phone: "+525512345678",
          })
        ).rejects.toThrow(ContactNameEmptyError);
      });
    });
  });

  describe("Given a contact with duplicate name", () => {
    describe("When adding contact", () => {
      it("Then should throw DuplicateContactNameError", async () => {
        const existingContact = Contact.create({
          email: Email.create("existing@example.com"),
          id: "existing-id",
          isFavorite: false,
          name: "John Doe",
          phone: Phone.create("+525512345678"),
        });

        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn(),
          findById: vi.fn(),
          findByName: vi.fn().mockResolvedValue(existingContact),
          findByPhone: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new AddContactUseCase(mockRepository);

        await expect(
          useCase.execute({
            email: "different@example.com",
            isFavorite: false,
            name: "John Doe",
            phone: "+525598765432",
          })
        ).rejects.toThrow(DuplicateContactNameError);
      });
    });
  });

  describe("Given a contact with duplicate email", () => {
    describe("When adding contact", () => {
      it("Then should throw DuplicateContactEmailError", async () => {
        const existingContact = Contact.create({
          email: Email.create("test@example.com"),
          id: "existing-id",
          isFavorite: false,
          name: "Jane Smith",
          phone: Phone.create("+525512345678"),
        });

        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn().mockResolvedValue(existingContact),
          findById: vi.fn(),
          findByName: vi.fn().mockResolvedValue(null),
          findByPhone: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new AddContactUseCase(mockRepository);

        await expect(
          useCase.execute({
            email: "test@example.com",
            isFavorite: false,
            name: "John Doe",
            phone: "+525598765432",
          })
        ).rejects.toThrow(DuplicateContactEmailError);
      });
    });
  });

  describe("Given a contact with duplicate phone", () => {
    describe("When adding contact", () => {
      it("Then should throw DuplicateContactPhoneError", async () => {
        const existingContact = Contact.create({
          email: Email.create("existing@example.com"),
          id: "existing-id",
          isFavorite: false,
          name: "Jane Smith",
          phone: Phone.create("+525512345678"),
        });

        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn().mockResolvedValue(null),
          findById: vi.fn(),
          findByName: vi.fn().mockResolvedValue(null),
          findByPhone: vi.fn().mockResolvedValue(existingContact),
          findFavorites: vi.fn(),
        };

        const useCase = new AddContactUseCase(mockRepository);

        await expect(
          useCase.execute({
            email: "different@example.com",
            isFavorite: false,
            name: "John Doe",
            phone: "+525512345678",
          })
        ).rejects.toThrow(DuplicateContactPhoneError);
      });
    });
  });

  describe("Given a contact with invalid email", () => {
    describe("When email format is invalid", () => {
      it("Then should throw EmailInvalidFormatError", async () => {
        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn(),
          findById: vi.fn(),
          findByName: vi.fn().mockResolvedValue(null),
          findByPhone: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new AddContactUseCase(mockRepository);

        await expect(
          useCase.execute({
            email: "invalid-email",
            isFavorite: false,
            name: "John Doe",
            phone: "+525512345678",
          })
        ).rejects.toThrow();
      });
    });
  });

  describe("Given valid contact data with no duplicates", () => {
    describe("When executing the use case", () => {
      it("Then should create and save contact successfully", async () => {
        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn().mockResolvedValue(null),
          findById: vi.fn(),
          findByName: vi.fn().mockResolvedValue(null),
          findByPhone: vi.fn().mockResolvedValue(null),
          findFavorites: vi.fn(),
        };

        const useCase = new AddContactUseCase(mockRepository);

        const result = await useCase.execute({
          email: "test@example.com",
          isFavorite: true,
          name: "John Doe",
          phone: "+525512345678",
        });

        expect(result).toBeInstanceOf(Contact);
        expect(result.getName()).toBe("John Doe");
        expect(result.getEmail().getValue()).toBe("test@example.com");
        expect(result.getPhone().getValue()).toBe("+525512345678");
        expect(result.isFavorite()).toBe(true);
        expect(mockRepository.add).toHaveBeenCalledWith(result);
        expect(mockRepository.findByName).toHaveBeenCalledWith("John Doe");
        expect(mockRepository.findByEmail).toHaveBeenCalled();
        expect(mockRepository.findByPhone).toHaveBeenCalled();
      });
    });
  });
});
