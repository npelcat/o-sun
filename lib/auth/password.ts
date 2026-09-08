import argon2 from "argon2";

/**
 * Hashes a password with Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456, // 19 MB of RAM (OWASP minimum)
    timeCost: 2, // 2 iterations (perf/security tradeoff)
    parallelism: 1, // 1 thread (suited to the server)
  });
}

/**
 * Verifies a password against its hash
 */
export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false; // Invalid hash or unexpected error
  }
}
