import crypto from "crypto";

/**
 * Génère un token sécurisé pour reset de mot de passe
 * Utilise crypto.randomBytes
 */
export function generateResetToken(): string {
  // 32 bytes = 256 bits de sécurité
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Calcule la date d'expiration du token
 * @param minutes - Durée de validité (défaut: 30 min selon OWASP)
 */
export function getTokenExpiration(minutes: number = 30): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
