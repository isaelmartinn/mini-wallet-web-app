import { describe, expect, it } from "vitest";

import { UserProfile } from "./user-profile.entity";

describe("UserProfile", () => {
  describe("Given valid user data", () => {
    describe("When creating a UserProfile", () => {
      it("Then should create successfully", () => {
        const profile = UserProfile.create({
          fullName: "Juan Pérez García",
          userId: "user-1",
        });

        expect(profile.getUserId()).toBe("user-1");
        expect(profile.getFullName()).toBe("Juan Pérez García");
      });
    });
  });

  describe("Given a full name with two words", () => {
    describe("When getting initials", () => {
      it("Then should return first and last initials", () => {
        const profile = UserProfile.create({
          fullName: "Juan Pérez",
          userId: "user-1",
        });

        expect(profile.getInitials()).toBe("JP");
      });
    });
  });

  describe("Given a full name with three words", () => {
    describe("When getting initials", () => {
      it("Then should return first and last initials", () => {
        const profile = UserProfile.create({
          fullName: "Juan Carlos Pérez",
          userId: "user-1",
        });

        expect(profile.getInitials()).toBe("JP");
      });
    });
  });

  describe("Given a full name with one word", () => {
    describe("When getting initials", () => {
      it("Then should return only first initial", () => {
        const profile = UserProfile.create({
          fullName: "Juan",
          userId: "user-1",
        });

        expect(profile.getInitials()).toBe("J");
      });
    });
  });

  describe("Given an empty name", () => {
    describe("When getting initials", () => {
      it("Then should return empty string", () => {
        const profile = UserProfile.create({
          fullName: "",
          userId: "user-1",
        });

        expect(profile.getInitials()).toBe("");
      });
    });
  });

  describe("Given a name with extra spaces", () => {
    describe("When getting initials", () => {
      it("Then should handle extra spaces correctly", () => {
        const profile = UserProfile.create({
          fullName: "  Juan   Pérez  ",
          userId: "user-1",
        });

        expect(profile.getInitials()).toBe("JP");
      });
    });
  });
});
