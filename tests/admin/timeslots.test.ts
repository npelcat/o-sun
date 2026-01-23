import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllTimeslotsAdmin,
  getTimeslotById,
  createTimeslot,
  updateTimeslot,
  deleteTimeslot,
} from "@/lib/admin/timeslots";

// Mock de la DB
vi.mock("@/src/db/index", () => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    execute: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
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
  returning: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Admin Timeslots Service", () => {
  describe("getAllTimeslotsAdmin", () => {
    it("should return all timeslots", async () => {
      const mockSlots = [
        {
          id: "slot-1",
          startTime: new Date("2026-02-15T10:00:00Z"),
          endTime: new Date("2026-02-15T11:00:00Z"),
          isActive: true,
        },
      ];

      mockDb.execute.mockResolvedValue(mockSlots);

      const result = await getAllTimeslotsAdmin();

      expect(result).toEqual(mockSlots);
    });

    it("should filter by month", async () => {
      mockDb.execute.mockResolvedValue([]);

      await getAllTimeslotsAdmin({ month: "2026-02" });

      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should filter by active status", async () => {
      mockDb.execute.mockResolvedValue([]);

      await getAllTimeslotsAdmin({ isActive: true });

      expect(mockDb.where).toHaveBeenCalled();
    });
  });

  describe("getTimeslotById", () => {
    it("should return timeslot when found", async () => {
      const mockSlot = {
        id: "slot-1",
        startTime: new Date(),
        endTime: new Date(),
        isActive: true,
      };

      mockDb.execute.mockResolvedValue([mockSlot]);

      const result = await getTimeslotById("slot-1");

      expect(result).toEqual(mockSlot);
    });

    it("should throw error when not found", async () => {
      mockDb.execute.mockResolvedValue([]);

      await expect(getTimeslotById("invalid-id")).rejects.toThrow(
        "Créneau non trouvé"
      );
    });
  });

  describe("createTimeslot", () => {
    it("should create timeslot when no overlap", async () => {
      const newSlot = {
        id: "slot-1",
        startTime: new Date("2026-02-15T10:00:00Z"),
        endTime: new Date("2026-02-15T11:00:00Z"),
        isActive: true,
      };

      mockDb.execute.mockResolvedValue([]); // no overlapping slots
      mockDb.returning.mockResolvedValue([newSlot]);

      const result = await createTimeslot({
        startTime: "2026-02-15T10:00:00Z",
        endTime: "2026-02-15T11:00:00Z",
      });

      expect(result).toEqual(newSlot);
    });

    it("should throw error when timeslot overlaps", async () => {
      mockDb.execute.mockResolvedValue([{ id: "existing-slot" }]); // overlap found

      await expect(
        createTimeslot({
          startTime: "2026-02-15T10:00:00Z",
          endTime: "2026-02-15T11:00:00Z",
        })
      ).rejects.toThrow("Ce créneau chevauche un créneau existant");
    });
  });

  describe("updateTimeslot", () => {
    it("should update timeslot", async () => {
      const existingSlot = { id: "slot-1", isActive: true };
      const updatedSlot = { id: "slot-1", isActive: false };

      mockDb.execute.mockResolvedValue([existingSlot]);
      mockDb.returning.mockResolvedValue([updatedSlot]);

      const result = await updateTimeslot("slot-1", { isActive: false });

      expect(result.isActive).toBe(false);
    });
  });

  describe("deleteTimeslot", () => {
    it("should delete timeslot", async () => {
      const deletedSlot = { id: "slot-1" };
      mockDb.returning.mockResolvedValue([deletedSlot]);

      const result = await deleteTimeslot("slot-1");

      expect(result).toEqual(deletedSlot);
    });

    it("should throw error when timeslot not found", async () => {
      mockDb.returning.mockResolvedValue([]);

      await expect(deleteTimeslot("invalid-id")).rejects.toThrow(
        "Créneau non trouvé"
      );
    });
  });
});
