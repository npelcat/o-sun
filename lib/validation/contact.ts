import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom est requis")
    .max(255, "Le nom est trop long")
    .trim(),
  email: z
    .string()
    .email("Email invalide")
    .max(255, "L'email est trop long")
    .toLowerCase()
    .trim(),
  message: z
    .string()
    .min(20, "Le message doit comporter au moins 20 caractères")
    .max(3000, "Le message est trop long (max 3000 caractères)")
    .trim(),
  turnstileToken: z.string().min(1, "Vérification de sécurité requise"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
