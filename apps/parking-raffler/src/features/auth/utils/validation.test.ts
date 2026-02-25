import { describe, expect, it } from "vitest";

import { registerSchema } from "./validation";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VALID = {
  buildingId: "b1",
  email: "test@unosquare.com",
  firstName: "Jane",
  lastName: "Doe",
  password: "secret12",
  phone: "1234567890",
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("registerSchema", () => {
  it("accepts a fully valid object", () => {
    expect(registerSchema.safeParse(VALID).success).toBe(true);
  });

  describe("firstName", () => {
    it("rejects empty string", () => {
      const r = registerSchema.safeParse({ ...VALID, firstName: "" });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.firstName?.[0],
      ).toBe("This field is required.");
    });
  });

  describe("lastName", () => {
    it("rejects empty string", () => {
      const r = registerSchema.safeParse({ ...VALID, lastName: "" });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.lastName?.[0],
      ).toBe("This field is required.");
    });
  });

  describe("buildingId", () => {
    it("rejects empty string", () => {
      const r = registerSchema.safeParse({ ...VALID, buildingId: "" });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.buildingId?.[0],
      ).toBe("This field is required.");
    });
  });

  describe("email", () => {
    it("rejects empty string", () => {
      const r = registerSchema.safeParse({ ...VALID, email: "" });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.email?.[0],
      ).toBe("This field is required.");
    });

    it("rejects non-unosquare domain", () => {
      const r = registerSchema.safeParse({
        ...VALID,
        email: "test@gmail.com",
      });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.email?.[0],
      ).toBe("Only @unosquare.com email addresses are accepted.");
    });

    it("accepts valid @unosquare.com address", () => {
      expect(registerSchema.safeParse(VALID).success).toBe(true);
    });
  });

  describe("password", () => {
    it("rejects empty string", () => {
      const r = registerSchema.safeParse({ ...VALID, password: "" });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.password?.[0],
      ).toBe("This field is required.");
    });

    it("rejects password shorter than 8 characters", () => {
      const r = registerSchema.safeParse({
        ...VALID,
        password: "short1",
      });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.password?.[0],
      ).toBe("Password must be at least 8 characters.");
    });

    it("accepts password of exactly 8 characters", () => {
      const r = registerSchema.safeParse({
        ...VALID,
        password: "exactly8",
      });

      expect(r.success).toBe(true);
    });
  });

  describe("phone", () => {
    it("rejects empty string", () => {
      const r = registerSchema.safeParse({ ...VALID, phone: "" });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.phone?.[0],
      ).toBe("This field is required.");
    });

    it("rejects fewer than 10 digits", () => {
      const r = registerSchema.safeParse({
        ...VALID,
        phone: "123456789",
      });

      expect(r.success).toBe(false);
      expect(
        r.error?.flatten().fieldErrors.phone?.[0],
      ).toBe("Phone number must be exactly 10 digits.");
    });

    it("rejects more than 10 digits", () => {
      const r = registerSchema.safeParse({
        ...VALID,
        phone: "12345678901",
      });

      expect(r.success).toBe(false);
    });

    it("rejects 10 chars that are not all digits", () => {
      const r = registerSchema.safeParse({
        ...VALID,
        phone: "123456789a",
      });

      expect(r.success).toBe(false);
    });

    it("accepts exactly 10 numeric digits", () => {
      expect(registerSchema.safeParse(VALID).success).toBe(true);
    });
  });
});
