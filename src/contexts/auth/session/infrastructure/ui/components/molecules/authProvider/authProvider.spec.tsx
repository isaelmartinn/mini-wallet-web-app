import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "./authProvider";

describe("AuthProvider", () => {
  describe("Given children components", () => {
    describe("When the provider is rendered", () => {
      it("Then should render children without errors", () => {
        render(
          <AuthProvider>
            <div>Test Child Content</div>
          </AuthProvider>
        );

        expect(screen.getByText("Test Child Content")).toBeInTheDocument();
      });
    });
  });
});
