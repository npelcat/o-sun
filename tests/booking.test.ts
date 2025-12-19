import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByIdSimple,
  updateBookingStatus,
  deleteBooking,
} from "@/lib/bookings";
import { createMockTransaction, asTrx } from "./utils/test-utils";

// Mock de la DB
vi.mock("@/src/db/index", () => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    innerJoin: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
  };
  return { default: mockDb };
});

import db from "@/src/db/index";

const mockDb = db as unknown as {
  select: Mock;
  from: Mock;
  where: Mock;
  limit: Mock;
  innerJoin: Mock;
  orderBy: Mock;
  update: Mock;
  set: Mock;
  returning: Mock;
  delete: Mock;
  insert: Mock;
  values: Mock;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createBooking", () => {
  it("should create a booking with pending status by default", async () => {
    const mockTrx = createMockTransaction();
    const mockBooking = {
      id: "booking-123",
      timeSlotId: "slot-456",
      clientId: "client-789",
      formId: "form-012",
      status: "pending" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTrx.returning.mockResolvedValue([mockBooking]);

    const booking = await createBooking(asTrx(mockTrx), {
      timeSlotId: "slot-456",
      clientId: "client-789",
      formId: "form-012",
    });

    expect(booking).toEqual(mockBooking);
    expect(mockTrx.insert).toHaveBeenCalled();
    expect(mockTrx.values).toHaveBeenCalledWith({
      timeSlotId: "slot-456",
      clientId: "client-789",
      formId: "form-012",
      status: "pending",
    });
  });

  it("should create a booking with specified status", async () => {
    const mockTrx = createMockTransaction();
    const mockBooking = {
      id: "booking-123",
      timeSlotId: "slot-456",
      clientId: "client-789",
      formId: "form-012",
      status: "confirmed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTrx.returning.mockResolvedValue([mockBooking]);

    const booking = await createBooking(asTrx(mockTrx), {
      timeSlotId: "slot-456",
      clientId: "client-789",
      formId: "form-012",
      status: "confirmed",
    });

    expect(booking.status).toBe("confirmed");
    expect(mockTrx.values).toHaveBeenCalledWith(
      expect.objectContaining({ status: "confirmed" })
    );
  });
});

describe("getAllBookings", () => {
  it("should return all bookings with details", async () => {
    const mockBookings = [
      {
        id: "booking-1",
        status: "pending" as const,
        clientName: "Jane Doe",
        clientEmail: "jane@example.com",
        animalName: "Rex",
        service: "Communication animale",
        startTime: new Date(),
      },
    ];

    mockDb.orderBy.mockResolvedValue(mockBookings);

    const bookings = await getAllBookings();

    expect(bookings).toEqual(mockBookings);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.innerJoin).toHaveBeenCalledTimes(3);
  });

  it("should return empty array when no bookings exist", async () => {
    mockDb.orderBy.mockResolvedValue([]);

    const bookings = await getAllBookings();

    expect(bookings).toEqual([]);
  });
});

describe("getBookingById", () => {
  it("should return booking with full details when found", async () => {
    const mockBooking = {
      id: "booking-123",
      status: "pending" as const,
      clientName: "Jane Doe",
      clientEmail: "jane@example.com",
      animalName: "Rex",
      service: "Communication animale",
      startTime: new Date(),
    };

    mockDb.limit.mockResolvedValue([mockBooking]);

    const booking = await getBookingById("booking-123");

    expect(booking).toEqual(mockBooking);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it("should throw error when booking not found", async () => {
    mockDb.limit.mockResolvedValue([]);

    await expect(getBookingById("invalid-id")).rejects.toThrow(
      "Réservation non trouvée"
    );
  });
});

describe("getBookingByIdSimple", () => {
  it("should return simple booking when found", async () => {
    const mockBooking = {
      id: "booking-123",
      timeSlotId: "slot-456",
      clientId: "client-789",
      formId: "form-012",
      status: "pending" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDb.limit.mockResolvedValue([mockBooking]);

    const booking = await getBookingByIdSimple("booking-123");

    expect(booking).toEqual(mockBooking);
  });

  it("should throw error when booking not found", async () => {
    mockDb.limit.mockResolvedValue([]);

    await expect(getBookingByIdSimple("invalid-id")).rejects.toThrow(
      "Réservation non trouvée"
    );
  });
});

describe("updateBookingStatus", () => {
  it("should update booking status", async () => {
    const mockUpdated = {
      id: "booking-123",
      status: "confirmed" as const,
      updatedAt: new Date(),
    };

    mockDb.returning.mockResolvedValue([mockUpdated]);

    const updated = await updateBookingStatus("booking-123", "confirmed");

    expect(updated.status).toBe("confirmed");
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({ status: "confirmed" })
    );
  });

  it("should throw error when booking not found", async () => {
    mockDb.returning.mockResolvedValue([]);

    await expect(
      updateBookingStatus("invalid-id", "confirmed")
    ).rejects.toThrow("Réservation non trouvée");
  });
});

describe("deleteBooking", () => {
  it("should delete booking and return deleted record", async () => {
    const mockDeleted = { id: "booking-123" };

    mockDb.returning.mockResolvedValue([mockDeleted]);

    const deleted = await deleteBooking("booking-123");

    expect(deleted).toEqual(mockDeleted);
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });

  it("should throw error when booking not found", async () => {
    mockDb.returning.mockResolvedValue([]);

    await expect(deleteBooking("invalid-id")).rejects.toThrow(
      "Réservation non trouvée"
    );
  });
});
