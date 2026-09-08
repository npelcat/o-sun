import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllBookingsAdmin,
  getBookingByIdAdmin,
  updateBookingAdmin,
  deleteBookingAdmin,
  createBookingAdmin,
} from "@/lib/admin/bookings";
import { createMockTransaction, asTrx } from "../utils/test-utils";

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
      const mockBookings = [
        { id: "booking-1", status: "confirmed", clientName: "Alice" },
      ];
      mockDb.execute.mockResolvedValue(mockBookings);

      const result = await getAllBookingsAdmin({ status: "confirmed" });

      expect(result).toEqual(mockBookings);
      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should filter bookings by period UPCOMING", async () => {
      mockDb.execute.mockResolvedValue([]);

      await getAllBookingsAdmin({ period: "upcoming" });

      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should filter bookings by period PAST", async () => {
      mockDb.execute.mockResolvedValue([]);

      await getAllBookingsAdmin({ period: "past" });

      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should filter bookings by month", async () => {
      mockDb.execute.mockResolvedValue([]);

      await getAllBookingsAdmin({ month: "2026-02" });

      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should filter bookings by client email", async () => {
      const mockBookings = [
        {
          id: "booking-1",
          status: "pending",
          clientEmail: "alice@example.com",
        },
      ];
      mockDb.execute.mockResolvedValue(mockBookings);

      const result = await getAllBookingsAdmin({
        clientEmail: "alice@example.com",
      });

      expect(result).toEqual(mockBookings);
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

      mockDb.limit.mockResolvedValue([mockBooking]);

      const result = await getBookingByIdAdmin("booking-1");

      expect(result).toEqual(mockBooking);
    });

    it("should throw error when booking not found", async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(getBookingByIdAdmin("invalid-id")).rejects.toThrow(
        "Réservation non trouvée",
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

    it("should update adminNotes only", async () => {
      const updatedBooking = {
        id: "booking-1",
        status: "pending",
        adminNotes: "Chat très craintif, prévoir séance calme",
        updatedAt: new Date(),
      };

      mockDb.returning.mockResolvedValue([updatedBooking]);

      const result = await updateBookingAdmin("booking-1", {
        adminNotes: "Chat très craintif, prévoir séance calme",
      });

      expect(result.adminNotes).toBe(
        "Chat très craintif, prévoir séance calme",
      );
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("should update both status and adminNotes", async () => {
      const updatedBooking = {
        id: "booking-1",
        status: "confirmed",
        adminNotes: "Virement reçu",
        updatedAt: new Date(),
      };

      mockDb.returning.mockResolvedValue([updatedBooking]);

      const result = await updateBookingAdmin("booking-1", {
        status: "confirmed",
        adminNotes: "Virement reçu",
      });

      expect(result.status).toBe("confirmed");
      expect(result.adminNotes).toBe("Virement reçu");
    });

    it("should throw error when booking to update is not found", async () => {
      mockDb.returning.mockResolvedValue([]);

      await expect(
        updateBookingAdmin("invalid-id", { status: "confirmed" }),
      ).rejects.toThrow("Réservation non trouvée");
    });
  });

  describe("deleteBookingAdmin", () => {
    it("should delete booking and release timeslot", async () => {
      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTrx = createMockTransaction();

        mockTrx.limit.mockResolvedValueOnce([{ timeSlotId: "slot-1" }]);

        mockTrx.returning.mockResolvedValueOnce([{ id: "booking-1" }]);
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

        mockTrx.limit
          .mockResolvedValueOnce([{ id: "slot-1", isActive: true }])
          .mockResolvedValueOnce([]);

        mockTrx.returning
          .mockResolvedValueOnce([{ id: "client-1" }])
          .mockResolvedValueOnce([{ id: "form-1" }])
          .mockResolvedValueOnce([{ id: "booking-1" }]);

        return callback(asTrx(mockTrx));
      });

      const result = await createBookingAdmin({
        timeSlotId: "slot-1",
        clientName: "Bob",
        clientEmail: "bob@example.com",
        animalName: "Minou",
        animalType: "Chat",
        service: "Communication animale - Clarté",
      });

      expect(result.booking.id).toBe("booking-1");
      expect(result.client.id).toBe("client-1");
      expect(result.form.id).toBe("form-1");
    });

    it("should throw error when timeslot not found", async () => {
      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTrx = createMockTransaction();
        mockTrx.limit.mockResolvedValue([]);
        return callback(asTrx(mockTrx));
      });

      await expect(
        createBookingAdmin({
          timeSlotId: "invalid-slot",
          clientName: "Bob",
          clientEmail: "bob@example.com",
          animalName: "Minou",
          animalType: "Chat",
          service: "Consultation",
        }),
      ).rejects.toThrow("Créneau non trouvé");
    });

    it("should throw error when timeslot is unavailable", async () => {
      mockDb.transaction.mockImplementation(async (callback) => {
        const mockTrx = createMockTransaction();
        mockTrx.limit.mockResolvedValue([{ id: "slot-1", isActive: false }]);
        return callback(asTrx(mockTrx));
      });

      await expect(
        createBookingAdmin({
          timeSlotId: "slot-1",
          clientName: "Bob",
          clientEmail: "bob@example.com",
          animalName: "Minou",
          animalType: "Chat",
          service: "Consultation",
        }),
      ).rejects.toThrow("Ce créneau n'est pas disponible");
    });

    it("should update existing client and create booking", async () => {
      const mockTrx = createMockTransaction();
      mockDb.transaction.mockImplementation(async (callback) => {
        mockTrx.limit
          .mockResolvedValueOnce([{ id: "slot-1", isActive: true }])
          .mockResolvedValueOnce([
            {
              id: "client-existant-42",
              name: "Bob Ancien",
              email: "bob@example.com",
              phone: "0600000000",
            },
          ]);

        mockTrx.returning
          .mockResolvedValueOnce([{ id: "form-1" }])
          .mockResolvedValueOnce([
            {
              id: "booking-1",
              clientId: "client-existant-42",
              formId: "form-1",
            },
          ]);

        return callback(asTrx(mockTrx));
      });

      const result = await createBookingAdmin({
        timeSlotId: "slot-1",
        clientName: "Bob Nouveau Nom",
        clientEmail: "bob@example.com",
        animalName: "Minou",
        animalType: "Chat",
        service: "Communication animale - Clarté",
      });

      expect(result.client.id).toBe("client-existant-42");
      expect(result.booking.clientId).toBe("client-existant-42");

      expect(mockTrx.update).toHaveBeenCalled();
    });
  });
});
