import Redis from 'ioredis';

const KEY_PREFIX = 'auth:revoke_before:';
/** Match default access TTL (15m) + small skew */
const DEFAULT_TTL_SEC = 20 * 60;

/**
 * Short-lived access JWT revocation via Redis.
 * On logout / logout-all, mark `iat` cutoff; JwtStrategy rejects older tokens.
 * No-ops when Redis is unavailable (refresh-session deletion still applies).
 */
export class AccessTokenRevocation {
  private redis: Redis | null = null;

  constructor(redisUrl?: string) {
    if (!redisUrl) return;
    try {
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
        lazyConnect: true,
      });
      this.redis.connect().catch(() => {
        // Leave client in place; commands fail soft in revoke/isRevoked
      });
    } catch {
      this.redis = null;
    }
  }

  async revokeUser(userId: string, ttlSec = DEFAULT_TTL_SEC): Promise<void> {
    if (!this.redis) return;
    const now = Math.floor(Date.now() / 1000);
    try {
      await this.redis.set(`${KEY_PREFIX}${userId}`, String(now), 'EX', ttlSec);
    } catch {
      // best-effort
    }
  }

  async isRevoked(userId: string, tokenIat?: number): Promise<boolean> {
    if (!this.redis || tokenIat === undefined) return false;
    try {
      const raw = await this.redis.get(`${KEY_PREFIX}${userId}`);
      if (!raw) return false;
      const cutoff = Number(raw);
      return Number.isFinite(cutoff) && tokenIat <= cutoff;
    } catch {
      return false;
    }
  }
}

let singleton: AccessTokenRevocation | undefined;

export function getAccessTokenRevocation(redisUrl = process.env.REDIS_URL): AccessTokenRevocation {
  if (!singleton) {
    singleton = new AccessTokenRevocation(redisUrl);
  }
  return singleton;
}
