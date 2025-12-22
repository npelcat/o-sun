import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/email/route";
import { createRequest } from "./utils/test-utils";

// Mock de Resend
const mockResendSend = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: mockResendSend,
    },
  })),
}));

// Mock logger
vi.mock("@/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Variables d'environnement
vi.stubEnv("RESEND_API_KEY", "test-api-key");
vi.stubEnv("RESEND_SENDER_EMAIL", "noreply@example.com");
vi.stubEnv("MY_EMAIL", "oceane@example.com");

describe("POST /api/email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResendSend.mockResolvedValue({ error: null });
  });

  it("should send contact email successfully", async () => {
    const req = createRequest("POST", {
      name: "Jane Dupont",
      email: "jane@example.com",
      message:
        "Bonjour, je souhaiterais avoir plus d'informations sur vos services.",
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message).toContain("Ton e-mail a bien été envoyé");

    // Vérifier l'appel à Resend
    expect(mockResendSend).toHaveBeenCalledTimes(1);
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "O'Sun ~ Voix Animale <noreply@example.com>",
        to: ["oceane@example.com"],
        cc: ["jane@example.com"],
        subject: "Message de Jane Dupont (jane@example.com)",
        html: expect.stringContaining("Jane Dupont"),
      })
    );
  });

  it("should return 400 when name is missing", async () => {
    const req = createRequest("POST", {
      email: "jane@example.com",
      message: "Message sans nom, cela devrait échouer.",
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("should return 400 when email is invalid", async () => {
    const req = createRequest("POST", {
      name: "Jane Dupont",
      email: "invalid-email",
      message: "Message avec email invalide.",
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("should return 400 when message is too short", async () => {
    const req = createRequest("POST", {
      name: "Jane Dupont",
      email: "jane@example.com",
      message: "Court", // moins de 20 caractères
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("should return 500 when Resend fails", async () => {
    mockResendSend.mockResolvedValueOnce({
      error: { message: "API error", name: "ResendError" },
    });

    const req = createRequest("POST", {
      name: "Jane Dupont",
      email: "jane@example.com",
      message: "Message valide mais l'envoi va échouer.",
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Erreur lors de l'envoi de l'e-mail.");
  });

  it("should convert line breaks to <br> tags", async () => {
    const req = createRequest("POST", {
      name: "Jane Dupont",
      email: "jane@example.com",
      message: "Ligne 1\nLigne 2\nLigne 3 avec du contenu supplémentaire",
    });

    await POST(req);

    const emailCall = mockResendSend.mock.calls[0][0];
    expect(emailCall.html).toContain("Ligne 1<br>Ligne 2<br>Ligne 3");
  });
});
