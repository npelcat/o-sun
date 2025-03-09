import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  message: z
    .string()
    .min(20, "Le message doit comporter au moins 20 caractères"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
