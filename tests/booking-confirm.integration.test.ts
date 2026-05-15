import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/booking/confirm/route";
import { createRequest, minutesAgo } from "./utils/test-utils";

// --- Mocks des dépendances externes uniquement ---

// Turnstile
vi.mock("@/lib/validation/turnstile", () => ({
  verifyTurnstileToken: vi.fn().mockResolvedValue({ success: true }),
}));

// Validation d'email : mock Resend
vi.mock("@/lib/validation/email", () => ({
  validateEmail: vi.fn().mockResolvedValue({ isValid: true }),
}));

// Rate limiter
vi.mock("@/lib/security/rate-limit-simple", () => ({
  apiRateLimiter: { check: vi.fn().mockReturnValue(true) },
}));

// Logger (éviter le bruit)
vi.mock("@/utils/logger", () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// La base de données (seule couche infrastructure mockée)
// `transaction` = point d'entrée de tout le flux de réservation
vi.mock("@/src/db/index", () => {
  const mockDb = { transaction: vi.fn() };
  return { default: mockDb };
});

import db from "@/src/db/index";
const mockDb = db as unknown as { transaction: ReturnType<typeof vi.fn> };

// Payload valide
const validPayload = {
  timeSlotId: "550e8400-e29b-41d4-a716-446655440001",
  clientName: "Marie Dupont",
  clientEmail: "marie@example.com",
  clientPhone: "0612345678",
  animalName: "Rex",
  animalType: "Chien",
  service: "Communication animale",
  preferredPronoun: "tutoiement",

  monthlyPlanningAck: true,
  cgvAccepted: true,
  socialMediaConsent: false,

  answers: { question1: "réponse1" },

  turnstileToken: "valid-token",
};

/**
 * Construit une fausse transaction Drizzle adaptée au flux de /confirm.
 */
function buildTrxMock({
  slotData,
  existingClient = null,
  clientResult,
  formResult,
  bookingResult,
}: {
  slotData: object | null;
  existingClient?: object | null;
  clientResult?: object;
  formResult?: object;
  bookingResult?: object;
}) {
  // Valeurs par défaut - cas nominal
  const defaultClient = {
    id: "client-123",
    name: "Marie Dupont",
    email: "marie@example.com",
  };
  const defaultForm = {
    id: "form-456",
    animalName: "Rex",
    service: "Communication animale",
  };
  const defaultBooking = {
    id: "booking-789",
    timeSlotId: validPayload.timeSlotId,
    clientId: "client-123",
    formId: "form-456",
    status: "pending",
  };

  const trx = {} as Record<string, ReturnType<typeof vi.fn>>;

  //   Appel 1 — validateSlotForConfirmation
  //   Appel 2 — confirmSlotPermanently
  trx.execute = vi
    .fn()
    .mockResolvedValueOnce(slotData ? [slotData] : [])
    .mockResolvedValueOnce(undefined);

  //   Appel 1 — validateSlotForConfirmation
  //   Appel 2 — createOrUpdateClient
  trx.limit = vi
    .fn()
    .mockReturnValueOnce(trx)
    .mockResolvedValueOnce(existingClient ? [existingClient] : []);

  //   Appel 1 — insert ou update du client
  //   Appel 2 — insert du formulaire (createFormData)
  //   Appel 3 — insert de la réservation (createBooking)
  trx.returning = vi
    .fn()
    .mockResolvedValueOnce([clientResult ?? defaultClient])
    .mockResolvedValueOnce([formResult ?? defaultForm])
    .mockResolvedValueOnce([bookingResult ?? defaultBooking]);

  for (const method of [
    "select",
    "from",
    "where",
    "insert",
    "values",
    "update",
    "set",
    "for",
    "delete",
    "orderBy",
  ]) {
    trx[method] = vi.fn().mockReturnValue(trx);
  }

  return trx;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/booking/confirm - integration", () => {
  it("should create a complete booking for a new client", async () => {
    const slot = {
      id: validPayload.timeSlotId,
      isActive: true,
      lockedAt: minutesAgo(5),
    };
    const trx = buildTrxMock({ slotData: slot, existingClient: null });
    mockDb.transaction.mockImplementation(
      async (cb: (t: unknown) => Promise<unknown>) => cb(trx),
    );

    const response = await POST(createRequest("POST", validPayload));
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.message).toBe("Réservation confirmée");

    expect(body.data.booking.id).toBe("booking-789");
    expect(body.data.booking.clientId).toBe("client-123");
    expect(body.data.booking.formId).toBe("form-456");

    expect(trx.insert).toHaveBeenCalled();

    expect(trx.execute).toHaveBeenCalledTimes(2);
  });

  it("should update an existing client and create the booking", async () => {
    const slot = {
      id: validPayload.timeSlotId,
      isActive: true,
      lockedAt: minutesAgo(5),
    };

    const existingClient = {
      id: "client-existant-999",
      name: "Marie D.",
      email: "marie@example.com",
      phone: "0600000000",
    };
    const updatedClient = {
      ...existingClient,
      name: "Marie Dupont",
      phone: "0612345678",
    };

    const booking = {
      id: "booking-789",
      timeSlotId: validPayload.timeSlotId,
      clientId: "client-existant-999",
      formId: "form-456",
      status: "pending",
    };

    const trx = buildTrxMock({
      slotData: slot,
      existingClient,
      clientResult: updatedClient,
      bookingResult: booking,
    });
    mockDb.transaction.mockImplementation(
      async (cb: (t: unknown) => Promise<unknown>) => cb(trx),
    );

    const response = await POST(createRequest("POST", validPayload));
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.data.booking.clientId).toBe("client-existant-999");

    expect(trx.update).toHaveBeenCalled();
  });

  it("should return 410 when the slot lock has expired", async () => {
    const slot = {
      id: validPayload.timeSlotId,
      isActive: true,
      lockedAt: minutesAgo(20),
    };
    const trx = buildTrxMock({ slotData: slot });
    mockDb.transaction.mockImplementation(
      async (cb: (t: unknown) => Promise<unknown>) => cb(trx),
    );

    const response = await POST(createRequest("POST", validPayload));
    expect(response.status).toBe(410);

    const body = await response.json();
    expect(body.error).toContain("expiré");

    expect(trx.insert).not.toHaveBeenCalled();
  });

  it("should return 409 when the slot is not locked", async () => {
    const slot = {
      id: validPayload.timeSlotId,
      isActive: true,
      lockedAt: null,
    };
    const trx = buildTrxMock({ slotData: slot });
    mockDb.transaction.mockImplementation(
      async (cb: (t: unknown) => Promise<unknown>) => cb(trx),
    );

    const response = await POST(createRequest("POST", validPayload));
    expect(response.status).toBe(409);

    expect(trx.insert).not.toHaveBeenCalled();
  });

  it("should return 400 when the request body fails schema validation", async () => {
    const response = await POST(
      createRequest("POST", {
        clientName: "Marie Dupont",
        clientEmail: "marie@example.com",
        animalName: "Rex",
        service: "Communication animale",
        turnstileToken: "valid-token",
      }),
    );

    expect(response.status).toBe(400);

    expect(mockDb.transaction).not.toHaveBeenCalled();
  });
});
