import { z } from "zod";

// Regex pour téléphones francophones (France, Belgique, Suisse, Canada, etc.)
// Accepte les formats avec ou sans indicatif international
const francophonesPhoneRegex = /^(\+|00)?[1-9]\d{7,14}$/;

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
  clientName: z
    .string()
    .min(1, "Le nom du client est requis")
    .max(255, "Le nom est trop long (max 255 caractères)")
    .trim(),
  clientEmail: z
    .string()
    .min(1, "L'email est requis")
    .email("Adresse email invalide")
    .max(255, "L'email est trop long")
    .toLowerCase()
    .trim(),
  clientPhone: z
    .string()
    .trim()
    .refine(
      (val) =>
        val === "" || francophonesPhoneRegex.test(val.replace(/[\s.-]/g, "")),
      {
        message:
          "Numéro de téléphone invalide (ex: 0601020304 ou +33601020304)",
      }
    )
    .nullable()
    .optional()
    .or(z.literal("")),
  animalName: z
    .string()
    .min(1, "Le nom de l'animal est requis")
    .max(255, "Le nom est trop long (max 255 caractères)")
    .trim(),
  animalType: z
    .string()
    .max(100, "Le type d'animal est trop long (max 100 caractères)")
    .trim()
    .nullable()
    .optional()
    .or(z.literal("")),
  service: z
    .string()
    .min(1, "Le service est requis")
    .max(255, "Le service est trop long"),
  answers: z
    .union([z.string(), z.record(z.unknown())])
    .nullable()
    .optional()
    .or(z.literal("")),
});

// Validation pour modifier le statut d'une réservation
export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "canceled"], {
    errorMap: () => ({ message: "Statut invalide" }),
  }),
});

// Validation pour envoyer l'email de confirmation
export const confirmEmailSchema = z.object({
  bookingId: z.string().uuid("ID de réservation invalide"),
});
