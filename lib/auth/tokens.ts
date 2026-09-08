import crypto from "crypto";

/**
 * Generates a secure token for password reset
 */
export function generateResetToken(): string {
  // 32 bytes = 256 bits of entropy
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Computes the token's expiration date
 * @param minutes - Validity duration (default: 30 min per OWASP)
 */
export function getTokenExpiration(minutes: number = 30): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
