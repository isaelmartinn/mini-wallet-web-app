import { describe, expect, it, vi } from "vitest";

import { Contact } from "#transactions/domain/entities";
import { ContactNameEmptyError } from "#transactions/domain/errors";
import { ContactRepository } from "#transactions/domain/repositories";

import { AddContactUseCase } from "./addContact.useCase";

describe("AddContactUseCase", () => {
  describe("Given a contact with empty name", () => {
    describe("When executing the use case", () => {
      it("Then should throw ContactNameEmptyError", async () => {
        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findById: vi.fn(),
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

  describe("Given a contact with invalid email", () => {
    describe("When email format is invalid", () => {
      it("Then should throw EmailInvalidFormatError", async () => {
        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findById: vi.fn(),
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

  describe("Given valid contact data", () => {
    describe("When executing the use case", () => {
      it("Then should create and save contact successfully", async () => {
        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findById: vi.fn(),
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
      });
    });
  });
});
