import { BookingWithDetails } from "@/app/api/types/booking";

export function calculateBookingStats(bookings: BookingWithDetails[]) {
  return {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    canceled: bookings.filter((b) => b.status === "canceled").length,
  };
}
