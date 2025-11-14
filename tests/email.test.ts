import { describe, it, expect, vi, beforeEach } from "vitest";

// Définir les variables d'environnement pour le test
vi.stubEnv("RESEND_API_KEY", "mock-api-key");
vi.stubEnv("RESEND_SENDER_EMAIL", "test@example.com");
vi.stubEnv("MY_EMAIL", "admin@example.com");

// Mock du module Resend
vi.mock("resend", () => {
  // Créer un mock complet pour Resend avec une fonction 'send' intégrée
  const mockSend = vi.fn().mockResolvedValue({ error: null });
  class MockResend {
    // on déclare la propriété pour TS
    public emails: { send: typeof mockSend };
    constructor() {
      this.emails = { send: mockSend };
    }
  }
  return {
    __esModule: true,
    Resend: MockResend,
    // on exporte mockSend pour pouvoir l’importer plus bas
    mockSend,
  };
});

// Mock logger
vi.mock("@/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock contactSchema
vi.mock("./contactSchema", () => ({
  contactSchema: {
    parse: vi.fn((data) => {
      // Validation basée sur la définition de votre schéma
      if (!data.name || data.name.length < 2) {
        throw new ZodError([
          {
            code: "too_small",
            minimum: 2,
            type: "string",
            inclusive: true,
            exact: false,
            message: "Le nom est requis",
            path: ["name"],
          },
        ]);
      }

      if (!data.email || !data.email.includes("@")) {
        throw new ZodError([
          {
            code: "invalid_string",
            validation: "email",
            message: "Email invalide",
            path: ["email"],
          },
        ]);
      }

      if (!data.message || data.message.length < 20) {
        throw new ZodError([
          {
            code: "too_small",
            minimum: 20,
            type: "string",
            inclusive: true,
            exact: false,
            message: "Le message doit comporter au moins 20 caractères",
            path: ["message"],
          },
        ]);
      }

      return data;
    }),
  },
}));

// @ts-expect-error: import du mock 'mockSend' depuis vi.mock(\"resend\")
import { mockSend } from "resend";
import { POST } from "@/app/api/email/route";
import { createRequest } from "@/tests/utils/test-utils";
import { ZodError } from "zod";

describe("POST /api/email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Réinitialiser le comportement par défaut
    mockSend.mockReset();
    mockSend.mockResolvedValue({ error: null });
  });

  it("renvoie une erreur 400 si les données sont invalides", async () => {
    // Données incomplètes (email manquant)
    const req = createRequest("POST", {
      name: "Jean Test",
      message: "Ceci est un message de test pour validation",
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  it("renvoie une erreur 500 si Resend renvoie une erreur", async () => {
    // Override du mock pour simuler une erreur de Resend
    mockSend.mockResolvedValueOnce({
      error: { message: "API error", name: "ResendError" },
    });

    const req = createRequest("POST", {
      name: "Jean Test",
      email: "jean@example.com",
      message: "Ceci est un message de test pour tester l'envoi d'emails",
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Erreur lors de l'envoi de l'e-mail.");
  });

  it("envoie un email avec succès et renvoie un message de confirmation", async () => {
    const req = createRequest("POST", {
      name: "Jean Test",
      email: "jean@example.com",
      message: "Ceci est un message de test pour tester l'envoi d'emails",
    });

    const response = await POST(req);

    // Vérifier que la réponse est correcte
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("message");
    expect(body.message).toContain("Ton e-mail a bien été envoyé");

    // Vérifier que l'appel à Resend a été fait avec les bons paramètres
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.stringContaining("O'Sun ~ Voix Animale"),
        to: [expect.any(String)],
        cc: ["jean@example.com"],
        subject: expect.stringContaining("Jean Test"),
        html: expect.stringContaining("Ceci est un message de test"),
      })
    );
  });

  it("gère correctement les sauts de ligne dans le message", async () => {
    const req = createRequest("POST", {
      name: "Jean Test",
      email: "jean@example.com",
      message:
        "Ligne 1\nLigne 2\nLigne 3 plus longue pour respecter la validation",
    });

    await POST(req);

    // Vérifier que les sauts de ligne sont convertis en <br>
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("Ligne 1<br>Ligne 2<br>Ligne 3"),
      })
    );
  });
});
