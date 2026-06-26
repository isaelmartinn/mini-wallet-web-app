import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserHeaderCompact } from "./userHeaderCompact";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("UserHeaderCompact", () => {
  describe("Given a loading state", () => {
    describe("When the component is rendered", () => {
      it("Then should display skeleton loaders", () => {
        const { container } = renderWithChakra(
          <UserHeaderCompact isLoading={true} />
        );

        const skeletons = container.querySelectorAll(".chakra-skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Given no fullName is provided", () => {
    describe("When the component is rendered", () => {
      it("Then should display skeleton loaders", () => {
        const { container } = renderWithChakra(<UserHeaderCompact />);

        const skeletons = container.querySelectorAll(".chakra-skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Given a fullName and initials", () => {
    describe("When the component is rendered in the morning", () => {
      it("Then should display 'Buenos días' greeting", () => {
        vi.setSystemTime(new Date("2024-01-01T09:00:00"));

        renderWithChakra(
          <UserHeaderCompact fullName="Juan Pérez" initials="JP" />
        );

        expect(screen.getByText("Buenos días")).toBeInTheDocument();
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
        expect(screen.getByText("JP")).toBeInTheDocument();
      });
    });

    describe("When the component is rendered in the afternoon", () => {
      it("Then should display 'Buenas tardes' greeting", () => {
        vi.setSystemTime(new Date("2024-01-01T15:00:00"));

        renderWithChakra(
          <UserHeaderCompact fullName="Juan Pérez" initials="JP" />
        );

        expect(screen.getByText("Buenas tardes")).toBeInTheDocument();
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      });
    });

    describe("When the component is rendered in the evening", () => {
      it("Then should display 'Buenas noches' greeting", () => {
        vi.setSystemTime(new Date("2024-01-01T20:00:00"));

        renderWithChakra(
          <UserHeaderCompact fullName="Juan Pérez" initials="JP" />
        );

        expect(screen.getByText("Buenas noches")).toBeInTheDocument();
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      });
    });
  });
});
