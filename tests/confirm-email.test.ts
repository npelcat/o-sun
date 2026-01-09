import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { POST } from "@/app/api/booking/confirm-email/route";
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

// Mock du logger
vi.mock("@/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de getBookingById
vi.mock("@/lib/bookings", () => ({
  getBookingById: vi.fn(),
}));

// Mock des fonctions de formatage de date
vi.mock("@/lib/date", () => ({
  formatDate: vi.fn(() => "15 janvier 2025"),
  formatTime: vi.fn(() => "10:00"),
}));

import { getBookingById } from "@/lib/bookings";

const mockGetBookingById = getBookingById as Mock;

// Variables d'environnement
vi.stubEnv("RESEND_API_KEY", "test-api-key");
vi.stubEnv("RESEND_SENDER_EMAIL", "noreply@example.com");
vi.stubEnv("MY_EMAIL", "oceane@example.com");

describe("POST /api/booking/confirm-email", () => {
  const mockBooking = {
    id: "booking-123",
    clientName: "Marie Dupont",
    clientEmail: "marie@example.com",
    startTime: new Date("2025-01-15T10:00:00Z"),
    animalName: "Rex",
    animalType: "Chien",
    service: "Communication animale",
    answers: JSON.stringify({ question1: "réponse1" }),
    status: "pending" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    timeSlotId: "slot-123",
    endTime: new Date("2025-01-15T11:00:00Z"),
    isTimeSlotActive: true,
    clientId: "client-123",
    clientPhone: "0612345678",
    formId: "form-123",
    formCreatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockResendSend.mockResolvedValue({ error: null });
    mockGetBookingById.mockResolvedValue(mockBooking);
  });

  it("should send confirmation emails successfully", async () => {
    const req = createRequest("POST", {
      bookingId: "550e8400-e29b-41d4-a716-446655440000", // UUID valide
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message).toBe("Emails de confirmation envoyés avec succès");

    // Vérifier que getBookingById a été appelé
    expect(mockGetBookingById).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000"
    );

    // Vérifier que 2 emails ont été envoyés (client + admin)
    expect(mockResendSend).toHaveBeenCalledTimes(2);

    // Vérifier l'email client
    expect(mockResendSend).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        from: "O'Sun ~ Voix Animale <noreply@example.com>",
        to: ["marie@example.com"],
        subject: expect.stringContaining(
          "Confirmation de votre demande de réservation"
        ),
        html: expect.stringContaining("Marie Dupont"),
      })
    );

    // Vérifier l'email admin
    expect(mockResendSend).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        from: "O'Sun ~ Voix Animale <noreply@example.com>",
        to: ["oceane@example.com"],
        subject: expect.stringContaining(
          "Nouvelle demande de réservation - Marie Dupont"
        ),
        html: expect.stringContaining("marie@example.com"),
      })
    );
  });

  it("should return 400 when bookingId is invalid", async () => {
    const req = createRequest("POST", {
      bookingId: "invalid-id",
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("should return 400 when bookingId is missing", async () => {
    const req = createRequest("POST", {});

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("should handle booking not found", async () => {
    mockGetBookingById.mockRejectedValue(new Error("Réservation non trouvée"));

    const req = createRequest("POST", {
      bookingId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("should return 500 when user email fails", async () => {
    mockResendSend.mockResolvedValueOnce({
      error: { message: "API error", name: "ResendError" },
    });

    const req = createRequest("POST", {
      bookingId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe(
      "Erreur lors de l'envoi de l'email de confirmation"
    );

    // L'email admin ne devrait pas être envoyé si l'email client échoue
    expect(mockResendSend).toHaveBeenCalledTimes(1);
  });

  it("should still succeed when admin email fails", async () => {
    // Premier appel (email client) réussit
    mockResendSend.mockResolvedValueOnce({ error: null });
    // Deuxième appel (email admin) échoue
    mockResendSend.mockResolvedValueOnce({
      error: { message: "Admin email failed", name: "ResendError" },
    });

    const req = createRequest("POST", {
      bookingId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const response = await POST(req);

    // La requête devrait quand même réussir
    expect(response.status).toBe(200);
    expect(mockResendSend).toHaveBeenCalledTimes(2);
  });

  it("should handle booking without animalType", async () => {
    mockGetBookingById.mockResolvedValue({
      ...mockBooking,
      animalType: null,
    });

    const req = createRequest("POST", {
      bookingId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    // Vérifier que l'email ne contient pas "(Chien)"
    const firstEmailCall = mockResendSend.mock.calls[0][0];
    expect(firstEmailCall.html).not.toContain("(Chien)");
  });

  it("should handle booking without answers", async () => {
    mockGetBookingById.mockResolvedValue({
      ...mockBooking,
      answers: null,
    });

    const req = createRequest("POST", {
      bookingId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    // L'email ne devrait pas contenir la section "Informations supplémentaires"
    const firstEmailCall = mockResendSend.mock.calls[0][0];
    expect(firstEmailCall.html).not.toContain("Informations supplémentaires");
  });

  it("should handle string answers correctly", async () => {
    mockGetBookingById.mockResolvedValue({
      ...mockBooking,
      answers: "Notes en texte libre",
    });

    const req = createRequest("POST", {
      bookingId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const firstEmailCall = mockResendSend.mock.calls[0][0];
    expect(firstEmailCall.html).toContain("Notes en texte libre");
  });
});
