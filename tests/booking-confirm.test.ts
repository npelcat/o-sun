import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/booking/confirm/route";
import { HttpError } from "@/utils/withErrorHandler";
import { createRequest } from "@/tests/utils/test-utils";

// --- Mocks pour logger et withErrorHandler ---
vi.mock("@/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Pour withErrorHandler, on va capturer les erreurs HTTP
let thrownError: HttpError | null = null;
vi.mock("@/utils/withErrorHandler", () => ({
  withErrorHandler: async (_req: unknown, fn: () => Promise<unknown>) => {
    try {
      return await fn();
    } catch (error) {
      thrownError = error as HttpError;
      throw error;
    }
  },
  HttpError: class HttpError extends Error {
    constructor(
      public status: number,
      message: string
    ) {
      super(message);
    }
  },
}));

// Définir les types pour les mocks de la base de données
type MockFunction = ReturnType<typeof vi.fn>;
type TransactionCallback = (trx: unknown) => Promise<void>;

// --- Mock pour la base de données ---
const mockSelect: MockFunction = vi.fn();
const mockUpdate: MockFunction = vi.fn();
const mockInsert: MockFunction = vi.fn();
const mockWhere: MockFunction = vi.fn();
const mockLimit: MockFunction = vi.fn();
const mockExecute: MockFunction = vi.fn();
const mockSet: MockFunction = vi.fn();
const mockValues: MockFunction = vi.fn();
const mockReturning: MockFunction = vi.fn();

// Base de données transactionnelle mockée
vi.mock("@/src/db/index", () => {
  return {
    default: {
      transaction: async (callback: TransactionCallback) => {
        const trx = {
          select: mockSelect,
          update: mockUpdate,
          insert: mockInsert,
        };

        // Configuration des chaînes pour select()
        mockSelect.mockReturnValue({
          from: () => ({
            where: mockWhere,
          }),
        });

        mockWhere.mockReturnValue({
          limit: mockLimit,
          execute: mockExecute,
        });

        mockLimit.mockReturnValue({
          execute: mockExecute,
        });

        // Configuration des chaînes pour update()
        mockUpdate.mockReturnValue({
          set: mockSet,
        });

        mockSet.mockReturnValue({
          where: () => ({
            execute: mockExecute,
          }),
        });

        // Configuration des chaînes pour insert()
        mockInsert.mockReturnValue({
          values: mockValues,
        });

        mockValues.mockReturnValue({
          returning: mockReturning,
        });

        await callback(trx);
        return null;
      },
    },
  };
});

// Clear les mocks avant chaque test
beforeEach(() => {
  vi.clearAllMocks();
  thrownError = null;

  // Réinitialiser les mock returns
  mockExecute.mockReset();
  mockReturning.mockReset();
});

describe("POST /api/booking/confirm", () => {
  // Interface pour représenter le body de la requête
  interface BookingRequestBody {
    timeSlotId?: string;
    name?: string;
    email?: string;
    content?: string;
  }

  it("renvoie une erreur 400 si des données sont manquantes", async () => {
    const req = createRequest("POST", {
      timeSlotId: "123",
      name: "Jean",
    } as BookingRequestBody); // Email manquant

    await expect(POST(req)).rejects.toThrow();
    expect(thrownError).toBeInstanceOf(HttpError);
    expect(thrownError?.status).toBe(400);
  });

  it("renvoie une erreur 404 si le créneau n'existe pas", async () => {
    const req = createRequest("POST", {
      timeSlotId: "not-exists",
      name: "Jean",
      email: "jean@example.com",
      content: "Message de test",
    });

    // Mock le résultat de la requête pour simuler un créneau inexistant
    mockExecute.mockResolvedValueOnce([]);

    await expect(POST(req)).rejects.toThrow();
    expect(thrownError).toBeInstanceOf(HttpError);
    expect(thrownError?.status).toBe(404);
  });

  it("renvoie une erreur 409 si le créneau n'est pas actif", async () => {
    const req = createRequest("POST", {
      timeSlotId: "inactive-slot",
      name: "Jean",
      email: "jean@example.com",
      content: "Message de test",
    });

    // Mock le résultat de la requête pour simuler un créneau inactif
    mockExecute.mockResolvedValueOnce([
      { id: "inactive-slot", isActive: false, lockedAt: new Date() },
    ]);

    await expect(POST(req)).rejects.toThrow();
    expect(thrownError).toBeInstanceOf(HttpError);
    expect(thrownError?.status).toBe(409);
  });

  it("renvoie une erreur 409 si le créneau n'est pas verrouillé", async () => {
    const req = createRequest("POST", {
      timeSlotId: "unlocked-slot",
      name: "Jean",
      email: "jean@example.com",
      content: "Message de test",
    });

    // Mock le résultat de la requête pour simuler un créneau non verrouillé
    mockExecute.mockResolvedValueOnce([
      { id: "unlocked-slot", isActive: true, lockedAt: null },
    ]);

    await expect(POST(req)).rejects.toThrow();
    expect(thrownError).toBeInstanceOf(HttpError);
    expect(thrownError?.status).toBe(409);
  });

  it("renvoie une erreur 410 si le verrou est expiré", async () => {
    const req = createRequest("POST", {
      timeSlotId: "expired-slot",
      name: "Jean",
      email: "jean@example.com",
      content: "Message de test",
    });

    // Mock pour simuler un verrou expiré (plus de 15 minutes)
    const expiredDate = new Date(Date.now() - 16 * 60 * 1000);
    mockExecute.mockResolvedValueOnce([
      { id: "expired-slot", isActive: true, lockedAt: expiredDate },
    ]);

    await expect(POST(req)).rejects.toThrow();
    expect(thrownError).toBeInstanceOf(HttpError);
    expect(thrownError?.status).toBe(410);
  });

  it("confirme la réservation avec succès", async () => {
    const req = createRequest("POST", {
      timeSlotId: "valid-slot",
      name: "Jean",
      email: "jean@example.com",
      content: "Message de test",
    });

    // Mock pour un créneau valide
    const validDate = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    mockExecute.mockResolvedValueOnce([
      { id: "valid-slot", isActive: true, lockedAt: validDate },
    ]);

    // Mock pour les opérations update et insert
    mockExecute.mockResolvedValue(undefined);
    mockReturning.mockImplementation(() => [{ id: "new-id" }]);

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ message: "Réservation confirmée" });

    // Vérifier que toutes les opérations de transaction ont été appelées
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledTimes(2); // Une fois pour formData, une fois pour bookings
  });
});
