import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTokenExpiration } from "@/lib/auth/tokens";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getAdminUser } from "@/lib/admin";
import { withAdminAuth } from "@/lib/auth/with-admin-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================================
// Mock de next-auth pour getAdminUser.
// ============================================================
vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/lib/auth/auth";

const mockAuth = vi.mocked(auth);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getTokenExpiration", () => {
  it("should return a date 30 minutes in the future by default", () => {
    const before = Date.now();
    const result = getTokenExpiration();
    const after = Date.now();

    expect(result.getTime()).toBeGreaterThanOrEqual(before + 30 * 60 * 1000);
    expect(result.getTime()).toBeLessThanOrEqual(after + 30 * 60 * 1000);
  });

  it("should respect a custom duration in minutes", () => {
    const before = Date.now();
    const result = getTokenExpiration(60);
    const after = Date.now();

    expect(result.getTime()).toBeGreaterThanOrEqual(before + 60 * 60 * 1000);
    expect(result.getTime()).toBeLessThanOrEqual(after + 60 * 60 * 1000);
  });
});

describe("password", () => {
  it("should hash a password and verify it correctly", async () => {
    const hash = await hashPassword("monMotDePasse123");
    const isValid = await verifyPassword(hash, "monMotDePasse123");

    expect(isValid).toBe(true);
  });

  it("should reject a wrong password", async () => {
    const hash = await hashPassword("monMotDePasse123");
    const isValid = await verifyPassword(hash, "mauvaisMotDePasse");

    expect(isValid).toBe(false);
  });

  it("should return false on an invalid hash without throwing", async () => {
    const isValid = await verifyPassword("hash-invalide", "password");

    expect(isValid).toBe(false);
  });
});

describe("getAdminUser", () => {
  it("should return null when there is no session", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await getAdminUser();

    expect(result).toBeNull();
  });

  it("should return the admin user object when session exists", async () => {
    mockAuth.mockResolvedValue({
      user: {
        id: "admin-123",
        name: "Océane",
        email: "oceane@example.com",
      },
      expires: "2099-01-01",
    });

    const result = await getAdminUser();

    expect(result).toEqual({
      id: "admin-123",
      username: "Océane",
      email: "oceane@example.com",
      role: "admin",
    });
  });
});

describe("withAdminAuth", () => {
  const fakeRequest = {} as NextRequest;

  it("should return 401 when there is no session", async () => {
    mockAuth.mockResolvedValue(null);
    const handler = vi.fn();

    const response = await withAdminAuth(handler)(fakeRequest);

    expect(response.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });

  it("should delegate to the handler when a valid session exists", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "admin-123", name: "Océane" },
      expires: "2099-01-01",
    });
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }));

    const response = await withAdminAuth(handler)(fakeRequest);

    expect(handler).toHaveBeenCalledWith(fakeRequest);
    expect(response.status).toBe(200);
  });
});
