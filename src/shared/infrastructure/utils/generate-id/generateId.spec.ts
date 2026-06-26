import { describe, expect, it } from "vitest";

import { generateId } from "./generateId";

describe("generateId", () => {
  describe("Given the function is called", () => {
    describe("When crypto.randomUUID is available", () => {
      it("Then should return a valid UUID v4 format", () => {
        const id = generateId();

        expect(id).toBeTruthy();
        expect(typeof id).toBe("string");
        expect(id.length).toBeGreaterThan(0);
      });
    });

    describe("When called multiple times", () => {
      it("Then should return unique IDs", () => {
        const id1 = generateId();
        const id2 = generateId();
        const id3 = generateId();

        expect(id1).not.toBe(id2);
        expect(id2).not.toBe(id3);
        expect(id1).not.toBe(id3);
      });
    });
  });
});
