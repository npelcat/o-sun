import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTokenExpiration } from "@/lib/auth/tokens";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getAdminUser } from "@/lib/admin";

// ============================================================
// Mock de next-auth uniquement pour getAdminUser.
// hashPassword, verifyPassword et getTokenExpiration
// n'ont aucune dépendance externe à mocker.
// ============================================================
vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/lib/auth/auth";

const mockAuth = vi.mocked(auth);

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================
// getTokenExpiration
// On teste cette fonction car elle contient une vraie logique
// de calcul (Date.now() + minutes * 60 * 1000).
// generateResetToken n'est pas testé car c'est un simple
// appel à crypto.randomBytes sans transformation.
// ============================================================
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

// ============================================================
// hashPassword / verifyPassword
// On teste ces fonctions car elles encapsulent une logique
// de sécurité custom (paramètres Argon2id OWASP).
// Ce sont des tests unitaires "vrais" : argon2 n'est pas
// mocké, on vérifie que le hash produit est bien vérifiable.
// ============================================================
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

// ============================================================
// getAdminUser
// On teste uniquement la logique custom autour de la session :
// - retourner null si pas de session
// - construire et retourner l'objet admin avec role: "admin"
// La logique interne de next-auth (JWT, callbacks) n'est pas testée.
// ============================================================
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
