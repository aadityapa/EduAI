import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import {
  AiClient,
  createAiClient,
  RedisKvStore,
  ResponseCache,
} from '@eduai/ai';

export const AI_CLIENT = 'AI_CLIENT';

function resolveAllowMock(config: ConfigService): boolean {
  const explicit = config.get<string>('AI_ALLOW_MOCK');
  if (explicit === 'true') return true;
  if (explicit === 'false') return false;
  return config.get<string>('NODE_ENV') !== 'production';
}

@Injectable()
export class AiClientFactory {
  private readonly logger = new Logger(AiClientFactory.name);

  create(config: ConfigService): AiClient {
    const allowMockFallback = resolveAllowMock(config);
    const redisUrl = config.get<string>('REDIS_URL');
    let responseCache: ResponseCache | undefined;

    if (redisUrl) {
      try {
        const redis = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          lazyConnect: true,
          enableReadyCheck: true,
        });
        void redis.connect().catch(() => {
          this.logger.warn('Redis AI cache connect failed — using memory cache');
        });
        responseCache = new ResponseCache({
          kv: new RedisKvStore(redis),
          ttlMs: 10 * 60 * 1000,
        });
        this.logger.log('AI response cache backed by Redis');
      } catch {
        this.logger.warn('Redis AI cache unavailable — using memory cache');
      }
    }

    const client = createAiClient({
      openaiApiKey: config.get<string>('OPENAI_API_KEY'),
      geminiApiKey: config.get<string>('GEMINI_API_KEY'),
      preferredProvider:
        config.get<'openai' | 'gemini' | 'mock'>('AI_PREFERRED_PROVIDER') ?? 'openai',
      openaiCheapModel: config.get<string>('AI_CHEAP_MODEL') ?? 'gpt-4o-mini',
      openaiPremiumModel: config.get<string>('AI_PREMIUM_MODEL') ?? 'gpt-4o',
      geminiCheapModel: config.get<string>('AI_GEMINI_CHEAP_MODEL') ?? 'gemini-1.5-flash',
      geminiPremiumModel: config.get<string>('AI_GEMINI_PREMIUM_MODEL') ?? 'gemini-1.5-pro',
      allowMockFallback,
      nodeEnv: config.get<string>('NODE_ENV'),
      enableCaching: config.get<string>('AI_CACHE_ENABLED') !== 'false',
      responseCache,
    });

    if (client.isMockOnly()) {
      this.logger.warn(
        'AI running in mock-only mode (no provider keys). Set OPENAI_API_KEY/GEMINI_API_KEY for live models.',
      );
    } else if (!allowMockFallback && client.getActiveProviders().length === 0) {
      this.logger.error(
        'No AI providers available in production. Configure API keys or set AI_ALLOW_MOCK=true.',
      );
    }

    return client;
  }
}

export const aiClientProvider = {
  provide: AI_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const factory = new AiClientFactory();
    return factory.create(config);
  },
};
