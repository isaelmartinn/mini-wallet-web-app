import { describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import { ContactRepository } from "#payments/contact/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";

import { GetContactsUseCase } from "./getContacts.useCase";

describe("GetContactsUseCase", () => {
  describe("Given a contact repository with contacts", () => {
    describe("When executing the use case", () => {
      it("Then should return all contacts", async () => {
        const mockContact = Contact.create({
          email: Email.create("test@example.com"),
          id: "contact-1",
          isFavorite: false,
          name: "Test User",
          phone: Phone.create("+525512345678"),
        });

        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn().mockResolvedValue([mockContact]),
          findById: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new GetContactsUseCase(mockRepository);

        const result = await useCase.execute();

        expect(result).toHaveLength(1);
        expect(result[0].getId()).toBe("contact-1");
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given an empty contact repository", () => {
    describe("When executing the use case", () => {
      it("Then should return an empty array", async () => {
        const mockRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn().mockResolvedValue([]),
          findById: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new GetContactsUseCase(mockRepository);

        const result = await useCase.execute();

        expect(result).toHaveLength(0);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      });
    });
  });
});
