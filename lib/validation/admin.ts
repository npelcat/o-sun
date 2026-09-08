import { z } from "zod";
import { BOOKING_STATUS } from "../utils/constants";

// ============================================
// TIMESLOT SCHEMAS
// ============================================

/**
 * Schema to create a new time slot
 * Admin can create long slots (full day, half day, etc.)
 */
export const createTimeslotSchema = z
  .object({
    startTime: z
      .string()
      .datetime({ message: "Format de date invalide (ISO 8601 requis)" })
      .refine(
        (date) => new Date(date) > new Date(),
        "La date doit être dans le futur",
      ),
    endTime: z
      .string()
      .datetime({ message: "Format de date invalide (ISO 8601 requis)" }),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "La date de fin doit être après la date de début",
    path: ["endTime"],
  });

/**
 * Schema to update an existing slot
 * Allows changing dates or disabling the slot
 */
export const updateTimeslotSchema = z
  .object({
    startTime: z
      .string()
      .datetime({ message: "Format de date invalide" })
      .optional(),
    endTime: z
      .string()
      .datetime({ message: "Format de date invalide" })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If both dates are provided, check consistency
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["endTime"],
    },
  );

// ============================================
// BOOKING SCHEMAS
// ============================================

/**
 * Schema to update a booking's status
 * + add admin notes (not visible to the client)
 */
export const updateBookingAdminSchema = z.object({
  status: z
    .enum(
      [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.CANCELED,
      ],
      {
        errorMap: () => ({ message: "Statut invalide" }),
      },
    )
    .optional(),
  adminNotes: z
    .string()
    .max(2000, "Les notes sont trop longues (max 2000 caractères)")
    .nullable()
    .optional(),
});

/**
 * Schema to manually create a booking (admin)
 * Useful when the practitioner wants to add a booking made outside the system
 */
export const createBookingAdminSchema = z.object({
  timeSlotId: z.string().uuid("ID de créneau invalide"),
  clientName: z
    .string()
    .min(1, "Le nom du client est requis")
    .max(255, "Le nom est trop long"),
  clientEmail: z
    .string()
    .email("Email invalide")
    .max(255, "L'email est trop long"),
  clientPhone: z.string().max(50, "Téléphone trop long").nullable().optional(),

  animalName: z
    .string()
    .min(1, "Le nom de l'animal est requis")
    .max(255, "Le nom est trop long"),
  animalType: z
    .string()
    .min(1, "Le type d'animal est requis")
    .max(100, "Le type d'animal est trop long"),
  animalInfo: z.string().nullable().optional(),
  householdInfo: z.string().nullable().optional(),
  service: z
    .string()
    .min(1, "Le service est requis")
    .max(255, "Le service est trop long"),
  serviceSpecificAnswers: z.string().nullable().optional(),
  answers: z
    .string()
    .max(5000, "Les réponses sont trop longues")
    .nullable()
    .optional(),

  preferredPronoun: z
    .string()
    .min(1, "Le pronom est requis")
    .max(20, "Le pronom est trop long"),

  socialMediaConsent: z.boolean().default(false),
  monthlyPlanningAck: z.boolean().default(false),
  cgvAccepted: z.boolean().default(false),

  status: z
    .enum([
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.CANCELED,
    ])
    .default(BOOKING_STATUS.CONFIRMED),
  adminNotes: z
    .string()
    .max(2000, "Les notes sont trop longues")
    .nullable()
    .optional(),
});

// ============================================
// FILTER SCHEMAS (for queries)
// ============================================

/**
 * Schema to filter bookings
 * Period filter (upcoming / past / all)
 */
export const bookingFiltersSchema = z.object({
  status: z
    .enum([
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.CANCELED,
    ])
    .optional(),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Format de mois invalide (YYYY-MM attendu)")
    .optional(),
  clientEmail: z
    .string()
    .min(2, "Recherche trop courte")
    .max(255, "Recherche trop longue")
    .optional(),
  period: z.enum(["upcoming", "past", "all"]).optional(),
});

/**
 * Schema to filter time slots
 * Example: GET /api/admin/timeslots?month=2026-01&isActive=true
 */
export const timeslotFiltersSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Format de mois invalide (YYYY-MM attendu)")
    .optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
