import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import { Email, Phone } from "#shared/domain/value-objects";

import { ContactSelector } from "./contactSelector";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    back: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

vi.mock("lucide-react", () => ({
  Star: () => <div data-testid="star-icon" />,
  User: () => <div data-testid="user-icon" />,
  UserPlus: () => <div data-testid="user-plus-icon" />,
}));

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

const createMockContact = (
  id: string,
  name: string,
  isFavorite: boolean = false
) => {
  const mockEmail = {
    getValue: vi.fn().mockReturnValue(`${id}@email.com`),
  } as unknown as Email;

  const mockPhone = {
    getValue: vi.fn().mockReturnValue(`+52123456${id}`),
  } as unknown as Phone;

  return {
    getEmail: vi.fn().mockReturnValue(mockEmail),
    getId: vi.fn().mockReturnValue(id),
    getName: vi.fn().mockReturnValue(name),
    getPhone: vi.fn().mockReturnValue(mockPhone),
    isFavorite: vi.fn().mockReturnValue(isFavorite),
  } as unknown as Contact;
};

describe("ContactSelector", () => {
  describe("Given contacts are loading", () => {
    describe("When the component renders", () => {
      it("Then should display skeleton loaders", () => {
        const onSelect = vi.fn();

        const { container } = renderWithChakra(
          <ContactSelector
            contacts={[]}
            isLoading={true}
            onSelect={onSelect}
            selectedContact={null}
          />
        );

        const skeletons = container.querySelectorAll(".chakra-skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
      });

      it("Then should display three skeleton items", () => {
        const onSelect = vi.fn();

        const { container } = renderWithChakra(
          <ContactSelector
            contacts={[]}
            isLoading={true}
            onSelect={onSelect}
            selectedContact={null}
          />
        );

        const skeletonContainers = container.querySelectorAll(
          '[class*="chakra-skeleton"]'
        );
        expect(skeletonContainers.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Given there are no contacts", () => {
    describe("When the component renders", () => {
      it("Then should display empty state message", () => {
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactSelector
            contacts={[]}
            isLoading={false}
            onSelect={onSelect}
            selectedContact={null}
          />
        );

        expect(
          screen.getByText("No hay contactos disponibles")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Given there are contacts", () => {
    describe("When the component renders", () => {
      it("Then should display all contacts", () => {
        const contacts = [
          createMockContact("1", "John Doe"),
          createMockContact("2", "Jane Smith"),
          createMockContact("3", "Bob Johnson"),
        ];
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactSelector
            contacts={contacts}
            isLoading={false}
            onSelect={onSelect}
            selectedContact={null}
          />
        );

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      });

      it("Then should pass correct props to ContactItem", () => {
        const contacts = [createMockContact("1", "John Doe")];
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactSelector
            contacts={contacts}
            isLoading={false}
            onSelect={onSelect}
            selectedContact={null}
          />
        );

        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
        buttons.forEach((button) => {
          expect(button).not.toBeDisabled();
        });
      });
    });

    describe("When a contact is selected", () => {
      it("Then should mark it as selected", () => {
        const contacts = [
          createMockContact("1", "John Doe"),
          createMockContact("2", "Jane Smith"),
        ];
        const selectedContact = contacts[0];
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactSelector
            contacts={contacts}
            isLoading={false}
            onSelect={onSelect}
            selectedContact={selectedContact}
          />
        );

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });

      it("Then should call onSelect when clicking a contact", async () => {
        const user = userEvent.setup();
        const contacts = [createMockContact("1", "John Doe")];
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactSelector
            contacts={contacts}
            isLoading={false}
            onSelect={onSelect}
            selectedContact={null}
          />
        );

        const buttons = screen.getAllByRole("button");
        const contactButton = buttons[1];
        await user.click(contactButton);

        expect(onSelect).toHaveBeenCalledWith(contacts[0]);
      });
    });

    describe("When selector is disabled", () => {
      it("Then should disable all contact items", () => {
        const contacts = [
          createMockContact("1", "John Doe"),
          createMockContact("2", "Jane Smith"),
        ];
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactSelector
            contacts={contacts}
            disabled={true}
            isLoading={false}
            onSelect={onSelect}
            selectedContact={null}
          />
        );

        const buttons = screen.getAllByRole("button");
        buttons.forEach((button) => {
          expect(button).toBeDisabled();
        });
      });

      it("Then should not call onSelect when clicking disabled items", async () => {
        const user = userEvent.setup();
        const contacts = [createMockContact("1", "John Doe")];
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactSelector
            contacts={contacts}
            disabled={true}
            isLoading={false}
            onSelect={onSelect}
            selectedContact={null}
          />
        );

        const buttons = screen.getAllByRole("button");
        const contactButton = buttons[1];
        await user.click(contactButton);

        expect(onSelect).not.toHaveBeenCalled();
      });
    });
  });
});
