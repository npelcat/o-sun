import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/booking/reserve/route";
import { NextRequest } from "next/server";

// --- Mocks ---
vi.mock("@/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/utils/withErrorHandler", () => ({
  withErrorHandler: async (_req: unknown, fn: () => Promise<unknown>) => {
    return fn();
  },
}));

// Mock db.transaction
vi.mock("@/src/db/index", () => {
  return {
    default: {
      transaction: async (fn: (trx: unknown) => Promise<void>) => {
        await fn({
          select: () => ({
            from: () => ({
              where: () => ({
                limit: () => ({
                  execute: async () => [{ id: "slot-1" }], // available slot
                }),
              }),
            }),
          }),
          update: () => ({
            set: () => ({
              where: () => ({
                execute: async () => {},
              }),
            }),
          }),
        });
      },
    },
  };
});

// --- Clear mocks before every test ---
beforeEach(() => {
  vi.clearAllMocks();
});

// --- Tests ---
describe("POST /api/booking/reserve", () => {
  it("réserve un créneau et renvoie un message de succès", async () => {
    // mock body JSON with timeSlotId
    const request = {
      json: async () => ({ timeSlotId: "slot-1" }),
    } as unknown as NextRequest;

    const response = await POST(request);
    const json = await response.json();

    expect(json).toEqual({ message: "Créneau réservé provisoirement" });
  });

  it("renvoie une erreur 400 si timeSlotId est manquant", async () => {
    const request = {
      json: async () => ({}),
    } as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toEqual({ message: "timeSlotId manquant" });
  });
});
