import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAvailableSlots,
  reserveSlot,
  getSlotById,
  releaseSlot,
  validateSlotForConfirmation,
} from "@/lib/timeslots";
import { HttpError } from "@/utils/withErrorHandler";
import { createMockTransaction, asTrx } from "./utils/test-utils";

// Mock de la DB
vi.mock("@/src/db/index", () => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    transaction: vi.fn(),
  };
  return { default: mockDb };
});

import db from "@/src/db/index";

// Typage utilitaire pour le mock
const mockDb = db as unknown as {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  execute: ReturnType<typeof vi.fn>;
  transaction: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getAvailableSlots", () => {
  it("should return available slots", async () => {
    const mockSlots = [
      {
        id: "slot-1",
        startTime: new Date("2025-01-15T10:00:00Z"),
        endTime: new Date("2025-01-15T11:00:00Z"),
        isActive: true,
        lockedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockDb.execute.mockResolvedValue(mockSlots);

    const slots = await getAvailableSlots();

    expect(slots).toEqual(mockSlots);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });
});

describe("getSlotById", () => {
  it("should return slot when found", async () => {
    const mockSlot = {
      id: "slot-123",
      startTime: new Date("2025-01-15T10:00:00Z"),
      endTime: new Date("2025-01-15T11:00:00Z"),
      isActive: true,
      lockedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDb.execute.mockResolvedValue([mockSlot]);

    const slot = await getSlotById("slot-123");

    expect(slot).toEqual(mockSlot);
  });

  it("should throw error when slot not found", async () => {
    mockDb.execute.mockResolvedValue([]);

    await expect(getSlotById("invalid-id")).rejects.toThrow(
      "Créneau non trouvé",
    );
  });
});

describe("reserveSlot", () => {
  it("should successfully reserve an available slot", async () => {
    const mockSlot = {
      id: "slot-123",
      startTime: new Date(),
      isActive: true,
      lockedAt: null,
    };

    // Mock de la transaction avec un slot disponible
    mockDb.transaction.mockImplementation(async (callback) => {
      const mockTrx = createMockTransaction();
      mockTrx.execute.mockResolvedValue([mockSlot]);
      return callback(asTrx(mockTrx));
    });

    await expect(reserveSlot("slot-123")).resolves.not.toThrow();
  });

  it("should throw error when slot is unavailable", async () => {
    // Mock de la transaction avec aucun slot disponible
    mockDb.transaction.mockImplementation(async (callback) => {
      const mockTrx = createMockTransaction();
      mockTrx.execute.mockResolvedValue([]);
      return callback(asTrx(mockTrx));
    });

    await expect(reserveSlot("slot-123")).rejects.toThrow(
      "Créneau indisponible ou déjà réservé",
    );
  });
});

describe("releaseSlot", () => {
  it("should release a locked slot", async () => {
    mockDb.execute.mockResolvedValue(undefined);

    await expect(releaseSlot("slot-123")).resolves.not.toThrow();

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalledWith({
      isActive: true,
      lockedAt: null,
    });
  });
});

describe("validateSlotForConfirmation", () => {
  it("should throw 404 when slot not found", async () => {
    const mockTrx = createMockTransaction();
    mockTrx.execute.mockResolvedValue([]);

    await expect(
      validateSlotForConfirmation(asTrx(mockTrx), "invalid-id"),
    ).rejects.toThrow(new HttpError(404, "Créneau introuvable"));
  });

  it("should throw 409 when slot is not active", async () => {
    const mockSlot = {
      id: "slot-123",
      isActive: false,
      lockedAt: new Date(),
    };

    const mockTrx = createMockTransaction();
    mockTrx.execute.mockResolvedValue([mockSlot]);

    await expect(
      validateSlotForConfirmation(asTrx(mockTrx), "slot-123"),
    ).rejects.toThrow(new HttpError(409, "Créneau déjà confirmé ou annulé"));
  });

  it("should throw 409 when slot is not locked", async () => {
    const mockSlot = {
      id: "slot-123",
      isActive: true,
      lockedAt: null,
    };

    const mockTrx = createMockTransaction();
    mockTrx.execute.mockResolvedValue([mockSlot]);

    await expect(
      validateSlotForConfirmation(asTrx(mockTrx), "slot-123"),
    ).rejects.toThrow(new HttpError(409, "Créneau non réservé précédemment"));
  });

  it("should throw 410 when lock has expired", async () => {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
    const mockSlot = {
      id: "slot-123",
      isActive: true,
      lockedAt: twentyMinutesAgo,
    };

    const mockTrx = createMockTransaction();
    mockTrx.execute.mockResolvedValue([mockSlot]);

    await expect(
      validateSlotForConfirmation(asTrx(mockTrx), "slot-123"),
    ).rejects.toThrow(
      new HttpError(
        410,
        "Le temps de réservation a expiré, merci de re-sélectionner un créneau",
      ),
    );
  });

  it("should return slot when valid", async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const mockSlot = {
      id: "slot-123",
      isActive: true,
      lockedAt: fiveMinutesAgo,
    };

    const mockTrx = createMockTransaction();
    mockTrx.execute.mockResolvedValue([mockSlot]);

    const result = await validateSlotForConfirmation(
      asTrx(mockTrx),
      "slot-123",
    );

    expect(result).toEqual(mockSlot);
  });
});
