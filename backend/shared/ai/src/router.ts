import { CircuitBreaker } from './circuit-breaker.js';
import { GeminiProvider } from './providers/gemini.js';
import { MockAiProvider } from './providers/mock.js';
import { OpenAiProvider } from './providers/openai.js';
import { CHEAP_MODELS, PREMIUM_MODELS } from './pricing.js';
import type { ModelTier } from './intent/classifier.js';
import type {
  AiProvider,
  ChatMessage,
  CompletionOptions,
  CompletionResult,
} from './types.js';

export type ProviderName = 'openai' | 'gemini' | 'mock';

export interface AiRouterConfig {
  openaiApiKey?: string;
  geminiApiKey?: string;
  preferredProvider?: ProviderName;
  openaiModel?: string;
  geminiModel?: string;
  openaiCheapModel?: string;
  openaiPremiumModel?: string;
  geminiCheapModel?: string;
  geminiPremiumModel?: string;
  /**
   * When false, mock is never used.
   * Default: true outside production; in production only if AI_ALLOW_MOCK=true.
   */
  allowMockFallback?: boolean;
  /** Override NODE_ENV detection (tests). */
  nodeEnv?: string;
}

function resolveAllowMock(config: AiRouterConfig): boolean {
  if (config.allowMockFallback !== undefined) {
    return config.allowMockFallback;
  }
  const env = config.nodeEnv ?? process.env.NODE_ENV ?? 'development';
  if (env === 'production') {
    return process.env.AI_ALLOW_MOCK === 'true';
  }
  return true;
}

export class AiRouter {
  private readonly providers: AiProvider[];
  private readonly orderedProviders: AiProvider[];
  private readonly breakers = new Map<string, CircuitBreaker>();
  private readonly cheapModels: Record<string, string>;
  private readonly premiumModels: Record<string, string>;
  private readonly allowMock: boolean;

  constructor(config: AiRouterConfig = {}) {
    this.allowMock = resolveAllowMock(config);

    const openai = new OpenAiProvider({
      apiKey: config.openaiApiKey,
      defaultModel: config.openaiModel ?? config.openaiCheapModel ?? CHEAP_MODELS.openai,
    });
    const gemini = new GeminiProvider({
      apiKey: config.geminiApiKey,
      defaultModel: config.geminiModel ?? config.geminiCheapModel ?? CHEAP_MODELS.gemini,
    });
    const mock = new MockAiProvider();

    this.providers = [openai, gemini, mock];

    this.cheapModels = {
      openai: config.openaiCheapModel ?? config.openaiModel ?? CHEAP_MODELS.openai,
      gemini: config.geminiCheapModel ?? config.geminiModel ?? CHEAP_MODELS.gemini,
      mock: CHEAP_MODELS.mock,
    };
    this.premiumModels = {
      openai: config.openaiPremiumModel ?? PREMIUM_MODELS.openai,
      gemini: config.geminiPremiumModel ?? PREMIUM_MODELS.gemini,
      mock: PREMIUM_MODELS.mock,
    };

    const preference = config.preferredProvider ?? 'openai';
    const available = this.providers.filter((p) => {
      if (p.name === 'mock') return this.allowMock;
      return p.isAvailable();
    });

    const preferred = available.find((p) => p.name === preference);
    const others = available.filter((p) => p.name !== preference);
    this.orderedProviders = preferred ? [preferred, ...others] : available;

    if (this.orderedProviders.length === 0 && this.allowMock) {
      this.orderedProviders = [mock];
    }
  }

  getActiveProviders(): string[] {
    return this.orderedProviders.map((p) => p.name);
  }

  isMockOnly(): boolean {
    return this.orderedProviders.length === 1 && this.orderedProviders[0]?.name === 'mock';
  }

  resolveModel(providerName: string, tier: ModelTier = 'cheap'): string {
    const table = tier === 'premium' ? this.premiumModels : this.cheapModels;
    return table[providerName] ?? table.mock ?? CHEAP_MODELS.mock;
  }

  async complete(
    messages: ChatMessage[],
    options?: CompletionOptions & { tier?: ModelTier },
  ): Promise<CompletionResult> {
    if (this.orderedProviders.length === 0) {
      throw new Error(
        'No AI providers available. Configure OPENAI_API_KEY / GEMINI_API_KEY, or set AI_ALLOW_MOCK=true in production.',
      );
    }

    let lastError: Error | undefined;
    const tier = options?.tier ?? 'cheap';

    for (const provider of this.orderedProviders) {
      const breaker = this.getBreaker(provider.name);
      const model = options?.model ?? this.resolveModel(provider.name, tier);
      try {
        return await breaker.execute(() =>
          provider.complete(messages, { ...options, model }),
        );
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    throw lastError ?? new Error('All AI providers failed');
  }

  private getBreaker(providerName: string): CircuitBreaker {
    let breaker = this.breakers.get(providerName);
    if (!breaker) {
      breaker = new CircuitBreaker({
        name: providerName,
        failureThreshold: 5,
        resetTimeoutMs: 30_000,
      });
      this.breakers.set(providerName, breaker);
    }
    return breaker;
  }
}
