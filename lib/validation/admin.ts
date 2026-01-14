import { z } from "zod";

// ============================================
// SCHÉMAS POUR LES TIMESLOTS (CRÉNEAUX)
// ============================================

/**
 * Schéma pour créer un nouveau créneau horaire
 * L'admin peut créer des créneaux longs (journée, demi-journée, etc.)
 */
export const createTimeslotSchema = z
  .object({
    startTime: z
      .string()
      .datetime({ message: "Format de date invalide (ISO 8601 requis)" })
      .refine(
        (date) => new Date(date) > new Date(),
        "La date doit être dans le futur"
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
 * Schéma pour modifier un créneau existant
 * Permet de changer les dates ou de désactiver le créneau
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
      // Si les deux dates sont fournies, vérifier la cohérence
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["endTime"],
    }
  );

// ============================================
// SCHÉMAS POUR LES BOOKINGS (RÉSERVATIONS)
// ============================================

/**
 * Schéma pour mettre à jour le statut d'une réservation
 * + ajouter des notes admin (invisibles du client)
 */
export const updateBookingAdminSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "canceled"], {
      errorMap: () => ({ message: "Statut invalide" }),
    })
    .optional(),
  adminNotes: z
    .string()
    .max(2000, "Les notes sont trop longues (max 2000 caractères)")
    .nullable()
    .optional(),
});

/**
 * Schéma pour créer manuellement une réservation (admin)
 * Utile si ta cliente veut ajouter une réservation hors système
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
    .max(100, "Le type d'animal est trop long")
    .nullable()
    .optional(),
  service: z
    .string()
    .min(1, "Le service est requis")
    .max(255, "Le service est trop long"),
  answers: z
    .string()
    .max(5000, "Les réponses sont trop longues")
    .nullable()
    .optional(),
  status: z.enum(["pending", "confirmed", "canceled"]).default("confirmed"), // Par défaut confirmée si créée par admin
  adminNotes: z
    .string()
    .max(2000, "Les notes sont trop longues")
    .nullable()
    .optional(),
});

// ============================================
// SCHÉMAS DE FILTRAGE (pour les queries)
// ============================================

/**
 * Schéma pour filtrer les réservations
 * Exemple: GET /api/admin/bookings?status=pending&month=2026-01
 */
export const bookingFiltersSchema = z.object({
  status: z.enum(["pending", "confirmed", "canceled"]).optional(),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Format de mois invalide (YYYY-MM attendu)")
    .optional(),
  clientEmail: z.string().email().optional(),
});

/**
 * Schéma pour filtrer les créneaux
 * Exemple: GET /api/admin/timeslots?month=2026-01&isActive=true
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
