import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de Turnstile - DOIT ÊTRE AVANT l'import du module qui l'utilise
vi.mock("@/lib/validation/turnstile", () => ({
  verifyTurnstileToken: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock Rate limiter
vi.mock("@/lib/security/rate-limit-simple", () => ({
  contactRateLimiter: {
    check: vi.fn().mockReturnValue(true),
  },
}));

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
    warn: vi.fn(),
  },
}));

// Imports APRÈS les mocks
import { POST } from "@/app/api/email/route";
import { createRequest } from "./utils/test-utils";
import { verifyTurnstileToken } from "@/lib/validation/turnstile";

// Récupérer la référence au mock
const mockVerifyTurnstile = vi.mocked(verifyTurnstileToken);

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
      turnstileToken: "valid-token",
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
      }),
    );
  });

  it("should return 400 when turnstile token is missing", async () => {
    const req = createRequest("POST", {
      name: "Jane Dupont",
      email: "jane@example.com",
      message: "Message sans token Turnstile.",
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("should return 400 when turnstile verification fails", async () => {
    mockVerifyTurnstile.mockResolvedValueOnce({
      success: false,
      error: "Invalid token",
    });

    const req = createRequest("POST", {
      name: "Jane Dupont",
      email: "jane@example.com",
      message: "Message avec token invalide.",
      turnstileToken: "invalid-token",
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid token");
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("should return 400 when email is invalid", async () => {
    const req = createRequest("POST", {
      name: "Jane Dupont",
      email: "invalid-email",
      message: "Message avec email invalide.",
      turnstileToken: "valid-token",
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
      turnstileToken: "valid-token",
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
      turnstileToken: "valid-token",
    });

    await POST(req);
    const emailCall = mockResendSend.mock.calls[0][0];
    expect(emailCall.html).toContain("Ligne 1<br>Ligne 2<br>Ligne 3");
  });
});
