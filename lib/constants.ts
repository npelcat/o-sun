export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELED: "canceled",
} as const;

export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export type BookingStatusFilter = BookingStatus | "";

export const BOOKING_PERIOD = {
  UPCOMING: "upcoming",
  PAST: "past",
  ALL: "all",
} as const;

export type BookingPeriod =
  (typeof BOOKING_PERIOD)[keyof typeof BOOKING_PERIOD];
