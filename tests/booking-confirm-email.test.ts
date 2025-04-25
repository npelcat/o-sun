// tests/reservation-email.test.ts
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { POST } from "@/app/api/booking/confirm-email/route";
import { createRequest } from "@/tests/utils/test-utils";

// Stub des variables d'environnement
vi.stubEnv("RESEND_API_KEY", "mock-api-key");
vi.stubEnv("RESEND_SENDER_EMAIL", "test@example.com");
vi.stubEnv("MY_EMAIL", "admin@example.com");

// Mock Resend et extraction de mockSend
vi.mock("resend", () => {
  const mockSend = vi.fn().mockResolvedValue({ error: null });
  class MockResend {
    public emails: { send: typeof mockSend };
    constructor() {
      this.emails = { send: mockSend };
    }
  }
  return { __esModule: true, Resend: MockResend, mockSend };
});
// @ts-ignore
import { mockSend } from "resend";

// Mock du logger pour ne pas polluer la console
vi.mock("@/utils/logger", () => ({
  default: { info: vi.fn(), error: vi.fn() },
}));

// Mock de la récupération du créneau et du formatage de date/heure
vi.mock("@/lib/booking", () => ({ getSlotById: vi.fn() }));
vi.mock("@/lib/date", () => ({ formatDate: vi.fn(), formatTime: vi.fn() }));

import { getSlotById } from "@/lib/booking";
import { formatDate, formatTime } from "@/lib/date";

describe("POST /api/reservation", () => {
  const fakeSlot = { startTime: new Date("2025-05-10T14:30:00Z") };

  beforeEach(() => {
    vi.clearAllMocks();
    // par défaut, getSlotById renvoie un créneau valide
    (getSlotById as Mock).mockResolvedValue(fakeSlot);
    (formatDate as Mock).mockReturnValue("10/05/2025");
    (formatTime as Mock).mockReturnValue("14:30");
    mockSend.mockReset();
    mockSend.mockResolvedValue({ error: null });
  });

  it("envoie deux emails et renvoie 200 avec message de confirmation", async () => {
    const body = {
      name: "Alice",
      email: "alice@example.com",
      timeSlotId: "abc123",
      content: "Détails de ma réservation.",
    };
    const req = createRequest("POST", body);

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("message");
    expect(json.message).toContain("Ta réservation a bien été confirmée");

    // Vérifier deux envois
    expect(mockSend).toHaveBeenCalledTimes(2);

    // Premier email à l'utilisateur
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["alice@example.com"],
        subject: expect.stringContaining("Confirmation de votre réservation"),
        html: expect.stringContaining("Bonjour Alice"),
      })
    );
    // Deuxième email à l'administrateur
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [process.env.MY_EMAIL],
        subject: expect.stringContaining("Nouvelle réservation reçue"),
        html: expect.stringContaining("Nom du client : Alice"),
      })
    );
  });

  it("retourne 500 si getSlotById lève une exception", async () => {
    (getSlotById as Mock).mockRejectedValueOnce(new Error("DB error"));
    const req = createRequest("POST", {
      name: "Bob",
      email: "bob@example.com",
      timeSlotId: "bad",
      content: "Test",
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toHaveProperty("error");
    expect(json.error).toBe("Erreur interne, réservation non confirmée.");
    // Aucun email ne doit être envoyé
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("propage l'erreur si resend.emails.send échoue", async () => {
    // Simuler une erreur sur le premier envoi
    mockSend.mockResolvedValueOnce({ error: { message: "SMTP down" } });
    const req = createRequest("POST", {
      name: "Carl",
      email: "carl@example.com",
      timeSlotId: "abc123",
      content: "Ok",
    });

    const res = await POST(req);
    // même si 2e appel n'est pas atteint, on renvoie 500
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Erreur interne, réservation non confirmée.");
  });
});
