import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  interval: number; // window duration in ms
  uniqueTokenPerInterval: number; // max number of distinct IPs tracked
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
   * Checks whether the identifier is allowed to make a request
   * @param identifier - IP or email to check
   * @returns true if allowed, false if rate limited
   */
  check(identifier: string): boolean {
    const now = Date.now();
    const tokenCount = this.tokenCache.get(identifier) || [];

    const validTokens = tokenCount.filter(
      (timestamp) => now - timestamp < this.interval,
    );

    if (validTokens.length >= this.limit) {
      return false;
    }

    validTokens.push(now);
    this.tokenCache.set(identifier, validTokens);

    return true;
  }

  /**
   * Resets the counter for an identifier
   */
  reset(identifier: string): void {
    this.tokenCache.delete(identifier);
  }
}

// Rate limiters configuration

/**
 * Login: 5 attempts per IP in 15 minutes
 */
export const loginRateLimiter = new RateLimiter(5, {
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

/**
 * Password reset: 3 attempts per email in 1 hour
 */
export const resetPasswordRateLimiter = new RateLimiter(3, {
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 200,
});

/**
 * Public API: 10 requests per 10 seconds
 */
export const apiRateLimiter = new RateLimiter(10, {
  interval: 10 * 1000, // 10 seconds
  uniqueTokenPerInterval: 1000,
});

/**
 * Contact form: 5 messages per 10 minutes
 */
export const contactRateLimiter = new RateLimiter(5, {
  interval: 10 * 60 * 1000, // 10 minutes
  uniqueTokenPerInterval: 1000,
});
