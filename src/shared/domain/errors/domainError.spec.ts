import { describe, it, expect } from "vitest";
import { DomainError } from "./domainError";

class TestError extends DomainError {
  constructor() {
    super("Test error message", "TEST_ERROR");
  }
}

describe("DomainError", () => {
  describe("Given a domain error class", () => {
    describe("When instantiating the error", () => {
      it("Then should create error with message and code", () => {
        const error = new TestError();

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toBe("Test error message");
        expect(error.code).toBe("TEST_ERROR");
        expect(error.name).toBe("TestError");
      });
    });
  });
});
