import argon2 from "argon2";

/**
 * Hash un mot de passe avec Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456, // 19 MB de RAM (OWASP minimum)
    timeCost: 2, // 2 itérations (équilibre perf/sécurité)
    parallelism: 1, // 1 thread (adapté au serveur)
  });
}

/**
 * Vérifie un mot de passe contre son hash
 */
export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false; // Hash invalide ou erreur
  }
}
