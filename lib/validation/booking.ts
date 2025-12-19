import { z } from "zod";

// Validation pour réserver provisoirement un créneau
export const reserveSlotSchema = z.object({
  timeSlotId: z.string().uuid("ID de créneau invalide"),
});

// Validation pour libérer un créneau
export const releaseSlotSchema = z.object({
  timeSlotId: z.string().uuid("ID de créneau invalide"),
});

// Validation pour confirmer une réservation
export const confirmBookingSchema = z.object({
  timeSlotId: z.string().uuid("ID de créneau invalide"),
  clientName: z.string().min(1, "Le nom du client est requis").max(255),
  clientEmail: z.string().email("Email invalide").max(255),
  clientPhone: z.string().max(20).optional(),
  animalName: z.string().min(1, "Le nom de l'animal est requis").max(255),
  animalType: z.string().max(100).optional(),
  service: z.string().min(1, "Le service est requis").max(255),
  answers: z.union([z.string(), z.record(z.unknown())]).optional(),
});

// Validation pour modifier le statut d'une réservation
export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "canceled"], {
    errorMap: () => ({ message: "Status invalide" }),
  }),
});

// Validation pour envoyer l'email de confirmation
export const confirmEmailSchema = z.object({
  bookingId: z.string().uuid("ID de réservation invalide"),
});
