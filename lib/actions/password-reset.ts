"use server";

import { admins, passwordResetTokens } from "@/src/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { generateResetToken, getTokenExpiration } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/send-reset-email";
import { hashPassword } from "@/lib/auth/password";
import db from "@/src/db";
import { resetPasswordRateLimiter } from "../security/rate-limit-simple";

/**
 * Server Action : Demande de réinitialisation de mot de passe
 */
export async function requestPasswordReset(email: string) {
  try {
    if (!email || typeof email !== "string") {
      return { error: "Email requis" };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting par email
    const isAllowed = resetPasswordRateLimiter.check(normalizedEmail);

    if (!isAllowed) {
      console.warn(`Rate limit dépassé pour email: ${normalizedEmail}`);
      // Réponse identique mais pas d'email envoyé
      return {
        success: true,
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé.",
      };
    }

    // Vérifie que l'email existe dans les admins
    const adminList = await db
      .select({ email: admins.email })
      .from(admins)
      .where(eq(admins.email, email.toLowerCase().trim()))
      .limit(1);

    // SÉCURITÉ : Ne jamais révéler si l'email existe ou non
    const message =
      "Si cet email existe, un lien de réinitialisation a été envoyé.";

    if (adminList.length === 0) {
      return { success: true, message };
    }

    // Génère le token
    const token = generateResetToken();
    const expiresAt = getTokenExpiration(30); // 30 minutes

    // Stocke le token en DB
    await db.insert(passwordResetTokens).values({
      email: email.toLowerCase().trim(),
      token,
      expiresAt,
      used: false,
    });

    // Envoie l'email
    const emailResult = await sendPasswordResetEmail(email, token);

    if (!emailResult.success) {
      console.error("Échec envoi email reset:", emailResult.error);
    }

    return { success: true, message };
  } catch (error) {
    console.error("Erreur requestPasswordReset:", error);
    return { error: "Erreur interne" };
  }
}

/**
 * Server Action : Réinitialisation du mot de passe
 */
export async function resetPassword(token: string, newPassword: string) {
  try {
    if (!token || !newPassword) {
      return { error: "Token et mot de passe requis" };
    }

    // Validation du mot de passe
    if (newPassword.length < 10) {
      return { error: "Le mot de passe doit contenir au moins 10 caractères" };
    }

    // Récupère le token
    const tokenList = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.used, false),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (tokenList.length === 0) {
      return { error: "Lien invalide ou expiré" };
    }

    const resetToken = tokenList[0];

    // Hash le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);

    // Met à jour le mot de passe de l'admin et marque le token comme utilisé
    await db.transaction(async (tx) => {
      await tx
        .update(admins)
        .set({ passwordHash: hashedPassword })
        .where(eq(admins.email, resetToken.email));
      await tx
        .update(passwordResetTokens)
        .set({ used: true })
        .where(eq(passwordResetTokens.id, resetToken.id));
    });

    return { success: true, message: "Mot de passe réinitialisé avec succès" };
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    return { error: "Erreur interne" };
  }
}
