import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, of, switchMap, tap } from 'rxjs';
import Redis from 'ioredis';

const IDEMPOTENCY_HEADER = 'idempotency-key';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_SEC = Math.floor(CACHE_TTL_MS / 1000);
const MAX_ENTRIES = 5_000;
const KEY_PREFIX = 'eduai:idempotency:';

type CacheEntry = {
  statusCode: number;
  body: unknown;
  expiresAt: number;
};

/**
 * Idempotency for mutating routes that send `Idempotency-Key`.
 * Uses Redis when REDIS_URL is set; otherwise in-process Map (single-instance).
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly memory = new Map<string, CacheEntry>();
  private redis: Redis | null = null;

  constructor() {
    const url = process.env.REDIS_URL;
    if (!url) return;
    try {
      this.redis = new Redis(url, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
        lazyConnect: true,
      });
      void this.redis.connect().catch(() => {
        this.redis = null;
      });
    } catch {
      this.redis = null;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{
      method?: string;
      headers?: Record<string, string | string[] | undefined>;
      user?: { tenantId?: string; sub?: string };
      originalUrl?: string;
      url?: string;
    }>();
    const response = http.getResponse<{
      statusCode: number;
      setHeader: (k: string, v: string) => void;
    }>();

    const method = (request.method ?? 'GET').toUpperCase();
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const rawKey = request.headers?.[IDEMPOTENCY_HEADER];
    const key =
      typeof rawKey === 'string'
        ? rawKey.trim()
        : Array.isArray(rawKey)
          ? rawKey[0]?.trim()
          : '';
    if (!key) {
      return next.handle();
    }

    if (key.length > 128) {
      throw new ConflictException('Idempotency-Key must be ≤ 128 characters');
    }

    const scope = [
      request.user?.tenantId ?? 'anon',
      request.user?.sub ?? 'anon',
      method,
      request.originalUrl ?? request.url ?? '',
      key,
    ].join(':');

    return from(this.getCached(scope)).pipe(
      switchMap((hit) => {
        if (hit && hit.expiresAt > Date.now()) {
          response.setHeader('Idempotency-Replayed', 'true');
          response.statusCode = hit.statusCode;
          return of(hit.body);
        }

        return next.handle().pipe(
          tap((body) => {
            void this.setCached(scope, {
              statusCode: response.statusCode || 200,
              body,
              expiresAt: Date.now() + CACHE_TTL_MS,
            });
          }),
        );
      }),
    );
  }

  private async getCached(scope: string): Promise<CacheEntry | null> {
    if (this.redis) {
      try {
        const raw = await this.redis.get(`${KEY_PREFIX}${scope}`);
        if (raw) return JSON.parse(raw) as CacheEntry;
      } catch {
        // fall through to memory
      }
    }
    this.evictExpired();
    return this.memory.get(scope) ?? null;
  }

  private async setCached(scope: string, entry: CacheEntry): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.set(
          `${KEY_PREFIX}${scope}`,
          JSON.stringify(entry),
          'EX',
          CACHE_TTL_SEC,
        );
        return;
      } catch {
        // fall through to memory
      }
    }
    if (this.memory.size >= MAX_ENTRIES) {
      const first = this.memory.keys().next().value;
      if (first) this.memory.delete(first);
    }
    this.memory.set(scope, entry);
  }

  private evictExpired() {
    const now = Date.now();
    for (const [k, v] of this.memory) {
      if (v.expiresAt <= now) this.memory.delete(k);
    }
  }
}
