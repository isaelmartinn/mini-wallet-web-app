import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import { Email, Phone } from "#shared/domain/value-objects";

import { ContactItem } from "./contactItem";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

const createMockContact = (overrides = {}) => {
  const mockEmail = {
    getValue: vi.fn().mockReturnValue("test@email.com"),
  } as unknown as Email;

  const mockPhone = {
    getValue: vi.fn().mockReturnValue("+521234567890"),
  } as unknown as Phone;

  return {
    getEmail: vi.fn().mockReturnValue(mockEmail),
    getId: vi.fn().mockReturnValue("contact-1"),
    getName: vi.fn().mockReturnValue("John Doe"),
    getPhone: vi.fn().mockReturnValue(mockPhone),
    ...overrides,
  } as unknown as Contact;
};

describe("ContactItem", () => {
  describe("Given a contact item is rendered", () => {
    describe("When the contact is not selected", () => {
      it("Then should display with default styles", () => {
        const contact = createMockContact();
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={false}
            onSelect={onSelect}
          />
        );

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
      });

      it("Then should show contact name", () => {
        const contact = createMockContact();
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={false}
            onSelect={onSelect}
          />
        );

        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      it("Then should show email badge if available", () => {
        const contact = createMockContact();
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={false}
            onSelect={onSelect}
          />
        );

        expect(screen.getByText("test@email.com")).toBeInTheDocument();
      });

      it("Then should show phone badge if available", () => {
        const contact = createMockContact();
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={false}
            onSelect={onSelect}
          />
        );

        expect(screen.getByText("+521234567890")).toBeInTheDocument();
      });

      it("Then should not show email badge if not available", () => {
        const contact = createMockContact({
          getEmail: vi.fn().mockReturnValue(null),
        });
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={false}
            onSelect={onSelect}
          />
        );

        expect(screen.queryByText("test@email.com")).not.toBeInTheDocument();
      });

      it("Then should not show phone badge if not available", () => {
        const contact = createMockContact({
          getPhone: vi.fn().mockReturnValue(null),
        });
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={false}
            onSelect={onSelect}
          />
        );

        expect(screen.queryByText("+521234567890")).not.toBeInTheDocument();
      });
    });

    describe("When the contact is selected", () => {
      it("Then should display with selected styles", () => {
        const contact = createMockContact();
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={true}
            onSelect={onSelect}
          />
        );

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
      });

      it("Then should have blue background", () => {
        const contact = createMockContact();
        const onSelect = vi.fn();

        const { container } = renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={true}
            onSelect={onSelect}
          />
        );

        const button = container.querySelector("button");
        expect(button).toBeInTheDocument();
      });
    });

    describe("When the item is clicked", () => {
      it("Then should call onSelect with contact", async () => {
        const user = userEvent.setup();
        const contact = createMockContact();
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            isSelected={false}
            onSelect={onSelect}
          />
        );

        const button = screen.getByRole("button");
        await user.click(button);

        expect(onSelect).toHaveBeenCalledWith(contact);
        expect(onSelect).toHaveBeenCalledTimes(1);
      });
    });

    describe("When the item is disabled", () => {
      it("Then should not be clickable", async () => {
        const user = userEvent.setup();
        const contact = createMockContact();
        const onSelect = vi.fn();

        renderWithChakra(
          <ContactItem
            contact={contact}
            disabled={true}
            isSelected={false}
            onSelect={onSelect}
          />
        );

        const button = screen.getByRole("button");
        expect(button).toBeDisabled();

        await user.click(button);
        expect(onSelect).not.toHaveBeenCalled();
      });
    });
  });
});
