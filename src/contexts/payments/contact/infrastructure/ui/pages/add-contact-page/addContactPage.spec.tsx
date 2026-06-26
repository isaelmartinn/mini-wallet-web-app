import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ContactRepository } from "#payments/contact/infrastructure/repositories";

import { AddContactPage } from "./addContactPage";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("AddContactPage", () => {
  const mockRouter = {
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  };

  const mockRepository: ContactRepository = {
    add: vi.fn().mockResolvedValue(undefined),
    findAll: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockResolvedValue(null),
    findFavorites: vi.fn().mockResolvedValue([]),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter);
  });

  describe("Given the add contact page is rendered", () => {
    describe("When the page loads", () => {
      it("Then should display the form with all fields", () => {
        render(<AddContactPage contactRepository={mockRepository} />);

        expect(screen.getByText("Agregar Contacto")).toBeInTheDocument();
        expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Teléfono")).toBeInTheDocument();
        expect(screen.getByText("Marcar como favorito")).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /guardar contacto/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe("Given valid contact data", () => {
    describe("When submitting the form", () => {
      it("Then should create contact and redirect", async () => {
        const user = userEvent.setup();
        render(<AddContactPage contactRepository={mockRepository} />);

        await user.type(screen.getByLabelText("Nombre"), "Test User");
        await user.type(screen.getByLabelText("Email"), "test@example.com");
        await user.type(screen.getByLabelText("Teléfono"), "+525512345678");
        await user.click(
          screen.getByRole("button", { name: /guardar contacto/i })
        );

        await waitFor(() => {
          expect(mockRepository.add).toHaveBeenCalled();
          expect(mockRouter.push).toHaveBeenCalledWith(
            expect.stringContaining("/transactions/new?contactId=")
          );
        });
      });
    });
  });

  describe("Given invalid email", () => {
    describe("When submitting the form", () => {
      it("Then should show validation error", async () => {
        const user = userEvent.setup();
        render(<AddContactPage contactRepository={mockRepository} />);

        await user.type(screen.getByLabelText("Nombre"), "Test User");
        await user.type(screen.getByLabelText("Email"), "invalid-email");
        await user.type(screen.getByLabelText("Teléfono"), "+525512345678");
        await user.click(
          screen.getByRole("button", { name: /guardar contacto/i })
        );

        await waitFor(() => {
          expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
          expect(mockRepository.add).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("Given the back button is clicked", () => {
    describe("When clicking back", () => {
      it("Then should navigate back", async () => {
        const user = userEvent.setup();
        render(<AddContactPage contactRepository={mockRepository} />);

        const backButton = screen
          .getByRole("button", { name: "" })
          .closest("button");
        if (backButton) await user.click(backButton);

        expect(mockRouter.back).toHaveBeenCalled();
      });
    });
  });
});
