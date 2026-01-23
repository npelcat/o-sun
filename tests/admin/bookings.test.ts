import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllBookingsAdmin,
  getBookingByIdAdmin,
  updateBookingAdmin,
  deleteBookingAdmin,
  createBookingAdmin,
} from "@/lib/admin/bookings";
import { createMockTransaction, asTrx } from "../utils/test-utils";

// Mock de la DB
vi.mock("@/src/db/index", () => {
  const mockQueryBuilder = () => ({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    execute: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    delete: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
  });

  const mockDb = {
    ...mockQueryBuilder(),
    transaction: vi.fn(),
  };

  return { default: mockDb };
});

import db from "@/src/db/index";

const mockDb = db as unknown as {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  execute: ReturnType<typeof vi.fn>;
  transaction: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Admin Bookings Service", () => {
  describe("getAllBookingsAdmin", () => {
    it("should return all bookings without filters", async () => {
      const mockBookings = [
        {
          id: "booking-1",
          status: "confirmed",
          clientName: "Alice",
          clientEmail: "alice@example.com",
          animalName: "Rex",
          service: "Consultation",
          startTime: new Date("2026-02-15T10:00:00Z"),
          endTime: new Date("2026-02-15T11:00:00Z"),
        },
      ];

      mockDb.execute.mockResolvedValue(mockBookings);

      const result = await getAllBookingsAdmin();

      expect(result).toEqual(mockBookings);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("should filter bookings by status", async () => {
      mockDb.execute.mockResolvedValue([]);

      await getAllBookingsAdmin({ status: "pending" });

      expect(mockDb.where).toHaveBeenCalled();
    });
  });

  describe("getBookingByIdAdmin", () => {
    it("should return booking when found", async () => {
      const mockBooking = {
        id: "booking-1",
        status: "confirmed",
        adminNotes: "Virement reçu",
      };

      // ⚠️ Drizzle retourne directement un tableau, pas via .execute()
      // La chaîne se termine par .limit(1) qui retourne le tableau
      mockDb.limit.mockResolvedValue([mockBooking]);

      const result = await getBookingByIdAdmin("booking-1");

      expect(result).toEqual(mockBooking);
    });

    it("should throw error when booking not found", async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(getBookingByIdAdmin("invalid-id")).rejects.toThrow(
        "Réservation non trouvée"
      );
    });
  });

  describe("updateBookingAdmin", () => {
    it("should update booking status", async () => {
      const updatedBooking = {
        id: "booking-1",
        status: "confirmed",
        updatedAt: new Date(),
      };

      mockDb.returning.mockResolvedValue([updatedBooking]);

      const result = await updateBookingAdmin("booking-1", {
        status: "confirmed",
      });

      expect(result).toEqual(updatedBooking);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("should update admin notes", async () => {
      const updatedBooking = {
        id: "booking-1",
        adminNotes: "Paiement reçu le 15/01",
      };

      mockDb.returning.mockResolvedValue([updatedBooking]);

      const result = await updateBookingAdmin("booking-1", {
        adminNotes: "Paiement reçu le 15/01",
      });

      expect(result.adminNotes).toBe("Paiement reçu le 15/01");
    });
  });

  describe("deleteBookingAdmin", () => {
    it("should delete booking and release timeslot", async () => {
      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTrx = createMockTransaction();

        // Premier appel : récupérer le timeSlotId
        mockTrx.limit.mockResolvedValueOnce([{ timeSlotId: "slot-1" }]);

        // Deuxième appel : supprimer la réservation
        mockTrx.returning.mockResolvedValueOnce([{ id: "booking-1" }]);

        // Troisième appel : réactiver le créneau
        mockTrx.execute.mockResolvedValueOnce(undefined);

        return callback(asTrx(mockTrx));
      });

      const result = await deleteBookingAdmin("booking-1");

      expect(result).toBeDefined();
      expect(result.id).toBe("booking-1");
    });
  });

  describe("createBookingAdmin", () => {
    it("should create booking with new client", async () => {
      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTrx = createMockTransaction();

        // 1. Vérifier le créneau
        mockTrx.limit
          .mockResolvedValueOnce([{ id: "slot-1", isActive: true }])
          // 2. Chercher client existant
          .mockResolvedValueOnce([]); // Pas de client existant

        // 3. Créer nouveau client
        mockTrx.returning
          .mockResolvedValueOnce([{ id: "client-1" }])
          // 4. Créer formulaire
          .mockResolvedValueOnce([{ id: "form-1" }])
          // 5. Créer réservation
          .mockResolvedValueOnce([{ id: "booking-1" }]);

        return callback(asTrx(mockTrx));
      });

      const result = await createBookingAdmin({
        timeSlotId: "slot-1",
        clientName: "Bob",
        clientEmail: "bob@example.com",
        animalName: "Minou",
        service: "Consultation",
      });

      expect(result.booking.id).toBe("booking-1");
      expect(result.client.id).toBe("client-1");
      expect(result.form.id).toBe("form-1");
    });

    it("should throw error when timeslot not found", async () => {
      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTrx = createMockTransaction();
        mockTrx.limit.mockResolvedValue([]); // Aucun créneau trouvé
        return callback(asTrx(mockTrx));
      });

      await expect(
        createBookingAdmin({
          timeSlotId: "invalid-slot",
          clientName: "Bob",
          clientEmail: "bob@example.com",
          animalName: "Minou",
          service: "Consultation",
        })
      ).rejects.toThrow("Créneau non trouvé");
    });

    it("should throw error when timeslot is unavailable", async () => {
      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTrx = createMockTransaction();
        // Créneau existe mais n'est pas actif
        mockTrx.limit.mockResolvedValue([{ id: "slot-1", isActive: false }]);
        return callback(asTrx(mockTrx));
      });

      await expect(
        createBookingAdmin({
          timeSlotId: "slot-1",
          clientName: "Bob",
          clientEmail: "bob@example.com",
          animalName: "Minou",
          service: "Consultation",
        })
      ).rejects.toThrow("Ce créneau n'est pas disponible");
    });
  });
});
