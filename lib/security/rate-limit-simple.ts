import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  interval: number; // Durée de la fenêtre en ms
  uniqueTokenPerInterval: number; // Nombre max d'IPs différentes trackées
};

export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>;
  private interval: number;
  private limit: number;

  constructor(limit: number, options: RateLimitOptions) {
    this.interval = options.interval;
    this.limit = limit;

    this.tokenCache = new LRUCache({
      max: options.uniqueTokenPerInterval,
      ttl: options.interval,
    });
  }

  /**
   * Vérifie si l'identifiant peut faire une requête
   * @param identifier - IP ou email à vérifier
   * @returns true si autorisé, false si rate limité
   */
  check(identifier: string): boolean {
    const now = Date.now();
    const tokenCount = this.tokenCache.get(identifier) || [];

    // Filtre les timestamps expirés
    const validTokens = tokenCount.filter(
      (timestamp) => now - timestamp < this.interval,
    );

    if (validTokens.length >= this.limit) {
      return false; // Rate limité
    }

    // Ajoute le nouveau timestamp
    validTokens.push(now);
    this.tokenCache.set(identifier, validTokens);

    return true;
  }

  /**
   * Remet à zéro le compteur pour un identifiant
   */
  reset(identifier: string): void {
    this.tokenCache.delete(identifier);
  }
}

// ⚙️ Configuration des rate limiters

/**
 * Login : 5 tentatives par IP en 15 minutes
 */
export const loginRateLimiter = new RateLimiter(5, {
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Track max 500 IPs différentes
});

/**
 * Reset password : 3 tentatives par email en 1 heure
 */
export const resetPasswordRateLimiter = new RateLimiter(3, {
  interval: 60 * 60 * 1000, // 1 heure
  uniqueTokenPerInterval: 200,
});

/**
 * API publiques : 10 requêtes en 10 secondes
 */
export const apiRateLimiter = new RateLimiter(10, {
  interval: 10 * 1000, // 10 secondes
  uniqueTokenPerInterval: 1000,
});

/**
 * Formulaire de contact : 5 messages en 10 minutes
 */
export const contactRateLimiter = new RateLimiter(5, {
  interval: 10 * 60 * 1000, // 10 minutes
  uniqueTokenPerInterval: 1000,
});
