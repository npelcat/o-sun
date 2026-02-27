import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllTimeslotsAdmin,
  getTimeslotById,
  createTimeslot,
  updateTimeslot,
  deleteTimeslot,
  countAvailableSlotsForMonth,
} from "@/lib/admin/timeslots";

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

const mockDb = db as unknown as {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  execute: ReturnType<typeof vi.fn>;
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
    it("should return all timeslots without filters", async () => {
      const mockSlots = [
        { id: "slot-1", startTime: new Date(), isActive: true },
      ];
      mockDb.execute.mockResolvedValue(mockSlots);

      const result = await getAllTimeslotsAdmin();

      expect(result).toEqual(mockSlots);
      expect(mockDb.select).toHaveBeenCalled();
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
        "Créneau non trouvé",
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
      mockDb.execute.mockResolvedValue([]); // aucun chevauchement
      mockDb.returning.mockResolvedValue([newSlot]);

      const result = await createTimeslot({
        startTime: "2026-02-15T10:00:00Z",
        endTime: "2026-02-15T11:00:00Z",
      });

      expect(result).toEqual(newSlot);
    });

    it("should throw error when timeslot overlaps", async () => {
      mockDb.execute.mockResolvedValue([{ id: "existing-slot" }]); // chevauchement détecté

      await expect(
        createTimeslot({
          startTime: "2026-02-15T10:00:00Z",
          endTime: "2026-02-15T11:00:00Z",
        }),
      ).rejects.toThrow("Ce créneau chevauche un créneau existant");
    });
  });

  describe("updateTimeslot", () => {
    it("should update isActive without date change", async () => {
      const existingSlot = {
        id: "slot-1",
        startTime: new Date("2026-02-15T10:00:00Z"),
        endTime: new Date("2026-02-15T11:00:00Z"),
        isActive: true,
      };
      const updatedSlot = { ...existingSlot, isActive: false };

      // Premier execute : getTimeslotById (appelé en interne par updateTimeslot)
      // Pas de second execute car on ne modifie pas les dates → pas de vérif chevauchement
      mockDb.execute.mockResolvedValue([existingSlot]);
      mockDb.returning.mockResolvedValue([updatedSlot]);

      const result = await updateTimeslot("slot-1", { isActive: false });

      expect(result.isActive).toBe(false);
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it("should update dates and check for overlap", async () => {
      const existingSlot = {
        id: "slot-1",
        startTime: new Date("2026-02-15T10:00:00Z"),
        endTime: new Date("2026-02-15T11:00:00Z"),
        isActive: true,
      };
      const updatedSlot = {
        ...existingSlot,
        startTime: new Date("2026-02-15T14:00:00Z"),
        endTime: new Date("2026-02-15T15:00:00Z"),
      };

      // Premier execute : getTimeslotById
      // Deuxième execute : vérification chevauchement → [] = pas de conflit
      mockDb.execute
        .mockResolvedValueOnce([existingSlot])
        .mockResolvedValueOnce([]);
      mockDb.returning.mockResolvedValue([updatedSlot]);

      const result = await updateTimeslot("slot-1", {
        startTime: "2026-02-15T14:00:00Z",
        endTime: "2026-02-15T15:00:00Z",
      });

      expect(result.startTime).toEqual(new Date("2026-02-15T14:00:00Z"));
    });

    it("should throw error when updated dates overlap another slot", async () => {
      const existingSlot = {
        id: "slot-1",
        startTime: new Date("2026-02-15T10:00:00Z"),
        endTime: new Date("2026-02-15T11:00:00Z"),
        isActive: true,
      };

      // Premier execute : getTimeslotById
      // Deuxième execute : chevauchement détecté avec un autre créneau
      mockDb.execute
        .mockResolvedValueOnce([existingSlot])
        .mockResolvedValueOnce([{ id: "slot-autre" }]);

      await expect(
        updateTimeslot("slot-1", { startTime: "2026-02-15T10:30:00Z" }),
      ).rejects.toThrow("Ces nouvelles dates chevauchent un créneau existant");
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
        "Créneau non trouvé",
      );
    });
  });

  describe("countAvailableSlotsForMonth", () => {
    it("should return the count of active slots for a given month", async () => {
      const mockSlots = [
        { id: "slot-1", isActive: true },
        { id: "slot-2", isActive: true },
        { id: "slot-3", isActive: true },
      ];
      mockDb.execute.mockResolvedValue(mockSlots);

      const result = await countAvailableSlotsForMonth("2026-02");

      expect(result).toBe(3);
      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should return 0 when no active slots for the month", async () => {
      mockDb.execute.mockResolvedValue([]);

      const result = await countAvailableSlotsForMonth("2026-02");

      expect(result).toBe(0);
    });
  });
});
