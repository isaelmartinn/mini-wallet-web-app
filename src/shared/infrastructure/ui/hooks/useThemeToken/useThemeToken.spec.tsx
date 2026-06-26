import { describe, expect, it, vi } from "vitest";

import { useThemeToken } from "./useThemeToken";

vi.mock("@chakra-ui/react", () => ({
  useToken: vi.fn((category: string, paths: string[]) => {
    const mockTokens: Record<string, Record<string, string>> = {
      colors: {
        "blue.500": "#3182ce",
        "brand.600": "#2c5282",
      },
      spacing: {
        "4": "1rem",
      },
    };
    return paths.map((path) => mockTokens[category]?.[path] || "");
  }),
}));

describe("useThemeToken", () => {
  describe("Given a Chakra UI theme", () => {
    describe("When accessing a color token", () => {
      it("Then should return the resolved color value", () => {
        const result = useThemeToken("colors", "blue.500");

        expect(result).toBeDefined();
        expect(typeof result).toBe("string");
        expect(result).toBe("#3182ce");
      });
    });

    describe("When accessing a spacing token", () => {
      it("Then should return the resolved spacing value", () => {
        const result = useThemeToken("spacing", "4");

        expect(result).toBeDefined();
        expect(typeof result).toBe("string");
        expect(result).toBe("1rem");
      });
    });
  });
});
